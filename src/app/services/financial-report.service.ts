import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  FinancialReport } from '../common/common.types';

@Injectable({
  providedIn: 'root',
})
export class FinancialReportService {
  private apiUrl = 'https://localhost:7038/api';
  constructor(private http: HttpClient) {}

  // Get financial report
  getFinancialReport(startDate: string,endDate: string): Observable<FinancialReport> {
    let url = `${this.apiUrl}/FinancialReport/GetFinancialReport?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<FinancialReport>(url);
  }
}
