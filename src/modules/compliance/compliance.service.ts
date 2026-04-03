import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import ComplianceFramework from '../../common/db/entities/compliance-framework.entity';
import ComplianceSelection from '../../common/db/entities/compliance-selection.entity';

import SelectComplianceDto from './dto/selectCompliance.dto';

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
    @InjectRepository(ComplianceFramework)
    private readonly complianceFrameworkRepository: Repository<ComplianceFramework>,
    @InjectRepository(ComplianceSelection)
    private readonly complianceSelectionRepository: Repository<ComplianceSelection>,
  ) {}

  async getFrameworks(): Promise<ComplianceFramework[]> {
    try {
      return await this.complianceFrameworkRepository.find({
        where: { isActive: true },
        order: { name: 'ASC' },
      });
    } catch {
      throw new InternalServerErrorException(COMPLIANCE_FETCH_FAILED_MESSAGE);
    }
  }

  async selectFramework(
    dto: SelectComplianceDto,
  ): Promise<ComplianceSelection> {
    try {
      const framework = await this.complianceFrameworkRepository.findOne({
        where: {
          code: dto.frameworkCode,
          isActive: true,
        },
      });

      if (!framework) {
        throw new NotFoundException(FRAMEWORK_NOT_FOUND_MESSAGE);
      }

      const existingSelection =
        await this.complianceSelectionRepository.findOne({
          where: { userId: dto.userId },
        });

      if (existingSelection) {
        existingSelection.frameworkId = framework.uuid;

        return await this.complianceSelectionRepository.save(existingSelection);
      }

      const selection = this.complianceSelectionRepository.create({
        userId: dto.userId,
        frameworkId: framework.uuid,
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

  async getSelection(userId: string): Promise<ComplianceSelection> {
    try {
      const selection = await this.complianceSelectionRepository.findOne({
        where: { userId },
      });

      if (!selection) {
        throw new NotFoundException(COMPLIANCE_SELECTION_NOT_FOUND);
      }

      return selection;
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
