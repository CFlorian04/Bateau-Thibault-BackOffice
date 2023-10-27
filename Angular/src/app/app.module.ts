import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './features/header/header.component';
import { FooterComponent } from './features/footer/footer.component';
import { DetailsProduitsComponent } from './pages/details-produits/details-produits.component';
// import { ProductsService } from './core/services/products.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login.component';
import { MatToolbarModule } from '@angular/material/toolbar'
import { CookieService } from 'ngx-cookie-service';
import { ConnectionHelperService } from './core/services/connection-helper.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HistoryComponent } from './pages/history/history.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDatepicker} from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider'
import {MatCheckboxModule} from '@angular/material/checkbox';
import { TitleComponent } from './features/title/title.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    DetailsProduitsComponent,
    LoginComponent,
    HistoryComponent,
    TitleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule ,

    MatToolbarModule,
    // MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatCheckboxModule
  ],
providers: [HttpClient, CookieService, ConnectionHelperService, {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'}, {provide: LOCALE_ID, useValue: 'fr-FR' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
