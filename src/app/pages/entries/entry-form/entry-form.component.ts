import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";

import {BaseResourceFormComponent} from "../../../shared/components/base-resource-form/base-resource-form.component";

import {Entry} from "../shared/entry.model";
import {EntryService} from "../shared/entry.service";

import {Category} from "../../categories/shared/category.model";
import {CategoryService} from "../../categories/shared/category.service";

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})

export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {

  categories: Array<Category> = [];
  types: Array<any> = [];

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  }

  constructor(
    protected entryService: EntryService,
    protected categoryService: CategoryService,
    protected override injector: Injector
  ) {

    super(injector, new Entry(), entryService, Entry.fromJson)
    this.buildResourceForm();
  }

  override ngOnInit(): void {
    this.loadCategories();
    this.loadTypes();
    super.ngOnInit()
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );
  }

  loadTypes() {
    this.types = Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ["expense", [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]],
    })
  }

  protected override creationPageTitle(): string {
    return "Cadastro de Novo Lançamento";
  }

  protected override editionPageTitle(): string {
    const entryName = this.resource.name || "";
    return "Editando Lançamento: " + entryName;
  }

}


