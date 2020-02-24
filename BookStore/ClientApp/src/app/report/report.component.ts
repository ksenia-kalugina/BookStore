import { Component } from '@angular/core';

@Component({
  selector: 'app-report-component',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
  
  items: AppleReportItem[];
  filesName: string[];
  readyToDownload: boolean;

  constructor() {
    this.items = new Array();
    this.filesName = new Array();
    this.readyToDownload = false;
  }

  async fileChanged(e) {
    this.items = [];
    this.filesName = [];
    this.readyToDownload = false;
    for (var i = 0; i < e.target.files.length; ++i) {      
      this.filesName[i] = e.target.files[i].name;
      var items1 = await this.parseDocument(e.target.files[i]);
      var items2 = this.items;
      this.items = items1.concat(items2);
    }
    this.makeReport(this.items);
    this.downloadCSV()
  }
  
  async parseDocument(file: File): Promise<AppleReportItem[]> {
    return new Promise<AppleReportItem[]>( (resolve, reject) => {
      var reportItems: string[] = new Array();
      var fileReader = new FileReader();
      fileReader.onload = (e) => {
        reportItems = fileReader.result.toString().split(/[\r\n]+/);
        var reportObjectItems: AppleReportItem[] = new Array();
        for (var i = 1; i < reportItems.length; ++i) {
          var property = reportItems[i].split('\t');
          var item: AppleReportItem = new AppleReportItem();          
          item.sku = property[2];
          item.developer = property[3];
          item.title = property[4];
          item.units = +property[7];
          item.customerPrice = +property[15];         
          item.total = +(0.7 * item.units * item.customerPrice).toFixed(2);
          reportObjectItems[i - 1] = item;
        }        
        resolve(reportObjectItems);
      }
      fileReader.readAsText(file);      
    });     
  }

  makeReport(reportObjectItems: AppleReportItem[]) {
    var reportObjectItemsSorted: AppleReportItem[] = reportObjectItems.sort((n1, n2) => {
      if (n1.sku > n2.sku) { return 1;}
      if (n1.sku < n2.sku) { return -1;}
      return 0;
    });    
    var items: AppleReportItem[] = new Array();
    items.push(reportObjectItemsSorted[0]);
    for (var i = 1; i < reportObjectItemsSorted.length; i++) {
      if (items[items.length - 1].sku === reportObjectItemsSorted[i].sku) {
        if (items[items.length - 1].title !== reportObjectItemsSorted[i].title) {
          items[items.length - 1].error = "mistake";
          items[items.length - 1].errorMessage = "ошибка:разные названия, но одинаковые sku";
          items.push(reportObjectItemsSorted[i]);
          items[items.length - 1].error = "mistake";
          items[items.length - 1].errorMessage = "ошибка:разные названия, но одинаковые sku";
          continue;
        }
        if (items[items.length - 1].customerPrice !== reportObjectItemsSorted[i].customerPrice) {
          items[items.length - 1].error = "mistake";
          items[items.length - 1].errorMessage = "ошибка:разные цены, но одинаковые sku";
          items.push(reportObjectItemsSorted[i]);
          items[items.length - 1].error = "mistake";
          items[items.length - 1].errorMessage = "ошибка:разные цены, но одинаковые sku";
          continue;
        }
        items[items.length - 1].units = items[items.length - 1].units + reportObjectItemsSorted[i].units;
      }
      else {
        items.push(reportObjectItemsSorted[i]);
      }
    }
    this.items = items;
    this.readyToDownload = true;
  }  

  downloadCSV() {
    var items = this.items;
    var csv = "id;Title;Publisher;Price;Count;Total;\n";
    for (var i = 0; i < items.length; i++) {
      csv += items[i].sku + ";";
      csv += items[i].title + ";";
      csv += items[i].developer + ";";
      csv += items[i].customerPrice + ";";
      csv += items[i].units + ";";
      csv += items[i].total + ";";
      csv += "\n";
    }
    console.log(csv);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'report.csv';
    hiddenElement.click();
  }
}

class AppleReportItem {
  units: number;
  customerPrice: number;
  developer: string;
  title: string;
  sku: string;
  total: number;
  error: string = "noMistake";
  errorMessage: string;  
}
