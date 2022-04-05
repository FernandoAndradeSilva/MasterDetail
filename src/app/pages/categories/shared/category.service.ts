import { Injectable , Injector } from '@angular/core';
import {Category} from "./category.model";
import {BaseResoruceService} from "../../../shared/services/base-resoruce.service";

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseResoruceService<Category>{

  constructor(protected override injector: Injector) {
    super("api/categories", injector, Category.fromJson)
  }
}
