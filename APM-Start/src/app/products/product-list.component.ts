import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { EMPTY, Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  categories;
  selectedCatId = 1;

  // products: Product[] = [];
  products$: Observable<Product[]> = this.productService.productWithCat$;
  sub: Subscription;

  productFilter$ = this.productService.productWithCat$
  .pipe(
    map(products =>
      products.filter(product => {
      return this.selectedCatId ? this.selectedCatId === product.categoryId : true;
    }))
  )

  categories$ = this.productCatService.productCategories$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  )

  constructor(private productService: ProductService, private productCatService: ProductCategoryService) { }

  // ngOnInit(): void {
  //   this.products$ = this.productService.getProducts().pipe(
  //     catchError(err => {
  //       console.log("error", err);
  //       this.errorMessage = err;
  //       return EMPTY;
  //       // return throwError(err);
  //       //return of(null)
  //     })
  //   );
  //   // this.sub = this.productService.getProducts()
  //   //   .subscribe(
  //   //     products => this.products = products,
  //   //     error => this.errorMessage = error
  //   //   );
  // }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    console.log('Not yet implemented');
    this.selectedCatId = +categoryId;
  }
}
