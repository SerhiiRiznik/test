import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Compliance } from '@common/constants';
import AbstractAnonymizerService from './abstract-anonymizer.service';
import anonymizationConfig from './anonymization.config';
import type { AnonymizationConfig } from './anonymization.config';

export default class PresidioAnonymizerService extends AbstractAnonymizerService {
  complianceName = Compliance.GDPR;

  constructor(
    @Inject(anonymizationConfig.KEY)
    private readonly config: AnonymizationConfig,
    private readonly httpService: HttpService,
  ) {
    super();
  }

  async anonymize(text: string): Promise<string> {
    const analyzerResults = await this.analyze(text);

    const response = await firstValueFrom(
      this.httpService.post(
        this.config.presidioAnonymizeUrl.concat('/anonymize'),
        {
          text,
          analyzer_results: analyzerResults,
        },
      ),
    );

    return response.data.text;
  }

  private async analyze(text: string): Promise<string> {
    // TODO: Detect language using https://github.com/nitotm/efficient-language-detector-js

    const response = await firstValueFrom(
      this.httpService.post(this.config.presidioAnalyzeUrl.concat('/analyze'), {
        text,
        language: 'en',
      }),
    );

    return response.data;
  }
}
