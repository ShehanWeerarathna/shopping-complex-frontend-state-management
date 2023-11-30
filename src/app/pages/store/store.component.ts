import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category, Store } from 'src/app/common/common.types';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StoreService } from 'src/app/services/store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, map } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
})
export class StoreComponent implements OnInit, OnDestroy {
  storeIdParam: string | null = '';
  store: Store = {} as Store;
  isEditable: boolean = false;
  categories: Category[] = [];

  storeForm = new FormGroup({
    storeName: new FormControl('', Validators.required),
    categoryId: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    leaseAgreementId: new FormControl<number | null>(null),
  });

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.refreshPageData();
  }

  private storeListSubscription: Subscription = new Subscription();
  private categoryListSubscription: Subscription = new Subscription();
  // Get initial page data
  private refreshPageData() {
    this.getCategories();
    this.route.paramMap.subscribe({
      next: (params) => {
        this.storeIdParam = params.get('id');
        if (this.storeIdParam !== 'new') {
          this.storeListSubscription = this.storeService.storeList$
            .pipe(
              map((stores) =>
                stores.find((s) => s.storeId === Number(this.storeIdParam))
              )
            )
            .subscribe({
              next: (data) => {
                const store = data;
                if (store) {
                  this.store = store;
                  this.storeForm.setValue({
                    storeName: store.storeName,
                    categoryId: store.categoryId,
                    leaseAgreementId: store.leaseAgreementId ?? null,
                  });
                  this.storeForm.disable();
                  this.isEditable = false;
                } else {
                  this.storeService
                    .getStoreByIdAsync(Number(this.storeIdParam))
                    .subscribe({
                      next: (data) => {
                        this.store = data;
                        this.storeForm.setValue({
                          storeName: data.storeName,
                          categoryId: data.categoryId,
                          leaseAgreementId: data.leaseAgreementId ?? null,
                        });

                        this.storeForm.disable();
                        this.isEditable = false;
                      },
                      error: (error) => {
                        this.toastr.error(error.error.Message);
                      },
                    });
                }
              },
            });
        } else {
          this.storeService.getStoreByIdAsync(0).subscribe({
            next: (data) => {
              this.store = data;
              this.storeForm.setValue({
                storeName: data.storeName,
                categoryId: data.categoryId,
                leaseAgreementId: data.leaseAgreementId ?? null,
              });

              this.storeForm.enable();
              this.isEditable = true;
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

  // Get the list of categories
  getCategories() {
    this.categoryListSubscription = this.storeService.categoryList$.subscribe({
      next: (data) => {
        this.categories = data;
        if (this.categories.length === 0) {
          this.storeService.getCategoryListAsync().subscribe({
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

  // Enable editing of the form
  editForm() {
    this.storeForm.enable();
    this.isEditable = true;
  }

  // Submit the form
  submitForm() {
    this.storeForm.markAllAsTouched();
    if (this.storeForm.invalid) {
      return;
    }
    const store: Store = {
      storeId: this.store.storeId,
      storeName: this.storeForm.value.storeName ?? '',
      categoryId: this.storeForm.value.categoryId ?? 0,
      leaseAgreementId: null,
    };
    this.saveStore(store);
  }

  // Save the store
  saveStore(store: Store) {
    if (this.store.storeId > 0) {
      this.storeService.updateStore(store).subscribe({
        next: (data) => {
          this.store = data;
          this.storeForm.setValue({
            storeName: data.storeName,
            categoryId: data.categoryId,
            leaseAgreementId: data.leaseAgreementId ?? null,
          });
          this.storeForm.disable();
          this.isEditable = false;
        },
        error: (error) => {
          this.toastr.error(error.error.Message);
        },
      });
    } else {
      this.storeService.createStore(store).subscribe({
        next: (data) => {
          this.storeService.addNewStore(data);
          this.router.navigateByUrl(`/stores/${data.storeId}`);
        },
        error: (error) => {
          this.toastr.error(error.error.Message);
        },
      });
    }
  }

  // Delete the store
  deletePayment() {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.title = 'Confirm';
    modalRef.componentInstance.message =
      'Are you sure you want to delete this store?';
    modalRef.componentInstance.confirmed.subscribe(() => {
      this.storeService.deleteStore(this.store.storeId).subscribe({
        next: (data) => {
          this.router.navigateByUrl('/stores');
        },
        error: (error) => {
          this.toastr.error(error.error.Message);
        },
      });
    });

    modalRef.close();
  }

  ngOnDestroy(): void {
    this.storeListSubscription.unsubscribe();
    this.categoryListSubscription.unsubscribe();
  }
}
