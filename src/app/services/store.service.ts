import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Category, PagedData, Store } from '../common/common.types';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private apiUrl = 'https://localhost:7038/api';
  constructor(private http: HttpClient) {}

  // add a BehaviourSubject to store the current store list

  // Get stores
  getStoreListAsync(
    searchTerm?: string,
    currentPage?: number,
    pageSize?: number,
    categoryId?: number
  ): Observable<PagedData<Store>> {
    return this.http.get<PagedData<Store>>(
      `${this.apiUrl}/Store/GetStores?searchTerm=${
        searchTerm ?? ''
      }&currentPage=${currentPage ?? 1}&pageSize=${pageSize ?? 10}&categoryId=${
        categoryId ?? 0
      }`
    );
  }

  // Create store
  createStore(store: Store): Observable<Store> {
    return this.http.post<Store>(`${this.apiUrl}/Store/CreateStore`, store);
  }

  // Update store
  updateStore(store: Store): Observable<Store> {
    return this.http.put<Store>(
      `${this.apiUrl}/Store/UpdateStore/${store.storeId}`,
      store
    );
  }

  // Delete store
  deleteStore(storeId: number): Observable<Store> {
    return this.http.delete<Store>(
      `${this.apiUrl}/Store/DeleteStore/${storeId}`
    );
  }

  // Get store by id
  getStoreByIdAsync(storeId: number): Observable<Store> {
    return this.http.get<Store>(`${this.apiUrl}/Store/GetStoreById/${storeId}`);
  }

  // Get store by user id
  getCategoryListAsync(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/Store/GetCategories`);
  }

  private storeListSubject = new BehaviorSubject<Store[]>([]);
  storeList$ = this.storeListSubject.asObservable();

  updateStoreList(newStoreList: Store[]) {
    this.storeListSubject.next(newStoreList);
  }

  addNewStore(newStore: Store) {
    const currentStoreList = this.storeListSubject.getValue();
    currentStoreList.push(newStore);
    this.storeListSubject.next(currentStoreList);
  }

  private categoryListSubject = new BehaviorSubject<Category[]>([]);
  categoryList$ = this.categoryListSubject.asObservable();

  updateCategoryList(newCategoryList: Category[]) {
    this.categoryListSubject.next(newCategoryList);
  }

  private storeNameSubject = new BehaviorSubject<string>('');
  storeName$ = this.storeNameSubject.asObservable();

  updateStoreName(newStoreName: string) {
    this.storeNameSubject.next(newStoreName);
  }
 
}
