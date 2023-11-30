import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreListComponent } from './pages/store-list/store-list.component';
import { StoreComponent } from './pages/store/store.component';
import { LeaseAgreementComponent } from './pages/lease-agreement/lease-agreement.component';
import { LeaseAgreementsComponent } from './pages/lease-agreements/lease-agreements.component';
import { LeasePaymentsComponent } from './pages/lease-payments/lease-payments.component';
import { LeasePaymentComponent } from './pages/lease-payment/lease-payment.component';
import { FinancialReportComponent } from './pages/financial-report/financial-report.component';
import { MaintenanceContractComponent } from './pages/maintenance-contract/maintenance-contract.component';
import { MaintenanceContractsComponent } from './pages/maintenance-contracts/maintenance-contracts.component';
import { MaintenancePaymentsComponent } from './pages/maintenance-payments/maintenance-payments.component';
import { MaintenancePaymentComponent } from './pages/maintenance-payment/maintenance-payment.component';

const routes: Routes = [
  { path: 'stores', component: StoreListComponent },
  { path: 'stores/:id', component: StoreComponent },
  { path: 'lease-agreement/:storeId', component: LeaseAgreementComponent },
  { path: 'maintenance-contract/:storeId', component: MaintenanceContractComponent},
  {
    path: 'lease-payments/:leaseAgreementId',
    component: LeasePaymentsComponent,
  },
  {
    path: 'maintenance-payments/:maintenanceContractId',
    component: MaintenancePaymentsComponent,
  },
  { path: 'lease-payment/:leaseAgreementId/:id', component: LeasePaymentComponent },
  { path: 'maintenance-payment/:maintenanceContractId/:id', component: MaintenancePaymentComponent },
  { path: 'lease-agreements', component: LeaseAgreementsComponent },
  { path: 'maintenance-contracts', component: MaintenanceContractsComponent},
  { path: 'financial-report', component: FinancialReportComponent },
  { path: '', redirectTo: '/stores', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
