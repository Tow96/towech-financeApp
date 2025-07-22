import { ReactNode } from 'react';

import { MovementDto } from '@/lib/movements/data-store';
import { MovementItem } from './movement-item';

interface MovementListProps {
  movements: MovementDto[];
  loading: boolean;
}

export const MovementList = ({ movements, loading }: MovementListProps) => {
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        movements.map(movement => <MovementItem key={movement.id} movement={movement} />)
      )}
    </div>
  );
};
