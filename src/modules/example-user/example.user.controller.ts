import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import UserService from './example.user.service';
import CreateUserDto from './dto/createExampleUser.dto';
import ReturnUserDto from './dto/returnExampleUser.dto';

@ApiTags('example-users')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('example-users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new ExampleUser from given email' })
  @ApiCreatedResponse({
    description: 'ExampleUser successfully created',
    type: ReturnUserDto,
  })
  @ApiBadRequestResponse({ description: 'Email is required' })
  @SerializeOptions({ type: ReturnUserDto })
  @Post()
  async create(@Body() body: CreateUserDto): Promise<ReturnUserDto> {
    return this.userService.create(body.email);
  }

  @ApiOperation({ summary: 'Get all ExampleUsers' })
  @ApiOkResponse({
    description: 'ExampleUsers retrieved successfully',
    type: ReturnUserDto,
    isArray: true,
  })
  @SerializeOptions({ type: ReturnUserDto })
  @Get()
  async getAll(): Promise<ReturnUserDto[]> {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get ExampleUser by their uuid' })
  @ApiFoundResponse({
    description: 'ExampleUser found successfully',
    type: ReturnUserDto,
  })
  @ApiNotFoundResponse({
    description: 'ExampleUser with specified uuid not found',
  })
  @ApiBadRequestResponse({ description: 'Invalid uuid parameter' })
  @SerializeOptions({ type: ReturnUserDto })
  @Get(':uuid')
  async getByUuid(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
  ): Promise<ReturnUserDto> {
    return this.userService.findOne(uuid);
  }
}
