import { Component } from '@angular/core';
import { Book } from '../book';
import { HttpClient } from '@angular/common/http';
import { AppleReportItem } from '../apple-report-item';

@Component({
  selector: 'app-report-component',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
  
  appleReport: AppleReportItem[];
  reportFilesName: string[];
  readyToDownload: boolean;
  http: HttpClient;
    
  constructor(http: HttpClient) {
    this.appleReport = new Array();
    this.reportFilesName = new Array();
    this.readyToDownload = false;
    this.http = http;
  }

  async fileChanged(e) {
    this.appleReport = [];
    this.reportFilesName = [];
    this.readyToDownload = false;
    for (var i = 0; i < e.target.files.length; ++i) {      
      this.reportFilesName[i] = e.target.files[i].name;
      var items1 = await this.parseDocument(e.target.files[i]);
      var items2 = this.appleReport;
      this.appleReport = items1.concat(items2);
    }
    this.makeReport(this.appleReport);
    this.downloadCSV()
    this.addToBD(this.appleReport);
  }
  
  async parseDocument(file: File): Promise<AppleReportItem[]> {
    return new Promise<AppleReportItem[]>((resolve) => {
      var reportString: string[] = new Array();
      var fileReader = new FileReader();
      fileReader.onload = (e) => {
        reportString = fileReader.result.toString().split(/[\r\n]+/);
        var reportObject: AppleReportItem[] = new Array();
        for (var i = 1; i < reportString.length; ++i) {
          var property = reportString[i].split('\t');
          var item: AppleReportItem = new AppleReportItem();          
          item.sku = property[2];
          item.developer = property[3];
          item.title = property[4];
          item.units = +property[7];
          item.customerPrice = +property[15];         
          item.total = +(0.7 * item.units * item.customerPrice).toFixed(2);
          reportObject[i - 1] = item;
        }        
        resolve(reportObject);
      }
      fileReader.readAsText(file);      
    });     
  }

  makeReport(reportF: AppleReportItem[]) {
    var reportSorted: AppleReportItem[] = reportF.sort((n1, n2) => {
      if (n1.sku > n2.sku) { return 1;}
      if (n1.sku < n2.sku) { return -1;}
      return 0;
    });    
    var report: AppleReportItem[] = new Array();
    report.push(reportSorted[0]);
    var error: string = "mistake";
    for (var i = 1; i < reportSorted.length; i++) {
      if (report[report.length - 1].sku === reportSorted[i].sku) {
        if (report[report.length - 1].title !== reportSorted[i].title) {
          var errorTitleMessage: string = "ошибка:разные названия, но одинаковые sku";
          report[report.length - 1].error = error;
          report[report.length - 1].errorMessage = errorTitleMessage;
          report.push(reportSorted[i]);
          report[report.length - 1].error = error;
          report[report.length - 1].errorMessage = errorTitleMessage;
          continue;
        }
        if (report[report.length - 1].customerPrice !== reportSorted[i].customerPrice) {
          var errorPriceMessage: string = "ошибка:разные цены, но одинаковые sku";
          report[report.length - 1].error = error;
          report[report.length - 1].errorMessage = errorPriceMessage;
          report.push(reportSorted[i]);
          report[report.length - 1].error = error;
          report[report.length - 1].errorMessage = errorPriceMessage;
          continue;
        }
        report[report.length - 1].units = report[report.length - 1].units + reportSorted[i].units;
      }
      else {
        report.push(reportSorted[i]);
      }
    }
    this.appleReport = report;
    this.readyToDownload = true;
  }  

  downloadCSV() {
    var report = this.appleReport;
    var textToCSV = "id;Title;Publisher;Price;Count;Total;\n";
    for (var i = 0; i < report.length; i++) {
      textToCSV += report[i].sku + ";";
      textToCSV += report[i].title + ";";
      textToCSV += report[i].developer + ";";
      textToCSV += report[i].customerPrice + ";";
      textToCSV += report[i].units + ";";
      textToCSV += report[i].total + ";";
      textToCSV += "\n";
    }
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(textToCSV);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'report.csv';
    hiddenElement.click();
  }

  addToBD(report: AppleReportItem[]) {
    var books: Book[] = new Array();
    for (var i = 0; i < report.length; i++) {
      var book: Book = new Book();
      book.id = report[i].sku;
      book.title = report[i].title;
      book.publisher = report[i].developer;
      book.price = report[i].customerPrice;
      book.active = true;
      books.push(book);
    }
    this.http.post('api/Book/Post', books).subscribe({
      error: error => console.error('There was an error!', error)
    });
  }
}
