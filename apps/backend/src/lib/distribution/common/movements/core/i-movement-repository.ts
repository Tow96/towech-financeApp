import { MovementAggregate } from './movement-aggregate';

export abstract class IMovementRepository {
  abstract getMovementOwner(id: string): Promise<string | null>;
  abstract getById(id: string): Promise<MovementAggregate | null>;

  abstract saveChanges(aggregate: MovementAggregate): Promise<void>;
}
