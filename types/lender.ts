export interface LenderPersonalDetails {
  name?: string;
  age?: number;
  occupation?: string;
  income?: number;
  [key: string]: any; // Allow for flexible additional fields
}

export interface Lender {
  id: string;
  personaldetail: LenderPersonalDetails;
  created_at?: string;
  updated_at?: string;
}
