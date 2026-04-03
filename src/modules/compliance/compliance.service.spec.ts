import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import ComplianceFramework from '../../common/db/entities/compliance-framework.entity';
import ComplianceSelection from '../../common/db/entities/compliance-selection.entity';

import ComplianceService from './compliance.service';

describe('ComplianceService', () => {
  let service: ComplianceService;

  const mockFrameworkRepo = {
    findOne: jest.fn(),
  };

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
          provide: getRepositoryToken(ComplianceFramework),
          useValue: mockFrameworkRepo,
        },
        {
          provide: getRepositoryToken(ComplianceSelection),
          useValue: mockSelectionRepo,
        },
      ],
    }).compile();

    service = module.get<ComplianceService>(ComplianceService);
  });

  it('should throw NotFoundException if framework does not exist', async () => {
    mockFrameworkRepo.findOne.mockResolvedValue(null);

    await expect(
      service.selectFramework({
        userId: 'user-1',
        frameworkCode: 'UNKNOWN',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
