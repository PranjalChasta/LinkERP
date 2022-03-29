import { Component, OnInit } from '@angular/core';
import { TableDataService } from '../services/table-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LBSSYSTableData } from 'src/app/models/sys/lbs-sys-table-data'; 
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
@Component({
  selector: 'app-table-generic',
  templateUrl: './table-generic.component.html',
  styleUrls: ['./table-generic.component.css']
})
export class TableGenericComponent implements OnInit {
  Module:any;
  constructor( 
  ) { }

  ngOnInit() {
    
     this.Module="SYS";
  }
  
}
