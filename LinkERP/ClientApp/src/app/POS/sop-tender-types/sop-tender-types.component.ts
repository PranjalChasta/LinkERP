import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sop-tender-types',
  templateUrl: './sop-tender-types.component.html',
  styleUrls: ['./sop-tender-types.component.css']
})
export class SopTenderTypesComponent implements OnInit {

  Module:any;
  constructor() { }

  ngOnInit() {
    this.Module="POS";
  }

}
