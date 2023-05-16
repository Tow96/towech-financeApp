/** user-state.selectors.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Selectors for the user-state
 */
// Libraries
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, userStateFeatureKey } from './user-state.reducer';

const selectUserState = createFeatureSelector<State>(userStateFeatureKey);

export const selectUser = createSelector(selectUserState, state => state.user);

export const isLoggedIn = createSelector(selectUserState, state => (state.user ? true : false));

export const selectLoadState = createSelector(selectUserState, state => ({
  loaded: state.loaded,
  loading: state.loading,
}));
