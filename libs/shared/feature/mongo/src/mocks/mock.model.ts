// import { FilterQuery, Types } from 'mongoose';
// import { BaseSchema } from '../lib/base.schema';

export abstract class MockModel {
  // export abstract class MockModel<T extends BaseSchema> {
  // protected abstract entityStub: T;
  // constructor(createEntityData: T) {
  //   // this.constructorSpy(createEntityData);
  // }
  // constructorSpy(_createEntityData: T): void {} // eslint-disable-line
  // async find(filter: FilterQuery<T>): Promise<T[]> {
  //   // if ((Object.keys(filter) || []).length === 0) return [this.entityStub];
  //   // let matched = false;
  //   // Object.keys(filter).forEach(key => {
  //   //   if (filter[key].toString() === this.entityStub[key].toString()) matched = true;
  //   // });
  //   // return matched ? [this.entityStub] : [];
  //   return [];
  // }
  // async findById(id: Types.ObjectId | string): Promise<T | null> {
  //   if (id.toString() === this.entityStub._id.toString()) return this.entityStub;
  //   return null;
  // }
  // async findByIdAndUpdate(id: Types.ObjectId | string): Promise<T> {
  //   if (id.toString() === this.entityStub._id.toString()) return this.entityStub;
  //   return null;
  // }
  // async findByIdAndDelete(id: Types.ObjectId | string): Promise<T> {
  //   if (id.toString() === this.entityStub._id.toString()) return this.entityStub;
  //   return null;
  // }
  // async findOne(filter: FilterQuery<T>): Promise<T | null> {
  //   let matched = false;
  //   Object.keys(filter).forEach(key => {
  //     if (filter[key].toString() === this.entityStub[key].toString()) matched = true;
  //   });
  //   return matched ? this.entityStub : null;
  // }
  // async findOneAndUpdate(filter: FilterQuery<T>): Promise<T> {
  //   let matched = false;
  //   Object.keys(filter).forEach(key => {
  //     if (filter[key].toString() === this.entityStub[key].toString()) matched = true;
  //   });
  //   return matched ? this.entityStub : null;
  // }
  // // async findOneAndDelete(filter: FilterQuery<T>): Promise<T> {
  // //   if (filter._id.toString() === this.entityStub._id.toString()) return this.entityStub;
  // //   return null;
  // // }
  // async create(): Promise<T> {
  //   return this.entityStub;
  // }
}
/* eslint-enable */
