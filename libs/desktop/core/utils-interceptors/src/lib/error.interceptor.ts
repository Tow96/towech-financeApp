/** error-handler.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Global error handler that includes toasts
 */
import { ErrorHandler, Injectable, Injector, Provider } from '@angular/core';
import { DesktopSharedDataAccessToasterService } from '@finance/desktop/shared/data-access-toast';

export enum messages {
  UNKNOWN = 'Unknown error',
  DEFAULT = 'Error: please check console for details',
}

@Injectable()
export class DesktopGlobalErrorToastClass implements ErrorHandler {
  public constructor(private readonly injector: Injector) {}

  /* eslint-disable @typescript-eslint/no-explicit-any */
  public handleError(error: any): void {
    let message = messages.UNKNOWN;

    if (error) {
      console.error(error);
      message = messages.DEFAULT;

      // Gets the message regardless if the error is sync or async:
      if (error.rejection) error = error.rejection;
      if (error.message) message = error.message;
    }

    const toastService = this.injector.get<DesktopSharedDataAccessToasterService>(
      DesktopSharedDataAccessToasterService
    );
    toastService.addError$.next({ message });
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export const DesktopGlobalErrorToast: Provider = {
  provide: ErrorHandler,
  useClass: DesktopGlobalErrorToastClass,
};
