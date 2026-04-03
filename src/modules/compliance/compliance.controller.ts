import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import ComplianceService from './compliance.service';
import SelectComplianceDto from './dto/selectCompliance.dto';
import ReturnComplianceFrameworkDto from './dto/returnComplianceFramework.dto';
import ReturnComplianceSelectionDto from './dto/returnComplianceSelection.dto';

@ApiTags('Compliance')
@Controller('compliance')
export default class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('frameworks')
  @ApiOperation({ summary: 'Get available compliance frameworks' })
  @ApiOkResponse({
    description: 'List of available compliance frameworks',
    type: [ReturnComplianceFrameworkDto],
  })
  async getFrameworks(): Promise<ReturnComplianceFrameworkDto[]> {
    return this.complianceService.getFrameworks();
  }

  @Post('select')
  @ApiOperation({ summary: 'Select compliance framework for a user' })
  @ApiCreatedResponse({
    description: 'Compliance framework selected successfully',
    type: ReturnComplianceSelectionDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request body',
  })
  @ApiNotFoundResponse({
    description: 'Compliance framework not found',
  })
  async selectFramework(
    @Body() dto: SelectComplianceDto,
  ): Promise<ReturnComplianceSelectionDto> {
    return this.complianceService.selectFramework(dto);
  }

  @Get('selection/:userId')
  @ApiOperation({ summary: 'Get selected compliance framework for a user' })
  @ApiParam({
    name: 'userId',
    example: 'user-123',
    description: 'User identifier',
  })
  @ApiOkResponse({
    description: 'Selected compliance framework',
    type: ReturnComplianceSelectionDto,
  })
  @ApiNotFoundResponse({
    description: 'Compliance selection not found',
  })
  async getSelection(
    @Param('userId') userId: string,
  ): Promise<ReturnComplianceSelectionDto> {
    return this.complianceService.getSelection(userId);
  }
}
