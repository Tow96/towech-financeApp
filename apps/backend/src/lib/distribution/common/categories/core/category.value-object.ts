// App packages
import { ValueObject } from '../../../../_common/primitives/value-object.base';

export enum CategoryType {
  income = 'INCOME',
  expense = 'EXPENSE',
  transfer = 'TRANSFER',
}

interface CategoryProps {
  _id: string;
  _userId: string;
  _type: CategoryType;
}

export class Category extends ValueObject<CategoryProps> {
  get id() {
    return this.props._id;
  }

  get userId() {
    return this.props._userId;
  }

  get type() {
    return this.props._type;
  }
}
