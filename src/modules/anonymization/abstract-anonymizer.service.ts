import { Compliance } from '@common/constants';

export default abstract class AbstractAnonymizerService {
  abstract complianceName: Compliance;

  abstract anonymize(text: string): Promise<string>;
}
