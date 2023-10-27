import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HistoryModel } from 'src/app/core/interfaces/history';
import { ConnectionHelperService, HttpListUrl } from 'src/app/core/services/connection-helper.service';
import { Chart } from 'chart.js/auto';
import { formatDate } from '@angular/common';
import { Product, ProductCategory } from 'src/app/core/interfaces/product';

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
  
  dateList : string[] = [];
  valueList : number[] = [];

  productList!: Product[];
  historyList : HistoryModel[] = [
    {
      tigID : 1,
      stock_change : 21,
      price : 10,
      date : new Date('2023-10-21')
    },
    {
      tigID : 2,
      stock_change : 22,
      price : 10,
      date : new Date('2023-10-22')
    },
    {
      tigID : 3,
      stock_change : 23,
      price : 10,
      date : new Date('2023-10-23')
    },
    {
      tigID : 4,
      stock_change : 24,
      price : 10,
      date : new Date('2023-10-24')
    },
    {
      tigID : 5,
      stock_change : 25,
      price : 10,
      date : new Date('2023-10-25')
    },
  ];
  historyListTemp : HistoryModel[] = [];
  //dateList : Date[] = [];
  checkboxList : boolean[] = [true, true, true];
  sliderValues = [0, 0];

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
      //labels: [ formatDate(this.range.controls['start'].value!, 'd/M/YY', 'en-US'), formatDate(this.range.controls['end'].value!, 'd/M/YY', 'en-US')],
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
      // scales: {
      //   x: {
      //     ticks: {
      //       callback: function(val, index) {
      //         // Hide every 2nd tick label
      //         return val;
      //         // return index % 2 === 0 ? this.getLabelForValue(val) : '';
      //       },
      //       // callback: (value, index, ticks) => {
              
      //       //   return ticks[index].;
      //       //   //console.log(value);
      //       //   //return formatDate(value, 'd/M/YY', 'en-US');
      //       // }
      //     }
      //   }
      // },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Line Chart'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              console.log(context);
              return context.formattedValue;
            }
          }
        }
      },
    },
    });
  }

  updateCheckBox(category : any) {
    this.checkboxList[category] = !this.checkboxList[category];
    this.createChart();
  }

  generateProductList() {
    this.productList
    this.historyListTemp = [];

    for (let his of this.historyList) {
      let product = this.productList.find((produ) => produ.id == his.tigID);
      if (his.date.valueOf() < this.range.controls['start'].value!.valueOf() || his.date.valueOf() > this.range.controls['end'].value!.valueOf())
      {
        console.log("Pas dans les dates");
        console.log(his.date , this.range.controls['end'].value!);
        continue;
      }
      if (product!.discount < this.sliderValues[0] || product!.discount > this.sliderValues[1])
      {
        console.log("Pas dans les promo");
        continue;
      }
      if (this.checkboxList[product!.category] == false)
      {
        console.log("Pas dans les categorie");
        continue;
      }
      console.log("Ajout " + his);
      this.historyListTemp.push(his);
    }
    this.dateList = [];
    this.valueList = [];
    for (let elem of this.historyListTemp)
    {
      //console.log("add element ", elem.date);
      this.dateList.push(formatDate(elem.date, 'd/M/YY', 'en-US'));
      this.valueList.push(elem.stock_change);
    }
  }
}
