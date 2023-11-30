import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreComponent } from './pages/store/store.component';
import { StoreListComponent } from './pages/store-list/store-list.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { LeaseAgreementComponent } from './pages/lease-agreement/lease-agreement.component';
import { LeaseAgreementsComponent } from './pages/lease-agreements/lease-agreements.component';
import { LeasePaymentsComponent } from './pages/lease-payments/lease-payments.component';
import { LeasePaymentComponent } from './pages/lease-payment/lease-payment.component';
import { FinancialReportComponent } from './pages/financial-report/financial-report.component';
import { MaintenanceContractComponent } from './pages/maintenance-contract/maintenance-contract.component';
import { MaintenanceContractsComponent } from './pages/maintenance-contracts/maintenance-contracts.component';
import { MaintenancePaymentComponent } from './pages/maintenance-payment/maintenance-payment.component';
import { MaintenancePaymentsComponent } from './pages/maintenance-payments/maintenance-payments.component';

import { ToastrModule } from 'ngx-toastr';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    StoreComponent,
    StoreListComponent,
    LeaseAgreementComponent,
    LeaseAgreementsComponent,
    LeasePaymentsComponent,
    LeasePaymentComponent,
    FinancialReportComponent,
    MaintenanceContractComponent,
    MaintenanceContractsComponent,
    MaintenancePaymentComponent,
    MaintenancePaymentsComponent,
    ConfirmDialogComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    BrowserAnimationsModule,
    ButtonModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
