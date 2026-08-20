import { Injectable } from '@angular/core';
import { ApiError } from './api-error';

@Injectable({
  providedIn: 'root',
})
export class ApiErrorMessageService {
  getMessage(error: ApiError): string {
    return error.message || 'Ocorreu um erro inesperado.';
  }
}
