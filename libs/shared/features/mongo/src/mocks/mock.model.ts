import { FilterQuery, Types } from 'mongoose';
import { BaseSchema } from '../lib/base.schema';

/* eslint-disable */
export abstract class MockModel<T extends BaseSchema> {
  protected abstract entityStub: T;

  constructor(createEntityData: T) {
    this.constructorSpy(createEntityData);
  }

  constructorSpy(_createEntityData: T): void {}

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    if (filter._id === this.entityStub._id.toString()) return this.entityStub;
    return null;
  }

  async find(filter: FilterQuery<T>): Promise<T[]> {
    if (Object.keys(filter).length === 0) return [this.entityStub];

    if (filter._id && filter._id.toString() === this.entityStub._id.toString())
      return [this.entityStub];
    return [];
  }

  async findById(id: Types.ObjectId | string): Promise<T | null> {
    if (id.toString() === this.entityStub._id.toString()) return this.entityStub;
    return null;
  }

  async findByIdAndUpdate(id: Types.ObjectId | string): Promise<T> {
    if (id.toString() === this.entityStub._id.toString()) return this.entityStub;
    return null;
  }

  async findByIdAndDelete(id: Types.ObjectId | string): Promise<T> {
    if (id.toString() === this.entityStub._id.toString()) return this.entityStub;
    return null;
  }

  async findOneAndUpdate(filter: FilterQuery<T>): Promise<T> {
    if (filter._id && filter._id.toString() === this.entityStub._id.toString())
      return this.entityStub;
    return null;
  }

  // async findOneAndDelete(filter: FilterQuery<T>): Promise<T> {
  //   if (filter._id.toString() === this.entityStub._id.toString()) return this.entityStub;
  //   return null;
  // }

  async save(): Promise<T> {
    return this.entityStub;
  }
}
