import { NgModule } from '@angular/core';
import { provideState } from '@ngrx/store';
import { reducer, userStateFeatureKey } from './user-state.reducer';

@NgModule({
  providers: [provideState(userStateFeatureKey, reducer)],
})
export class DesktopShellDataAccessUserStateModule {}
