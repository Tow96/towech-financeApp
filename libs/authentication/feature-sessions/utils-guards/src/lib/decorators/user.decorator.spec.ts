// Libraries
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import * as httpMock from 'node-mocks-http';
// Tested Element
import { User } from './user.decorator';
// Stubs
import { userStub } from '@finance/authentication/shared/utils-testing';

describe('user.decorator', () => {
  let factory: any;
  let req: httpMock.MockResponse<any>;
  let res: httpMock.MockResponse<any>;
  let result: any;

  function getResult() {
    const ctx = new ExecutionContextHost([req, res]);
    result = factory(null, ctx);
  }

  beforeEach(() => {
    class TestDecorator {
      public test(@User() value: any) {}
    }
    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test');
    factory = args[Object.keys(args)[0]].factory;
    req = httpMock.createRequest();
    res = httpMock.createResponse();
  });

  describe('When the Refresh decorator is used with a user in the request', () => {
    it('Should return the user ', () => {
      req['user'] = userStub;
      getResult();
      expect(result).toBe(userStub);
    });
  });

  describe('When Refresh decorator is used without a user in the request', () => {
    it('Should return undefined ', () => {
      getResult();
      expect(result).toBeUndefined();
    });
  });
});
