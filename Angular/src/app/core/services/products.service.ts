import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const ProductCategory = [
  [0,'Poissons'],
  [1,'Fruit de Mer'],
  [2,'Crustacés'],
];

// enum HttpListUrl {
//   InfoProducts = "infoproducts/",
// }

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  
  // serverURL: string = "http://127.0.0.1:8000/";

  // constructor(private http: HttpClient) {
  //   this.getConfigDataFromJson();
  // }

  // getConfigDataFromJson() {
  //   this.http.get<any>('../../../assets/data/config.json').subscribe(data => {
  //     this.serverURL = data.serverURL;
  //   });
  // }

  // // Récupération des produits du JSON local
  // getProductsFromJson(): Observable<Product[]> {
  //   return this.http.get<Product[]>("../../../assets/data/Products.json");
  // }

  // Récupération du nom des catégories des produits
  // getProductCategoryName(category: number) {
  //   const categoryItem = ProductCategory.find(e => e[0] === category);
  //   return categoryItem ? categoryItem[1] : null;
  // }

  // TEST : Récupération de JSON du serveur
  // getJSONDataFromServer(requestType: string) {
  //   const url: string = HttpListUrl[requestType as keyof typeof HttpListUrl];
  //   if (this.serverURL === '') {
  //     this.getConfigDataFromJson();
  //     console.log("Pas d'URL serveur récupéré")

  //   }
  //   console.log("URL REQUESTED: " + this.serverURL + url);
  //   return this.http.get<Product[]>(this.serverURL + url);
  // }

  // saveProductsChanges(json: string) {
  //   // Faire l'envoyer du JSON
  // }
}
