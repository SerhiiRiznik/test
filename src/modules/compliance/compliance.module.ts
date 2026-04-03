import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ComplianceFramework from '../../common/db/entities/compliance-framework.entity';
import ComplianceSelection from '../../common/db/entities/compliance-selection.entity';

import ComplianceController from './compliance.controller';
import ComplianceService from './compliance.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComplianceFramework, ComplianceSelection]),
  ],
  controllers: [ComplianceController],
  providers: [ComplianceService],
  exports: [ComplianceService],
})
export default class ComplianceModule {}
