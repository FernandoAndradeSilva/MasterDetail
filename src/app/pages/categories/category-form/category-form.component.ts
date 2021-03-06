import {Component, OnInit, AfterContentChecked} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

import {Category} from "../shared/category.model";
import {CategoryService} from "../shared/category.service";
import {switchMap} from "rxjs";

import * as toastr from "toastr";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string | undefined;
  pageTitle: string | undefined;
  serverErrorMessages: string[] | undefined;
  submittingForm: boolean = false;
  category: Category = new Category();

  categoryForm: FormGroup = this.formBuilder.group({
    id: [null],
    name: [null, [Validators.required, Validators.minLength(2)]],
    description: [null]
  })

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if(this.currentAction === 'new') {
      this.createCategory();
    } else if(this.currentAction === 'edit') {
      this.updateCategory();
    }


  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }


  private loadCategory() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(Number(params.get('id'))))
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm?.patchValue(this.category);
        },
        (error => alert('Ocorreu um erro no servidor. Tente mais tarde'))
      )
    }
  }

  private setPageTitle() {
    if (this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de Nova Categoria';
    } else {
      const categoryName = this.category.name || ''
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }

  createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsForError(error)
      )

  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsForError(error)
      )

  }

  private actionsForSuccess(category: Category) {
    toastr.success("Solicita????o processada com sucesso!")
    this.router.navigateByUrl("categories" , {skipLocationChange: true}).then(
      () => this.router.navigate(['categories' , category.id, "edit"])
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
}
