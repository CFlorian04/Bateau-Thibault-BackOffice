import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { Product, ProductCategory } from 'src/app/core/interfaces/product';
import { ConnectionHelperService, HttpListUrl } from 'src/app/core/services/connection-helper.service';

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

  isSaveAllDisabled: boolean = false;


  constructor(private connectionService : ConnectionHelperService) { }

  /**
  * Récupère la liste des produits du service 'Products'.
  * @param param1 - Description du premier paramètre.
  * @param param2 - Description du deuxième paramètre.
  * @returns Description de la valeur de retour.
  * @autre_actions 
  * - Stockage des valeurs original (sans modification) => 'originalListeProduits'
  * - Mise des données par défault => setDataAsDefault()
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
  * - Mise des données par défault => setDataAsDefault()
  * - Tri des produits en fonction de leur catégorie => sortArrayOfProducts()
  */
  getProducts() {

    this.listeProduits = [];

    this.connectionService.getDataFromServer<Product[]>(HttpListUrl.InfoProducts).subscribe((res: Product[]) => {
    // this.productsService.getProductsFromJson().subscribe((res: Product[]) => {
      console.log(res);
      this.listeProduits = res;
      this.originalListeProduits = cloneDeep(res); // Liste de valeurs original sans modifications
      this.setDataAsDefault(); // Mise des données par défault
      this.sortArrayOfProducts(); // Tri des produits par catégorie
      this.isSaveAllDisabled = false;
    },
      (err) => {
        alert('Failed loading JSON data');
      });
  }

  /**
  * Mise des données par défault sur toute la liste de produits.
  * @returns Pas de retour
  */
  setDataAsDefault() {
    for (const product of this.listeProduits) {
      product.discounted_price = this.getDiscountPrice(product.price, product.discount);
      product.associate_price = 0;
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

  /**
  * Met à jour les produits dans la liste listeProduits[ ]
  * @param id - id du produit à mettre à jour
  * @returns Pas de retour
  * @autre_actions 
  * - Stockage l'id si produit différent de l'original => listeIDProduitUpdate[ ]
  * - Ajoute du CSS si la valeur de l'input est incorrect
  * - Met à jour la valeur du prix avec réduction
  */
  saveProductChange(changeID: number) {
    const ProductRow = document.getElementById(changeID.toString());

    if (ProductRow) {

      const updateProduct = this.getProduit(changeID);
      const originalProduct = this.getOriginalProduit(changeID);

      let discountInputElement = ProductRow.querySelector(".discount") as HTMLInputElement;
      let associatePriceInputElement = ProductRow.querySelector(".associate-price") as HTMLInputElement;
      let stockInputElement = ProductRow.querySelector(".stock") as HTMLInputElement;
      let associate_price_text = ProductRow.querySelector(".associate-price-text") as HTMLParagraphElement;
      let button_save = ProductRow.querySelector(".button_save_row > .button-save") as HTMLButtonElement;

      let hasChanged = false;
      let hasError_local = false;

      if (updateProduct && originalProduct) {

        // Modification de la valeur du discount
        if (discountInputElement) {
          if (+discountInputElement.value >= 0 && +discountInputElement.value <= 100) { // Règle d'affichage d'erreur
            discountInputElement.classList.remove("input-error");
            if (originalProduct.discount != +discountInputElement.value) {
              updateProduct.discount = +discountInputElement.value;
              updateProduct.discounted_price = this.getDiscountPrice(updateProduct.price, updateProduct.discount);
              hasChanged = true;
            }
          } else {
            discountInputElement.classList.add("input-error");
            hasError_local = true;
          }
        }


        // Récupération de la valeur de transaction, si le stock est différent de celui de base
        if (associatePriceInputElement) {
          if (+associatePriceInputElement.value >= 0) {
            associatePriceInputElement.classList.remove("input-error");
            updateProduct.associate_price = +associatePriceInputElement.value;
            // Pas de hasChanged = true car cette valeur dépend du changement de stock
          } else {
            associatePriceInputElement.classList.add("input-error");
            hasError_local = true;
          }
        }

        // Modification de la valeur du stock
        if (stockInputElement) {
          if (+stockInputElement.value >= 0) { // Règle d'affichage d'erreur
            stockInputElement.classList.remove("input-error");
            if (originalProduct.quantityInStock != +stockInputElement.value) {
              updateProduct.quantityInStock = +stockInputElement.value;
              hasChanged = true;
              associatePriceInputElement.classList.remove("input-error");
              let changeValue = +stockInputElement.value - originalProduct.quantityInStock
              if (+associatePriceInputElement.value == 0 && changeValue < 0) {
                associate_price_text.innerText = 'invendu (' + changeValue + ')';
              } else if (+associatePriceInputElement.value > 0 && changeValue < 0) {
                associate_price_text.innerText = 'vente (' + changeValue + ')';
              } else if (+associatePriceInputElement.value > 0 && changeValue > 0) {
                associate_price_text.innerText = 'achat (+' + changeValue + ')';
              } else {
                // Ne correspond pas à quelque chose de possible
                associate_price_text.innerText = 'erreur';
                associatePriceInputElement.classList.add("input-error");
                hasError_local = true;
              }
            } else {
              associate_price_text.innerText = '';
            }
          } else {
            stockInputElement.classList.add("input-error");
            hasError_local = true;
          }
        }

        hasChanged ? this.setProduitsUpdate(changeID) : this.removeProduitsUpdate(changeID);
        hasError_local ? button_save?.setAttribute('disabled', '') : button_save?.removeAttribute('disabled');

        this.updateSaveAllButton()

        // console.log("sortListeProduits");
        // console.log(this.sortListeProduits[updateProduct?.category].find(e => e.id === changeID));

      }

      // console.log("Associate Price : " + this.listeProduits.find(e => e.id === changeID)?.associate_price)
      // console.log("Discount : " + this.listeProduits.find(e => e.id === changeID)?.discount);
      // console.log("Discount Price : " + this.listeProduits.find(e => e.id === changeID)?.discounted_price);

    }
  }

  updateSaveAllButton() {
    this.isSaveAllDisabled = false;
    this.originalListeProduits.forEach(e => {
      let ProductRow = document.getElementById(e.id.toString());
      if (ProductRow) {
        let button_save = ProductRow.querySelector(".button_save_row > .button-save") as HTMLButtonElement;
        if (button_save['disabled'] == true) {
          this.isSaveAllDisabled = true;
          return;
        }
      }

    });
    //console.log(this.isSaveAllDisabled);
  }
  
  /**
  * Récupère le nom de la catégorie
  * @param category - Numéro  de la catégorie
  * @returns type: string
  */
  getProductCategoryName(category: number) {
    const categoryItem = ProductCategory.find(e => e[0] === category);
    return categoryItem ? categoryItem[1] : null;
  }

  /**
  * Ajoute le produit dans la liste listeIDProduitUpdate[ ]
  * @param id - id du produit à ajouter
  */
  setProduitsUpdate(productID: number) {
    if (!this.listeIDProduitUpdate.includes(productID)) {
      this.listeIDProduitUpdate.push(productID);
    }
  }

  /**
  * Retire le produit dans la liste listeIDProduitUpdate[ ]
  * @param id - id du produit à retirer
  */
  removeProduitsUpdate(productID: number) {
    const index = this.listeIDProduitUpdate.indexOf(productID);

    if (index !== -1) {
      this.listeIDProduitUpdate.splice(index, 1);
    }
  }

  /**
  * Envoi les modifications de tous les produits au serveur
  * @param id - (optionnel) id du produit à sauvegarder
  * @autre_actions Suppression de tous les ids dans listeIDProduitUpdate[ ]
  */
  SaveItems(optionalID?: number) {

    // let updatedProducts: Product[] = [];

    let updatedProducts: { id: number, quantityInStock: number, price: number }[] = [];

    if (typeof optionalID !== undefined) {
      this.listeIDProduitUpdate.forEach(itemId => {
        let updatedProduct = this.listeProduits.find(product => product.id === itemId);
        if (updatedProduct) {
          updatedProducts.push({ id: updatedProduct.id, quantityInStock: updatedProduct.quantityInStock, price: updatedProduct.price });
        }
      });
      this.sendTransactions();
    } else {
      let updatedProduct = this.listeProduits.find(product => product.id === optionalID);
      if (updatedProduct) {
        updatedProducts.push({ id: updatedProduct.id, quantityInStock: updatedProduct.quantityInStock, price: updatedProduct.price });
      }
      this.sendTransactions(optionalID);
    }


    if (updatedProducts.length > 0) {
      let json = JSON.stringify(updatedProducts);
      //this.connectionService.sendDataToServer(HttpListUrl.UpdateProduct, "data='" + json + "'") //TODO : appeler la bonne fonction du back avec les valeurs souhaités
      this.listeIDProduitUpdate = [];

      this.connectionService.sendDataToServer(HttpListUrl.UpdateProduct, json).subscribe( (res : any) => {
        console.log(res);
      },
      (err) => {
          alert('L\'envoi de la modification à échoué');
        }
      );


      //console.log("Sauvegarde de toutes les modifications de produits");
      //console.log(json);

    }
  }


  sendTransactions(optionalID?: number) {

    // let updateTransactions: { id_product: number, stock_change: number, price: number }[] = [];
    let updateTransactions: { id: number, stock_change: number, price: number }[] = [];


    if (typeof optionalID !== undefined) {
      this.listeIDProduitUpdate.forEach(itemId => {
        let updatedTransa = this.listeProduits.find(product => product.id === itemId);
        let originalProduct = this.originalListeProduits.find(product => product.id === itemId);

        if (updatedTransa && originalProduct) {
          updateTransactions.push({ id: updatedTransa.id, stock_change: updatedTransa.quantityInStock-originalProduct.quantityInStock, price: updatedTransa.price });;
        }
      });
    } else {
      let updatedTransa = this.listeProduits.find(product => product.id === optionalID);
      let originalProduct = this.originalListeProduits.find(product => product.id === optionalID);

      if (updatedTransa && originalProduct) {
        updateTransactions.push({ id: updatedTransa.id, stock_change: updatedTransa.quantityInStock-originalProduct.quantityInStock, price: updatedTransa.price });;
      }
    }


    if (updateTransactions.length > 0) {
      let json = JSON.stringify(updateTransactions);
      //this.connectionService.sendDataToServer(HttpListUrl.UpdateProduct, "data='" + json + "'") //TODO : appeler la bonne fonction du back avec les valeurs souhaités
      this.listeIDProduitUpdate = [];

      this.connectionService.sendDataToServer(HttpListUrl.AddHistory, json).subscribe( (res : any) => {
        console.log(res);
      },
      (err) => {
          alert('L\'envoie de la transaction a échoué');
        }
      );

      //console.log("Sauvegarde de toutes les modifications de produits");
      //console.log(json);
    }

  }


}
