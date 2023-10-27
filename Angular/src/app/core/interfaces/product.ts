export interface Product {
    type: string;
    comments: string;
    category: number;
    availability: boolean;
    id: number;
    tig_id: number;
    price: number;
    price_on_sale: number;
    discount: number;
    sale: boolean;
    owner: string;
    unit: string;
    name: string;
    quantityInStock: number;
    quantity_sold: number;

    discounted_price: number; // Prix avec réduction
    associate_price: number; // Prix associer à un changement de stock

}


export const ProductCategory = [
    [0,'Poissons'],
    [1,'Fruit de Mer'],
    [2,'Crustacés'],
  ];
