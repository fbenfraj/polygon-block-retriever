import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Block {
  @PrimaryKey()
  id: number;

  @Property()
  hash: string;

  @Property()
  number: string;

  @Property()
  parentHash: string;

  @Property()
  timestamp: Date;

  @Property()
  forked: boolean;
}
