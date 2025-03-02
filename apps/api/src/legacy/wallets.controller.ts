/** index.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * index for all the wallet routes
 */
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res } from '@nestjs/common';
import Queue, { AmqpMessage } from 'tow96-amqpwrapper';
import { BaseUser } from './Models/Objects/user';
import { Transaction, Wallet } from './Models/objects';
import { ChangeTransactionResponse } from './Models/responses';
import { WorkerGetTransactions, WorkerTransfer } from './Models/requests';

@Controller('wallets')
export class WalletController {
  private transactionQueue = (process.env.TRANSACTION_QUEUE as string) || 'transactionQueue';

  @Get('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getWallets(@Req() req: any, @Res() res: any) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      const corrId = await Queue.publishWithReply(channel, this.transactionQueue, {
        status: 200,
        type: 'get-Wallets',
        payload: { _id: req.user._id } as BaseUser,
      });
      const response: AmqpMessage<Wallet[]> = await Queue.fetchFromQueue(channel, corrId, corrId);

      res.status(response.status).send(response.payload);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  @Post('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createWallet(@Req() req: any, @Res() res: any, @Body() body: any) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      // Passes the data to the Transaction Workers
      const corrId = await Queue.publishWithReply(channel, this.transactionQueue, {
        status: 200,
        type: 'add-Wallet',
        payload: {
          user_id: req.user._id,
          name: body.name,
          money: body.money,
          currency: body.currency,
          parent_id: body.parent_id,
          icon_id: body.icon_id,
        } as Wallet,
      });

      // Waits for the response from the workers
      const response: AmqpMessage<Wallet> = await Queue.fetchFromQueue(channel, corrId, corrId);

      res.status(response.status).send(response.payload);
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }

  @Post('transfer')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createTransference(@Req() req: any, @Res() res: any, @Body() body: any) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      // Passes the data to the Transaction Workers
      const corrId = await Queue.publishWithReply(channel, this.transactionQueue, {
        status: 200,
        type: 'transfer-Wallet',
        payload: {
          user_id: req.user._id,
          from_id: body.from_id,
          to_id: body.to_id,
          amount: body.amount,
          concept: body.concept,
          transactionDate: body.transactionDate,
        } as WorkerTransfer,
      });

      // Waits for the response from the workers
      const response: AmqpMessage<ChangeTransactionResponse> = await Queue.fetchFromQueue(
        channel,
        corrId,
        corrId
      );
      res.status(response.status).send(response.payload);
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }

  @Get(':walletId')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getWallet(@Req() req: any, @Res() res: any, @Param('walletId') walletId: string) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      const corrId = await Queue.publishWithReply(channel, this.transactionQueue, {
        status: 200,
        type: 'get-Wallet',
        payload: {
          _id: walletId,
          user_id: req.user._id,
        } as Wallet,
      });
      const response: AmqpMessage<Wallet> = await Queue.fetchFromQueue(channel, corrId, corrId);

      res.status(response.status).send(response.payload);
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }

  @Patch(':walletId')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateWallet(
    @Req() req: any,
    @Res() res: any,
    @Body() body: any,
    @Param('walletId') walletId: string
  ) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      const corrId = await Queue.publishWithReply(channel, this.transactionQueue, {
        status: 200,
        type: 'edit-Wallet',
        payload: {
          _id: walletId,
          user_id: req.user._id,
          name: body.name,
          icon_id: body.icon_id,
          currency: body.currency,
        } as Wallet,
      });
      const response: AmqpMessage<Wallet> = await Queue.fetchFromQueue(channel, corrId, corrId);

      res.status(response.status).send(response.payload);
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }

  @Delete(':walletId')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async deleteWallet(@Req() req: any, @Res() res: any, @Param('walletId') walletId: string) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      const corrId = await Queue.publishWithReply(channel, this.transactionQueue, {
        status: 200,
        type: 'delete-Wallet',
        payload: {
          _id: walletId,
          user_id: req.user._id,
        } as Wallet,
      });

      const response: AmqpMessage<Wallet> = await Queue.fetchFromQueue(channel, corrId, corrId);
      res.status(response.status).send(response.payload);
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }

  @Get(':walletId/transactions')
  async getWalletTransactions(
    @Req() req: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    @Res() res: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    @Param('walletId') walletId: string,
    @Query('datamonth') qDataMonth: string
  ) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      // Gets the data month, the worker will interpret it
      const dataMonth: string = (qDataMonth || '-1').toString();

      const corrId = await Queue.publishWithReply(channel, this.transactionQueue, {
        status: 200,
        type: 'get-Transactions',
        payload: {
          _id: walletId,
          user_id: req.user._id,
          datamonth: dataMonth,
        } as WorkerGetTransactions,
      });
      const response: AmqpMessage<Transaction[]> = await Queue.fetchFromQueue(
        channel,
        corrId,
        corrId
      );

      res.status(response.status).send(response.payload);
    } catch (e) {
      AmqpMessage.sendHttpError(res, e);
    }
  }
}
