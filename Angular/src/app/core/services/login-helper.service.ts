import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LoginHelperService {
  private accessToken : string = '';
  private refreshToken : string = '';

  private key = 'sd6g1b8d9f4n6t51ns65b4qe98r6h1db56';

  private connected : boolean = false;

  constructor(private cookieService : CookieService) {}

  private setConnection(connect : boolean) {
    this.connected = connect;
    if (this.connected == true) {
      
    }
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
   
  deleteCookie(){
    this.cookieService.delete('name');
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
    let crypted = this.encrypt(password).replace(/=$/,'');
    let decrypted = this.decrypt(crypted);
    console.log("Crypted = " + crypted);
    console.log("Decrypted = " + decrypted.toString());
    if(email == 'root' && password == 'root')
      this.setConnection(true);
  }

  // ngOnInit(): void {
  // this.cookie_name=this.cookieService.get('name');
  // this.all_cookies=this.cookieService.getAll();  // get all cookies object
  //     }
}
