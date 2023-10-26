import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const ProductCategory = [
  [0,'Poissons'],
  [1,'Fruit de Mer'],
  [2,'Crustacés'],
]

enum HttpListUrl {
  ListProducts = "products/?format=json",
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  //serverURL: string = "http://51.255.166.155:1352/tig/";
  serverURL: string = "";


  constructor(private http: HttpClient) {
    this.getConfigDataFromJson().subscribe(data => {
      this.serverURL = data.serverURL;
    });
   }

  getConfigDataFromJson(): Observable<{ serverURL: string }> {
    return this.http.get<{ serverURL: string}>('../../../assets/data/config.json');
  }

  // Récupération des produits du JSON local
  getProductsFromJson() {
    return this.http.get<Product[]>("../../../assets/data/Products.json");
  }

  // Récupération du nom des catégories des produits
  getProductCategoryName(category: number) {
    const categoryItem = ProductCategory.find(e => e[0] === category);
    return categoryItem ? categoryItem[1] : null;
  }

  // TEST : Récupération de JSON du server
  getJSONDataFromServer(requestType: string) {
    const url: string = HttpListUrl[requestType as keyof typeof HttpListUrl];
    console.log(this.serverURL+url);
    return this.http.get<Product[]>(this.serverURL+url);
  }

  saveProductsChanges(json: string) {
    //Faire l'envoyer du JSON
  }
  
}
