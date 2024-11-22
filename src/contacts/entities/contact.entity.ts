// src/entities/contact.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Roles } from 'src/common/enums/roles.enum';
import { User } from 'src/users/entities/user.entity';
import { LatLng } from 'src/common/interfaces/region.interface';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ default: false })
  isFavorite: boolean;

  @Column({ nullable: true })
  image?: string;

  @Column({
    type: 'enum',
    enum: Roles,
  })
  role: Roles;

  @Column('simple-json')
  location: LatLng;

  @ManyToOne(() => User, (user) => user.contacts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
