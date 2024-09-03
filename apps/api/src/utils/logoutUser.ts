/** logoutUser.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Utility that removes the refresh tokens from a user if a token is provided,
 * only removes it, otherwise, removes all tokens
 */

// Libraries
import amqplib from 'amqplib';
import Queue, { AmqpMessage } from 'tow96-amqpwrapper';

// Models
import { Objects, Requests } from '../Models';

const userQueue = (process.env.USER_QUEUE as string) || 'userQueue';

const logoutUser = async (
  channel: amqplib.Channel,
  user: Objects.User.BaseUser,
  token: string | null = null,
): Promise<void> => {
  // If a token is provided, only that one is removed

  // Retrieves the tokens from the DB to verify
  const corrId = await Queue.publishWithReply(channel, userQueue, {
    status: 200,
    type: 'get-byId',
    payload: {
      _id: user._id,
    } as Requests.WorkerGetUserById,
  });
  const response: AmqpMessage<Objects.User.BackendUser> = await Queue.fetchFromQueue(channel, corrId, corrId);
  const bUser = response.payload;

  // If a token is provided, it only removes that token, otherwise, removes all of them
  if (token) {
    // Removes the token from the user
    if (bUser.singleSessionToken === token) bUser.singleSessionToken = undefined;
    if (bUser.refreshTokens) bUser.refreshTokens = bUser.refreshTokens.filter((rToken) => rToken !== token);
  } else {
    bUser.refreshTokens = [];
    bUser.singleSessionToken = undefined;
  }

  // Updates de user
  Queue.publishSimple(channel, userQueue, {
    status: 200,
    type: 'log',
    payload: bUser as Objects.User.FrontendUser,
  });
};

export default logoutUser;
