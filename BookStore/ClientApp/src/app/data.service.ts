import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from './book';

@Injectable()
export class DataService {

  private url = "/api/books";

  constructor(private http: HttpClient) {
  }

  getBooks() {
    //console.log(this.http.get(this.url));
    return this.http.get(this.url);
  }  
}
