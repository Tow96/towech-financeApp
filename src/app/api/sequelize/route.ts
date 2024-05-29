import { isSuperUser } from '@/libs/feature-authentication';
import { apiHandler } from '@/utils';
import { getLogger } from '@/utils/Logger';
import { MongoClient } from 'mongodb';
import { drizzle } from 'drizzle-orm/postgres-js';
import { dbClient } from '@/utils';
import * as userSchema from '@/libs/feature-authentication/Schema';
import { eq } from 'drizzle-orm';
/* eslint-disable max-nested-callbacks */
// TODO: Deprecate this after migration is complete
const logger = getLogger('sequelize');

export const POST = apiHandler(isSuperUser, async _ => {
  const mongoClient = new MongoClient(process.env.DATABASE_URL || '');
  await mongoClient.connect();
  const mongoDb = mongoClient.db(process.env.MONGODB);
  logger.info('connected to mongo db');

  const sqlConn = drizzle(dbClient, { schema: { ...userSchema } });

  // Migrate users
  logger.info('Migrating users');
  const usersCollection = mongoDb.collection('users');
  const data = await usersCollection.find({}).toArray();
  data.forEach(async user => {
    const userMigrated = await sqlConn.query.usersTable.findFirst({
      where: eq(userSchema.usersTable.id, user._id.toString()),
    });
    if (userMigrated) {
      logger.info(`user ${user._id} already migrated`);
    } else {
      await sqlConn.insert(userSchema.usersTable).values({
        id: user._id.toString(),
        email: user.username,
        hashedPassword: user.password,
        name: user.name,
        accountConfirmed: user.accountConfirmed,
        createdAt: new Date(user.createdAt),
        deleted: false,
        role: user.role,
      });
      logger.info(`migrated user ${user._id}`);
    }
  });

  mongoClient.close();
  logger.info('disconnected from mongo db');
});
