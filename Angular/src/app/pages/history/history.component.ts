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
  
  productList!: Product[];
  historyList : HistoryModel[] = [];
  historyListTemp : HistoryModel[] = [];
  dateList : number[] = [];
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
        this.historyList = res;
        this.historyList.sort((a : HistoryModel, b : HistoryModel) => a.date.valueOf() - b.date.valueOf());
        for (let elem of this.historyList)
          this.dateList.push(elem.date.valueOf());
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

    let chart = new Chart("myChart", {  type: 'line',
    data: {// values on X-Axis
      // labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
      //          '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
      labels: [ formatDate(this.range.controls['start'].value!, 'd/M/YY', 'en-US'), formatDate(this.range.controls['end'].value!, 'd/M/YY', 'en-US')],
       datasets: [
        {
          label: "Historique",
          data: this.dateList,
          backgroundColor: 'blue'
        },
      ],
    },
    options: {
      responsive: true,
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
  }

  generateProductList() {
    this.productList
    this.historyListTemp = [];

    for (let his of this.historyList) {
      let product = this.productList.find((produ) => produ.id == his.tigID);
      if (his.date.valueOf() < this.range.controls['start'].value!.valueOf() || his.date.valueOf() > this.range.controls['end'].value!.valueOf())
        continue;
      if (product!.discount < this.sliderValues[0] || product!.discount > this.sliderValues[1])
        continue;
      if (this.checkboxList[product!.category] == false)
        continue;
      this.historyListTemp.push(his);
    }
  }
}
