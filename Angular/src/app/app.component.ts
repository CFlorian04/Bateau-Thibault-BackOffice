import { Component } from '@angular/core';
import { ConnectionHelperService } from './core/services/connection-helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TP1';

  constructor(public loginHelper : ConnectionHelperService) {
  }
}
