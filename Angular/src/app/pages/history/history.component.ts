import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HistoryModel } from 'src/app/core/interfaces/history';
import { ConnectionHelperService, HttpListUrl } from 'src/app/core/services/connection-helper.service';
import { Chart, TooltipItem } from 'chart.js/auto';
import { formatDate } from '@angular/common';
import { Product, ProductCategory } from 'src/app/core/interfaces/product';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {

  /*
  NOTE:
  Par manque de temps, tout les variables ont été doublé pour afficher les 2 Charts créant une redondance,
  Avec plus de temps un model aurait été créé pour géré l'affichage d'une Chart et aurait été utilisé ici
   */

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  }); //FormGroup permettant de récupérer les valeurs pour la Chart des ventes

  rangeProfit = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  }); //FormGroup permettant de récupérer les valeurs pour la Chart du chiffre d'affaire

  readonly ProductCategoryList = [0, 1, 2];       //Valeur permettant de connaître la catégorie de la vente
  readonly ProductCategory = ProductCategory;     //Récupération de la liste des catégorie
  readonly TodayDate = new Date();                //Date du jour pour limiter la valeur rentrée dans les Charts
  
  dateList : Date[] = [];                         //Liste de Date permettant d'afficher les valeurs dans l'ordre chronologique dans l'axe X dans la Chart
  valueList : number[] = [];                      //Liste de nombre permettant d'afficher la valeur de la vente dans l'axe Y dans la Chart
  dateProfitList : Date[] = [];                   //Liste de Date permettant d'afficher les valeurs dans l'ordre chronologique dans l'axe X dans la Chart
  valueProfitList : number[] = [];                //Liste de nombre permettant d'afficher la valeur de l'historique dans l'axe Y dans la Chart

  productList!: Product[];                        //Liste des produits afin d'aller chercher les valeurs des produits pour l'affichage de la Tooltip des Charts
  historyList : HistoryModel[] = [];              //Liste d'HistoryModel permettant la récupération des informations dans le backEnd
  historyListTemp : HistoryModel[] = [];          //Liste dynamique permettant le trie en fonction des filtres activé pour la Chart des ventes
  historyListProfitTemp : HistoryModel[] = [];    //Liste dynamique permettant le trie en fonction des Dates pour la Chart de chiffre d'affaire

  checkboxList : boolean[] = [true, true, true];  //Liste permettant de connaître les catégories selectionnés pour les filtres
  sliderValues = [0, 100];                        //Valeur permettant de connaître les deux valeurs du slider pour les filtres

  constructor(private connectionService : ConnectionHelperService){}

  ngOnInit() {
    //Récupération de la liste des produits dans le backEnd
    this.connectionService.getDataFromServer<Product[]>(HttpListUrl.InfoProducts).subscribe((res: Product[]) => {

        console.log(res);
        this.productList = res;
      },
        (err) => {
          alert('Failed loading JSON data');
        });
    this.range.controls['end'].valueChanges.subscribe(value => {
      this.createChart(); //Binding de la création de la Chart des ventes quand une date de fin est rentrée
    });
    this.rangeProfit.controls['end'].valueChanges.subscribe(value => {
      this.createChartProfit(); //Binding de la création de la Chart chiffre d'affaire quand une date de fin est rentrée
    });
    this.getHistoric();
  }

  getHistoric() {
    //Récupération de la liste des historique dans le backEnd
    this.connectionService.getDataFromServer<HistoryModel[]>(HttpListUrl.ShowHistory).subscribe((res: HistoryModel[]) => {

        console.log(res);
        this.historyList = res;
        this.historyList.sort((a : HistoryModel, b : HistoryModel) => a.date.valueOf() - b.date.valueOf()); //Sorting des valeurs permettant de s'implifier les filtres
        for (let produ of this.historyList) {
          produ.stock_change = -produ.stock_change; //Invertion des changements de stock permettant d'afficher les ventes en positif et les achats en négatif
        }
      },
      (err) => {
          alert('Failed loading JSON data');
        }
      );
  }
  
  //Fonction utiliser par le slider pour afficher la valeur en poucentage
  formatLabel(value: number): string {
    return `${value}%`;
  }

  //Fonction utiliser par le slider permettant de récuperer les valeurs rentrées et de recréer la Chart
  sliderChange(value : any) {
    console.log(value.target.value);
    console.log(value.target.title);
    this.sliderValues[value.target.title == "start" ? 0 : 1] = value.target.value;
    this.createChart();
  }

  //Création de la Chart des ventes
  createChart(){
    var chartExist = Chart.getChart("myChart"); // Récupération de la Chart des ventes
    if (chartExist != undefined)  //Destruction de la Chart si existante
      chartExist.destroy(); 

    this.generateProductList();   //Création de la liste d'objet à afficher
    console.log("historyTemp list :" + this.historyListTemp);

    //Création de la Chart
    let chart = new Chart("myChart", {  type: 'line',
    data: {
      labels: this.dateList,  //Label permettant l'affichage des dates dans l'axis X
      datasets: [
        {
          label: "Historique des ventes", //Nom du label
          data: this.valueList,           //Liste des valeurs
          backgroundColor: 'blue'
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: {
            callback: (val, index) => { //Rajout d'une fonction permettant le formatage des Dates de l'axis X
              return formatDate(this.dateList[index], 'd/M/YY', 'fr-FR'); 
            },
          }
        },
        y: {
          min: 0  //Set le minimum de l'axe Y à 0
        }
      },
      plugins: {
        legend: {
          position: 'top',    //Mets le titre en haut
        },
        title: {
          display: true,
          text: 'Historique'  //Titre
        },
        tooltip: {
          titleAlign: "center",
          callbacks: {
            title: (item) => {            //Ajout d'une fonction permettant la modification du titre du Tooltip avec le nom du produit
              let product = this.productList.find((produ) => produ.id == this.historyListTemp[item[0].parsed.x].tigID);
              return product?.name;
            },
            afterTitle: (item) => {       //Ajout d'une fonction permettant l'ajout de la catégorie après le titre
              let product = this.productList.find((produ) => produ.id == this.historyListTemp[item[0].parsed.x].tigID);
              return ProductCategory[product!.category][1].toString();
            },
            beforeLabel: (item) => {      //Ajout d'une fonction permettant l'affichage et le formatage de la date de vente, le prix de base et le montant de la promotion
              let product = this.productList.find((produ) => produ.id == this.historyListTemp[item.parsed.x].tigID);
              return ["Date de vente : " + formatDate(this.historyListTemp[item.parsed.x].date, 'MMM d, y, H:mm:ss', "fr-FR"),
                    "Prix  de base : " + product?.price + " €",
                    "Montant de la promotion : " + Math.round((100 - (this.historyListTemp[item.parsed.x].price * 100 / product!.price))) + " %"];
            },
            label: (item) => {            //Ajout d'une fonction permettant l'affichage et le formatage du prix total de la vente, de la quantité de la vente et du prix unitaire de vente
              let product = this.productList.find((produ) => produ.id == this.historyListTemp[item.parsed.x].tigID);
              return ["Prix total : " + (this.historyListTemp[item.parsed.x].price * this.historyListTemp[item.parsed.x].stock_change) + " €",
                    "Quantité de la vente : " + this.historyListTemp[item.parsed.x].stock_change + " " + product?.unit,
                    "Prix unitaire : " + this.historyListTemp[item.parsed.x].price + " €"];
            },
          }
        }
      },
    },
    });
  }

  //Fonction utilisée par la liste de Checkbox afin de récupérer les veleurs et recréer la Chart
  updateCheckBox(category : number) {
    console.log("checkbox");
    this.checkboxList[category] = !this.checkboxList[category];
    this.createChart();
  }

  //Fonction qui utilise les différentes filtres pour créer la liste d'element à afficher dans la Chart des ventes
  generateProductList() {
    this.historyListTemp = [];  //Reset de la liste

    let endDate = new Date();
    endDate.setDate((this.range.controls['end'].value!.getDate() + 1)); //Modification de la date rentrer afin de prendre le dernier jour dans la liste
    endDate.setHours(0, 0, 0, 0);

    for (let his of this.historyList) { //On parcourt la liste d'historique afin de créer la liste adéquate selon les filtres
      if (his.stock_change <= 0)  //Si l'historique n'est pas une vente, on passe
        continue;
      let product = this.productList.find((produ) => produ.id == his.tigID);
      if (his.date.valueOf() < this.range.controls['start'].value!.valueOf() || his.date.valueOf() > endDate.valueOf()) //Si l'historique n'est pas dans l'intervalle de temps demandé, on passe
      {
        continue;
      }
      if (Math.round((100 - (his.price * 100 / product!.price))) < this.sliderValues[0] || Math.round((100 - (his.price * 100 / product!.price))) > this.sliderValues[1]) //Si l'historique n'a pas le pourcentage de promotion demandé, on passe
      {
        continue;
      }
      if (this.checkboxList[product!.category] == false)  //Si la catégorie a été retiréz, on passe
      {
        continue;
      }
      this.historyListTemp.push(his); //Sinon on ajoute
    }
    this.dateList = [];   //Reset des listes de valeurs
    this.valueList = [];
    for (let elem of this.historyListTemp)
    {
      this.dateList.push(elem.date);                        //Ajout de la date afin d'afficher la liste dans l'axis X
      this.valueList.push(elem.stock_change * elem.price);  //Ajout de la valeur de la vente afin d'afficher la liste dans l'axis Y
    }
  }

  //Fonction renvoyant la valeur total des transactions de l'historique donnée
  getTotalSales() {
    let num = 0
    for (let elem of this.historyListTemp) {
      num += elem.stock_change * elem.price;
    }
    return num;
  }

  //Fonction renvoyant la valeur total des transaction de l'historique donnée
  getTotalProfit() {
    let num = 0
    for (let elem of this.historyListProfitTemp) {
      num += elem.stock_change * elem.price;
    }
    return num;
  }

  //Fonction qui utilise le filtrage sur la date pour créer la liste d'element à afficher dans la Chart chiffre d'affaire
  generateProductProfitList() {
    this.historyListProfitTemp = [];  //Reset de la liste d'element

    let endDate = new Date();
    endDate.setDate((this.rangeProfit.controls['end'].value!.getDate() + 1)); //Modification de la date rentrer afin de prendre le dernier jour dans la liste
    endDate.setHours(0, 0, 0, 0);

    for (let his of this.historyList) {
      let product = this.productList.find((produ) => produ.id == his.tigID);
      if (his.date.valueOf() < this.rangeProfit.controls['start'].value!.valueOf() || his.date.valueOf() > endDate.valueOf()) //Si l'historique n'est pas une vente, on passe
      {
        continue;
      }
      this.historyListProfitTemp.push(his);
    }
    this.dateProfitList = [];   //Reset des listes de valeurs
    this.valueProfitList = [];
    for (let elem of this.historyListProfitTemp)
    {
      this.dateProfitList.push(elem.date);                        //On ajout la date pour l'affichage de l'axis X
      this.valueProfitList.push(elem.stock_change * elem.price);  //On ajout le montant de la transaction pour l'affichage de l'axis Y
    }
  }

  //Création de la Chart des transactions
  createChartProfit(){
    if (this.rangeProfit.controls['end'].value == null) //Garde-fou si aucune valeur n'est rentréz
      return;
    var chartExist = Chart.getChart("myChartProfit"); //Récupération de la Chart
    if (chartExist != undefined)  //Destruction de la Chart si existante
      chartExist.destroy(); 

    this.generateProductProfitList(); //Génération de la liste de valeur à utiliser

    console.log("profit", this.dateProfitList, this.valueProfitList);

    let chart = new Chart("myChartProfit", {  type: 'line',
    data: {
      labels: this.dateProfitList,  //Ajout des valeurs de l'axis X
      datasets: [
        {
          label: "Historique des transactions", //Nom du label
          data: this.valueProfitList,           //Liste des valeurs pour l'axis Y
          backgroundColor: 'blue'
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: {
            callback: (val, index) => {
              return formatDate(this.dateProfitList[index], 'd/M/YY', 'fr-FR'); //Ajout d'un formatage pour les Dates de l'axis X
            },
          }
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Historique des transaction'  //Titre
        },
        tooltip: {
          titleAlign: "center",
          callbacks: {
            title: (item) => {          //Ajout d'une fonction permettant la modification du titre du Tooltip avec le nom du produit
              let product = this.productList.find((produ) => produ.id == this.historyListProfitTemp[item[0].parsed.x].tigID);
              return product?.name;
            },
            afterTitle: (item) => {     //Ajout d'une fonction permettant l'ajout de la catégorie après le titre
              let product = this.productList.find((produ) => produ.id == this.historyListProfitTemp[item[0].parsed.x].tigID);
              return ProductCategory[product!.category][1].toString();
            },
            beforeLabel: (item) => {    //Ajout d'une fonction permettant l'affichage et le formatage de la date de vente, le prix de base et le montant de la promotion
              let product = this.productList.find((produ) => produ.id == this.historyListProfitTemp[item.parsed.x].tigID);
              return ["Date d" + (this.historyListProfitTemp[item.parsed.x].stock_change <= 0 ? "'achat" : "e vente") + " : " + formatDate(this.historyListProfitTemp[item.parsed.x].date, 'MMM d, y, H:mm:ss', "fr-FR"),
                    "Prix  de base : " + product?.price + " €",
                    "Montant de la promotion : " + Math.round((100 - (this.historyListProfitTemp[item.parsed.x].price * 100 / product!.price))) + " %"];
            },
            label: (item) => {          //Ajout d'une fonction permettant l'affichage et le formatage du prix total de la vente, de la quantité de la vente et du prix unitaire de vente
              let product = this.productList.find((produ) => produ.id == this.historyListProfitTemp[item.parsed.x].tigID);
              return ["Prix total : " + (this.historyListProfitTemp[item.parsed.x].price * this.historyListProfitTemp[item.parsed.x].stock_change) + " €",
              "Quantité de l" + (this.historyListProfitTemp[item.parsed.x].stock_change <= 0 ? "'achat" : "a vente") + " : " + Math.abs(this.historyListProfitTemp[item.parsed.x].stock_change) + " " + product?.unit,
                    "Prix unitaire : " + this.historyListProfitTemp[item.parsed.x].price + " €",];
            },
          }
        }
      },
    },
    });
  }
}
