import { IsEnum } from 'class-validator';

import { StatTimeframe, GetBalanceRequest } from '@towech-financeapp/shared';

export class GetBalanceDto implements GetBalanceRequest {
  @IsEnum(StatTimeframe)
  timeframe: StatTimeframe;
}
