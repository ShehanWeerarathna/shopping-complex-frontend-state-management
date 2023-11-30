import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedData, LeasePayment } from '../common/common.types';

@Injectable({
  providedIn: 'root',
})
export class LeasePaymentService {
  private apiUrl = 'https://localhost:7038/api';
  constructor(private http: HttpClient) {}

  // Get lease payments
  getLeasePaymentsAsync(
    currentPage?: number,
    pageSize?: number,
    leaseAgreementId?: number
  ): Observable<PagedData<LeasePayment>> {
    return this.http.get<PagedData<LeasePayment>>(
      `${this.apiUrl}/LeasePayment/GetLeasePayments?currentPage=${
        currentPage ?? 1
      }&pageSize=${pageSize ?? 10}&leaseAgreementId=${leaseAgreementId ?? 0}`
    );
  }

  // Create lease payment
  createLeasePayment(leasePayment: LeasePayment): Observable<LeasePayment> {
    return this.http.post<LeasePayment>(
      `${this.apiUrl}/LeasePayment/CreateLeasePayment`,
      leasePayment
    );
  }

  // Update lease payment
  updateLeasePayment(leasePayment: LeasePayment): Observable<LeasePayment> {
    return this.http.put<LeasePayment>(
      `${this.apiUrl}/LeasePayment/UpdateLeasePayment/${leasePayment.leasePaymentId}`,
      leasePayment
    );
  }

  // Delete lease payment
  deleteLeasePayment(leasePaymentId: number): Observable<LeasePayment> {
    return this.http.delete<LeasePayment>(
      `${this.apiUrl}/LeasePayment/DeleteLeasePayment/${leasePaymentId}`
    );
  }

  // Get lease payment by id
  getLeasePaymentByIdAsync(leasePaymentId: number): Observable<LeasePayment> {
    return this.http.get<LeasePayment>(
      `${this.apiUrl}/LeasePayment/GetLeasePaymentById/${leasePaymentId}`
    );
  }
}
