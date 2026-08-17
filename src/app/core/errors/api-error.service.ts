import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from './api-error';

@Injectable({
  providedIn: 'root',
})
export class ApiErrorService {

  normalize(error: HttpErrorResponse): ApiError {
    return {
      status: error.status,
      message: this.extractMessage(error),
      timestamp: error.error?.timestamp,
      path: error.error?.path,
    };
  }

  private extractMessage(error: HttpErrorResponse): string {
    if (typeof error.error === 'string') {
      return error.error;
    }

    if (error.error?.message) {
      return error.error.message;
    }

    return this.getDefaultMessage(error.status);
  }

  private getDefaultMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Os dados informados são inválidos.';

      case 401:
        return 'Sua sessão não é válida.';

      case 403:
        return 'Você não possui permissão para realizar esta operação.';

      case 404:
        return 'O recurso solicitado não foi encontrado.';

      case 409:
        return 'Não foi possível concluir a operação porque existe um conflito.';

      case 422:
        return 'Os dados informados não puderam ser processados.';

      case 500:
        return 'Ocorreu um erro interno no servidor.';

      case 502:
      case 503:
      case 504:
        return 'O servidor está temporariamente indisponível.';

      case 0:
        return 'Não foi possível conectar ao servidor.';

      default:
        return 'Ocorreu um erro inesperado.';
    }
  }
}
