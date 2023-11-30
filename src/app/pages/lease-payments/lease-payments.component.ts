import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LeasePayment, PagedData } from 'src/app/common/common.types';
import { LeasePaymentService } from 'src/app/services/lease-payment.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-lease-payments',
  templateUrl: './lease-payments.component.html',
  styleUrls: ['./lease-payments.component.css'],
})
export class LeasePaymentsComponent implements OnInit, OnDestroy {
  pagedList: PagedData<LeasePayment> = {} as PagedData<LeasePayment>;
  currentPage: number = 1;
  pageSize: number = 10;
  leaseAgreementId: number = 0;
  storeName: string = '';

  constructor(
    private route: ActivatedRoute,
    private leasePaymentService: LeasePaymentService,
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

  // Get lease payments data
  private refreshPageData() {
    this.route.paramMap
      .subscribe({
        next: (params) => {
          this.leaseAgreementId = Number(params.get('leaseAgreementId'));
          this.refreshLeasePayments(this.leaseAgreementId);
        },
        error: (error) => {
          this.toastr.error(error.error.Message);
        },
      });
  }

  // Get the lease payments for the selected lease agreement
  refreshLeasePayments(leaseAgreementId: number) {
    this.leasePaymentService
      .getLeasePaymentsAsync(this.currentPage, this.pageSize, leaseAgreementId)
      .subscribe({
        next: (leasePayments) => {
          this.pagedList = leasePayments;
          this.currentPage = leasePayments.currentPage;
          this.pageSize = leasePayments.pageSize;
        },
        error: (error) => {
          this.toastr.error(error.error.Message);
        },
      });
  }
}
