import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ExampleUser from '../../common/db/entities/example.user.entity';
import ExampleUserService from './example.user.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExampleUser])],
  providers: [ExampleUserService],
  exports: [ExampleUserService],
})
export default class ExampleUserModule {}
