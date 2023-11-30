import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category, PagedData, Store } from '../../common/common.types';
import { StoreService } from '../../services/store.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css'],
})
export class StoreListComponent implements OnInit, OnDestroy {
  pagedList: PagedData<Store> = {} as PagedData<Store>;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  categoryId: number = 0;
  categories: Category[] = [];
  private categoryListSubscription: Subscription = new Subscription();

  constructor(private storeService: StoreService, private toastr: ToastrService
    ) {}
  ngOnDestroy(): void {
    this.categoryListSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.refreshStoreList();
    this.getCategories();
  }

  // Get categories
  getCategories() {
    
    this.categoryListSubscription = this.storeService.categoryList$
    .subscribe({
      next: (data) => {
        this.categories = data;
        if(this.categories.length === 0){
          this.storeService.getCategoryListAsync()
          .subscribe({
            next: (data) => {
              this.categories = data;
              this.storeService.updateCategoryList(data);
            },
            error: (error) => {
              this.toastr.error(error.error.Message);
            },
          });
        }
      },
      error: (error) => {
        this.toastr.error(error.error.Message);
      },
    });
  }

  // Refresh the store list when the user clicks the Search button.
  refreshStoreList() {
    this.storeService
      .getStoreListAsync(
        this.searchTerm,
        this.currentPage,
        this.pageSize,
        this.categoryId
      )
      .subscribe({
        next: (data) => {
          this.pagedList = data;
          this.currentPage = data.currentPage;
          this.pageSize = data.pageSize;
          this.storeService.updateStoreList(data.pagedData);
        },
        error: (error) => {
          this.toastr.error(error.error.Message);
        },
      });
  }

  // set selected store name to signal
  setSelectedStoreName(storeName: string) {
    this.storeService.updateStoreName(storeName);
  }
}
