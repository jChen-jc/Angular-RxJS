import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject, Subscription, throwError } from 'rxjs';
import { catchError, tap, map, startWith } from 'rxjs/operators';
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
  sub: Subscription;

  private selectedCatSubject = new BehaviorSubject<number>(0);
  selectedCatAction$ = this.selectedCatSubject.asObservable();

  products$ = combineLatest([
    this.productService.productWithCat$,
    // this.selectedCatAction$.pipe(startWith(0))
    this.selectedCatAction$
  ]).pipe(
    map(([products, selectedCatId]) =>
      products.filter(product => {
      return selectedCatId ? selectedCatId === product.categoryId : true;
    })),
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  )

  categories$ = this.productCatService.productCategories$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  )

  constructor(private productService: ProductService, private productCatService: ProductCategoryService) { }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.selectedCatSubject.next(+categoryId);
  }
}
