import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TableDataService } from '../services/table-data.service';
@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent implements OnInit {
  Mode: any = 'List';
  Submitted: any = false;
  TableDataForm:FormGroup;
  CompanyId = localStorage.getItem('CompanyID');
  AgLoad: boolean = false;
  BindAllTableData:any;
  BindTable:any;
  ColumnDefs;
  RowData: any;
  constructor(
    private tableDataService:TableDataService,
    private TableDataFB:FormBuilder
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Mode = "List";
    this.ColumnDefs = [
      { headerName: 'Data Code', field: 'dataCode: ', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Data Name', field: 'dataName: ', sortable: true, filter: true, checkboxSelection: false },
      //{ headerName: 'Bin Name', field: 'binName', sortable: true, filter: true, checkboxSelection: false },
      //{ headerName: 'Organisation', field: 'companyName', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleted', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false },
      { headerName: '', field: 'Delete', cellRenderer: this.CustomDeleteIconFunc, type: 'Action', hide: false }
    ];
    this.BindAllTableDatas();
    //this.BindTables();
    this.TableDataForm = this.TableDataFB.group({
      ID: [''],
      DataCode: [''],
      DataName: ['']
    });
  }
  onTableChange(event) {
    console.log(event);
    this.BindTableDataByTableID(event)
}
      BindTableDataByTableID(ID){
        this.tableDataService.getTableDataByTableID(ID).subscribe((resp: any) => {
         console.log(resp.data);
         this.RowData = resp.data.tabledata;
         this.AgLoad = true;
          /* this.TableDataForm.patchValue({
            ID: lBSSYSTableData.id,
            //Organisation: lBSSYSDocumentTemplates.companyID,
            //WareHouseName: lBSSYSTableData.wareHouseID,
            DataCode: lBSSYSTableData.dataCode,
            DataName: lBSSYSTableData.dataName
          });
          this.Mode = 'Edit'; */ 
        }, (error) => {
          console.error('Problem with the sevice. Please try later : ' + error);
        });
      }
  BindAllTableDatas(){
    
    this.tableDataService.getAllTableData().subscribe((resp: any) => {
      
      this.BindAllTableData = resp.data.tabledata;

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  // BindTables() {
  //   this.tableDataService.getAllTables().subscribe((resp: any) => {
  //     this.BindTable = resp.data.tables;
  //    // this.RowData = resp.data.tables;
  //    // this.AgLoad = true;
  //     //this.Loading = false;
  //   }, (error) => {
  //     console.error('Problem with the sevice. Please try later : ' + error);
  //   });
  // }
 /* FOR Aggird Start */
 OnActionClick(event: any) {
  var colId = event.column.getId();
  if (colId == 'Edit') {
    //this.Edit(event.data.id)
  } else if (colId == 'Delete') {
    //this.onDeleteChecked(event.data.id)
  }
}
CustomEditIconFunc(params): string {
  let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
  return cellContent
}
CustomDeleteIconFunc(params): string {
  let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
  return cellContent
}
/* FOR Aggird End  */

}
