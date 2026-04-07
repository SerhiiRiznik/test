import { Inject } from '@nestjs/common';
import AbstractAnonymizerService from './abstract-anonymizer.service';
import ANONYMIZER_SERVICES_TOKEN from './anonymizer-services.token';
import { Compliance } from '../../common/constants';
import AnonymizerNotFoundError from './anonymizer-not-found.error';

export default class AnonymizationService {
  private serviceMap: Map<Compliance, AbstractAnonymizerService>;

  constructor(
    @Inject(ANONYMIZER_SERVICES_TOKEN) services: AbstractAnonymizerService[],
  ) {
    this.serviceMap = new Map(services.map((s) => [s.complianceName, s]));
  }

  async anonymize(complianceName: Compliance, text: string) {
    const service = this.serviceMap.get(complianceName);

    if (!service) {
      throw new AnonymizerNotFoundError(complianceName);
    }

    return service.anonymize(text);
  }
}
