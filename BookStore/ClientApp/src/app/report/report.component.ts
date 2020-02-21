import { Component } from '@angular/core';

@Component({
  selector: 'app-report-component',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
  
  items: AppleReportItem[];
  filesName: string[] ;

  constructor() {
    this.items = new Array();
    this.filesName = new Array();
  }

  fileChanged(e) {
    for (var i = 0; i < e.target.files.length; ++i) {      
      this.filesName[i] = e.target.files[i].name;
    }    
    this.viewDocument(e.target.files[0]);
    console.log(this.items.length);
  }


  text: string
  viewDocument(file:File) {
    
    var reportItems: string[] = new Array();
    var fileReader = new FileReader();
    fileReader.onload = (e) => {
      reportItems = fileReader.result.toString().split(/[\r\n]+/);
      var reportObjectItems: AppleReportItem[] = new Array();
      for (var i = 1; i < reportItems.length; ++i) {
        var property = reportItems[i].split('\t');
        var item: AppleReportItem = new AppleReportItem();
        item.provider = property[0];
        item.providerCountry = property[1];
        item.sku = property[2];
        item.developer = property[3];
        item.title = property[4];
        item.version = property[5];
        item.productTypeIdentifier = property[6];
        item.units = property[7];
        item.developerProceeds = property[8];
        item.beginDate = property[9];
        item.endDate = property[10];
        item.customerCurrency = property[11];
        item.countryCode = property[12];
        item.currencyOfProceeds = property[13];
        item.appleIdentifier = property[14];
        item.customerPrice = property[15];
        item.promoCode = property[16];
        item.parentIdentifier = property[17];
        item.subscription = property[18];
        item.period = property[19];
        item.category = property[20];
        item.cmb = property[21];
        item.device = property[22];
        item.supportedPlatforms = property[23];
        item.proceedsReason = property[24];
        item.preservedPricing = property[25];
        item.client = property[26];
        item.orderType = property[27];
        reportObjectItems[i - 1] = item;
      }
      this.items = reportObjectItems;
      console.log(this.items);
    }
    console.log(this.items);
    fileReader.readAsText(file);
    
  }

  makeReport(reportObjectItems) {
    var reportObjectItemsSorted: AppleReportItem[] = reportObjectItems.sort((n1, n2) => {
      if (n1.sku > n2.sku) {
        return 1;
      }
      if (n1.sku < n2.sku) {
        return -1;
      }
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
        var a1: number = +items[items.length - 1].units + (+reportObjectItemsSorted[i].units);
        items[items.length - 1].units = "" + a1;
      }
      else {
        items.push(reportObjectItemsSorted[i]);
      }
    }    
    this.items = items;
  }

  
}

class AppleReportItem {
  provider: string;
  providerCountry: string;
  sku: string;
  developer: string;
  title: string;
  version: string;
  productTypeIdentifier: string;
  units: string;
  developerProceeds: string;
  beginDate: string;
  endDate: string;
  customerCurrency: string;
  countryCode: string;
  currencyOfProceeds: string;
  appleIdentifier: string;
  customerPrice: string;
  promoCode: string;
  parentIdentifier: string;
  subscription: string;
  period: string;
  category: string;
  cmb: string;
  device: string;
  supportedPlatforms: string;
  proceedsReason: string;
  preservedPricing: string;
  client: string;
  orderType: string;

  error: string = "noMistake";
  errorMessage: string;
}
















//import { Component } from '@angular/core';

//@Component({
//  selector: 'app-report-component',
//  templateUrl: './report.component.html',
//  styleUrls: ['./report.component.css']
//})
//export class ReportComponent {

//  items: AppleReportItem[] = new Array();

//  fileChanged(e) {
//    this.viewDocument(e.target.files[0]);
//  }
//  viewDocument(file) {
//    var reportStringItems = new Array();
//    let fileReader = new FileReader();
//    fileReader.onload = (e) => {
//      reportStringItems = fileReader.result.toString().split(/[\r\n]+/);
//      var arrayObject: AppleReportItem[] = new Array(reportStringItems.length - 1);
//      for (var i = 1; i < reportStringItems.length - 1; ++i) {
//        var property = reportStringItems[i].split('\t');
//        var item1: AppleReportItem = new AppleReportItem();
//        item1.provider = property[0];
//        item1.providerCountry = property[1];
//        item1.sku = property[2];
//        item1.developer = property[3];
//        item1.title = property[4];
//        item1.version = property[5];
//        item1.productTypeIdentifier = property[6];
//        item1.units = property[7];
//        item1.developerProceeds = property[8];
//        item1.beginDate = property[9];
//        item1.endDate = property[10];
//        item1.customerCurrency = property[11];
//        item1.countryCode = property[12];
//        item1.currencyOfProceeds = property[13];
//        item1.appleIdentifier = property[14];
//        item1.customerPrice = property[15];
//        item1.promoCode = property[16];
//        item1.parentIdentifier = property[17];
//        item1.subscription = property[18];
//        item1.period = property[19];
//        item1.category = property[20];
//        item1.cmb = property[21];
//        item1.device = property[22];
//        item1.supportedPlatforms = property[23];
//        item1.proceedsReason = property[24];
//        item1.preservedPricing = property[25];
//        item1.client = property[26];
//        item1.orderType = property[27];
//        arrayObject[i - 1] = item1;
//      }
//      console.log(arrayObject[0]);
//      console.log(arrayObject[1]);
//      console.log(arrayObject[2]);
//      console.log(arrayObject[3]);
//      console.log(arrayObject[4]);
//      console.log(arrayObject[5]);
//      this.items = arrayObject;
//    }
//    fileReader.readAsText(file);

//  }
//}

//class AppleReportItem {
//  provider: string;
//  providerCountry: string;
//  sku: string;
//  developer: string;
//  title: string;
//  version: string;
//  productTypeIdentifier: string;
//  units: string;
//  developerProceeds: string;
//  beginDate: string;
//  endDate: string;
//  customerCurrency: string;
//  countryCode: string;
//  currencyOfProceeds: string;
//  appleIdentifier: string;
//  customerPrice: string;
//  promoCode: string;
//  parentIdentifier: string;
//  subscription: string;
//  period: string;
//  category: string;
//  cmb: string;
//  device: string;
//  supportedPlatforms: string;
//  proceedsReason: string;
//  preservedPricing: string;
//  client: string;
//  orderType: string;
//}
