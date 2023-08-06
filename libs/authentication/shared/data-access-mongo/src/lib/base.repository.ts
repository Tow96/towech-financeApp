/** base.repository.ts
 * Copyright (c) 2022, Towechlabs
 *
 * Basic repository for Mongo, contains the calls that most repositories use
 */
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { BaseSchema } from './base.schema';

export abstract class BaseRepository<TDocument extends BaseSchema> {
  // Hides the model so it cannot be used without parameters
  public constructor(protected readonly model: Model<TDocument>) {}

  /**
   * Creates a new document inside a database, will automatically add an _id and a create date
   * @param document The document that will be stored
   * @param options Mongo SaveOptions
   * @returns The stored document
   */
  protected async create(document: Omit<TDocument, '_id' | 'createdAt'>): Promise<TDocument> {
    return this.model.create({ ...document, _id: new Types.ObjectId(), createdAt: new Date() });
  }

  /**
   * Searches the database for all the documents that match
   * @param filterQuery The filter to match
   * @returns An array of the matched documents
   */
  protected async find(filterQuery: FilterQuery<TDocument>) {
    return this.model.find(filterQuery, {}, { lean: true });
  }

  /**
   * Searches the database for an id that matches
   * @param {Types.ObjectId | string} id The id of the desired document
   * @returns The matched document or null if not found
   */
  protected async findById(id: Types.ObjectId | string) {
    return this.model.findById(id);
  }

  /**
   * Searches the database for an id that matches and updates it
   * @param {Types.ObjectId | string} id The id of the desired document
   * @param {UpdateQuery<TDocument>} update The contents that should be updated
   * @returns The updated document or null if not found
   */
  protected async findByIdAndUpdate(id: Types.ObjectId | string, update: UpdateQuery<TDocument>) {
    const document = await this.model.findByIdAndUpdate(id, update, {
      lean: true,
      upsert: true,
      new: true,
    });

    if (!document) return null;
    return document;
  }

  /**
   * Searches the database for an id that matches and deletes it
   * @param {Types.ObjectId | string} id The id of the desired document
   * @param {FilterQuery<TDocument>} options Options
   * @returns The deleted document or null if not found
   */
  protected async findByIdAndDelete(
    id: Types.ObjectId | string,
    options?: FilterQuery<TDocument>
  ): Promise<TDocument | null> {
    const document = await this.model.findByIdAndDelete(id, options);

    if (!document) return null;
    return document;
  }

  /**
   * Searches the database for the first document that matches, will return null if not found
   * @param {FilterQuery<TDocument>} filterQuery The filter to match
   * @returns The found document or null if not found
   */
  protected async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument | null> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!document) return null;
    return document;
  }

  /**
   * Searches the database for the first document that matches, and updates the data
   * @param {FilterQuery<TDocument>} filterQuery The filter to match
   * @param {UpdateQuery<TDocument>} update The contents that should be updated
   * @returns The updated document or null if not found
   */
  protected async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>
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
