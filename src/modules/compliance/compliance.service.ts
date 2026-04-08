import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import ComplianceSelection from '@common/db/entities/compliance-selection.entity';
import SelectComplianceDto from './dto/selectCompliance.dto';
import { COMPLIANCE_FRAMEWORKS } from './constants/complianceFrameworks';

const FRAMEWORK_NOT_FOUND_MESSAGE = 'Compliance framework not found';
const COMPLIANCE_FETCH_FAILED_MESSAGE = 'Failed to fetch compliance frameworks';
const COMPLIANCE_SELECTION_FAILED_MESSAGE =
  'Failed to select compliance framework';
const COMPLIANCE_SELECTION_NOT_FOUND = 'Compliance selection not found';
const COMPLIANCE_GET_SELECTION_FAILED_MESSAGE =
  'Failed to fetch compliance selection';

@Injectable()
export default class ComplianceService {
  constructor(
    @InjectRepository(ComplianceSelection)
    private readonly complianceSelectionRepository: Repository<ComplianceSelection>,
  ) {}

  // eslint-disable-next-line class-methods-use-this
  async getFrameworks() {
    try {
      return COMPLIANCE_FRAMEWORKS.filter((framework) => framework.isActive);
    } catch {
      throw new InternalServerErrorException(COMPLIANCE_FETCH_FAILED_MESSAGE);
    }
  }

  async selectFramework(
    dto: SelectComplianceDto,
  ): Promise<ComplianceSelection> {
    try {
      const framework = COMPLIANCE_FRAMEWORKS.find(
        (item) => item.code === dto.frameworkCode && item.isActive,
      );

      if (!framework) {
        throw new NotFoundException(FRAMEWORK_NOT_FOUND_MESSAGE);
      }

      const existingSelection =
        await this.complianceSelectionRepository.findOne({
          where: { userId: dto.userId },
        });

      if (existingSelection) {
        existingSelection.frameworkCode = framework.code;

        return await this.complianceSelectionRepository.save(existingSelection);
      }

      const selection = this.complianceSelectionRepository.create({
        userId: dto.userId,
        frameworkCode: framework.code,
      });

      return await this.complianceSelectionRepository.save(selection);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        COMPLIANCE_SELECTION_FAILED_MESSAGE,
      );
    }
  }

  async getSelection(userId: string) {
    try {
      const selection = await this.complianceSelectionRepository.findOne({
        where: { userId },
      });

      if (!selection) {
        throw new NotFoundException(COMPLIANCE_SELECTION_NOT_FOUND);
      }

      const framework = COMPLIANCE_FRAMEWORKS.find(
        (item) => item.code === selection.frameworkCode,
      );

      return {
        ...selection,
        framework: framework ?? null,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        COMPLIANCE_GET_SELECTION_FAILED_MESSAGE,
      );
    }
  }
}
