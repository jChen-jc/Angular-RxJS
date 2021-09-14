import { ChangeDetectionStrategy, Component } from '@angular/core';

import { combineLatest, EMPTY, Observable, Subject, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  private errSubject = new Subject<string>();
  errorMessage$ = this.errSubject.asObservable();

  products$ = this.productService.productWithCat$.pipe(
    catchError(err => {
      this.errSubject.next(err);
      return EMPTY;
    })
  );
  sub: Subscription;

  selectedProduct$ = this.productService.selectedProduct$;

  constructor(private productService: ProductService) { }

  onSelected(productId: number): void {
    this.productService.selectProduct(productId);
  }
}
