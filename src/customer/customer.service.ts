import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';
import { CustomerType } from './customer.types';
import { HashService } from '../shared/security/hash.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly hashService: HashService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findOne({
      where: { email: createCustomerDto.email },
    });

    if (existingCustomer) {
      throw new HttpException('Customer with this email already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await this.hashService.hash(createCustomerDto.password);

    const customer = this.customerRepository.create({
      ...createCustomerDto,
      password: hashedPassword,
      type: createCustomerDto.type || CustomerType.GUEST,
    });

    return await this.customerRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async findOneWithRelations(id: string, relations?: string[]): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: relations || [],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return await this.customerRepository.findOne({
      where: { email },
    });
  }

  async update(
    id: string,
    updateCustomerDto: Readonly<Partial<CreateCustomerDto>>,
  ): Promise<Customer> {
    const customer = await this.findOne(id);

    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingCustomer = await this.customerRepository.findOne({
        where: { email: updateCustomerDto.email },
      });

      if (existingCustomer) {
        throw new HttpException('Customer with this email already exists', HttpStatus.CONFLICT);
      }
    }

    const updateData: any = { ...updateCustomerDto };

    if (updateCustomerDto.password) {
      updateData.password = await this.hashService.hash(updateCustomerDto.password);
    }

    Object.assign(customer, updateData);

    return await this.customerRepository.save(customer);
  }

  async delete(id: string): Promise<{ message: string }> {
    const customer = await this.findOne(id);

    await this.customerRepository.remove(customer);

    return { message: `Customer with ID ${id} has been permanently deleted` };
  }

  async activate(id: string): Promise<Customer> {
    const customer = await this.findOne(id);

    customer.isActive = true;
    return await this.customerRepository.save(customer);
  }

  async deactivate(id: string): Promise<Customer> {
    const customer = await this.findOne(id);

    customer.isActive = false;
    return await this.customerRepository.save(customer);
  }
}
