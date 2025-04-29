/** index.js
 * Copyright (c) 2022, TowechLabs
 * All rights reserved
 *
 * index for all the category routes
 */
import { Controller, Get, Req, Res } from '@nestjs/common';
import { GetCategoriesResponse } from './Models/responses';
import { Category } from './Models/objects';
import { WorkerGetAllCategories } from './Models/requests';
import Queue, { AmqpMessage } from 'tow96-amqpwrapper';
@Controller('categories')
export class CategoryController {
  private categoryQueue = (process.env.CATEGORY_QUEUE as string) || 'categoryQueue';

  @Get('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getCategories(@Req() req: any, @Res() res: any) {
    try {
      const connection = await Queue.startConnection();
      const channel = await Queue.setUpChannelAndExchange(connection);

      const corrId = await Queue.publishWithReply(channel, this.categoryQueue, {
        status: 200,
        type: 'get-all',
        payload: {
          user_id: req.user._id,
        } as WorkerGetAllCategories,
      });
      const response: AmqpMessage<Category[]> = await Queue.fetchFromQueue(channel, corrId, corrId);

      // Sorts the received categories
      const incomeCats: Category[] = [];
      const expenseCats: Category[] = [];
      const archivedCats: Category[] = [];

      response.payload.forEach((category: Category) => {
        if (category.archived) {
          archivedCats.push(category);
        } else {
          switch (category.type) {
            case 'Income':
              incomeCats.push(category);
              break;
            case 'Expense':
              expenseCats.push(category);
              break;
          }
        }
      });

      res.status(response.status).send({
        Income: incomeCats,
        Expense: expenseCats,
        Archived: archivedCats,
      } as GetCategoriesResponse);
    } catch (e) {
      res.status(500).send(e);
    }
  }
}
