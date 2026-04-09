import { ApiProperty } from '@nestjs/swagger';

export default class ContactMessageResponseDto {
  @ApiProperty({
    example: 'Contact message created successfully',
    description: 'Success message',
  })
  message!: string;
}
