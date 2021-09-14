import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, combineLatest, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Product } from './product';
import { Supplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = this.supplierService.suppliersUrl;

  product$ = this.http.get<Product[]>(this.productsUrl)
  .pipe(
    // map(products => products.map(item => ({
    //   ...item,
    //   price: item.price * 1.5,
    //   searchKey: [item.productName],
    // }) as Product) // force the type
    // ),
    tap(data => console.log('Products: ', JSON.stringify(data))),
    catchError(this.handleError)
  );

  productWithCat$ = combineLatest([
    this.product$,
    this.catService.productCategories$
  ]).pipe(
    map(([products, cats]) => products.map(product => ({
      ...product,
      price: product.price * 1.5,
      category: cats.find(cat => product.categoryId === cat.id)?.name,
      searchKey: [product.productName]
    }) as Product ))
  )

  private selectedProductSubject = new BehaviorSubject<number>(0);
  selectProductAction$ = this.selectedProductSubject.asObservable();

  selectedProduct$ = combineLatest([
    this.productWithCat$,
    this.selectProductAction$
  ])
    .pipe(
      map(([products, selectedId]) => products.find(product => product.id === selectedId)),
      tap(product => console.log("selected", product))
    );

  constructor(private http: HttpClient,
              private supplierService: SupplierService,
              private catService: ProductCategoryService) { }

  selectProduct(selectedId: number):void {
    this.selectedProductSubject.next(selectedId);
  }

  // getProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>(this.productsUrl)
  //     .pipe(
  //       tap(data => console.log('Products: ', JSON.stringify(data))),
  //       catchError(this.handleError)
  //     );
  // }

  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      // category: 'Toolbox',
      quantityInStock: 30
    };
  }

  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
