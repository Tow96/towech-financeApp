import { NgModule } from '@angular/core';
import { provideState } from '@ngrx/store';
import { reducer, userStateFeatureKey } from './user-state.reducer';
import { provideEffects } from '@ngrx/effects';
import { UserEffects } from './user-state.effects';

@NgModule({
  providers: [provideState(userStateFeatureKey, reducer), provideEffects([UserEffects])],
})
export class DesktopShellDataAccessUserStateModule {}
