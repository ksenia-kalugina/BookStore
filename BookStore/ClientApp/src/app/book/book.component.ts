import { Component } from '@angular/core';
import * as XLSX from 'ts-xlsx';

@Component({

  selector: 'app-book-component',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {
  items= new Array();  
  arrayBuffer: any;
  file: File;
  incomingfile(event) {
    this.file = event.target.files[0];
    this.Upload();
  }
  Upload() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");      
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.items = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      //console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true })); 
    }
    fileReader.readAsArrayBuffer(this.file);
  }

  clear() {
    this.items = new Array();
  }
}
