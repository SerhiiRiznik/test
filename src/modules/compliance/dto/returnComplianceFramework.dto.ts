import { ApiProperty } from '@nestjs/swagger';

export default class ReturnComplianceFrameworkDto {
  @ApiProperty({ example: 'HIPAA_US' })
  code: string;

  @ApiProperty({ example: 'HIPAA' })
  name: string;

  @ApiProperty({
    example: 'Health Insurance Portability and Accountability Act (US)',
    nullable: true,
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 18,
    nullable: true,
    required: false,
  })
  entityTypesCount?: number;

  @ApiProperty({ example: true })
  isActive: boolean;
}
