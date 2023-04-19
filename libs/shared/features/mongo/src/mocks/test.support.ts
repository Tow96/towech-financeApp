import { InjectModel, Schema } from '@nestjs/mongoose';
import { BaseSchema } from '../lib/base.schema';
import { MockModel } from './mock.model';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { BaseRepository } from '../lib/base.repository';

@Schema()
export class DummyDoc extends BaseSchema {}

export const dummyStub = (): DummyDoc => {
  return {
    _id: new Types.ObjectId('63ef9ebca2b48f1fe74b010a'),
    createdAt: new Date(0, 0, 0),
  };
};

export class DummyModel extends MockModel<DummyDoc> {
  protected entityStub = dummyStub();
}

export class DummyRepo extends BaseRepository<DummyDoc> {
  constructor(@InjectModel(DummyDoc.name) model: Model<DummyDoc>) {
    super(model);
  }

  create(document: DummyDoc) {
    return super.create(document);
  }

  find(filterQuery: FilterQuery<DummyDoc>) {
    return super.find(filterQuery);
  }

  findById(id: string) {
    return super.findById(id);
  }

  findOne(filterQuery: FilterQuery<DummyDoc>) {
    return super.findOne(filterQuery);
  }

  findOneAndUpdate(filterQuery: FilterQuery<DummyDoc>, update: UpdateQuery<DummyDoc>) {
    return super.findOneAndUpdate(filterQuery, update);
  }

  findByIdAndUpdate(id: Types.ObjectId | string, update: UpdateQuery<DummyDoc>) {
    return super.findByIdAndUpdate(id, update);
  }

  findByIdAndDelete(id: string | Types.ObjectId, options?: FilterQuery<DummyDoc>) {
    return super.findByIdAndDelete(id, options);
  }
}
