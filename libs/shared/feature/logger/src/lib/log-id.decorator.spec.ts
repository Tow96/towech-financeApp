// Libraries
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import * as httpMock from 'node-mocks-http';
// Tested Element
import { LogId } from './log-id.decorator';

function getParamDecoratorFactory(decorator: any) {
  class TestDecorator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public test(@decorator() value) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test');
  return args[Object.keys(args)[0]].factory;
}

const mockId = 'TestId';

describe('When Log-id decorator is used with a logid in the request', () => {
  it('Should return the logid ', () => {
    const factory = getParamDecoratorFactory(LogId);
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();
    req.logId = mockId;
    const ctx = new ExecutionContextHost([req, res]);
    const result = factory(null, ctx);

    expect(result).toBe(mockId);
  });
});

describe('When Log-id decorator is used without a logid in the request', () => {
  it('Should return "NO-LOGID" ', () => {
    const factory = getParamDecoratorFactory(LogId);
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();
    const ctx = new ExecutionContextHost([req, res]);
    const result = factory(null, ctx);

    expect(result).toBe('NO-LOGID');
  });
});
