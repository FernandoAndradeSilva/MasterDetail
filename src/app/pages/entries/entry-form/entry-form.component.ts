import {Component, OnInit, AfterContentChecked} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

import {Entry} from "../shared/entry.model";
import {EntryService} from "../shared/entry.service";
import {switchMap} from "rxjs";

import * as toastr from "toastr";
import {Category} from "../../categories/shared/category.model";
import {CategoryService} from "../../categories/shared/category.service";

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})





export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string | undefined;
  pageTitle: string | undefined;
  serverErrorMessages: string[] | undefined;
  submittingForm: boolean = false;
  entry: Entry = new Entry();
  categories: Category[] = [];
  types: Array<any> = [];

  entryForm: FormGroup = this.formBuilder.group({
    id: [null],
    name: [null, [Validators.required, Validators.minLength(2)]],
    description: [null],
    type: ["expense" , [Validators.required]],
    amount: [null, [Validators.required]],
    date: [null , [Validators.required]],
    paid: [true , [Validators.required]],
    categoryId: [null , [Validators.required]]
  })

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  }
  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) {


  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.loadTypes();
    this.loadCategories();
    this.loadEntry();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if(this.currentAction === 'new') {
      this.createEntry();
    } else if(this.currentAction === 'edit') {
      this.updateEntry();
    }
  }

  loadTypes() {
      this.types = Object.entries(Entry.types).map(
        ([value,text]) => {
          return {
            text: text,
            value: value
          }
        }
      )
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }


  private loadEntry() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(Number(params.get('id'))))
      )
      .subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm?.patchValue(this.entry);
        },
        (error => alert('Ocorreu um erro no servidor. Tente mais tarde'))
      )
    }
  }

  private setPageTitle() {
    if (this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de Novo Lan??amento';
    } else {
      const entryName = this.entry.name || ''
      this.pageTitle = 'Editando Lan??amento: ' + entryName;
    }
  }

  createEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.create(entry)
      .subscribe(
        entry => this.actionsForSuccess(entry),
        error => this.actionsForError(error)
      )

  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.update(entry)
      .subscribe(
        entry => this.actionsForSuccess(entry),
        error => this.actionsForError(error)
      )

  }

  private actionsForSuccess(entry: Entry) {
    toastr.success("Solicita????o processada com sucesso!")
    this.router.navigateByUrl("entries" , {skipLocationChange: true}).then(
      () => this.router.navigate(['entries' , entry.id, "edit"])
    )
  }

  private actionsForError(error: any) {
    toastr.error("Ocorreu um erro ao processar a sua solicita????o!")
    this.submittingForm = false;

    if(error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).erros;
    } else {
      this.serverErrorMessages = ["Falha na comunica????o com o servidor. Tente mais tarde."]
    }

  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(
      categories =>  this.categories = categories
    );
  }
}


