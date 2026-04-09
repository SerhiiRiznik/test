import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import ContactMessageService from './contactMessage.service';
import CreateContactMessageDto from './dto/createContactMessage.dto';
import ContactMessageResponseDto from './dto/contactMessageResponse.dto';

@ApiTags('contact-messages')
@Controller('contact-messages')
export default class ContactMessageController {
  constructor(private readonly contactMessageService: ContactMessageService) {}

  @ApiOperation({ summary: 'Submit a contact us message' })
  @ApiCreatedResponse({
    description: 'Contact message successfully submitted',
    type: ContactMessageResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiTooManyRequestsResponse({ description: 'Too many requests from this IP' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Throttle({ default: { limit: 5, ttl: 3600000 } })
  @Post()
  async create(
    @Body() body: CreateContactMessageDto,
  ): Promise<ContactMessageResponseDto> {
    return this.contactMessageService.create(body);
  }
}
