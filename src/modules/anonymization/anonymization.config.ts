import { registerAs } from '@nestjs/config';

const anonymizationConfig = registerAs('anonymization', () => ({
  presidioAnalyzeUrl: process.env.PRESIDIO_ANALYZE_URL ?? '',
  presidioAnonymizeUrl: process.env.PRESIDIO_ANONYMIZE_URL ?? '',
}));

export default anonymizationConfig;
export type AnonymizationConfig = ReturnType<typeof anonymizationConfig>;
