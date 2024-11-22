import { Module } from '@nestjs/common';
import { ContactController } from './contacts.controller';
import { ContactService } from './contacts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinart.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Contact]), CloudinaryModule],
  controllers: [ContactController],
  providers: [ContactService, JwtService],
})
export class ContactsModule {}
