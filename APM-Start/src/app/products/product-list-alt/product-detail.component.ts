import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ProductService } from '../product.service';
import { Product } from '../product';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  errorMessage = '';
  product$ = this.productService.selectedProduct$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  )

  productSuppliers$ = this.productService.selectedProductWithSuppliers$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  )

  pageTitle$ = this.product$
    .pipe(map((p:Product) => p ? `Product Detail - ${p.productName}` : null));

  // combine stream
  vm$ = combineLatest([
    this.product$,
    this.productSuppliers$,
    this.pageTitle$
  ]).pipe(
    map(([product, productSuppliers, pageTitle]) => ({ product, productSuppliers, pageTitle }))
  )

  constructor(private productService: ProductService) { }

}
