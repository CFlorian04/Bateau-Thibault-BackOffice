export interface Product {
    type: string;
    comments: string;
    category: number;
    availability: boolean;
    id: number;
    price: number;
    price_on_sale: number;
    discount: number;
    sale: boolean;
    owner: string;
    unit: string;
    name: string;
    quantity_stock: number;
    quantity_sold: number;

    discounted_price: number; // Prix avec réduction
    associate_price: number; // Prix associer à un changement de stock

}