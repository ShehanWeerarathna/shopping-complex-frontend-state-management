import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MaintenanceContract } from 'src/app/common/common.types';
import { MaintenanceContractService } from 'src/app/services/maintenance-contract.service';
import { StoreService } from 'src/app/services/store.service';

const today: Date = new Date();

@Component({
  selector: 'app-maintenance-contract',
  templateUrl: './maintenance-contract.component.html',
  styleUrls: ['./maintenance-contract.component.css'],
})
export class MaintenanceContractComponent implements OnInit, OnDestroy {
  storeIdParam: string | null = '';
  maintenanceContract: MaintenanceContract = {} as MaintenanceContract;
  isEditable: boolean = false;
  storeName: string = '';

  maintenanceContractForm = new FormGroup({
    // Initialize the contractStartDate form control
    contractStartDate: new FormControl<NgbDateStruct>(
      this.formatter.parse(today.toISOString()) as NgbDateStruct,
      Validators.required
    ),
    contractEndDate: new FormControl<NgbDateStruct>(
      {} as NgbDateStruct,
      Validators.required
    ),
    contractAmount: new FormControl<number|null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    description: new FormControl<string|null>('',[Validators.maxLength(500)]),
  });

  constructor(
    private route: ActivatedRoute,
    private maintenanceContractService: MaintenanceContractService,
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

  // Get initial page data
  private refreshPageData() {
    this.route.paramMap
      .subscribe({
        next: (params) => {
          this.storeIdParam = params.get('storeId');
          this.maintenanceContractService
            .getMaintenanceContractByStoreIdAsync(Number(this.storeIdParam))

            .subscribe({
              next: (data) => {
                this.maintenanceContract = data;
                const startDate = this.formatter.parse(
                  data.contractStartDate
                );
                const endDate = this.formatter.parse(data.contractEndDate);
                if (data.maintenanceContractId === 0) {
                  this.isEditable = true;
                  this.maintenanceContractForm.enable();
                  this.maintenanceContractForm.setValue({
                    contractStartDate: startDate,
                    contractEndDate: {} as NgbDateStruct,
                    contractAmount: null,
                    description: data.description ?? null,
                  });
                } else {
                  this.isEditable = false;
                  this.maintenanceContractForm.disable();
                  this.maintenanceContractForm.setValue({
                    contractStartDate: startDate,
                    contractEndDate: endDate,
                    contractAmount: data.contractAmount,
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
    this.maintenanceContractForm.markAllAsTouched();
    if (this.maintenanceContractForm.invalid) {
      return;
    }
    const maintenanceContract: MaintenanceContract = {
      maintenanceContractId: this.maintenanceContract.maintenanceContractId,
      storeId: Number(this.storeIdParam),
      contractStartDate: this.formatter.format(
        this.maintenanceContractForm.value.contractStartDate as NgbDateStruct
      ),
      contractEndDate: this.formatter.format(
        this.maintenanceContractForm.value.contractEndDate as NgbDateStruct
      ),
      contractAmount: this.maintenanceContractForm.value.contractAmount ?? 0,
      description: this.maintenanceContractForm.value.description ?? null,
    };

    this.saveMaintenanceContract(maintenanceContract);
  }

  // Edit the form
  editForm() {
    this.isEditable = true;
    this.maintenanceContractForm.enable();
  }

  // Delete the contract
  deleteContract() {
    if (this.maintenanceContract.maintenanceContractId === 0) {
      return;
    }
    if (confirm(`Are you sure you want to delete this maintenance contract?`)) {
      this.maintenanceContractService
        .deleteMaintenanceContract(
          this.maintenanceContract.maintenanceContractId
        )
        .subscribe({
          next: (data) => {
            this.router.navigate([`/stores`]);
          },
          error: (error) => {
            this.toastr.error(error.error.Message);
          },
        });
    }
  }

  // Save the contract
  saveMaintenanceContract(maintenanceContract: MaintenanceContract) {
    if (
      this.maintenanceContract.maintenanceContractId &&
      this.maintenanceContract.maintenanceContractId > 0
    ) {
      this.maintenanceContractService
        .updateMaintenanceContract(maintenanceContract)
        .subscribe({
          next: (data) => {
            this.maintenanceContract = data;
            const startDate = this.formatter.parse(data.contractStartDate);
            const endDate = this.formatter.parse(data.contractEndDate);
            this.maintenanceContractForm.setValue({
              contractStartDate: startDate,
              contractEndDate: endDate,
              contractAmount: data.contractAmount,
              description: data.description ?? null,
            });
            this.maintenanceContractForm.disable();
            this.isEditable = false;
          },
          error: (error) => {
            this.toastr.error(error.error.Message);
          },
        });
    } else {
      this.maintenanceContractService
        .createMaintenanceContract(maintenanceContract)
        .subscribe({
          next: (data) => {
            this.maintenanceContract = data;
            const startDate = this.formatter.parse(data.contractStartDate);
            const endDate = this.formatter.parse(data.contractEndDate);
            this.maintenanceContractForm.setValue({
              contractStartDate: startDate,
              contractEndDate: endDate,
              contractAmount: data.contractAmount,
              description: data.description ?? null,
            });
            this.maintenanceContractForm.disable();
            this.isEditable = false;
          },
          error: (error) => {
            this.toastr.error(error.error.Message);
          },
        });
    }
  }
}
