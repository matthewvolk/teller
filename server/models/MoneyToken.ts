import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from './User';

@Entity('money_tokens')
export class MoneyToken {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ unique: true, nullable: false })
  access_token: string;

  @Column({ unique: true, nullable: false })
  institution: string;

  @Column({ unique: true, nullable: false })
  item_id: string;

  @ManyToOne(() => User, (user) => user.money_tokens)
  user: User;
}
