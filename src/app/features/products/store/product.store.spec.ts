import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';

import { ProductStore } from './product.store';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { CreateProductRequest } from '../models/create-product.request';
import { UpdateProductRequest } from '../models/update-product.request';
import { ApiError } from '../../../core/errors/api-error';

describe('ProductStore', () => {
  let store: ProductStore;
  let productService: jasmine.SpyObj<ProductService>;

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

  const secondProduct: Product = {
    id: '2',
    name: 'Mouse',
    sku: 'MOUSE-001',
    category: 'Periféricos',
    quantity: 20,
    minimumStock: 5,
    unitPrice: 100,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    productService = jasmine.createSpyObj<ProductService>(
      'ProductService',
      [
        'getProducts',
        'create',
        'update',
        'toggleActive',
        'remove',
      ]
    );

    productService.getProducts.and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        ProductStore,
        {
          provide: ProductService,
          useValue: productService,
        },
      ],
    });
  });

  it('deve carregar os productos ao ser criado', () => {
    productService.getProducts.and.returnValue(
      of([product, secondProduct])
    );
    store = TestBed.inject(ProductStore);
    expect(store.products()).toEqual([product, secondProduct]);
    expect(store.totalProducts()).toBe(2);
    expect(store.hasProducts()).toBeTrue();
  })

  it('deve carregar os produtos', () => {
    productService.getProducts.and.returnValue(
      of([product, secondProduct])
    );
    store = TestBed.inject(ProductStore);
    expect(store.products()).toEqual([product, secondProduct]);
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeNull();
  })

  it('deve armazenar o erro ao falhar no carregamento', () => {
    const error: ApiError = {
      status: 500,
      error: 'INTERNAL_ERROR',
      message: 'Não foi possive carregar os produtos'
    }
    productService.getProducts.and.returnValue(
      throwError(() => error)
    );
    store = TestBed.inject(ProductStore);
    expect(store.products()).toEqual([]);
    expect(store.error()).toBe(error.message);
    expect(store.loading()).toBeFalse();
  })

  it('deve adicionar o produto criado ao Store', () => {
    store = TestBed.inject(ProductStore);
    const request: CreateProductRequest = {
      name: 'Notebook',
      sku: 'NOTE-001',
      category: 'Eletrônicos',
      quantity: 10,
      minimumStock: 2,
      unitPrice: 3500,
      active: true
    };
    productService.create.and.returnValue(of(product));
    store.create(request).subscribe();
    expect(productService.create).toHaveBeenCalledWith(request);
    expect(store.products()).toEqual([product]);
    expect(store.saving()).toBeFalse();
    expect(store.saveError()).toBeNull();
  })

  it('deve armazenar o erro ao falhar na criação', () => {
    store = TestBed.inject(ProductStore);
    const request: CreateProductRequest = {
      name: 'Notebook',
      sku: 'NOTE-001',
      category: 'Eletrônicos',
      quantity: 10,
      minimumStock: 2,
      unitPrice: 3500,
      active: true
    };
    const error: ApiError = {
      status: 409,
      error: 'PRODUCT_SKU_ALREADY_EXISTS',
      message: 'Já existe um produto com este SKU.'
    };
    productService.create.and.returnValue(
      throwError(() => error)
    )
    store.create(request).subscribe({
      error: () => { }
    })
    expect(store.products()).toEqual([])
    expect(store.saveError()).toBe(error.message);
    expect(store.saving()).toBeFalse();
  })

  it('deve atualizar o produto no Store', () => {
    store = TestBed.inject(ProductStore);
    store.products.set([product, secondProduct]);
    const request: UpdateProductRequest = {
      name: 'Notebook atualizado',
      sku: 'NOTE-001',
      category: 'Eletrônicos',
      quantity: 15,
      minimumStock: 2,
      unitPrice: 3600,
      active: true
    }
    const updatedProduct: Product = {
      ...product,
      name: 'Notebook atualizado',
      quantity: 15,
      unitPrice: 3600
    }
    productService.update.and.returnValue(of(updatedProduct));
    store.update(product.id, request).subscribe();
    expect(productService.update).toHaveBeenCalledWith(
      product.id,
      request
    );
    expect(store.products()).toEqual([
      updatedProduct,
      secondProduct
    ])
    expect(store.saving()).toBeFalse();
    expect(store.saveError()).toBeNull();
  })

  it('deve atualizar o status do produto', () => {
    store = TestBed.inject(ProductStore);
    store.products.set([product, secondProduct]);
    const updatedProduct: Product = {
      ...product,
      active: false
    };
    productService.toggleActive.and.returnValue(
      of(updatedProduct)
    );
    store.toggleActive(product.id).subscribe();
    expect(productService.toggleActive).toHaveBeenCalledWith(
      product.id
    )
    expect(store.products()).toEqual(
      [
        updatedProduct,
        secondProduct
      ]
    );
    expect(store.togglingProductId()).toBeNull();
    expect(store.toggleError()).toBeNull();
  })

  it('deve remover o produto do Store', () => {
    store = TestBed.inject(ProductStore);
    store.products.set([product, secondProduct])
    productService.remove.and.returnValue(of(void 0));
    store.remove(product.id).subscribe();
    expect(productService.remove).toHaveBeenCalledWith(
      product.id
    )
    expect(store.products()).toEqual([
      secondProduct
    ])
    expect(store.deletingProductId()).toBeNull();
    expect(store.deleteError()).toBeNull();
  })

  it('deve armazenar o erro ao falhar na atualização', () => {
    store = TestBed.inject(ProductStore);
    store.products.set([product, secondProduct]);

    const request: UpdateProductRequest = {
      name: 'Notebook atualizado',
      sku: 'NOTE-001',
      category: 'Eletrônicos',
      quantity: 15,
      minimumStock: 2,
      unitPrice: 3600,
      active: true
    };
    const error: ApiError = {
      status: 409,
      error: 'PRODUCT_SKU_ALREADY_EXISTS',
      message: 'Já existe um produto com este SKU.'
    }

    productService.update.and.returnValue(
      throwError(() => error)
    )

    store.update(product.id, request).subscribe({
      error: () => { }
    });
    expect(store.products()).toEqual([
      product,
      secondProduct
    ]);

    expect(store.saveError()).toBe(error.message);
    expect(store.saving()).toBeFalse();
  })

  it('deve alterar o status do produto', () => {
    store = TestBed.inject(ProductStore);
    store.products.set([product, secondProduct]);
    const updateProduct: Product = {
      ...product,
      active: false,
    }
    productService.toggleActive.and.returnValue(
      of(updateProduct)
    );
    store.toggleActive(product.id).subscribe();
    expect(productService.toggleActive).toHaveBeenCalledWith(
      product.id
    );
    expect(store.products()).toEqual([
      updateProduct,
      secondProduct
    ])
    expect(store.togglingProductId()).toBeNull();
    expect(store.toggleError()).toBeNull();
  })

  it('deve armazenar o erro ao falhar na alteração do status', () => {
    store = TestBed.inject(ProductStore);
    store.products.set([product, secondProduct]);
    const error: ApiError = {
      status: 500,
      error: 'INTERNAL ERROR',
      message: 'Não foi possível alterar o status do produto.'
    }
    productService.toggleActive.and.returnValue(
      throwError(() => error)
    )
    store.toggleActive(product.id).subscribe({
      error: () => { }
    })
    expect(store.products()).toEqual([
      product,
      secondProduct
    ])
    expect(store.toggleError()).toBe(error.message);
    expect(store.togglingProductId()).toBeNull();
  })

  it('deve remover o produto do Store', () => {
    store = TestBed.inject(ProductStore);
    store.products.set([product, secondProduct]);
    productService.remove.and.returnValue(of(void 0));
    store.remove(product.id).subscribe();
    expect(productService.remove).toHaveBeenCalledWith(
      product.id
    );
    expect(store.products()).toEqual([
      secondProduct
    ])
    expect(store.deletingProductId()).toBeNull();
    expect(store.deleteError()).toBeNull();
  })

  it('deve armazenar o erro ao falhar na exclusão', () => {
    store = TestBed.inject(ProductStore);
    store.products.set([product, secondProduct]);
    const error: ApiError = {
      status: 500,
      error: 'INTERNAL_ERROR',
      message: 'Não foi possível excluir o produto.'
    }
    productService.remove.and.returnValue(
      throwError(() => error)
    )
    store.remove(product.id).subscribe({
      error: () => { }
    })
    expect(store.products()).toEqual([
      product, secondProduct
    ]);
    expect(store.deleteError()).toBe(error.message);
    expect(store.deletingProductId()).toBeNull();
  })

  it('deve manter saving ativo enquanto a criação estiver em andamento', () => {
    store = TestBed.inject(ProductStore);
    const request: CreateProductRequest = {
      name: 'Notebook',
      sku: 'NOTE-001',
      category: 'Eletrônicos',
      quantity: 10,
      minimumStock: 2,
      unitPrice: 3500,
      active: true
    };
    const response$ = new Subject<Product>();
    productService.create.and.returnValue(response$);
    const subscription = store.create(request).subscribe();
    expect(store.saving()).toBeTrue();
    expect(store.saveError()).toBeNull();
    response$.next(product);
    response$.complete();
    expect(store.products()).toEqual([product]);
    expect(store.saving()).toBeFalse();
    subscription.unsubscribe();
  })

  it('deve manter saving ativo enquanto a atualização estiver em andamento', () => {
    store = TestBed.inject(ProductStore);
    store.products.set([product, secondProduct]);
    const request: UpdateProductRequest = {
      name: 'Notebook atualizado',
      sku: 'NOTE-001',
      category: 'Eletrônicos',
      quantity: 15,
      minimumStock: 2,
      unitPrice: 3600,
      active: true
    }

    const updatedProduct: Product = {
      ...product,
      name: 'Notebook atualizado',
      quantity: 15,
      unitPrice: 3600
    }

    const response$ = new Subject<Product>();

    productService.update.and.returnValue(response$);

    const subscription = store.update(product.id, request).subscribe();

    expect(store.saving()).toBeTrue();
    expect(store.saveError()).toBeNull();

    response$.next(updatedProduct);
    response$.complete();

    expect(store.saving()).toBeFalse();
    subscription.unsubscribe();
  })

  it('deve manter o produto identificado enquanto a alteração de status estiver em andamento', () => {
    store = TestBed.inject(ProductStore);
    store.products.set([product, secondProduct]);
    const updateProduct: Product = {
      ...product,
      active: false
    }
    const response$ = new Subject<Product>();

    productService.toggleActive.and.returnValue(response$);

    const subscription = store.toggleActive(product.id).subscribe();

    expect(store.togglingProductId()).toBe(product.id);
    expect(store.toggleError()).toBeNull();

    response$.next(updateProduct);
    response$.complete();

    expect(store.products()).toEqual([
      updateProduct,
      secondProduct
    ])

    expect(store.togglingProductId()).toBeNull();
    subscription.unsubscribe();
  })

  it('deve manter o produto identificado enquanto a exclusão estiver em andamento', () => {
    store = TestBed.inject(ProductStore);
    store.products.set([product, secondProduct]);
    const response$ = new Subject<void>();
    productService.remove.and.returnValue(response$);
    const subscription = store.remove(product.id).subscribe();
    expect(store.deletingProductId()).toBe(product.id);
    expect(store.deleteError()).toBeNull();
    response$.next();
    response$.complete();

    expect(store.products()).toEqual([secondProduct]);
    expect(store.deletingProductId()).toBeNull();

    subscription.unsubscribe();
  })

  it('deve retornar um produto pelo id', () => {
    store = TestBed.inject(ProductStore);
    store.products.set([product, secondProduct])
    expect(store.getById(product.id)).toEqual(product);
  })

  it('deve retornar undefined quando o produto não existir', () => {
    store = TestBed.inject(ProductStore);
    store.products.set([product, secondProduct]);
    expect(store.getById('999')).toBeUndefined();
  })

  it('deve calcular corretamente o total de produtos', () => {
    store = TestBed.inject(ProductStore);

    expect(store.totalProducts()).toBe(0);
    expect(store.hasProducts()).toBeFalse();

    store.products.set([product, secondProduct]);

    expect(store.totalProducts()).toBe(2);
    expect(store.hasProducts()).toBeTrue();
  })
});
