import { CategoryType } from '@/lib/categories/data-store';

export interface MovementDto {
  id: string;
  date: Date;
  description: string;
  category: {
    type: CategoryType;
    id: string | null;
    subId: string | null;
  };
  summary: SummaryDto[];
}

export interface SummaryDto {
  wallet: {
    originId: string | null;
    destinationId: string | null;
  };
  amount: number;
}