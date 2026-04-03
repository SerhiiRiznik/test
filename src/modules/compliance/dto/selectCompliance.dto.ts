import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class SelectComplianceDto {
  @ApiProperty({
    example: 'HIPAA_US',
    description: 'Compliance framework code',
  })
  @IsString()
  @IsNotEmpty()
  frameworkCode: string;

  @ApiProperty({
    example: 'user-123',
    description: 'User identifier',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
