import { Module } from '@nestjs/common';
import { AuthenticationShellFeatureModule } from '@towech-finance/authentication/shell/feature';

@Module({
  imports: [AuthenticationShellFeatureModule],
})
export class AppModule {}
