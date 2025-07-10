// App packages
import { ValueObject } from '../../../../_common/primitives';
import { CategoryType } from '../../../../_common/categories';

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

  protected validate(props: CategoryProps): void {
    if (props._id === '' || props._userId === '') throw new Error('Empty values');
  }
}
