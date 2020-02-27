import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
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
  itemsCSV: Book[] = new Array();
  itemsFromBD: Book[] = new Array();
  arrayBuffer: any;
  file: File;
  http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    http.get<Book[]>('api/Book/Get').subscribe(result => {
      this.itemsFromBD = result;
    }, error => console.error(error));
  }  

  async changeBooksExcel(event) {
    if (event.target.files[0]) {
      this.file = event.target.files[0];
      this.items = await this.readFromExcelFile();
    }        
  }

  readFromExcelFile(): Promise<Book[]> {
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
        var stringItems: string[] = XLSX.utils.sheet_to_csv(worksheet, { FS: ";", RS: "\n"}).toString().split(/[\r\n]+/);        
        var itemsBook: Book[] = new Array();   
        for(var i = 1; i < stringItems.length-1; i++) {
          var property = stringItems[i].split(';');          
          var book: Book = new Book();          
          book.id = property[0];
          book.title = property[1];
          book.publisher = property[2];           
          book.price = +property[3];
          if (property[4] == "1") {
            book.active = true;
          }
          else {
            book.active = false;
          }
          itemsBook.push(book);         
        }        
        resolve(itemsBook);
      }
        fileReader.readAsArrayBuffer(this.file);
    });
  }

  exportBooks() {
    var items = this.itemsFromBD;
    var csv = "id;Title;Publisher;Price;Active;";
    for (var i = 0; i < items.length; i++) {
      csv += "\n"+items[i].id + ";";
      csv += items[i].title + ";";
      csv += items[i].publisher + ";";
      csv += items[i].price + ";";
      if (items[i].active) {
        csv += 1 + ";";
      }
      else {
        csv += 0 + ";";
      }
    }
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'books.csv';
    hiddenElement.click();
  }

  async changeBooksCSV(e) {
    this.itemsCSV = await this.parseDocumentCSV(e.target.files[0]);
  }

  async parseDocumentCSV(file: File): Promise<Book[]> {
    return new Promise<Book[]>((resolve, reject) => {
      var booksString: string[] = new Array();
      var fileReader = new FileReader();
      fileReader.onload = (e) => {
        booksString = fileReader.result.toString().split(/[\r\n]+/);
        var booksObject: Book[] = new Array();
        for (var i = 1; i < booksString.length; ++i) {
          var bookProperty = booksString[i].split(';');
          if (!bookProperty.length) {
            break;
          }
          var item: Book = new Book();
          item.id = bookProperty[0];
          item.title = bookProperty[1];
          item.publisher =bookProperty[2];
          item.price = +bookProperty[3];
          item.active = Boolean(JSON.parse(bookProperty[4]));
          console.log(Boolean(JSON.parse(bookProperty[4])));
          booksObject[i - 1] = item;
        }
        resolve(booksObject);
      }
      fileReader.readAsText(file);
    });
  }

  @ViewChild('excelBooks') excelBooks: ElementRef;
  clearExcelBooks() {
    this.items = new Array();
    this.excelBooks.nativeElement.value = null;
  }
    
  addBooksToBD(books: Book[]) {
    this.http.post('api/Book/Post', books).subscribe({
      error: error => console.error('There was an error!', error)
    });

    this.http.get<Book[]>('api/Book/Get').subscribe(result => {
      this.itemsFromBD = result;
    }, error => console.error(error));
    this.clearCSVBooks();
    this.clearExcelBooks();
  }
  @ViewChild('CSVBooks') CSVBooks: ElementRef;
  clearCSVBooks() {
    this.itemsCSV = new Array();
    this.CSVBooks.nativeElement.value = null;
  }
}
