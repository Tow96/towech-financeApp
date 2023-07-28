// Work around file to avoid certain modules to be added to
// the production bundle
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { actionSanitizer, stateSanitizer } from '@state-adapt/core';

export const devOnlyModulesImport = [
  provideStoreDevtools({
    maxAge: 25,
    autoPause: true,
    trace: false,
    actionSanitizer,
    stateSanitizer,
  }),
];
