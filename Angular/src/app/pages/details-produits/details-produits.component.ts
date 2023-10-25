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
  listeIDProduitUpdate: number[] = [];
  sortListeProduits: { [key: string]: Product[] } = {};

  sortKeyList!: string[];

  constructor(public productsService: ProductsService) {
  }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {

    this.listeProduits = [];

    // this.productsService.getJSONDataFromServer("ListProducts").subscribe((res: Product[]) => {
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

    this.sortListeProduits = {};

    this.listeProduits.forEach(product => {
      if (!this.sortListeProduits[product.category]) {
        this.sortListeProduits[product.category] = [];
      }
      this.sortListeProduits[product.category].push(product);
    });

    this.sortKeyList = Object.keys(this.sortListeProduits);
  }

  saveProductChange(changeID: number) {
    let ProductRow = document.getElementById(changeID.toString());

    if (ProductRow) {

      const updateProduct = this.getProduit(changeID);

      if (updateProduct) {

        // Modification de la valeur du stock
        let stockInputElement = ProductRow.querySelector("#stock") as HTMLInputElement;
        if (stockInputElement) {
          if (+stockInputElement.value >= 0) { // Règle d'affichage d'erreur
            stockInputElement.classList.remove("input-error");
            if (updateProduct.quantity_stock != +stockInputElement.value) {
              updateProduct.quantity_stock = +stockInputElement.value;
              this.setProduitsUpdate(changeID);
            }
          } else { 
            stockInputElement.classList.add("input-error");
          }
        }

        // Modification de la valeur du discount
        let discountInputElement = ProductRow.querySelector("#discount") as HTMLInputElement;
        if (discountInputElement) {
          if (+discountInputElement.value >= 0 && +discountInputElement.value <= 100) { // Règle d'affichage d'erreur
            discountInputElement.classList.remove("input-error");
            if (updateProduct.discount != +discountInputElement.value) {
              updateProduct.discount = +discountInputElement.value;
              this.setProduitsUpdate(changeID);
            }
          } else { 
            discountInputElement.classList.add("input-error");
          }
        }
      }

      //console.log(updateProduct);
      //console.log(this.listeProduits.find(e => e.id === changeID)?.discount + '/' + this.listeProduits.find(e => e.id === changeID)?.quantity_stock)
    }
  }

  getProductCategoryName(category: number) {
    return this.productsService.getProductCategoryName(category);
  }

  setProduitsUpdate(productID: number) {
    if (!this.listeIDProduitUpdate.includes(productID)) {
      this.listeIDProduitUpdate.push(productID);
    }
    //console.log(this.listeIDProduitUpdate);
  }

  SaveAllItem() {
    let updatedProducts: Product[] = [];

    this.listeIDProduitUpdate.forEach(itemId => {
      let updatedProduct = this.listeProduits.find(product => product.id === itemId);
      if (updatedProduct) {
        updatedProducts.push(updatedProduct);
      }
    });

    if(updatedProducts.length > 0) {
      let json = JSON.stringify(updatedProducts);
      this.productsService.saveProductsChanges(json);
      this.listeIDProduitUpdate = [];

      console.log("Sauvegarde de toutes les modifications de produits");
      console.log(json);
    }

    console.log(this.listeIDProduitUpdate);
}



  SaveSingleItem(productID: number) {
    let updatedProducts: Product[] = [];

    let updatedProduct = this.listeProduits.find(product => product.id === productID);
    if (updatedProduct) {
      updatedProducts.push(updatedProduct);
      let index = this.listeIDProduitUpdate.indexOf(productID);
        if (index !== -1) {
            this.listeIDProduitUpdate.splice(index, 1);
        }
    }

    if(updatedProducts.length > 0) {
      let json = JSON.stringify(updatedProducts);
      this.productsService.saveProductsChanges(json);

      console.log("Sauvegarde du produit : id "+productID);
      console.log(json);
    }
    console.log(this.listeIDProduitUpdate);


  }



}
