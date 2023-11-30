import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedData, MaintenancePayment } from '../common/common.types';

@Injectable({
  providedIn: 'root'
})
export class MaintenancePaymentService {

  private apiUrl = 'https://localhost:7038/api';
  constructor(private http: HttpClient) {}

  // Get maintenance payments
  getMaintenancePaymentsAsync(
    currentPage?: number,
    pageSize?: number,
    maintenanceContractId?: number
  ): Observable<PagedData<MaintenancePayment>> {
    return this.http.get<PagedData<MaintenancePayment>>(
      `${this.apiUrl}/MaintenancePayment/GetMaintenancePayments?currentPage=${
        currentPage ?? 1
      }&pageSize=${pageSize ?? 10}&maintenanceContractId=${maintenanceContractId ?? 0}`
    );
  }

  // Create maintenance payment
  createMaintenancePayment(maintenancePayment: MaintenancePayment): Observable<MaintenancePayment> {
    return this.http.post<MaintenancePayment>(
      `${this.apiUrl}/MaintenancePayment/CreateMaintenancePayment`,
      maintenancePayment
    );
  }

  // Update maintenance payment
  updateMaintenancePayment(maintenancePayment: MaintenancePayment): Observable<MaintenancePayment> {
    return this.http.put<MaintenancePayment>(
      `${this.apiUrl}/MaintenancePayment/UpdateMaintenancePayment/${maintenancePayment.maintenancePaymentId}`,
      maintenancePayment
    );
  }

  // Delete maintenance payment
  deleteMaintenancePayment(maintenancePaymentId: number): Observable<MaintenancePayment> {
    return this.http.delete<MaintenancePayment>(
      `${this.apiUrl}/MaintenancePayment/DeleteMaintenancePayment/${maintenancePaymentId}`
    );
  }

  // Get maintenance payment by id
  getMaintenancePaymentByIdAsync(maintenancePaymentId: number): Observable<MaintenancePayment> {
    return this.http.get<MaintenancePayment>(
      `${this.apiUrl}/MaintenancePayment/GetMaintenancePaymentById/${maintenancePaymentId}`
    );
  }
}
