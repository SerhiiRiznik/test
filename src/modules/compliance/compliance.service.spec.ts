import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import ComplianceSelection from '../../common/db/entities/compliance-selection.entity';

import ComplianceService from './compliance.service';

describe('ComplianceService', () => {
  let service: ComplianceService;

  const mockSelectionRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplianceService,
        {
          provide: getRepositoryToken(ComplianceSelection),
          useValue: mockSelectionRepo,
        },
      ],
    }).compile();

    service = module.get<ComplianceService>(ComplianceService);
  });

  it('should throw NotFoundException if framework does not exist', async () => {
    await expect(
      service.selectFramework({
        userId: 'user-1',
        frameworkCode: 'UNKNOWN',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
