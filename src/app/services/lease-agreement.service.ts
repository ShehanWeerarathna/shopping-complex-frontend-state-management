import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedData, LeaseAgreement } from '../common/common.types';

@Injectable({
  providedIn: 'root'
})
export class LeaseAgreementService {

  private apiUrl = "https://localhost:7038/api";

  constructor(private http: HttpClient) { }

  // Get lease agreements
  getLeaseAgreementsAsync(currentPage?: number, pageSize?: number): Observable<PagedData<LeaseAgreement>> {
    return this.http.get<PagedData<LeaseAgreement>>(
      `${this.apiUrl}/LeaseAgreement/GetLeaseAgreements?currentPage=${currentPage ?? 1}&pageSize=${pageSize ?? 10}`
    );
  }

  // Create lease agreement
  createLeaseAgreement(leaseAgreement: LeaseAgreement): Observable<LeaseAgreement> {
    return this.http.post<LeaseAgreement>(
      `${this.apiUrl}/LeaseAgreement/CreateLeaseAgreement`,
      leaseAgreement
    );
  }

  // Update lease agreement
  updateLeaseAgreement(leaseAgreement: LeaseAgreement): Observable<LeaseAgreement> {
    return this.http.put<LeaseAgreement>(
      `${this.apiUrl}/LeaseAgreement/UpdateLeaseAgreement/${leaseAgreement.leaseAgreementId}`,
      leaseAgreement
    );
  }

  // Delete lease agreement
  deleteLeaseAgreement(leaseAgreementId: number): Observable<LeaseAgreement> {
    return this.http.delete<LeaseAgreement>(
      `${this.apiUrl}/LeaseAgreement/DeleteLeaseAgreement/${leaseAgreementId}`
    );
  }

  // Get lease agreement by id
  getLeaseAgreementByIdAsync(leaseAgreementId: number): Observable<LeaseAgreement> {
    return this.http.get<LeaseAgreement>(
      `${this.apiUrl}/LeaseAgreement/GetLeaseAgreementById/${leaseAgreementId}`
    );
  }

  // Get lease agreement by store id
  getLeaseAgreementByStoreIdAsync(storeId: number): Observable<LeaseAgreement> {
    return this.http.get<LeaseAgreement>(
      `${this.apiUrl}/LeaseAgreement/GetLeaseAgreementByStoreId/${storeId}`
    );
  }
}
