import {BaseResourceModel} from "../models/base-resource.model";
import {HttpClient } from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {map, catchError} from "rxjs";
import { Injector } from "@angular/core";


export abstract class BaseResoruceService<T extends BaseResourceModel> {

  protected http: HttpClient;

  constructor(protected apiPath: string,
              protected injector: Injector,
              protected jsonDataToResorceFn: (jsonData: any) => T
  ) {
    this.http = injector.get(HttpClient);
  }


  getAll(): Observable<T[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResources.bind(this))
    )
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource.bind(this))
    )
  }

  create(resource: T): Observable<T> {
    return this.http.post(this.apiPath, resource).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource.bind(this))
    )
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;
    return this.http.put(url , resource).pipe(
      catchError(this.handleError),
      map(() => resource)
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )

  }

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(
      element => resources.push(this.jsonDataToResorceFn(element))
    )
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResorceFn(jsonData);
  }

  protected handleError(error: any) : Observable<any> {
    console.log("Erro na requisiççao => ", error);
    return throwError(error);
  }

}