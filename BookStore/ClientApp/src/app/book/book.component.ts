import { Component, Inject } from '@angular/core';
import * as XLSX from 'ts-xlsx';
import { Book } from '../book';
import { HttpClient } from '@angular/common/http';

@Component({

  selector: 'app-book-component',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'] 
})
export class BookComponent {
  items: Book[] = new Array();
  itemsFromBD: Book[] = new Array();
  arrayBuffer: any;
  file: File;
  
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<Book[]>(/*baseUrl +*/ 'api/Book/Get').subscribe(result => {
      this.itemsFromBD = result;
    }, error => console.error(error));


  }  

  async changeBooks(event) {
    this.file = event.target.files[0];
    this.items = await this.readInformationFromFile();    
  }

  readInformationFromFile(): Promise<Book[]> {
    return new Promise<Book[]>((resolve, reject) => {
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
        var items = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        var itemsBook: Book[] = new Array();
        for (var i = 0; i < items.length; i++) {
          var book: Book = new Book();
          book.id = items[i].SKU;
          book.title = items[i].Title;
          book.publisher = items[i].Publisher;
          book.price = items[i].Rubles;
          book.active = items[i].Active;
          itemsBook.push(book);
        }            
        resolve(itemsBook);
      }
        fileReader.readAsArrayBuffer(this.file);
    });
  }

  clear() {
    this.items = new Array();
  }
}
