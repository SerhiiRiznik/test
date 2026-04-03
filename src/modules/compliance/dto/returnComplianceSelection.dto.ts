import { ApiProperty } from '@nestjs/swagger';
import ReturnComplianceFrameworkDto from './returnComplianceFramework.dto';

export default class ReturnComplianceSelectionDto {
  @ApiProperty({ example: 'uuid-123' })
  uuid: string;

  @ApiProperty({ example: 'user-123' })
  userId: string;

  @ApiProperty({ example: 'framework-uuid-123' })
  frameworkId: string;

  @ApiProperty({ type: ReturnComplianceFrameworkDto })
  framework: ReturnComplianceFrameworkDto;
}
