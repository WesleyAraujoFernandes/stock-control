import { ProductService } from "./product.service"
import { ProductRepository } from '../repositories/product-repository';
import { Product } from "../models/product.model";
import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { throwError } from "rxjs";
import { CreateProductRequest } from "../models/create-product.request";
import { UpdateProductRequest } from "../models/update-product.request";

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: jasmine.SpyObj<ProductRepository>;

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
    updatedAt: new Date()
  }

  const secondProduct: Product = {
    id: '2',
    name: 'Mouse',
    sku: 'MOUSE-001',
    category: 'Periféricos',
    quantity: 20,
    minimumStock: 5,
    unitPrice: 150,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  beforeEach(() => {
    const repositorySpy = jasmine.createSpyObj<ProductRepository>(
      'ProductRepository',
      [
        'getProducts',
        'create',
        'update',
        'toggleActive',
        'remove'
      ]
    );
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: repositorySpy
        }
      ]
    });
    service = TestBed.inject(ProductService);
    productRepository = TestBed.inject(
      ProductRepository
    ) as jasmine.SpyObj<ProductRepository>;
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  })

  it('deve buscar todos os produtos pelo repository', () => {
    productRepository.getProducts.and.returnValue(
      of([product, secondProduct])
    );
    service.getProducts().subscribe((products) => {
      expect(products).toEqual([
        product, secondProduct
      ]);
    });
    expect(productRepository.getProducts).toHaveBeenCalled();
  })

  it('deve criar um produto pelo repository', () => {
    const request: CreateProductRequest = {
      name: 'Notebook',
      sku: 'NOTE-001',
      category: 'Eletrônicos',
      quantity: 10,
      minimumStock: 2,
      unitPrice: 3500,
      active: true
    };
    productRepository.create.and.returnValue(of(product));
    service.create(request).subscribe((result) => {
      expect(result).toEqual(product)
    });
    expect(productRepository.create).toHaveBeenCalledWith(
      request
    );
  });

  it('deve atualizar um produto pelo repository', () => {
    const id = '1';
    const request: UpdateProductRequest = {
      name: 'Notebook atualizado',
      sku: 'NOTE-001',
      category: 'Eletrônicos',
      quantity: 15,
      minimumStock: 2,
      unitPrice: 3600,
      active: true
    };
    const updatedProduct: Product = {
      ...product,
      name: 'Notebook atualizado',
      quantity: 15,
      unitPrice: 3600
    };
    productRepository.update.and.returnValue(
      of(updatedProduct)
    );
    service.update(id, request).subscribe((result) => {
      expect(result).toEqual(updatedProduct);
    });
    expect(productRepository.update).toHaveBeenCalledWith(id, request);
  })

  it('deve alterar o status do produto pelo repository', () => {
    const id = '1';
    const updatedProduct: Product = {
      ...product,
      active: false
    };
    productRepository.toggleActive.and.returnValue(
      of(updatedProduct)
    );
    service.toggleActive(id).subscribe((result) => {
      expect(result).toEqual(updatedProduct);
    })
    expect(productRepository.toggleActive).toHaveBeenCalledWith(id);
  })

  it('deve excluir um produto pelo repository', () => {
    const id = '1'
    productRepository.remove.and.returnValue(of(undefined))
    service.remove(id).subscribe((result) => {
      expect(result).toBeUndefined();
    });
    expect(productRepository.remove).toHaveBeenCalledWith(
      id
    )
  })

  it('deve propagar o erro do repository', () => {
    const error = {
      status: 409,
      error: 'PRODUCT_SKU_ALREADY_EXISTS',
      message: 'Já existe um produto com este SKU.'
    };
    productRepository.create.and.returnValue(throwError(() => error));
    service.create({
      name: 'Notebook',
      sku: 'NOTE-001',
      category: 'Eletrônicos',
      quantity: 10,
      minimumStock: 2,
      unitPrice: 3500,
      active: true
    }).subscribe({
      next: () => fail('Era esperado um erro'),
      error: (receivedError) => {
        expect(receivedError).toBe(error);
      }
    })
    expect(productRepository.create).toHaveBeenCalled();
  })
})
