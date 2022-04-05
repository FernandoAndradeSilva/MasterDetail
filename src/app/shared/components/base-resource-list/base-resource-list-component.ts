import {Directive, OnInit} from '@angular/core';

import { BaseResourceModel } from "../../models/base-resource.model";
import { BaseResoruceService } from "../../services/base-resoruce.service";

@Directive()
export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];

  constructor(private resourceService: BaseResoruceService<T>) {

  }

  ngOnInit(): void {
    this.resourceService.getAll().subscribe(
      resources => this.resources = resources.sort(
        (a,b) => Number(b.id) - Number(a.id)),
      () => alert('Erro ao carregar a lista!')
    )
  }

  deleteResource(resource: T) {

    const mustDelete = confirm('Deseja realmente excluir esse item?')

    if(mustDelete) {
      this.resourceService.delete(Number(resource.id)).subscribe(
        () => this.resources = this.resources.filter(element =>  element != resource),
        () => alert('Erro ao tentar excluir'))
    }


  }

}
