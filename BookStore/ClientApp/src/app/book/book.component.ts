import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from '@angular/ts-xlsx';
import { Book } from '../book';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-book-component',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})

export class BookComponent implements OnInit {
  booksExcel: Book[] = new Array();
  booksCSV: Book[] = new Array();
  booksFromBD: Book[] = new Array();  
  @ViewChild('excelBooks') excelBooks: ElementRef;
  @ViewChild('CSVBooks') CSVBooks: ElementRef;  
  http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  ngOnInit() {
    this.http.get<Book[]>('api/Book/Get').subscribe(result => {
      this.booksFromBD = result;
    }, error => console.error(error));
  }

  async changeBooksExcel(event) {
    if (event.target.files[0]) {
      this.booksExcel = await this.readFromExcelFile(event.target.files[0]);
    }        
  }

  readFromExcelFile(file:File): Promise<Book[]> {
    return new Promise<Book[]>((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        var arrayBuffer: any=fileReader.result;
        var data = new Uint8Array(arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) {
          arr[i] = String.fromCharCode(data[i]);
        }          
        var bstr = arr.join("");      
        var workbook = XLSX.read(bstr, { type: "binary" });
        var firstSheetName = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[firstSheetName];
        var stringItems: string[] = XLSX.utils.sheet_to_csv(worksheet, { FS: ";", RS: "\n"}).toString().split(/[\r\n]+/);        
        var books: Book[] = new Array();   
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
          books.push(book);         
        }        
        resolve(books);
      }
      fileReader.readAsArrayBuffer(file);
    });
  }

  exportBooks() {
    var books = this.booksFromBD;
    var textToCsv = "id;Title;Publisher;Price;Active;";
    for (var i = 0; i < books.length; i++) {
      textToCsv += "\n" + books[i].id + ";";
      textToCsv += books[i].title + ";";
      textToCsv += books[i].publisher + ";";
      textToCsv += books[i].price + ";";
      if (books[i].active) {
        textToCsv += 1 + ";";
      }
      else {
        textToCsv += 0 + ";";
      }
    }
    var hiddenElement = document.createElement('a');
    hiddenElement.href =  'data:text/csv;charset=utf-8,' + encodeURI(textToCsv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'books.csv';
    hiddenElement.click();
  }

  async changeBooksCSV(e) {
    this.booksCSV = await this.parseDocumentCSV(e.target.files[0]);
  }

  async parseDocumentCSV(file: File): Promise<Book[]> {
    return new Promise<Book[]>((resolve) => {
      var booksString: string[] = new Array();
      var fileReader = new FileReader();
      fileReader.onload = (e) => {
        booksString = fileReader.result.toString().split(/[\r\n]+/);
        var booksObject: Book[] = new Array();
        for (var i = 1; i < booksString.length; ++i) {
          var bookProperties = booksString[i].split(';');
          if (!bookProperties.length) {
            break;
          }
          var book: Book = new Book();
          book.id = bookProperties[0];
          book.title = bookProperties[1];
          book.publisher = bookProperties[2];
          book.price = +bookProperties[3];
          book.active = Boolean(JSON.parse(bookProperties[4]));
          booksObject[i - 1] = book;
        }
        resolve(booksObject);
      }
      fileReader.readAsText(file);
    });
  }
  
  clearExcelBooks() {
    this.booksExcel = new Array();
    this.excelBooks.nativeElement.value = null;
  }
    
  async addBooksToBD(books: Book[]) {
    this.http.post('api/Book/Post', books).toPromise().then(() => {
      this.http.get<Book[]>('api/Book/Get').subscribe(result => {
        this.booksFromBD = result;
      }, error => console.error(error));
    });
    this.clearCSVBooks();
    this.clearExcelBooks();
  } 
  
  clearCSVBooks() {
    this.booksCSV = new Array();
    this.CSVBooks.nativeElement.value = null;
  }
}
