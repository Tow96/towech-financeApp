/** base.repository.ts
 * Copyright (c) 2022, Towechlabs
 *
 * Basic repository for Mongo, contains the calls that most repositories use
 */
import { FilterQuery, Model, Types, SaveOptions, UpdateQuery } from 'mongoose';
import { BaseSchema } from './base.schema';

export abstract class BaseRepository<TDocument extends BaseSchema> {
  // Hides the model so it cannot be used without parameters
  constructor(protected readonly model: Model<TDocument>) {}

  /** create
   * Creates a new document inside a database, will automatically add an _id and a create date
   * @param document The document that will be stored
   * @param options Mongo SaveOptions
   *
   * @returns The stored document
   */
  protected async create(
    document: Omit<TDocument, '_id' | 'createdAt'>,
    options?: SaveOptions
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
      createdAt: new Date(),
    });
    return (await createdDocument.save(options)) as unknown as TDocument;
  }

  /** find
   * Searches the database for all the documents that match
   * @param filterQuery The filter to match
   *
   * @returns The found document
   */
  protected async find(filterQuery: FilterQuery<TDocument>) {
    return this.model.find(filterQuery, {}, { lean: true });
  }

  protected async findById(id: string) {
    return this.model.findById(id);
  }

  protected async findByIdAndUpdate(
    id: Types.ObjectId | string,
    update: UpdateQuery<TDocument | null>
  ) {
    const document = await this.model.findByIdAndUpdate(id, update, {
      lean: true,
      upsert: true,
      new: true,
    });

    if (!document) return null;
    return document;
  }

  protected async findByIdAndDelete(
    id: Types.ObjectId | string,
    options?: FilterQuery<TDocument>
  ): Promise<TDocument | null> {
    const document = await this.model.findByIdAndDelete(id, options);

    if (!document) return null;
    return document;
  }

  /** findOne
   * Searches the database for the first document that matches, will return null if not found
   * @param filterQuery The filter to match
   *
   * @returns The found document
   */
  protected async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument | null> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!document) return null;
    return document;
  }

  /** findOneAndUpdate
   * Searches the database for the first document that matches, and updates the data
   * @param filterQuery The filter to match
   *
   * @returns The found document
   */
  protected async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument | null>
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      upsert: true,
      new: true,
    });

    if (!document) return null;
    return document;
  }

  // async upsert(filterQuery: FilterQuery<TDocument>, document: Partial<TDocument>) {
  //   return this.model.findOneAndUpdate(filterQuery, document, {
  //     lean: true,
  //     upsert: true,
  //     new: true,
  //   });
  // }

  // async startTransaction() {
  //   const session = await this.connection.startSession();
  //   session.startTransaction();
  //   return session;
  // }
}
