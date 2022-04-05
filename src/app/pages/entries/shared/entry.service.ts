import { Injectable , Injector } from '@angular/core';
import { Entry } from "./entry.model";
import { CategoryService } from "../../categories/shared/category.service";
import { BaseResoruceService } from "../../../shared/services/base-resoruce.service";
import {map, mergeMap, Observable} from "rxjs";

import * as moment from "moment";


@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResoruceService<Entry> {

  constructor(protected override injector: Injector,
              protected categoryService: CategoryService) {
    super("api/entries" , injector , Entry.fromJson)

  }

  override create(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry , super.create.bind(this));
  }

  override update(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry , super.update.bind(this));
  }

  getByMonthAndYear(month: number, year: number): Observable<Entry[]> {
    return this.getAll().pipe(
      map((entries: Entry[]) => this.filterByMonthAndYear(entries, month , year))
    )
  }
  private setCategoryAndSendToServer(entry: Entry, sendFn: any) : Observable<Entry> {
    // @ts-ignore
    return this.categoryService.getById(Number(entry.categoryId)).pipe(
      mergeMap(category => {
        entry.category = category;
        return sendFn(entry)
      }),

    );
  }


  private filterByMonthAndYear(entries: Entry[], month: number, year: number) {
      return entries.filter((entry:any) => {
        const entryDate = moment(entry.date , "DD/MM/YYYY");
        const montMatches = entryDate.month() + 1 == month;
        const yearMatches = entryDate.year() == year;

        if(montMatches && yearMatches) {
          return entry;
        }

      })
  }
}
