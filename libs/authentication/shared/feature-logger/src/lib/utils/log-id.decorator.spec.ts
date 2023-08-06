// Libraries
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import * as httpMock from 'node-mocks-http';
// Tested Element
import { LogId } from './log-id.decorator';

function getParamDecoratorFactory(decorator: any) {
  class TestDecorator {
    public test(@decorator() value: any) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test');
  return args[Object.keys(args)[0]].factory;
}

const mockId = 'TestId';

describe('Log-Id decorator', () => {
  let factory: any;
  let req: httpMock.MockRequest<any>;
  let res: httpMock.MockResponse<any>;
  let ctx: ExecutionContextHost;
  let result: any;

  const getResult = () => {
    ctx = new ExecutionContextHost([req, res]);
    result = factory(null, ctx);
  };

  beforeEach(() => {
    factory = getParamDecoratorFactory(LogId);
    req = httpMock.createRequest();
    res = httpMock.createResponse();
  });

  it('Should return the logid when it is used with a logid in the request', () => {
    req['logId'] = mockId;
    getResult();
    expect(result).toBe(mockId);
  });

  it('Should return "NO-LOGID" ', () => {
    getResult();
    expect(result).toBe('NO-LOGID');
  });
});
