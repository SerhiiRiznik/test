import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ContactMessage from '../../common/db/entities/contactMessage.entity';
import ContactMessageService from './contactMessage.service';
import ContactMessageController from './contactMessage.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContactMessage])],
  providers: [ContactMessageService],
  controllers: [ContactMessageController],
})
export default class ContactMessageModule {}
