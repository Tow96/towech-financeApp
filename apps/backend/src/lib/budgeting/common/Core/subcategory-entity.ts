import { v4 as uuidV4 } from 'uuid';
import { Entity } from '../../../_common/primitives';

interface SubCategoryProps {
  iconId: number;
  name: string;
}

export interface CreateSubCategoryProps {
  iconId: number;
  name: string;
}

export interface UpdateSubCategoryProps {
  iconId?: number;
  name?: string;
}

export class SubCategoryEntity extends Entity<SubCategoryProps> {
  static create(create: CreateSubCategoryProps): SubCategoryEntity {
    const id = uuidV4();
    const props: SubCategoryProps = { ...create };
    return new SubCategoryEntity({ id, props });
  }

  validate(): void {
    this.props.name = this.props.name.trim().toLowerCase();
    if (this.props.name.length < 2) throw new Error('name must be at least 3 characters');
    if (this.props.name.length > 50) throw new Error('name cannot be longer than 50 characters');
  }

  update(update: UpdateSubCategoryProps): void {
    if (update.iconId) this.props.iconId = update.iconId;
    if (update.name) this.props.name = update.name;
    this._updatedAt = new Date();
    this.validate();
  }

  get name(): string {
    return this.props.name;
  }
}
