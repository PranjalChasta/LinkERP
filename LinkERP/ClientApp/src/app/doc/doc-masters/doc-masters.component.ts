import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doc-masters',
  templateUrl: './doc-masters.component.html',
  styleUrls: ['./doc-masters.component.css']
})
export class DocMastersComponent implements OnInit {
  Module: any;
  constructor() { }

  ngOnInit() {

    this.Module = 'DOC';
  }

}
