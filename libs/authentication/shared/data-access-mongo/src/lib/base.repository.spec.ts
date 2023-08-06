// Libraries
import { Test } from '@nestjs/testing';
import { InjectModel, Schema, getModelToken } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
// Tested elements
import { BaseSchema } from './base.schema';
import { BaseRepository } from './base.repository';
// Mocks
import { MockModel } from '@finance/authentication/shared/utils-testing';

// ----------------------------------------------------------------------------
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
  public constructor(@InjectModel(DummyDoc.name) model: Model<DummyDoc>) {
    super(model);
  }
  public override create(document: DummyDoc) {
    return super.create(document);
  }
  public override find(filterQuery: FilterQuery<DummyDoc>) {
    return super.find(filterQuery);
  }
  public override findById(id: string) {
    return super.findById(id);
  }
  public override findOne(filterQuery: FilterQuery<DummyDoc>) {
    return super.findOne(filterQuery);
  }
  public override findOneAndUpdate(
    filterQuery: FilterQuery<DummyDoc>,
    update: UpdateQuery<DummyDoc>
  ) {
    return super.findOneAndUpdate(filterQuery, update);
  }
  public override findByIdAndUpdate(id: Types.ObjectId | string, update: UpdateQuery<DummyDoc>) {
    return super.findByIdAndUpdate(id, update);
  }
  public override findByIdAndDelete(id: string | Types.ObjectId, options?: FilterQuery<DummyDoc>) {
    return super.findByIdAndDelete(id, options);
  }
}

// ----------------------------------------------------------------------------
describe('Base Repository', () => {
  let dummyRepo: DummyRepo;
  let responseDoc: DummyDoc | null;
  let dummyModel: DummyModel;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [DummyRepo, { provide: getModelToken(DummyDoc.name), useClass: DummyModel }],
    }).compile();

    dummyRepo = moduleRef.get<DummyRepo>(DummyRepo);
    dummyModel = moduleRef.get<DummyModel>(getModelToken(DummyDoc.name));
  });

  describe('When create is called', () => {
    beforeEach(async () => {
      jest.spyOn(dummyModel, 'create');
      responseDoc = await dummyRepo.create(dummyStub());
    });

    it('Should call the dummyModel', () => {
      expect(dummyModel.create).toHaveBeenCalledTimes(1);
      expect(dummyModel.create).toHaveBeenCalledWith({
        _id: expect.anything(),
        createdAt: expect.anything(),
      });
    });
    it('Should return data', () => expect(responseDoc).toEqual(dummyStub()));
  });

  describe('When find is called', () => {
    let responseDocs: DummyDoc[];
    beforeEach(() => jest.spyOn(dummyModel, 'find'));

    describe('with a registered id', () => {
      beforeEach(async () => (responseDocs = await dummyRepo.find({ _id: dummyStub()._id })));

      it('Should call the model', () => {
        expect(dummyModel.find).toHaveBeenCalledTimes(1);
        expect(dummyModel.find).toHaveBeenCalledWith({ _id: dummyStub()._id }, {}, { lean: true });
      });
      it('Should return an array', () => expect(responseDocs).toEqual([dummyStub()]));
    });
    describe('with an unregistered id', () => {
      it('Should return an empty array', async () => {
        responseDocs = await dummyRepo.find({ _id: 'notreal' });
        expect(responseDocs).toEqual([]);
      });
    });
  });

  describe('When findById is called', () => {
    beforeEach(() => jest.spyOn(dummyModel, 'findById'));

    describe('With a registered id', () => {
      beforeEach(async () => (responseDoc = await dummyRepo.findById(dummyStub()._id.toString())));

      it('Should call the model', () => {
        expect(dummyModel.findById).toBeCalledTimes(1);
        expect(dummyModel.findById).toHaveBeenCalledWith(dummyStub()._id.toString());
      });
      it('Should return the document', () => expect(responseDoc).toEqual(dummyStub()));
    });
    describe('With an unregistered id', () => {
      it('Should return null', async () => {
        responseDoc = await dummyRepo.findById('notarealid');
        expect(responseDoc).toEqual(null);
      });
    });
  });

  describe('When findByIdAndUpdate is called', () => {
    beforeEach(() => jest.spyOn(dummyModel, 'findByIdAndUpdate'));

    describe('With a registered id', () => {
      beforeEach(
        async () =>
          (responseDoc = await dummyRepo.findByIdAndUpdate(dummyStub()._id.toString(), {}))
      );

      it('Should call the model', () => {
        expect(dummyModel.findByIdAndUpdate).toBeCalledTimes(1);
        expect(dummyModel.findByIdAndUpdate).toHaveBeenCalledWith(
          dummyStub()._id.toString(),
          {},
          { lean: true, new: true, upsert: true }
        );
      });
      it('Should return the document', () => expect(responseDoc).toEqual(dummyStub()));
    });
    describe('When findByIdAndUpdate is called with an unregistered id', () => {
      it('Should return null', async () => {
        responseDoc = await dummyRepo.findByIdAndUpdate('notarealid', {});
        expect(responseDoc).toEqual(null);
      });
    });
  });

  describe('When findByIdAndDelete is called', () => {
    beforeEach(() => jest.spyOn(dummyModel, 'findByIdAndDelete'));

    describe('With a registered id', () => {
      beforeEach(
        async () => (responseDoc = await dummyRepo.findByIdAndDelete(dummyStub()._id.toString()))
      );

      it('Should call the model', () => {
        expect(dummyModel.findByIdAndDelete).toBeCalledTimes(1);
        expect(dummyModel.findByIdAndDelete).toHaveBeenCalledWith(
          dummyStub()._id.toString(),
          undefined
        );
      });
      it('Should return the document', () => expect(responseDoc).toEqual(dummyStub()));
    });
    describe('With an unregistered id', () => {
      it('Should return null', async () => {
        responseDoc = await dummyRepo.findByIdAndDelete('notarealid');
        expect(responseDoc).toEqual(null);
      });
    });
  });

  describe('When findOne is called', () => {
    beforeEach(() => jest.spyOn(dummyModel, 'findOne'));

    describe('With a registered id', () => {
      beforeEach(
        async () => (responseDoc = await dummyRepo.findOne({ _id: dummyStub()._id.toString() }))
      );

      it('Should call the model', () => {
        expect(dummyModel.findOne).toBeCalledTimes(1);
        expect(dummyModel.findOne).toHaveBeenCalledWith(
          { _id: dummyStub()._id.toString() },
          {},
          { lean: true }
        );
      });
      it('Should return the document', () => expect(responseDoc).toEqual(dummyStub()));
    });
    describe('With an unregistered id', () => {
      it('Should return null', async () => {
        responseDoc = await dummyRepo.findOne({ _id: 'notarealid' });
        expect(responseDoc).toEqual(null);
      });
    });
  });

  describe('When findOneAndUpdate is called', () => {
    beforeEach(() => jest.spyOn(dummyModel, 'findOneAndUpdate'));

    describe('With a registered id', () => {
      beforeEach(
        async () =>
          (responseDoc = await dummyRepo.findOneAndUpdate({ _id: dummyStub()._id.toString() }, {}))
      );

      it('Should call the model', () => {
        expect(dummyModel.findOneAndUpdate).toBeCalledTimes(1);
        expect(dummyModel.findOneAndUpdate).toHaveBeenCalledWith(
          { _id: dummyStub()._id.toString() },
          {},
          { lean: true, new: true, upsert: true }
        );
      });
      it('Should return the document', () => expect(responseDoc).toEqual(dummyStub()));
    });
    describe('With an unregistered id', () => {
      it('Should return null', async () => {
        responseDoc = await dummyRepo.findOneAndUpdate({ _id: 'notarealid' }, {});
        expect(responseDoc).toEqual(null);
      });
    });
  });
});
