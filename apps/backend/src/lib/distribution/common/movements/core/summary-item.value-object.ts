// External packages

// App packages
import { ValueObject, ValueObjectProps } from '../../../../_common/primitives/value-object.base';

// Slice packages

export interface SummaryItemProps {
  originWalletId: string | null;
  destinationWalletId: string | null;
  amount: number;
}

export class SummaryItem extends ValueObject<SummaryItemProps> {
  get originWalletId() {
    return this.props.originWalletId;
  }

  get destinationWalletId() {
    return this.destinationWalletId;
  }

  get amount() {
    return this.props.amount;
  }

  protected validate(props: ValueObjectProps<SummaryItemProps>) {
    if (props.originWalletId === null && props.destinationWalletId === null)
      throw new Error('The movement needs to have at least one wallet');

    props.amount = Math.floor(props.amount);
    if (props.amount <= 0) throw new Error('Amount must be a positive integer');
  }
}
