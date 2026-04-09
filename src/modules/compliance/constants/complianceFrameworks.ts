export interface ComplianceFrameworkConfig {
  code: string;
  name: string;
  description?: string;
  entityTypesCount?: number;
  isActive: boolean;
}

export const COMPLIANCE_FRAMEWORKS: ComplianceFrameworkConfig[] = [
  {
    code: 'HIPAA_US',
    name: 'HIPAA',
    description: 'Health Insurance Portability and Accountability Act (US)',
    entityTypesCount: 18,
    isActive: true,
  },
  {
    code: 'GDPR_EU',
    name: 'EU GDPR',
    description: 'European Union General Data Protection Regulation',
    entityTypesCount: 11,
    isActive: true,
  },
  {
    code: 'GDPR_UK',
    name: 'UK GDPR',
    description: 'United Kingdom General Data Protection Regulation',
    entityTypesCount: 11,
    isActive: true,
  },
  {
    code: 'FADP_CH',
    name: 'Swiss FADP',
    description: 'Swiss Federal Act on Data Protection',
    entityTypesCount: 11,
    isActive: true,
  },
];
