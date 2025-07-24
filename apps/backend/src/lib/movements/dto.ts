import { CategoryType } from '@/lib/categories/dto';

export interface MovementDto {
  id: string;
  category: {
    type: CategoryType;
    id: string | null;
    subId: string | null;
  };
  date: Date;
  description: string;
  summary: SummaryDto[];
}

export interface SummaryDto {
  wallet: {
    originId: string | null;
    destinationId: string | null;
  };
  amount: number;
}

export interface AddMovementDto {
  category: {
    type: CategoryType;
    id: string | null;
    subId: string | null;
  };
  date: Date;
  description: string;
  summary: SummaryDto[];
}
