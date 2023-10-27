import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


export enum HttpListUrl {
  Admin = "admin/",
  InfoProducts = "infoproducts/",
  Products = "products/",
  OnSaleProducts = "onsaleproducts/",
  ShipPoints = "shipPoints/",
  AvailableProducts = "availableProducts/",
  Fishes = "fishes/",
  Crustaceans = "crustaceans/",
  Shells = "shells/",
  ShowHistory = "showHistory/",
  
  InfoProduct = "infoproduct/",//<int:tig_id>/
  Product = "product/",//<int:pk>/
  OnSaleProduct = "onsaleproduct/",//<int:pk>/
  ShipPoint = "shipPoint/",//<int:pk>/
  AvailableProduct = "availableProduct/",//<int:pk>/
  Fish = "fish/",//<int:pk>/
  Crustacean = "crustacean/",//<int:pk>/
  Shell = "shell/",//<int:pk>/
  Putonsale = "putonsale/",//<int:id>/<str:newprice>/
  Removesale = "removesale/",//<int:id>/
  IncrementStock = "incrementStock/",//<int:id>/<int:number>/
  DecrementStock = "decrementStock/",//<int:id>/<int:number>/
  UpdateProduct = "modifyProduct/",//[data='product_model']

  AddHistory = "AddHistory/",

  ApiToken = "api/token/",// [name='token_obtain_pair']
  ApiTokenRefresh = "api/token/refresh/"// [name='token_refresh']
}

@Injectable({
  providedIn: 'root'
})
export class ConnectionHelperService {
  private accessToken : string = '';
  private refreshToken : string = '';

  private key = 'sd6g1b8d9f4n6t51ns65b4qe98r6h1db56';

  private connected : boolean = false;
  serverURL: string = "http://127.0.0.1:8000/";

  constructor(private http: HttpClient, private cookieService : CookieService, private router: Router) {
    this.getConfigDataFromJson();
  }

  private setConnection(connect : boolean) {
    this.connected = connect;
    if (this.connected == true) {
      //this.router.navigate(['/home']);
    }
  }

  getConfigDataFromJson() {
    this.http.get<any>('../../../assets/data/config.json').subscribe(data => {
      this.serverURL = data.serverURL;
    });
  }
  
  getConnection() {
    return this.connected;
  }

  getCookies() {
    this.accessToken=this.cookieService.get('accessToken');
    this.refreshToken=this.cookieService.get('refreshToken');
    console.log(this.accessToken);
    console.log(this.refreshToken);
  }

  setCookies(){
    this.cookieService.set('accessToken', this.accessToken);
    this.cookieService.set('refreshToken',this.refreshToken);
  }
   
  deleteCookie(name : string){
    this.cookieService.delete(name);
  }
   
  deleteAll(){
    this.cookieService.deleteAll();
  }
  
  encrypt(str : string) {
    return CryptoJS.AES.encrypt(str, this.key).toString();
  }
  
  decrypt(encrypted : string) {
    const decrypted = CryptoJS.AES.decrypt(encrypted, this.key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  sendLogin(email : string, password : string) {
    /*let crypted = this.encrypt(password).replace(/=$/,'');
    let decrypted = this.decrypt(crypted);
    console.log("Crypted = " + crypted);
    console.log("Decrypted = " + decrypted.toString());*/
    /*if(email == 'root' && password == 'root')
      this.setConnection(true);*/
    let data = {username : email, password : password};
    this.sendDataToServer(HttpListUrl.ApiToken, JSON.stringify(data)).subscribe( (res : any) => {
        //let tokens = {accessToken : '', refreshToken : ''};
        //JSON.parse(res);
        console.log(res);

        this.accessToken = res["access"];
        this.refreshToken = res["refresh"];
        this.setCookies();

        if( res["access"] && res["refresh"]) {
          this.setConnection(true);
        }
        else {
          this.setConnection(false);
        }


      },
      (err) => {
          alert('Failed loading JSON data');
        }
    );
  }

  getDataFromServer<Type>(url: string) {
    if (this.serverURL === '') {
      this.getConfigDataFromJson();
      console.log("Pas d'URL serveur récupéré")
    }
    console.log("URL REQUESTED: " + this.serverURL + url);
    return this.http.get<Type>(this.serverURL + url);
  }

  sendDataToServer<Type>(url : string, data: string = '') {
    console.log(this.serverURL + url)
    console.log(data);
    console.log({headers: {"Content-Type": "application/json", "Authorization": "JWT "+ this.refreshToken} });
    return this.http.post(this.serverURL + url, data, {headers: {"Content-Type": "application/json", "Authorization": "JWT "+ this.refreshToken} } );
  }
}
