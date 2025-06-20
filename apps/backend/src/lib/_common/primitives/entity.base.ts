import { convertPropsToObject } from './utils';
import { Guard } from './guard';

export interface BaseEntityProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEntityProps<T> {
  id: string;
  props: T;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class Entity<EntityProps> {
  constructor({ id, createdAt, updatedAt, props }: CreateEntityProps<EntityProps>) {
    this._id = id;
    this.validateProps(props);
    const now = new Date();

    this._createdAt = createdAt || now;
    this._updatedAt = updatedAt || now;
    this.props = props;
    this.validate();
  }

  protected readonly props: EntityProps;

  protected _id: string;
  private readonly _createdAt: Date;
  protected _updatedAt: Date;

  get id(): string { return this._id; } // prettier-ignore
  get createdAt(): Date { return this._createdAt; } // prettier-ignore
  get updatedAt(): Date { return this._updatedAt; } // prettier-ignore

  static isEntity(entity: unknown): entity is Entity<unknown> {
    return entity instanceof Entity;
  }

  /**
   *  Checks if two entities are the same Entity by comparing ID field.
   * @param object Entity
   */
  public equals(object?: Entity<EntityProps>): boolean {
    if (object === null || object === undefined) return false;
    if (this === object) return true;
    if (!Entity.isEntity(object)) return false;

    return this.id ? this.id === object.id : false;
  }

  /**
   * Returns entity properties.
   * @return {*}  {Props & EntityProps}
   * @memberof Entity
   */
  public getProps(): EntityProps & BaseEntityProps {
    const propsCopy = {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }

  /**
   * Convert an Entity and all sub-entities/Value Objects it
   * contains to a plain object with primitive types. Can be
   * useful when logging an entity during testing/debugging
   */
  public toObject(): unknown {
    const plainProps = convertPropsToObject(this.props); // eslint-disable-line @typescript-eslint/no-unsafe-assignment

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      ...plainProps,
    };
    return Object.freeze(result);
  }

  /**
   * There are certain rules that always have to be true (invariants)
   * for each entity. Validate method is called every time before
   * saving an entity to the database to make sure those rules are respected.
   */
  public abstract validate(): void;

  private validateProps(props: EntityProps): void {
    const MAX_PROPS = 50;

    if (Guard.isEmpty(props)) {
      throw new Error('Entity props should not be empty');
    }
    if (typeof props !== 'object') {
      throw new Error('Entity props should be an object');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (Object.keys(props as any).length > MAX_PROPS) {
      throw new Error(`Entity props should not have more than ${MAX_PROPS} properties`);
    }
  }
}
