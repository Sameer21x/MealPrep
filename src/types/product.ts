export type Taxon = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  department: Taxon;
  category?: Taxon;
  quantity?: string;
  netContent?: { value: number; unit: string };
  price: { amount: number; currency: string };
  unitPrice?: { amount: number; unit: string };
  nutrition: {
    energyKcal100g: number;
    fat100g: number;
    saturatedFat100g: number;
    carbohydrates100g: number;
    sugars100g: number;
    fiber100g: number;
    proteins100g: number;
    salt100g: number;
  };
  nutriScore?: string;
  novaGroup?: number;
  labels: Taxon[];
  allergens: Taxon[];
};
