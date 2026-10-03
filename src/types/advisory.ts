export interface AdvisoryRequest {
  crop: string;
  year: number;
  month: number;
  rainfall_mm?: number;
  diesel_price_lkr?: number;
}

export interface AdvisoryResponse {
  Target_Harvest_Date: string;
  Planting_Date: string;
  Required_Harvest_MT: number;
  Allowed_Extent_Ha: number;
  Calculated_Fair_Price: number;
  Estimated_Wholesale_Price: number;
  Estimated_Consumer_Price: number;
}
