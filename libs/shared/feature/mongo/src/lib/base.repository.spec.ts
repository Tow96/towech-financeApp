import { getModelToken } from '@nestjs/mongoose';
import { DummyDoc, DummyModel, DummyRepo, dummyStub } from '../mocks/test.support';
import { Test } from '@nestjs/testing';

let dummyRepo: DummyRepo;
let responseDoc: DummyDoc;

let dummyModel: DummyModel;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [DummyRepo, { provide: getModelToken(DummyDoc.name), useClass: DummyModel }],
  }).compile();

  dummyRepo = moduleRef.get<DummyRepo>(DummyRepo);
  dummyModel = moduleRef.get<DummyModel>(getModelToken(DummyDoc.name));
});

describe('When create is called', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
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

  it('Should return data', () => {
    expect(responseDoc).toEqual(dummyStub());
  });
});

describe('When find is called with a registered id', () => {
  let responseDocs: DummyDoc[];

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(dummyModel, 'find');
    responseDocs = await dummyRepo.find({ _id: dummyStub()._id });
  });

  it('Should call the model', () => {
    expect(dummyModel.find).toHaveBeenCalledTimes(1);
    expect(dummyModel.find).toHaveBeenCalledWith({ _id: dummyStub()._id }, {}, { lean: true });
  });

  it('Should return an array', () => {
    expect(responseDocs).toEqual([dummyStub()]);
  });
});

describe('When find is called with an unregistered id', () => {
  let responseDocs: DummyDoc[];

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(dummyModel, 'find');
    responseDocs = await dummyRepo.find({ _id: 'notreal' });
  });

  it('Should call the model', () => {
    expect(dummyModel.find).toHaveBeenCalledTimes(1);
    expect(dummyModel.find).toHaveBeenCalledWith({ _id: 'notreal' }, {}, { lean: true });
  });

  it('Should return an empty array', () => {
    expect(responseDocs).toEqual([]);
  });
});

describe('When findById is called with a registered id', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(dummyModel, 'findById');
    responseDoc = await dummyRepo.findById(dummyStub()._id.toString());
  });

  it('Should call the model', () => {
    expect(dummyModel.findById).toBeCalledTimes(1);
    expect(dummyModel.findById).toHaveBeenCalledWith(dummyStub()._id.toString());
  });

  it('Should return the document', () => {
    expect(responseDoc).toEqual(dummyStub());
  });
});

describe('When findById is called with an unregistered id', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(dummyModel, 'findById');
    responseDoc = await dummyRepo.findById('notarealid');
  });

  it('Should return null', () => {
    expect(responseDoc).toEqual(null);
  });
});

describe('When findByIdAndUpdate is called with a registered id', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(dummyModel, 'findByIdAndUpdate');
    responseDoc = await dummyRepo.findByIdAndUpdate(dummyStub()._id.toString(), {});
  });

  it('Should call the model', () => {
    expect(dummyModel.findByIdAndUpdate).toBeCalledTimes(1);
    expect(dummyModel.findByIdAndUpdate).toHaveBeenCalledWith(
      dummyStub()._id.toString(),
      {},
      { lean: true, new: true, upsert: true }
    );
  });

  it('Should return the document', () => {
    expect(responseDoc).toEqual(dummyStub());
  });
});

describe('When findByIdAndUpdate is called with an unregistered id', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(dummyModel, 'findByIdAndUpdate');
    responseDoc = await dummyRepo.findByIdAndUpdate('notarealid', {});
  });

  it('Should return null', () => {
    expect(responseDoc).toEqual(null);
  });
});

describe('When findByIdAndDelete is called with a registered id', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(dummyModel, 'findByIdAndDelete');
    responseDoc = await dummyRepo.findByIdAndDelete(dummyStub()._id.toString());
  });

  it('Should call the model', () => {
    expect(dummyModel.findByIdAndDelete).toBeCalledTimes(1);
    expect(dummyModel.findByIdAndDelete).toHaveBeenCalledWith(
      dummyStub()._id.toString(),
      undefined
    );
  });

  it('Should return the document', () => {
    expect(responseDoc).toEqual(dummyStub());
  });
});

describe('When findOneAndUpdate is called with an unregistered id', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(dummyModel, 'findByIdAndDelete');
    responseDoc = await dummyRepo.findByIdAndDelete('notarealid');
  });

  it('Should return null', () => {
    expect(responseDoc).toEqual(null);
  });
});

describe('When findOne is called with a registered id', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(dummyModel, 'findOne');
    responseDoc = await dummyRepo.findOne({ _id: dummyStub()._id.toString() });
  });

  it('Should call the model', () => {
    expect(dummyModel.findOne).toBeCalledTimes(1);
    expect(dummyModel.findOne).toHaveBeenCalledWith(
      { _id: dummyStub()._id.toString() },
      {},
      { lean: true }
    );
  });

  it('Should return the document', () => {
    expect(responseDoc).toEqual(dummyStub());
  });
});

describe('When findOne is called with an unregistered id', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(dummyModel, 'findOne');
    responseDoc = await dummyRepo.findOne({ _id: 'notarealid' });
  });

  it('Should return null', () => {
    expect(responseDoc).toEqual(null);
  });
});

describe('When findOneAndUpdate is called with a registered id', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(dummyModel, 'findOneAndUpdate');
    responseDoc = await dummyRepo.findOneAndUpdate({ _id: dummyStub()._id.toString() }, {});
  });

  it('Should call the model', () => {
    expect(dummyModel.findOneAndUpdate).toBeCalledTimes(1);
    expect(dummyModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: dummyStub()._id.toString() },
      {},
      { lean: true, new: true, upsert: true }
    );
  });

  it('Should return the document', () => {
    expect(responseDoc).toEqual(dummyStub());
  });
});

describe('When findOneAndUpdate is called with an unregistered id', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(dummyModel, 'findOneAndUpdate');
    responseDoc = await dummyRepo.findOneAndUpdate({ _id: 'notarealid' }, {});
  });

  it('Should return null', () => {
    expect(responseDoc).toEqual(null);
  });
});
