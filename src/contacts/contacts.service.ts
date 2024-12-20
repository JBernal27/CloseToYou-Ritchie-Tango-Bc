import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    contactData: CreateContactDto,
    userId: number,
    file?: Express.Multer.File,
  ): Promise<Contact> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const finalContactData: Partial<Contact> = {
      ...contactData,
      image: undefined,
      user: user,
      isFavorite: contactData.isFavorite === 'true' ? true : false,
    };

    if (file) {
      try {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        finalContactData.image = uploadResult.secure_url;
      } catch (error) {
        throw new InternalServerErrorException(
          'Error al subir la imagen a Cloudinary',
        );
      }
    }

    const existingContact = await this.contactRepository.findOne({
      where: { number: contactData.number, user: { id: userId } },
    });
    if (existingContact) {
      throw new ConflictException(
        'Ya existe un contacto con el mismo número. Por favor, utilice un número diferente.',
      );
    }

    contactData.email = contactData.email.toLowerCase().trim();

    finalContactData.location = {
      latitude: +contactData.latitude,
      longitude: +contactData.longitude,
    };

    try {
      const contact = this.contactRepository.create(finalContactData);
      return await this.contactRepository.save(contact);
    } catch (error) {
      throw new InternalServerErrorException(
        'No se pudo crear el contacto. Verifique que todos los campos requeridos sean correctos.',
      );
    }
  }

  async findAll(): Promise<Contact[]> {
    return await this.contactRepository.find();
  }

  async findOne(id: number): Promise<Contact> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contacto con ID ${id} no encontrado`);
    }
    return contact;
  }

  async findByUserId(id: number): Promise<Contact[]> {
    const contacts = await this.contactRepository.find({
      where: { user: { id } },
    });
    return contacts;
  }

  async update(
    id: number,
    contactData: UpdateContactDto,
    file?: Express.Multer.File,
  ): Promise<Contact> {
    const contact = await this.findOne(id);

    const finalContactData: Partial<Contact> = {
      ...contact,
      ...contactData,
      image: contact.image,
      isFavorite: false,
    };

    if (contactData.isFavorite !== undefined) {
      finalContactData.isFavorite =
        contactData.isFavorite === 'true' ? true : false;
    }

    if (file) {
      if (contact.image) {
        const publicId = this.extractPublicId(contact.image);
        try {
          await this.cloudinaryService.deleteResource(publicId, 'image');
        } catch (error) {
          throw new InternalServerErrorException(
            'Error al eliminar la imagen anterior de Cloudinary',
          );
        }
      }

      try {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        finalContactData.image = uploadResult.secure_url;
      } catch (error) {
        throw new InternalServerErrorException(
          'Error al subir la nueva imagen a Cloudinary',
        );
      }
    }

    if (contactData.email) {
      finalContactData.email = contactData.email.toLowerCase().trim();
    }

    if (contactData.latitude && contactData.longitude) {
      finalContactData.location = {
        latitude: +contactData.latitude,
        longitude: +contactData.longitude,
      };
    }

    try {
      return await this.contactRepository.save(finalContactData);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'Ya existe un contacto con el mismo número o correo. Por favor, utilice valores diferentes.',
        );
      }
      throw new InternalServerErrorException(
        'No se pudo actualizar el contacto. Verifique que los campos sean válidos.',
      );
    }
  }

  async delete(id: number): Promise<void> {
    const contact = await this.findOne(id);

    if (contact.image) {
      const publicId = this.extractPublicId(contact.image);
      try {
        await this.cloudinaryService.deleteResource(publicId, 'image');
      } catch (error) {
        throw new InternalServerErrorException(
          'Error al eliminar la imagen de Cloudinary',
        );
      }
    }

    const result = await this.contactRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Contacto con ID ${id} no encontrado`);
    }
  }

  private extractPublicId(url: string): string {
    const segments = url.split('/');
    return segments[segments.length - 1].split('.')[0];
  }
}
