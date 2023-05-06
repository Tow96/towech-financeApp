// Libraries
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import * as httpMock from 'node-mocks-http';
// Tested Element
import { User } from './user.decorator';
// Stubs
import { userStub } from '@towech-finance/authentication/repos/user';

function getParamDecoratorFactory(decorator: any) {
  class TestDecorator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public test(@decorator() value) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test');
  return args[Object.keys(args)[0]].factory;
}

describe('When the Refresh decorator is used with a user in the request', () => {
  it('Should return the user ', () => {
    const factory = getParamDecoratorFactory(User);
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();
    req.user = userStub;
    const ctx = new ExecutionContextHost([req, res]);
    const result = factory(null, ctx);

    expect(result).toBe(userStub);
  });
});

describe('When Refresh decorator is used without a user in the request', () => {
  it('Should return undefined ', () => {
    const factory = getParamDecoratorFactory(User);
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();
    const ctx = new ExecutionContextHost([req, res]);
    const result = factory(null, ctx);

    expect(result).toBeUndefined();
  });
});
