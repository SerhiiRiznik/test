import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import sanitizeHtml from 'sanitize-html';
import ContactMessage from '../../common/db/entities/contactMessage.entity';
import CreateContactMessageDto from './dto/createContactMessage.dto';

@Injectable()
export default class ContactMessageService {
  constructor(
    @InjectRepository(ContactMessage)
    private contactMessageRepository: Repository<ContactMessage>,
  ) {}

  private static sanitizeInput(input: string): string {
    return sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();
  }

  async create(dto: CreateContactMessageDto): Promise<ContactMessage> {
    try {
      const sanitizedDto = {
        firstName: ContactMessageService.sanitizeInput(dto.firstName),
        lastName: ContactMessageService.sanitizeInput(dto.lastName),
        email: ContactMessageService.sanitizeInput(dto.email),
        phoneNumber: ContactMessageService.sanitizeInput(dto.phoneNumber),
        message: ContactMessageService.sanitizeInput(dto.message),
      };

      const insertResult = await this.contactMessageRepository
        .createQueryBuilder()
        .insert()
        .into(ContactMessage)
        .values([sanitizedDto])
        .execute();

      const id: string = insertResult.identifiers[0]?.uuid;
      if (!id) {
        throw new InternalServerErrorException(
          'Contact message creation failed: no id returned',
        );
      }

      const message = await this.contactMessageRepository
        .createQueryBuilder('cm')
        .where('cm.uuid = :uuid', { uuid: id })
        .getOne();

      if (!message) {
        throw new InternalServerErrorException(
          'Contact message creation failed: could not fetch created record',
        );
      }

      return message;
    } catch (error) {
      if (error instanceof InternalServerErrorException) throw error;
      throw new InternalServerErrorException(
        'Failed to create contact message',
      );
    }
  }
}
