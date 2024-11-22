import { Module } from '@nestjs/common';
import { ContactsModule } from './contacts/contacts.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CloudinaryModule } from './cloudinary/cloudinart.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ContactsModule,
    DatabaseModule,
    CloudinaryModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
