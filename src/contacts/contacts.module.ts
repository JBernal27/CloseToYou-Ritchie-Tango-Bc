import { Module } from '@nestjs/common';
import { ContactController } from './contacts.controller';
import { ContactService } from './contacts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinart.module';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, User]), CloudinaryModule],
  controllers: [ContactController],
  providers: [ContactService, JwtService],
})
export class ContactsModule {}
