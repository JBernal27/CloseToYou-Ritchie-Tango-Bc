// src/contact/contact.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContactService } from './contacts.service';
import { Contact } from './entities/contact.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('contacts')
@UseGuards(AuthGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() contactData: Partial<Contact>,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Contact> {
    
    return await this.contactService.create(
      { ...contactData, user: req.user.id },
      req.user.id,
      file,
    );
  }

  @Get()
  async findAll(): Promise<Contact[]> {
    return await this.contactService.findAll();
  }

  @Get('user/:id')
  async findOneByUserId(@Param('id') id: number): Promise<Contact[]> {
    return await this.contactService.findByUserId(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Contact> {
    return await this.contactService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: number,
    @Body() contactData: Partial<Contact>,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Contact> {
    return await this.contactService.update(id, contactData, file);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.contactService.delete(id);
  }
}
