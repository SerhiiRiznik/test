import { Compliance } from '@common/constants';

export default class AnonymizerNotFoundError extends Error {
  constructor(complianceName: Compliance) {
    super(`No anonymizer found for compliance: ${complianceName}`);
    this.name = 'AnonymizerNotFoundError';
  }
}
