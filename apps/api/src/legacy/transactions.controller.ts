/** index.ts
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * index for all the transaction routes
 */
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res } from '@nestjs/common';
import Queue, { AmqpMessage } from 'tow96-amqpwrapper';
import { Transaction } from './Models/objects';
import { ChangeTransactionResponse } from './Models/responses';

@Controller('transactions')
export class TransactionController {
  private transactionQueue = (process.env.TRANSACTION_QUEUE as string) || 'transactionQueue';

  @Post('')
  async createTransaction(@Req() req: any, @Res() res: any, @Body() body: any) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      // Passes the data to the Transaction Workers
      const corrId = await Queue.publishWithReply(channel, this.transactionQueue, {
        status: 200,
        type: 'add-Transaction',
        payload: {
          user_id: req.user._id,
          wallet_id: body.wallet_id,
          category: {
            _id: body.category_id,
          },
          concept: body.concept,
          amount: body.amount,
          transactionDate: body.transactionDate,
          excludeFromReport: body.excludeFromReport,
        } as Transaction,
      });

      // Waits for the response from the workers
      const response: AmqpMessage<ChangeTransactionResponse> = await Queue.fetchFromQueue(channel, corrId, corrId);

      res.status(response.status).send(response.payload);
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }

  @Get(':transactionId')
  async getTransaction(@Req() req: any, @Res() res: any, @Param('transactionId') transactionId: string) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      // Passes the data to the Transaction Workers
      const corrId = await Queue.publishWithReply(channel, this.transactionQueue, {
        status: 200,
        type: 'get-Transaction',
        payload: {
          user_id: req.user._id,
          _id: transactionId,
        } as Transaction,
      });

      // Waits for the response from the workers
      const response: AmqpMessage<Transaction> = await Queue.fetchFromQueue(channel, corrId, corrId);
      res.status(response.status).send(response.payload);
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }

  @Patch(':transactionId')
  async updateTransaction(
    @Req() req: any,
    @Res() res: any,
    @Body() body: any,
    @Param('transactionId') transactionId: string
  ) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      // Passes the data to the Transaction Workers
      const corrId = await Queue.publishWithReply(channel, this.transactionQueue, {
        status: 200,
        type: 'edit-Transaction',
        payload: {
          _id: transactionId,
          user_id: req.user._id,
          wallet_id: body.wallet_id,
          category: {
            _id: body.category_id,
          },
          concept: body.concept,
          amount: body.amount,
          transactionDate: body.transactionDate,
          excludeFromReport: body.excludeFromReport,
        } as Transaction,
      });

      // Waits for the response from the workers
      const response: AmqpMessage<ChangeTransactionResponse> = await Queue.fetchFromQueue(channel, corrId, corrId);

      res.status(response.status).send(response.payload);
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }

  @Delete(':transactionId')
  async deleteTransaction(@Req() req: any, @Res() res: any, @Param('transactionId') transactionId: string) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      // Passes the data to the Transaction Workers
      const corrId = await Queue.publishWithReply(channel, this.transactionQueue, {
        status: 200,
        type: 'delete-Transaction',
        payload: {
          user_id: req.user._id,
          _id: transactionId,
        } as Transaction,
      });

      // Waits for the response from the workers
      const response: AmqpMessage<ChangeTransactionResponse> = await Queue.fetchFromQueue(channel, corrId, corrId);

      res.status(response.status).send(response.payload);
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }
}
