import { Injectable } from '@angular/core';
import { MaintenanceContract, PagedData } from '../common/common.types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceContractService {

  private apiUrl = "https://localhost:7038/api";

  constructor(private http: HttpClient) { }

  // Get maintenance contracts
  getMaintenanceContractsAsync(currentPage?: number, pageSize?: number): Observable<PagedData<MaintenanceContract>> {
    return this.http.get<PagedData<MaintenanceContract>>(
      `${this.apiUrl}/MaintenanceContract/GetMaintenanceContracts?currentPage=${currentPage ?? 1}&pageSize=${pageSize ?? 10}`
    );
  }

  // Create maintenance contract
  createMaintenanceContract(maintenanceContract: MaintenanceContract): Observable<MaintenanceContract> {
    return this.http.post<MaintenanceContract>(
      `${this.apiUrl}/MaintenanceContract/CreateMaintenanceContract`,
      maintenanceContract
    );
  }

  // Update maintenance contract
  updateMaintenanceContract(maintenanceContract: MaintenanceContract): Observable<MaintenanceContract> {
    return this.http.put<MaintenanceContract>(
      `${this.apiUrl}/MaintenanceContract/UpdateMaintenanceContract/${maintenanceContract.maintenanceContractId}`,
      maintenanceContract
    );
  }

  // Delete maintenance contract
  deleteMaintenanceContract(maintenanceContractId: number): Observable<MaintenanceContract> {
    return this.http.delete<MaintenanceContract>(
      `${this.apiUrl}/MaintenanceContract/DeleteMaintenanceContract/${maintenanceContractId}`
    );
  }

  // Get maintenance contract by id
  getMaintenanceContractByIdAsync(maintenanceContractId: number): Observable<MaintenanceContract> {
    return this.http.get<MaintenanceContract>(
      `${this.apiUrl}/MaintenanceContract/GetMaintenanceContractById/${maintenanceContractId}`
    );
  }

  // Get maintenance contract by store id
  getMaintenanceContractByStoreIdAsync(storeId: number): Observable<MaintenanceContract> {
    return this.http.get<MaintenanceContract>(
      `${this.apiUrl}/MaintenanceContract/GetMaintenanceContractByStoreId/${storeId}`
    );
  }
}
