import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetailsProduitsComponent } from './pages/details-produits/details-produits.component';

 const routes: Routes = [
   { path: '', redirectTo: '/home', pathMatch: 'full'},
   { path: 'home', component: HomeComponent, title: 'Home Page'},
   { path: 'produits', component: DetailsProduitsComponent, title: 'Products List'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule,]
})
export class AppRoutingModule { }
