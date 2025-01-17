import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeNameDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
