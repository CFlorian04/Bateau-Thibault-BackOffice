import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetailsProduitsComponent } from './pages/details-produits/details-produits.component';
import { HistoryComponent } from './pages/history/history.component';

 const routes: Routes = [
   { path: '', component: HomeComponent, title: 'Home Page'},
   { path: 'produits', component: DetailsProduitsComponent, title: 'Products List'},
   { path: 'history', component: HistoryComponent, title: 'History Page'},
   //{ path: 'produits/**/', component: DetailsProduitsComponent, title: 'Products List'},
   //{ path: '**', component: HomeComponent, title: 'Home Page'}, //faire erreur 404

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule,]
})
export class AppRoutingModule { }
