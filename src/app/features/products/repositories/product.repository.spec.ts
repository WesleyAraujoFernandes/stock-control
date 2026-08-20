import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ProductRepository } from './product-repository';
import { Product } from '../models/product.model';
import { CreateProductRequest } from '../models/create-product.request';
import { UpdateProductRequest } from '../models/update-product.request';
import { environment } from '../../../../environments/environment';

describe('ProductRepository', () => {
  let repository: ProductRepository;
  let httpTesting: HttpTestingController;

  const endpoint = `${environment.apiUrl}/api/products`;

  const product: Product = {
    id: '1',
    name: 'Notebook',
    sku: 'NOTE-001',
    category: 'Eletrônicos',
    quantity: 10,
    minimumStock: 2,
    unitPrice: 3500,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    repository = TestBed.inject(ProductRepository);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('deve buscar todos os produtos', () => {
    repository.getProducts().subscribe((products) => {
      expect(products).toEqual([product]);
    });

    const request = httpTesting.expectOne(endpoint);

    expect(request.request.method).toBe('GET');

    request.flush([product]);
  });

  it('deve criar um produto', () => {
    const requestBody: CreateProductRequest = {
      name: 'Notebook',
      sku: 'NOTE-001',
      category: 'Eletrônicos',
      quantity: 10,
      minimumStock: 2,
      unitPrice: 3500,
      active: true,
    };

    repository.create(requestBody).subscribe((result) => {
      expect(result).toEqual(product);
    });

    const request = httpTesting.expectOne(endpoint);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(requestBody);

    request.flush(product);
  });

  it('deve atualizar um produto', () => {
    const id = '1';

    const requestBody: UpdateProductRequest = {
      name: 'Notebook atualizado',
      sku: 'NOTE-001',
      category: 'Eletrônicos',
      quantity: 15,
      minimumStock: 2,
      unitPrice: 3600,
      active: true,
    };

    repository.update(id, requestBody).subscribe((result) => {
      expect(result).toEqual(product);
    });

    const request = httpTesting.expectOne(`${endpoint}/${id}`);

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(requestBody);

    request.flush(product);
  });

  it('deve alterar o status do produto', () => {
    const id = '1';

    repository.toggleActive(id).subscribe((result) => {
      expect(result).toEqual(product);
    });

    const request = httpTesting.expectOne(`${endpoint}/${id}/active`);

    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toBeNull();

    request.flush(product);
  });

  it('deve excluir um produto', () => {
    const id = '1';

    repository.remove(id).subscribe();

    const request = httpTesting.expectOne(`${endpoint}/${id}`);

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });

  it('deve propagar erros HTTP', () => {
    repository.getProducts().subscribe({
      next: () => fail('Era esperado um erro'),
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const request = httpTesting.expectOne(endpoint);

    request.flush(
      {
        status: 500,
        code: 'INTERNAL_ERROR',
        message: 'Erro interno',
      },
      {
        status: 500,
        statusText: 'Internal Server Error',
      }
    );
  });
});
