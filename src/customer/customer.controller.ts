import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: Readonly<Partial<CreateCustomerDto>>) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  activate(@Param('id') id: string) {
    return this.customerService.activate(id);
  }

  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  deactivate(@Param('id') id: string) {
    return this.customerService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string) {
    return this.customerService.delete(id);
  }
}
