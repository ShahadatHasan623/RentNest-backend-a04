export interface ICreateProperty {
  title: string;
  description?: string;
  location?: string;
  address?: string;
  city?: string;
  area?: string;
  rent: number;
  bedrooms?: number;
  bathrooms?: number;
  size: number;
  amenities: string[];
  images?: string[];
  categoryId: string;
}
