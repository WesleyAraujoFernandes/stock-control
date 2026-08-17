import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { ApiErrorService } from '../errors/api-error.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const apiErrorService = inject(ApiErrorService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiError = apiErrorService.normalize(error);

      console.error('Erro HTTP:', {
        status: apiError.status,
        message: apiError.message,
        path: apiError.path,
      });

      return throwError(() => apiError);
    })
  );
};
