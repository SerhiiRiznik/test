import { registerAs } from '@nestjs/config';

const anonymizationConfig = registerAs('anonymization', () => ({
  presidioAnalyzeUrl: process.env.PRESIDIO_ANALYZER_URL ?? '',
  presidioAnonymizeUrl: process.env.PRESIDIO_ANONYMIZER_URL ?? '',
}));

export default anonymizationConfig;
export type AnonymizationConfig = ReturnType<typeof anonymizationConfig>;
