import { Component } from '@angular/core';
import { Product } from 'src/app/core/interfaces/product';
import { ProductsService } from 'src/app/core/services/products.service';

@Component({
  selector: 'app-details-produits',
  templateUrl: './details-produits.component.html',
  styleUrls: ['./details-produits.component.css']
})
export class DetailsProduitsComponent {

  listeProduits!: Product[];
  sortListeProduits: { [key: string]: Product[] } = {};

  sortKeyList!: string[];

  constructor(public productsService: ProductsService) {
  }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.productsService.getProductsFromJson().subscribe((res: Product[]) => {
      this.listeProduits = res;
      this.sortArrayOfProducts();
    },
    (err) => {
      alert('Failed loading JSON data');
    });
  }

  getDiscountPrice(price: number, discount: number) {
    return Math.round(price * (1 - (discount / 100)) * 100) / 100;
  }

  getProduit(id: number): Product | undefined {
    return this.listeProduits.find(product => product.id === id);
  }

  sortArrayOfProducts() {
    this.listeProduits.forEach(product => {
      if (!this.sortListeProduits[product.type]) {
        this.sortListeProduits[product.type] = [];
      }
      this.sortListeProduits[product.type].push(product);
    });

    this.sortKeyList = Object.keys(this.sortListeProduits);
  }

  saveProductChange(changeID: number) {
    let changeStock = document.getElementById("changeStock");
    let updateProduct = this.getProduit(changeID);

    //updateProduct.quantity_stock = changeStock;

    let indexToUpdate = this.listeProduits.findIndex(item => item.id === changeID);
    //this.listeProduits[indexToUpdate] = newItem;

  }
}
