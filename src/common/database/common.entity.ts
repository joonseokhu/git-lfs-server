import { DtoProp } from '@utils';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';

export abstract class CommonEntity {
  @DtoProp('index')
  @PrimaryGeneratedColumn()
  index: string;

  @DtoProp('id')
  @Index({ unique: true })
  @Column()
  id: string;

  @DtoProp('생성일')
  @CreateDateColumn()
  createdAt: Date;

  @DtoProp('수정일')
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  private beforeInsert() {
    this.id = ulid();
  }
}
