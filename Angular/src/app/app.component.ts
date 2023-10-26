import { Component } from '@angular/core';
import { LoginHelperService } from './core/services/login-helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TP1';

  constructor(public loginHelper : LoginHelperService) {
  }
}
