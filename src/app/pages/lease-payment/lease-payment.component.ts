import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LeasePayment } from 'src/app/common/common.types';
import { LeasePaymentService } from 'src/app/services/lease-payment.service';
import { StoreService } from 'src/app/services/store.service';
const today: Date = new Date();
@Component({
  selector: 'app-lease-payment',
  templateUrl: './lease-payment.component.html',
  styleUrls: ['./lease-payment.component.css'],
})
export class LeasePaymentComponent implements OnInit, OnDestroy {
  leaseAgreementId: number = 0;
  paymentIdParam: string | null = '';
  isNewPayment: boolean = false;
  isEditable: boolean = false;
  leasePayment: LeasePayment = {} as LeasePayment;
  storeName: string = '';

  // Initialize the paymentForm form group
  paymentForm = new FormGroup({
    paymentDate: new FormControl<NgbDateStruct>(
      this.formatter.parse(today.toISOString()) as NgbDateStruct,
      Validators.required
    ),
    amount: new FormControl<number|null>(null, [Validators.required, Validators.min(1)]),
  });

  constructor(
    private route: ActivatedRoute,
    private leasePaymentService: LeasePaymentService,
    private router: Router,
    public formatter: NgbDateParserFormatter,
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

  // Get the lease payment data
  private refreshPageData() {
    this.route.paramMap
      .subscribe({
        next: (params) => {
          this.leaseAgreementId = Number(params.get('leaseAgreementId'));
          this.paymentIdParam = params.get('id');
          this.isNewPayment = this.paymentIdParam === 'new';
          if (!this.isNewPayment) {
            this.leasePaymentService
              .getLeasePaymentByIdAsync(Number(this.paymentIdParam))
              .subscribe({
                next: (data) => {
                  this.leasePayment = data;
                  const paymentDate = this.formatter.parse(data.paymentDate);
                  this.paymentForm.setValue({
                    paymentDate: paymentDate,
                    amount: data.amount,
                  });
                },
                error: (error) => {
                  this.toastr.error(error.error.Message);
                }
              });
            this.isEditable = false;
            this.paymentForm.disable();
          } else {
            this.leasePaymentService
              .getLeasePaymentByIdAsync(0)
              .subscribe({
                next: (data) => {
                  this.leasePayment = data;
                  const paymentDate = this.formatter.parse(data.paymentDate);
                  this.paymentForm.setValue({
                    paymentDate: paymentDate,
                    amount: null,
                  });
                },
                error: (error) => {
                  this.toastr.error(error.error.Message);
                }
              });
            this.isEditable = true;
            this.paymentForm.enable();
          }
        },
        error: (error) => {
          this.toastr.error(error.error.Message);
        }
      });
  }

  // Enable the form for editing
  editForm() {
    this.isEditable = true;
    this.paymentForm.enable();
  }

  // Delete the payment
  deletePayment() {
    if (this.leasePayment.leasePaymentId === 0) {
      return;
    }
    if (confirm(`Are you sure you want to delete this payment?`)) {
      this.leasePaymentService
        .deleteLeasePayment(this.leasePayment.leasePaymentId)
        .subscribe({
          next: (data) => {
            this.router.navigate([`/lease-payments/${this.leaseAgreementId}`]);
          },
          error: (error) => {
            this.toastr.error(error.error.Message);
          },
        });
    }
  }

  // Save the payment
  submitForm() {
    this.paymentForm.markAllAsTouched();
    if (this.paymentForm.invalid) {
      return;
    }
    const leasePayment: LeasePayment = {
      leasePaymentId: this.leasePayment.leasePaymentId,
      leaseAgreementId: this.leaseAgreementId,
      paymentDate: this.formatter.format(this.paymentForm.value.paymentDate as NgbDateStruct),
      amount: this.paymentForm.value.amount ?? 0,
    };
    this.saveLeasePayment(leasePayment);
  }

  // Save the payment
  saveLeasePayment(leasePayment: LeasePayment) {
    if (leasePayment.leasePaymentId === 0) {
      this.leasePaymentService
        .createLeasePayment(leasePayment)
        .subscribe({
          next: (data) => {
            this.leasePayment = data;
            const paymentDate = this.formatter.parse(data.paymentDate);
            this.paymentForm.setValue({
              paymentDate: paymentDate,
              amount: data.amount,
            });
            this.isEditable = false;
            this.paymentForm.disable();
          },
          error: (error) => {
            this.toastr.error(error.error.Message);
          }
        });
    } else {
      this.leasePaymentService
        .updateLeasePayment(leasePayment)
        .subscribe({
          next: (data) => {
            this.leasePayment = data;
            const paymentDate = this.formatter.parse(data.paymentDate);
            this.paymentForm.setValue({
              paymentDate: paymentDate,
              amount: data.amount,
            });
            this.isEditable = false;
            this.paymentForm.disable();
          },
          error: (error) => {
            this.toastr.error(error.error.Message);
          }
        });
    }
  }
}
