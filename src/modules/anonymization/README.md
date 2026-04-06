# Anonymization Module

## Overview

The Anonymization module provides a flexible, compliance-aware data anonymization service. It uses a pluggable architecture to support multiple anonymization strategies, currently supporting Presidio-based PII data anonymization (GDPR only).

## Features

- **Multi-compliance support**: Handle different regulatory requirements (GDPR, ~~HIPAA~~, ~~FADP~~)
- **Pluggable architecture**: Easy to extend with new anonymization strategies
- **Presidio integration**: PII data detection (using LLM) and anonymization

## Installation & Setup

The module is automatically configured. Just add the required environment variables to your `.env` file

## Supported Compliance Standards

- **GDPR**: General Data Protection Regulation (EU, UK)
- ~~**HIPAA**: Health Insurance Portability and Accountability Act (US)~~ (strategy to be implemented)
- ~~**FADP**: Federal Act on Data Protection(Switzerland)~~ (strategy to be implemented)

## Usage Examples

```typescript
import AnonymizationService from './anonymization.service';
import { Compliance } from '../../common/constants';

@Injectable()
export class MyService {
  constructor(private anonymizationService: AnonymizationService) {}

  async processData(text: string) {
    const anonymized = await this.anonymizationService.anonymize(
      Compliance.GDPR,
      text,
    );
    return anonymized;
  }
}
```

## Extending with New Anonymizers

To add a new anonymization strategy:

1. Create a new service extending `AbstractAnonymizerService`:

```typescript
import AbstractAnonymizerService from './abstract-anonymizer.service';
import { Compliance } from '../../common/constants';

export default class CustomAnonymizerService extends AbstractAnonymizerService {
  complianceName: Compliance = Compliance.GDPR; // or add new compliance type

  async anonymize(text: string): Promise<string> {
    // Your anonymization logic here
    return anonymizedText;
  }
}
```

2. Register it in `anonymization.module.ts`:

```typescript
{
  provide: ANONYMIZER_SERVICES_TOKEN,
  useFactory: (
    presidioAnonymizerService: PresidioAnonymizerService,
    customAnonymizerService: CustomAnonymizerService,
  ) => [presidioAnonymizerService, customAnonymizerService],
  inject: [PresidioAnonymizerService, CustomAnonymizerService],
}
```

3. Update the `Compliance` enum in `common/constants.ts` if needed:

```typescript
export const enum Compliance {
  GDPR = 'GDPR',
  HIPAA = 'HIPAA',
  CUSTOM = 'CUSTOM', // New compliance type
}
```

## Architecture

The module uses a **Strategy Pattern** with dependency injection:

- **AnonymizationService**: Main service that routes requests to appropriate anonymizers
- **AbstractAnonymizerService**: Base class for all anonymization strategies
- **PresidioAnonymizerService**: Implementation using Presidio for PII detection

## Configuration

Update environment variables as needed for:

- Presidio service URLs and Ports

## Error Handling

The module throws `AnonymizerNotFoundError` when:

- An unsupported compliance is requested
- The corresponding anonymizer service is not registered

Example error:

```
Error: Anonymizer not found for compliance: UNSUPPORTED_COMPLIANCE
```

## Known Issues

- Adding two anonymizers with the same compliance name will result in the last one overwriting the previous
