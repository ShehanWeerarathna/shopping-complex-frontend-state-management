import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { PagedData, MaintenancePayment } from 'src/app/common/common.types';
import { MaintenancePaymentService } from 'src/app/services/maintenance-payment.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-maintenance-payments',
  templateUrl: './maintenance-payments.component.html',
  styleUrls: ['./maintenance-payments.component.css'],
})
export class MaintenancePaymentsComponent implements OnInit, OnDestroy {
  pagedList: PagedData<MaintenancePayment> =
    {} as PagedData<MaintenancePayment>;
  currentPage: number = 1;
  pageSize: number = 10;
  maintenanceContractId: number = 0;
  storeName: string = '';

  constructor(
    private route: ActivatedRoute,
    private maintenancePaymentService: MaintenancePaymentService,
    private toastr: ToastrService,
    private storeService: StoreService
  ) {
    // this.storeName = storeNameSignal();
  }

  private storeNameSubscription = new Subscription();

  ngOnInit(): void {
    this.refreshPageData();
    this.storeNameSubscription = this.storeService.storeName$.subscribe({
      next: (storeName) => {
        this.storeName = storeName;
      },
      error: (error) => {
        this.toastr.error(error.error.Message);
      },
    });
  }

  ngOnDestroy(): void {
    this.storeNameSubscription.unsubscribe();
  }

  // Get the initial page data
  private refreshPageData() {
    this.route.paramMap
      .subscribe({
        next: (params) => {
          this.maintenanceContractId = Number(params.get('maintenanceContractId'));
          this.refreshMaintenancePayments(this.maintenanceContractId);
        },
        error: (error) => {
          this.toastr.error(error.error.Message);
        },
      });
  }

  // Get the maintenance payments.
  refreshMaintenancePayments(maintenanceContractId: number) {
    this.maintenancePaymentService
      .getMaintenancePaymentsAsync(
        this.currentPage,
        this.pageSize,
        maintenanceContractId
      )
      .subscribe({
        next: (maintenancePayments) => {
          this.pagedList = maintenancePayments;
          this.currentPage = maintenancePayments.currentPage;
          this.pageSize = maintenancePayments.pageSize;
        },
        error: (error) => {
          this.toastr.error(error.error.Message);
        },
      })
  }
}
