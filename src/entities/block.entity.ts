import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Block {
  @PrimaryKey()
  id: number;

  @Property()
  hash: string;

  @Property()
  parentHash: string;

  @Property()
  timestamp: string;

  @Property()
  forked: boolean;
}
