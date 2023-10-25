import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetailsProduitsComponent } from './pages/details-produits/details-produits.component';
import { LoginComponent } from './pages/login/login.component';

 const routes: Routes = [
   //{ path: '', component: LoginComponent, title: 'Login Page'},
  //  { path: '', component: HomeComponent, title: 'Home Page'},
   { path: '', component: HomeComponent, title: 'Home Page'},
   { path: 'produits', component: DetailsProduitsComponent, title: 'Products List'},
   //{ path: 'produits/**/', component: DetailsProduitsComponent, title: 'Products List'},
   //{ path: '**', component: HomeComponent, title: 'Home Page'}, //faire erreur 404

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule,]
})
export class AppRoutingModule { }
