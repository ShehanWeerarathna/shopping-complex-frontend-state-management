import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LeaseAgreement } from 'src/app/common/common.types';
import { LeaseAgreementService } from 'src/app/services/lease-agreement.service';
import { StoreService } from 'src/app/services/store.service';

const today: Date = new Date();

@Component({
  selector: 'app-lease-agreement',
  templateUrl: './lease-agreement.component.html',
  styleUrls: ['./lease-agreement.component.css'],
})
export class LeaseAgreementComponent implements OnInit, OnDestroy {
  storeIdParam: string | null = '';
  leaseAgreement: LeaseAgreement = {} as LeaseAgreement;
  isEditable: boolean = false;
  storeName: string = '';

  // Initialize the leaseAgreementForm form group
  leaseAgreementForm = new FormGroup({
    leaseStartDate: new FormControl<NgbDateStruct>(
      this.formatter.parse(today.toISOString()) as NgbDateStruct,
      Validators.required
    ),
    leaseEndDate: new FormControl<NgbDateStruct>(
      {} as NgbDateStruct,
      Validators.required
    ),
    leaseAmount: new FormControl<number|null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    description: new FormControl<string|null>('',[Validators.maxLength(500)]),
  });

  constructor(
    private route: ActivatedRoute,
    private leaseAgreementService: LeaseAgreementService,
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
      next: (data) => {
        this.storeName = data;
      },
    });
  }

  ngOnDestroy(): void {
    this.storeNameSubscription.unsubscribe();
  }

  private refreshPageData() {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.storeIdParam = params.get('storeId');
        this.leaseAgreementService
          .getLeaseAgreementByStoreIdAsync(Number(this.storeIdParam))
          .subscribe({
            next: (data) => {
              this.leaseAgreement = data;
              const startDate = this.formatter.parse(data.leaseStartDate);
              const endDate = this.formatter.parse(data.leaseEndDate);
              if (data.leaseAgreementId === 0) {
                this.isEditable = true;
                this.leaseAgreementForm.enable();
                this.leaseAgreementForm.setValue({
                  leaseStartDate: startDate,
                  leaseEndDate: {} as NgbDateStruct,
                  leaseAmount: null,
                  description: data.description ?? null,
                });
              } else {
                this.isEditable = false;
                this.leaseAgreementForm.disable();
                this.leaseAgreementForm.setValue({
                  leaseStartDate: startDate,
                  leaseEndDate: endDate,
                  leaseAmount: data.leaseAmount,
                  description: data.description ?? null,
                });
              }
            },
            error: (error) => {
              this.toastr.error(error.error.Message);
            },
          });
      },
      error: (error) => {
        this.toastr.error(error.error.Message);
      },
    });
  }

  // Submit the form
  submitForm() {
    this.leaseAgreementForm.markAllAsTouched();
    if (this.leaseAgreementForm.invalid) {
      return;
    }
    const leaseAgreement: LeaseAgreement = {
      leaseAgreementId: this.leaseAgreement.leaseAgreementId,
      storeId: Number(this.storeIdParam),
      leaseStartDate: this.formatter.format(
        this.leaseAgreementForm.value.leaseStartDate as NgbDateStruct
      ),
      leaseEndDate: this.formatter.format(
        this.leaseAgreementForm.value.leaseEndDate as NgbDateStruct
      ),

      leaseAmount: this.leaseAgreementForm.value.leaseAmount ?? 0,
      description: this.leaseAgreementForm.value.description ?? null,
    };

    this.saveLeaseAgreement(leaseAgreement);
  }

  // Edit the form
  editForm() {
    this.isEditable = true;
    this.leaseAgreementForm.enable();
  }

  // Delete the agreement
  deleteAgreement() {
    if (this.leaseAgreement.leaseAgreementId === 0) {
      return;
    }
    if (confirm(`Are you sure you want to delete this lease agreement?`)) {
      this.leaseAgreementService
        .deleteLeaseAgreement(this.leaseAgreement.leaseAgreementId)
        .subscribe({
          next: (data) => {
            this.router.navigate([`/stores`]);
          },
          error: (error) => {
            console.log(error);
            this.toastr.error(error.error.Message);
          },
        });
    }
  }

  // Save the agreement
  saveLeaseAgreement(leaseAgreement: LeaseAgreement) {
    if (
      this.leaseAgreement.leaseAgreementId &&
      this.leaseAgreement.leaseAgreementId > 0
    ) {
      this.leaseAgreementService
        .updateLeaseAgreement(leaseAgreement)
        .subscribe({
          next: (data) => {
            this.leaseAgreement = data;
            const startDate = this.formatter.parse(data.leaseStartDate);
            const endDate = this.formatter.parse(data.leaseEndDate);
            this.leaseAgreementForm.setValue({
              leaseStartDate: startDate,
              leaseEndDate: endDate,
              leaseAmount: data.leaseAmount,
              description: data.description ?? null,
            });
            this.leaseAgreementForm.disable();
            this.isEditable = false;
          },
          error: (error) => {
            this.toastr.error(error.error.Message);
          },
        });
    } else {
      this.leaseAgreementService
        .createLeaseAgreement(leaseAgreement)
        .subscribe({
          next: (data) => {
            this.leaseAgreement = data;
            const startDate = this.formatter.parse(data.leaseStartDate);
            const endDate = this.formatter.parse(data.leaseEndDate);
            this.leaseAgreementForm.setValue({
              leaseStartDate: startDate,
              leaseEndDate: endDate,
              leaseAmount: data.leaseAmount,
              description: data.description ?? null,
            });
            this.leaseAgreementForm.disable();
            this.isEditable = false;
          },
          error: (error) => {
            this.toastr.error(error.error.Message);
          },
        });
    }
  }
}
