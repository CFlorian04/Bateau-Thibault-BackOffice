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
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  readonly ProductCategoryList = [0, 1, 2];
  readonly ProductCategory = ProductCategory;
  readonly TodayDate = new Date();
  
  dateList : Date[] = [];
  valueList : number[] = [];

  productList!: Product[];
  historyList : HistoryModel[] = [
    {
      tigID : 1,
      stock_change : 21,
      price : 1,
      date : new Date('2023-10-21')
    },
    {
      tigID : 2,
      stock_change : 10,
      price : 2,
      date : new Date('2023-10-22')
    },
    {
      tigID : 3,
      stock_change : 50,
      price : 3,
      date : new Date('2023-10-23')
    },
    {
      tigID : 4,
      stock_change : 24,
      price : 4,
      date : new Date('2023-10-24')
    },
    {
      tigID : 5,
      stock_change : 15,
      price : 5,
      date : new Date('2023-10-25')
    },
  ];
  historyListTemp : HistoryModel[] = [];
  //dateList : Date[] = [];
  checkboxList : boolean[] = [true, true, true];
  sliderValues = [0, 100];

  constructor(private connectionService : ConnectionHelperService){}

  ngOnInit() {
    this.connectionService.getDataFromServer<Product[]>(HttpListUrl.InfoProducts).subscribe((res: Product[]) => {
      // this.productsService.getProductsFromJson().subscribe((res: Product[]) => {
        console.log(res);
        this.productList = res;
      },
        (err) => {
          alert('Failed loading JSON data');
        });
    this.range.controls['end'].valueChanges.subscribe(value => {
      this.createChart();
    });
    this.getHistoric();
  }

  getHistoric() {
    this.connectionService.getDataFromServer<HistoryModel[]>(HttpListUrl.ShowHistory).subscribe((res: HistoryModel[]) => {
      // this.productsService.getProductsFromJson().subscribe((res: Product[]) => {
        console.log(res);
        //this.historyList = res; //TODO uncomment
        this.historyList.sort((a : HistoryModel, b : HistoryModel) => a.date.valueOf() - b.date.valueOf());
      },
      (err) => {
          alert('Failed loading JSON data');
        }
      );
  }
  
  formatLabel(value: number): string {
    return `${value}%`;
  }

  sliderChange(value : any) {
    console.log(value.target.value);
    console.log(value.target.title);
    this.sliderValues[value.target.title == "start" ? 0 : 1] = value.target.value;
    this.createChart();
  }

  createChart(){
    var chartExist = Chart.getChart("myChart"); // <canvas> id
    if (chartExist != undefined)  
      chartExist.destroy(); 

    this.generateProductList();
    console.log(new Date('2023-10-25'));
    console.log("historyTemp list :" + this.historyListTemp);


    let chart = new Chart("myChart", {  type: 'line',
    data: {// values on X-Axis
      // labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
      //          '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
      //labels: [ formatDate(this.range.controls['start'].value!, 'd/M/YY', 'fr-FR'), formatDate(this.range.controls['end'].value!, 'd/M/YY', 'fr-FR')],
      labels: this.dateList,
      datasets: [
        {
          label: "Historique",
          data: this.valueList,
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
              return formatDate(this.dateList[index], 'd/M/YY', 'fr-FR');
            },
          }
        },
        y: {
          min: 0
        }
      //   y: [{
      //     display: true,
      //     ticks: {
      //         suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
      //         // OR //
      //         beginAtZero: true   // minimum value will be 0.
      //     }
      // }]
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Line Chart'
        },
        tooltip: {
          titleAlign: "center",
          callbacks: {
            title: (item) => {
              let product = this.productList.find((produ) => produ.id == this.historyListTemp[item[0].parsed.x].tigID);
              return product?.name;
            },
            afterTitle: (item) => {
              let product = this.productList.find((produ) => produ.id == this.historyListTemp[item[0].parsed.x].tigID);
              return ProductCategory[product!.category][1].toString();
            },
            beforeBody: (item) => {
              let product = this.productList.find((produ) => produ.id == this.historyListTemp[item[0].parsed.x].tigID);
              return "Prix  de base : " + product?.price;
              // return "Date de vente : " + formatDate(this.historyListTemp[item[0].parsed.x].date, 'MMM d, y, H:mm:ss', "fr-FR");
            },
            beforeLabel: (item) => {
              let product = this.productList.find((produ) => produ.id == this.historyListTemp[item.parsed.x].tigID);
              return "Montant de la promotion : " + Math.round((100 - (this.historyListTemp[item.parsed.x].price * 100 / product!.price))) + " %";
            },
            label: (item) => {
              let product = this.productList.find((produ) => produ.id == this.historyListTemp[item.parsed.x].tigID);
              return "Quantité de la vente : " + this.historyListTemp[item.parsed.x].stock_change + " " + product?.unit;
            },
            afterLabel: (item) => {
              //let product = this.productList.find((produ) => produ.id == this.historyListTemp[item.parsed.x].tigID);
              return "Prix unitaire : " + this.historyListTemp[item.parsed.x].price + " €";
            },
            afterBody: (item) => {
              //let product = this.productList.find((produ) => produ.id == this.historyListTemp[item.parsed.x].tigID);
              return "Prix total : " + (this.historyListTemp[item[0].parsed.x].price * this.historyListTemp[item[0].parsed.x].stock_change) + " €";
            },
          }
        }
      },
    },
    });
  }

  updateCheckBox(category : number) {
    console.log("checkbox");
    this.checkboxList[category] = !this.checkboxList[category];
    this.createChart();
  }

  generateProductList() {
    this.historyListTemp = [];

    for (let his of this.historyList) {
      let product = this.productList.find((produ) => produ.id == his.tigID);
      if (his.date.valueOf() < this.range.controls['start'].value!.valueOf() || his.date.valueOf() > this.range.controls['end'].value!.valueOf())
      {
        continue;
      }
      if (Math.round((100 - (his.price * 100 / product!.price))) < this.sliderValues[0] || Math.round((100 - (his.price * 100 / product!.price))) > this.sliderValues[1])
      {
        continue;
      }
      if (this.checkboxList[product!.category] == false)
      {
        continue;
      }
      this.historyListTemp.push(his);
    }
    this.dateList = [];
    this.valueList = [];
    for (let elem of this.historyListTemp)
    {
      //console.log("add element ", elem.date);
      this.dateList.push(elem.date);//formatDate(elem.date, 'd/M/YY', 'fr-FR'));
      this.valueList.push(elem.stock_change);
    }
  }

  getTotalSales() {
    let num = 0
    for (let elem of this.historyListTemp) {
      num += elem.stock_change * elem.price;
    }
    return num;
  }
}
