/** base.schema.ts
 * Copyright (c) 2022, Towechlabs
 *
 * Basic Mongo Schema
 */
import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export abstract class BaseSchema {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Date, required: true })
  createdAt: Date;
}
