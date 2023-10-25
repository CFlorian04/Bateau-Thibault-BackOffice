import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginHelperService {
  private accessToken : string = '';
  private refreshToken : string = '';

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
   
  sendLogin(email : string, password : string) {
    if(email == 'root' && password == 'root') {
      this.setConnection(true);
    }
  }

  // ngOnInit(): void {
  // this.cookie_name=this.cookieService.get('name');
  // this.all_cookies=this.cookieService.getAll();  // get all cookies object
  //     }
}
