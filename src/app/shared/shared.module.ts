import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { BreadCumbComponent } from './components/bread-cumb/bread-cumb.component';
import { RouterModule } from "@angular/router";
import { PageHeaderComponent } from './components/page-header/page-header.component';
import {FormFieldErrorComponent} from "./components/form-field-error/form-field-error.component";
import { ServerErrorMessagesComponent } from './components/server-error-messages/server-error-messages.component';



@NgModule({
  declarations: [
    BreadCumbComponent,
    PageHeaderComponent,
    FormFieldErrorComponent,
    ServerErrorMessagesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],

  exports: [
    // shared modules
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PageHeaderComponent,
    FormFieldErrorComponent,
    ServerErrorMessagesComponent,

    // shared components
    BreadCumbComponent
  ]

})
export class SharedModule { }
