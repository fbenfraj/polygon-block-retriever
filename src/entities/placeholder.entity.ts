// src/entities/placeholder.entity.ts

import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Placeholder {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;
}
