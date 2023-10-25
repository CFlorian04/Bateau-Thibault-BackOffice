import { Component } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Product } from 'src/app/core/interfaces/product';
import { ProductsService } from 'src/app/core/services/products.service';


@Component({
  selector: 'app-details-produits',
  templateUrl: './details-produits.component.html',
  styleUrls: ['./details-produits.component.css']
})
export class DetailsProduitsComponent {

  originalListeProduits!: Product[]; // Liste de produit original, sans modification
  listeProduits!: Product[]; // Liste de produit avec les modifications possibles

  sortListeProduits: { [key: string]: Product[] } = {}; // Liste triée des produits
  sortKeyList!: string[]; // Liste des catégories de produits

  listeIDProduitUpdate: number[] = []; // Liste des ID des produits modifiés

  listeTransaction!: number[][]; // Liste des transactions faites (par rapport au stock et au prix associé)

  constructor(public productsService: ProductsService) {}

  /**
  * Récupère la liste des produits du service 'Products'.
  * @param param1 - Description du premier paramètre.
  * @param param2 - Description du deuxième paramètre.
  * @returns Description de la valeur de retour.
  * @autre_actions 
  * - Stockage des valeurs original (sans modification) => 'originalListeProduits'
  * - Calcul des prix avec réductions => calculateDiscountedPrices()
  * - Tri des produits en fonction de leur catégorie => sortArrayOfProducts()
  */


  ngOnInit() {
    this.getProducts();
  }

  /**
  * Récupère la liste des produits du service 'Products'.
  * @returns Pas de retour
  * @autre_actions
  * - Stockage des valeurs original (sans modification) => originalListeProduits[ ]
  * - Calcul des prix avec réductions => calculateDiscountedPrices()
  * - Tri des produits en fonction de leur catégorie => sortArrayOfProducts()
  */
  getProducts() {

    this.listeProduits = [];

    // this.productsService.getJSONDataFromServer("ListProducts").subscribe((res: Product[]) => {
    this.productsService.getProductsFromJson().subscribe((res: Product[]) => {
      this.listeProduits = res;
      this.originalListeProduits = cloneDeep(res); // Liste de valeurs original sans modifications
      this.calculateDiscountedPrices(); // Calcul de tous les prix avec réductions
      this.sortArrayOfProducts(); // Tri des produits par catégorie
    },
      (err) => {
        alert('Failed loading JSON data');
      });
  }

  /**
  * Attribue les prix avec réduction sur toute la liste de produits.
  * @returns Pas de retour
  */
  calculateDiscountedPrices() {
    for (const product of this.listeProduits) {
      product.discountedPrice = this.getDiscountPrice(product.price, product.discount);
    }
  }

  /**
  * Calcul du prix avec réduction
  * @param price - Prix du produit
  * @param discount - Valeur de la réduction du produit. Nombre entier pas décimal
  * @returns type: number
  */
  getDiscountPrice(price: number, discount: number) {
    return Math.round(price * (1 - (discount / 100)) * 100) / 100;
  }

  /**
  * Récuperer un produit (avec modifications)
  * @param id - id du produit
  * @returns type: Product | undefined
  */
  getProduit(id: number): Product | undefined {
    return this.listeProduits.find(product => product.id === id);
  }

  /**
  * Récuperer un produit (sans modifications)
  * @param id - id du produit
  * @returns type: Product | undefined
  */
  getOriginalProduit(id: number): Product | undefined {
    return this.originalListeProduits.find(product => product.id === id);
  }

  /**
  * Tri des produits en fonction de leur catégorie
  * @returns Pas de retour
  * @autre_actions Attribution de la liste des catégories => sortKeyList[ ]
  */
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
    const ProductRow = document.getElementById(changeID.toString());

    if (ProductRow) {

      const updateProduct = this.getProduit(changeID);
      const originalProduct = this.getOriginalProduit(changeID);
      let hasChanged = false;

      if (updateProduct && originalProduct) {

        // Modification de la valeur du stock
        let stockInputElement = ProductRow.querySelector(".stock") as HTMLInputElement;
        if (stockInputElement) {
          if (+stockInputElement.value >= 0) { // Règle d'affichage d'erreur
            stockInputElement.classList.remove("input-error");
            if (originalProduct.quantity_stock != +stockInputElement.value) {
              updateProduct.quantity_stock = +stockInputElement.value;
              hasChanged = true;
              // Récupération de la valeur de transaction, si le stock est différent de celui de base
              let associatePrice = ProductRow.querySelector(".associate-price") as HTMLInputElement;
              if (associatePrice) {
                null;
              } else {
                stockInputElement.classList.add("input-error");
              }

            }
          }

          // Modification de la valeur du discount
          let discountInputElement = ProductRow.querySelector(".discount") as HTMLInputElement;
          if (discountInputElement) {
            if (+discountInputElement.value >= 0 && +discountInputElement.value <= 100) { // Règle d'affichage d'erreur
              discountInputElement.classList.remove("input-error");
              if (originalProduct.discount != +discountInputElement.value) {
                updateProduct.discount = +discountInputElement.value;
                updateProduct.discountedPrice = this.getDiscountPrice(updateProduct.price, updateProduct.discount);
                console.log(this.getDiscountPrice(updateProduct.price, updateProduct.discount))
                console.log(updateProduct.discountedPrice);
                hasChanged = true;
              }
            } else {
              discountInputElement.classList.add("input-error");
            }
          }
        }

        hasChanged ? this.setProduitsUpdate(changeID) : this.removeProduitsUpdate(changeID);

        // console.log("sortListeProduits");
        // console.log(this.sortListeProduits[updateProduct?.category].find(e => e.id === changeID));

      }
      console.log("listeProduits");
      console.log("Discount : " + this.listeProduits.find(e => e.id === changeID)?.discount);
      console.log("Discount Price : " + this.listeProduits.find(e => e.id === changeID)?.discountedPrice);

    }
  }

  getProductCategoryName(category: number) {
    return this.productsService.getProductCategoryName(category);
  }

  setProduitsUpdate(productID: number) {
    if (!this.listeIDProduitUpdate.includes(productID)) {
      this.listeIDProduitUpdate.push(productID);
    }
  }

  removeProduitsUpdate(productID: number) {
    const index = this.listeIDProduitUpdate.indexOf(productID);

    if (index !== -1) {
      this.listeIDProduitUpdate.splice(index, 1);
    }
  }


  SaveAllItem() {
    let updatedProducts: Product[] = [];

    this.listeIDProduitUpdate.forEach(itemId => {
      let updatedProduct = this.listeProduits.find(product => product.id === itemId);
      if (updatedProduct) {
        updatedProducts.push(updatedProduct);
      }
    });

    if (updatedProducts.length > 0) {
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

    if (updatedProducts.length > 0) {
      let json = JSON.stringify(updatedProducts);
      this.productsService.saveProductsChanges(json);

      console.log("Sauvegarde du produit : id " + productID);
      console.log(json);
    }
    console.log(this.listeIDProduitUpdate);


  }



}
