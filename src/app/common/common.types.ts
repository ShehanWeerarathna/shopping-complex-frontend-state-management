export interface PagedData<T> {
  currentPage: number
  pageSize: number
  totalItemsCount: number
  pagedData: T[]
}

export interface Store {
  storeId: number
  storeName: string
  categoryId: number
  category?: Category
  leaseAgreementId?: number|null
  leaseAgreement?: LeaseAgreement
  maintenanceContractId?: number|null
  maintenanceContract?: MaintenanceContract
}

export interface Category {
  categoryId: number
  categoryName: string
  stores?: Store[]
}

export interface LeaseAgreement {
  leaseAgreementId: number
  storeId: number
  leaseStartDate: string
  leaseEndDate: string
  leaseAmount: number
  description?: string | null
  store?: Store
  payments?: LeasePayment[]
}

export interface MaintenanceContract {
  maintenanceContractId: number
  storeId: number
  contractStartDate: string
  contractEndDate: string
  contractAmount: number
  description?: string | null
  store?: Store
  payments?: MaintenancePayment[]
}

export interface LeasePayment {
  leasePaymentId: number
  leaseAgreementId: number
  paymentDate: string
  amount: number
  leaseAgreement?: LeaseAgreement
}

export interface MaintenancePayment {
  maintenancePaymentId: number
  maintenanceContractId: number
  paymentDate: string
  amount: number
  maintenanceContract?: MaintenanceContract
}


export interface Country {
  name?: string;
  code?: string;
}

export interface Representative {
  name?: string;
  image?: string;
}

export interface Customer {
  id?: number;
  name?: string;
  country?: Country;
  company?: string;
  date?: string | Date;
  status?: string;
  activity?: number;
  representative?: Representative;
  verified?: boolean;
  balance?: number;
}

export interface FinancialReport {
  transactions: Transaction[]
  totalCredit: number
  totalDebit: number
  balance: number
}

export interface Transaction {
  paymentDate: string
  description: string
  amount: number
  isCredit: boolean
}
