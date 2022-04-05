import { Component, OnInit, Input } from '@angular/core';

interface BreadCumbItem {
  text?: string,
  link?: string
}

@Component({
  selector: 'app-bread-cumb',
  templateUrl: './bread-cumb.component.html',
  styleUrls: ['./bread-cumb.component.css']
})
export class BreadCumbComponent implements OnInit {

  @Input() items: Array<BreadCumbItem> = [];


  constructor() { }

  ngOnInit(): void {
  }

  isTheLastItem(item: BreadCumbItem): boolean {
    const index = this.items.indexOf(item);
    return index+1 == this.items.length;
  }
}
