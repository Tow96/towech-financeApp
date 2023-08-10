// Libraries
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import * as httpMock from 'node-mocks-http';
// Tested Element
import { Refresh } from './refresh.decorator';
// Stubs
import { userStub } from '@finance/authentication/shared/utils-testing';

describe('refresh.decorator', () => {
  let factory: any;
  let req: httpMock.MockRequest<any>;
  let res: httpMock.MockResponse<any>;
  let result: any;

  function getParamDecoratorFactory(decorator: any) {
    class TestDecorator {
      public test(@decorator() value: any) {} // eslint-disable-line
    }

    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test');
    return args[Object.keys(args)[0]].factory;
  }
  function getResult() {
    const ctx = new ExecutionContextHost([req, res]);
    result = factory(null, ctx);
  }

  beforeEach(() => {
    factory = getParamDecoratorFactory(Refresh);
    req = httpMock.createRequest();
    res = httpMock.createResponse();
  });

  describe('When the Refresh decorator is used with a token in the request', () => {
    it('Should return the user ', () => {
      req['user'] = { id: 'test', user: userStub() };
      getResult();
      expect(result).toEqual({ id: 'test', user: userStub() });
    });
  });

  describe('When Refresh decorator is used without a user in the request', () => {
    it('Should return undefined ', () => {
      getResult();
      expect(result).toBeUndefined();
    });
  });
});
