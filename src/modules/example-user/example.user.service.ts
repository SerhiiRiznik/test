import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import isMySqlError from '../../common/utils/isMySqlError';
import ExampleUser from '../../common/db/entities/example.user.entity';

@Injectable()
export default class ExampleUserService {
  constructor(
    @InjectRepository(ExampleUser)
    private userRepository: Repository<ExampleUser>,
  ) {}

  async findAll(): Promise<ExampleUser[]> {
    try {
      return await this.userRepository.createQueryBuilder('user').getMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findOne(uuid: string): Promise<ExampleUser> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.uuid = :uuid', { uuid })
        .getOne();

      if (!user) {
        throw new NotFoundException(`ExampleUser with uuid ${uuid} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async create(email: string): Promise<ExampleUser> {
    try {
      const insertResult = await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(ExampleUser)
        .values([{ email }])
        .execute();

      const userId: string = insertResult.identifiers[0]?.uuid;
      if (!userId) {
        throw new InternalServerErrorException(
          'ExampleUser creation failed: no id returned',
        );
      }

      const user = await this.findOne(userId);
      if (!user) {
        throw new InternalServerErrorException(
          'ExampleUser creation failed: could not fetch created user',
        );
      }

      return user;
    } catch (error: unknown) {
      if (isMySqlError(error) && error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exists');
      }

      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
