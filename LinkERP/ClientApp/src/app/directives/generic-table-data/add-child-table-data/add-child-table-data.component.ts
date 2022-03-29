import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TableDataService } from 'src/app/sys/services/table-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { LBSSYSTableData } from 'src/app/models/sys/lbs-sys-table-data';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-add-child-table-data',
  templateUrl: './add-child-table-data.component.html',
  styleUrls: ['./add-child-table-data.component.css']
})
export class AddChildTableDataComponent implements OnInit {
  
  @Input() ParentTableID: any;
  @Input() SelectedID: any;
  @Output() OnCloseChild = new EventEmitter();
  @Input() ParentName:string;
  @Input() IsParentActive:Boolean;
  @Input() Delete_Access: any;
  ColumnDefs;
  Loading: any = false;
  RowData: any;
  AgLoad: boolean = false;
  GenericChildTableDataForm: FormGroup;
  Mode: any;
  CompanyId = localStorage.getItem('CompanyID');
  Submitted: any = false;
  LineEditField: string;
  PageSize: any;
  Currentpage: string;
  IsActive: boolean;
  constructor(private tabledataservice: TableDataService,
    private TableGenericFB: FormBuilder,
    private toastrService: ToastrService,
    private deleteRecordsService: DeleteRecordsService) { }

  ngOnInit() {
    this.Mode = "List";
    this.Currentpage = "0";
    this.PageSize="50";
    this.LineEditField = "dataCode";
    this.ColumnDefs = [
      { headerName: 'Data Code', field: 'dataCode', sortable: true, filter: true, checkboxSelection: false, },
      { headerName: 'Data Name', field: 'dataName', sortable: true, filter: true, checkboxSelection: false,  },
      //{ headerName: 'Bin Name', field: 'binName', sortable: true, filter: true, checkboxSelection: false },
      //{ headerName: 'Organisation', field: 'companyName', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
       { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.Delete_Access }
    ];
    this.BindChildData();
    this.GenericChildTableDataForm = this.TableGenericFB.group({
      TblSelectedID: ['-1'],
      ID: [''],
      DataCode: [''],
      DataName: ['']
    });
    console.log(this.ParentTableID);
    console.log(this.SelectedID);
  }

  onSaveold(saveAction) {
    debugger;
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?',saveAction);
  }
  onSave(saveAction) {

    this.Submitted = true;
    if (this.GenericChildTableDataForm.invalid) {
      return;
    }
    let lBSSYSTableData = new LBSSYSTableData();
    lBSSYSTableData.CompanyID = this.CompanyId;
    lBSSYSTableData.TableID = this.SelectedID;
    lBSSYSTableData.ParentCodeID = this.ParentTableID;
    lBSSYSTableData.DataCode = this.GenericChildTableDataForm.get('DataCode').value;
    lBSSYSTableData.DataName = this.GenericChildTableDataForm.get('DataName').value;
    if (this.Mode == 'Add') {

      this.tabledataservice.addTableData(lBSSYSTableData).subscribe((resp: any) => {
        if (resp.isSuccess) { 
          this.toastrService.success('Data added successfully');
          if(saveAction=='Close'){
            this.Cancel();
            this.BindChildData();
            this.Mode = 'List';
          }
          else{
            this.BindTableDataByTableDataID(resp.data.id);
            this.BindChildData();
            this.Mode = 'Edit';
          }
          this.Loading = false;
        }else {
          
          this.toastrService.warning(resp.message)
          this.Loading = false;
        } 
         
        //this.Loading = false; 
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    else if (this.Mode == 'Edit') {
      lBSSYSTableData.ID = this.GenericChildTableDataForm.get('ID').value;
      this.tabledataservice.updateTableData(lBSSYSTableData).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastrService.success('Data updated successfully');
          if(saveAction=='Close'){
            this.Cancel();
            this.Mode = 'List';
           // this.ResetForm();
           this.BindChildData();
          }
          else{
            this.Mode = 'Edit';
            this.BindTableDataByTableDataID(this.GenericChildTableDataForm.get('ID').value);
          }
        }else{
          this.Loading = false;
          this.toastrService.warning(resp.message);
        }

       
        this.BindChildData();
         
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    this.Loading = false;
  }
  BindTableDataByTableDataID(ID) {

    this.tabledataservice.getTableDataByTableDataID(ID).subscribe((resp: any) => {
      let lBSSYSTableData: any = resp.data.tabledata;
      console.log(resp.data);
      this.GenericChildTableDataForm.patchValue({
        ID: lBSSYSTableData.id,
        //Organisation: lBSSYSDocumentTemplates.companyID,
        DataCode: lBSSYSTableData.dataCode,
        DataName: lBSSYSTableData.dataName
      });
      if (!lBSSYSTableData.deleted) {
        this.GenericChildTableDataForm.enable();
        this.IsActive = true;
      } else {
        this.GenericChildTableDataForm.disable();
        this.IsActive = false;
      }
      this.Mode = 'Edit';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindChildData() {
    this.AgLoad = false;
    this.tabledataservice.getChildLookup(this.SelectedID, this.ParentTableID).subscribe((resp: any) => {
      console.log(resp.data);
      this.RowData = resp.data.tables;
      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  AddNew(){
    debugger;
    this.Mode = 'Add';
    this.IsActive = true;
  }
  // AddNew(): void {
  //   this.GenericChildTableDataForm.patchValue({
  //     ID: null,
  //     //Organisation: lBSSYSDocumentTemplates.companyID,
  //     DataCode: '',
  //     DataName: ''
  //   });
  //   this.Mode = 'Add';
  // }
  OnActionClick(event: any) {

    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.AGEdit(event.data)
      if (event.data.deleteStatus == 'Active') {
        this.GenericChildTableDataForm.enable();
        this.IsActive = true;
      } else {
        this.GenericChildTableDataForm.disable();
        this.IsActive = false;
      }
    } else if (colId == 'Delete') {
      this.onDelete(event.data.id)
    }
  }
  AGEdit(event) {
    this.Mode = 'Edit';
    this.GenericChildTableDataForm.patchValue({
      ID: event.id,
      //Organisation: lBSSYSDocumentTemplates.companyID,
      DataCode: event.dataCode,
      DataName: event.dataName
    });
  }
  onDelete(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SYS_TableData', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.BindTableDataByID(this.SelectedID);
      this.BindChildData();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  Cancel() {
    this.GenericChildTableDataForm.patchValue({
      ID: null,
      //Organisation: lBSSYSDocumentTemplates.companyID,
      DataCode: '',
      DataName: ''
    });
    this.BindChildData();
    this.Mode = 'List';
  }
  OnSaveChildlist(From) {
    this.tabledataservice.addUpdateParentData(this.RowData).subscribe((resp: any) => {
      if (!resp.isSuccess) {
        this.toastrService.warning(resp.message);
      } else {
        this.toastrService.success('Data added successfully');
        this.BindChildData();
        this.Mode = 'List';
        if (From == 'Close') {
          this.CloseChild();
        }
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  addNewChilddata() {
    this.AgLoad = false;
    let tableobject = {
      companyID: this.CompanyId,
      tableID: this.SelectedID,
      parentCodeID: this.ParentTableID,
      dataCode: '',
      dataName: '',
      lbS_SYS_Table: null,
      id: null,
      createdBY: localStorage.getItem('LoginID'),
      dateCreated: "0001-01-01T00:00:00",
      deleted: false,
      deletedBy: null,
      deleteDate: "0001-01-01T00:00:00",
      deleteStatus: "Active"
    }
    // this.RowData.push(tableobject);
    this.RowData.splice(0, 0, tableobject);
    this.AgLoad = false;
    this.AgLoad = true;
  }
  CloseChild() {
    this.OnCloseChild.emit();
  }

  OnPageSizeChange($event: any){
    this.PageSize=$event.target.value; 
  }

  OnchangeCurrentpage(page){
    this.Currentpage=page;
      }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
