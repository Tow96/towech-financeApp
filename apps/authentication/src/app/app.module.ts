import { Module } from '@nestjs/common';
import { AuthenticationCoreFeatureShellModule } from '@finance/authentication/core/shell';

@Module({
  imports: [AuthenticationCoreFeatureShellModule],
})
export class AppModule {}
