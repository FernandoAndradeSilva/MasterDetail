import { Injectable } from '@angular/core';
import {HttpClient , HttpHeaders} from "@angular/common/http";

import {flatMap, Observable, throwError} from "rxjs";
import {map, catchError, mergeMap} from "rxjs";

import {Entry} from "./entry.model";
import {CategoryService} from "../../categories/shared/category.service";

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = "api/entries";
  constructor(private http: HttpClient,
              private categoryService: CategoryService) {
  }


  getAll(): Observable<Entry[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntradas)
    )
  }

  getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    )
  }

  create(entry: Entry): Observable<Entry> {

    return this.categoryService.getById(Number(entry.categoryId)).pipe(
      mergeMap(category => {
        entry.category = category;

        return this.http.post(this.apiPath, entry).pipe(
          catchError(this.handleError),
          map(this.jsonDataToEntry)
        )
      })
    )



  }

  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`;

    return this.categoryService.getById(Number(entry.categoryId)).pipe(
      mergeMap(category => {
        entry.category = category;

        return this.http.put(url , entry).pipe(
          catchError(this.handleError),
          map(() => entry)
        )

      })
    )



  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )

  }

  private jsonDataToEntradas(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach(element => {
      entries.push(Object.assign(new Entry , element));
    })
    return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry , jsonData);
  }

  private handleError(error: any) : Observable<any> {
    console.log("Erro na requisi????ao => ", error);
    return throwError(error);
  }


}
