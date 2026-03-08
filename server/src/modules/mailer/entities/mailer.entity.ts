import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base-entity';

@Entity('emails')
export class Mailer extends BaseEntity {
  @Column({ name: 'sender', type: 'varchar', nullable: false }) // EMAIL_USER from .env
  sender: string;

  @Column({ name: 'recepient', type: 'varchar', nullable: false }) // user.email from user database
  recepient: string;

  @Column({ name: 'subject', type: 'text', nullable: true }) // subject of the email
  subject: string;

  @Column({ name: 'body', type: 'text', nullable: false }) // html body of the email can use html and raw inline css
  body: string;

  @Column({ type: 'text', nullable: true }) // optional error message
  error_message?: string;
}
