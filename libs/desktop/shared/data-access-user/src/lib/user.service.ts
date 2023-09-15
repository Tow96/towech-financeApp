/** desktop-user.service.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Service that handles the user state
 */
// Libraries
import { Injectable } from '@angular/core';
// Models
import { LoginUser } from '@finance/shared/utils-types';
import { Status } from './types';
// Pipes
import { Store, createFeature, createSelector } from '@ngrx/store';
import { loginActions, logoutActions, refreshActions } from './user.actions';
import { reducer } from './user.reducer';
import { EffectSources } from '@ngrx/effects';
import * as userEffects from './user.effects';
// import { loginEffect, logoutEffect, refreshEffect } from './user.effects';

export enum Actions {
  LOGIN = '[User Service] Login',
  LOGOUT = '[User Service] Logout',
  REFRESH = '[User Service] Refresh',
}

@Injectable()
export class DesktopUserService {
  private state = createFeature({
    name: 'user',
    reducer,
    extraSelectors: ({ selectUserState }) => ({
      isLoggedIn: createSelector(selectUserState, state => ({
        loaded: state.status === Status.COMPLETED || state.status === Status.FAILED,
        logged: state.data !== null,
      })),
      tokenExp: createSelector(selectUserState, state => ({
        value: state.token,
        expired: new Date().getTime() > (state.data?.exp || 0) * 1000,
      })),
    }),
  });

  // Sources ------------------------------------------------------------------
  login = (payload: Partial<LoginUser>) => this.ngrx.dispatch(loginActions.do({ payload }));
  logout = () => this.ngrx.dispatch(logoutActions.do({ payload: undefined }));
  refresh = () => this.ngrx.dispatch(refreshActions.do({ payload: undefined }));

  // Selectors ----------------------------------------------------------------
  status$ = this.ngrx.select(this.state.selectStatus);
  value$ = this.ngrx.select(this.state.selectData);
  token$ = this.ngrx.select(this.state.tokenExp);
  isLoggedIn$ = this.ngrx.select(this.state.isLoggedIn);

  constructor(private readonly ngrx: Store, private readonly effects: EffectSources) {
    ngrx.addReducer(this.state.name, this.state.reducer);
    effects.addEffects(userEffects);
    this.refresh();
  }
}
