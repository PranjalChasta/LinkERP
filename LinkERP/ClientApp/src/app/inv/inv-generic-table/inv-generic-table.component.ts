import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inv-generic-table',
  templateUrl: './inv-generic-table.component.html',
  styleUrls: ['./inv-generic-table.component.css']
})
export class InvGenericTableComponent implements OnInit {

  Module:any;
  constructor( 
  ) { }

  ngOnInit() {
     this.Module="INV";
  }
}
