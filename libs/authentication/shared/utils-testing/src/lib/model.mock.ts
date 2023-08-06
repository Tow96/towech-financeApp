import { FilterQuery, Types } from 'mongoose';

class MockBase {
  public _id: Types.ObjectId;
  public createdAt: Date;

  constructor(id: string) {
    this._id = new Types.ObjectId(id);
    this.createdAt = new Date();
  }
}

export abstract class MockModel<T extends MockBase> {
  protected abstract entityStub: T;
  constructor(createEntityData: T) {
    this.constructorSpy(createEntityData);
  }
  constructorSpy(_createEntityData: T): void {} // eslint-disable-line
  private matchObjects(filter: FilterQuery<T>): boolean {
    let matched = false;
    Object.keys(filter).forEach(key => {
      if (filter[key].toString() === (this.entityStub[key as keyof T] as any).toString())
        matched = true;
    });
    return matched;
  }

  async find(filter: FilterQuery<T>): Promise<T[]> {
    if ((Object.keys(filter) || []).length === 0) return [this.entityStub];
    return this.matchObjects(filter) ? [this.entityStub] : [];
  }
  async findById(id: Types.ObjectId | string): Promise<T | null> {
    return id.toString() === this.entityStub._id.toString() ? this.entityStub : null;
  }
  async findByIdAndUpdate(id: Types.ObjectId | string): Promise<T | null> {
    return id.toString() === this.entityStub._id.toString() ? this.entityStub : null;
  }
  async findByIdAndDelete(id: Types.ObjectId | string): Promise<T | null> {
    return id.toString() === this.entityStub._id.toString() ? this.entityStub : null;
  }
  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.matchObjects(filter) ? this.entityStub : null;
  }
  async findOneAndUpdate(filter: FilterQuery<T>): Promise<T | null> {
    return this.matchObjects(filter) ? this.entityStub : null;
  }
  // async findOneAndDelete(filter: FilterQuery<T>): Promise<T> {
  //   if (filter._id.toString() === this.entityStub._id.toString()) return this.entityStub;
  //   return null;
  // }
  async create(): Promise<T> {
    return this.entityStub;
  }
}
