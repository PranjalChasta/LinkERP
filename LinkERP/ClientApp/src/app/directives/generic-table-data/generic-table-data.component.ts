import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TableDataService } from 'src/app/sys/services/table-data.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { LBSSYSTableData } from 'src/app/models/sys/lbs-sys-table-data';
import { CryptoAes } from '../crypto-aes';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-generic-table-data',
  templateUrl: './generic-table-data.component.html',
  styleUrls: ['./generic-table-data.component.css']
})
export class GenericTableDataComponent implements OnInit {
  @Input() Module: any;
  Mode: any = 'List';
  submitted: any = false;
  Loading: any = false;
  Companies: any[] = [];
  IsActive: boolean;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  GenericTableDataForm: FormGroup;
  CompanyId = localStorage.getItem('CompanyID');
  ParentTableID: any;
  AllTables: any;
  SelectedID;
  IsChildData: boolean = false;
  LineEditField: string;
  isChild: boolean;
  ParentName: string;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  PageSize: any;
  selectedtable;
  Currentpage: string;
  IsParentActive: boolean;
  constructor(
    private tabledataservice: TableDataService,
    private TableGenericFB: FormBuilder,
    private toastrService: ToastrService,
    private deleteRecordsService: DeleteRecordsService, private cryptoAes: CryptoAes
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Currentpage = "0";
    this.Mode = "List";
    this.PageSize = "50";
    this.LineEditField = "dataCode";
    this.BindTables();
    this.GenericTableDataForm = this.TableGenericFB.group({
      TblSelectedID: ['-1'],
      ID: [''],
      DataCode: ['', Validators.required],
      DataName: ['', Validators.required]
    });

    this.SetPermissions();
  }

  BindAllTableDatas() {
    this.Loading = true;
    this.AgLoad = false;
    this.tabledataservice.getAllTableData().subscribe((resp: any) => {
      console.log(resp);
      this.RowData = resp.data.tabledata;
      console.log(this.RowData);
      this.AgLoad = true;
      this.Loading = false;

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  GetAgColumns() {
    this.ColumnDefs = [
     // { headerName: 'Data Code', field: 'dataCode', sortable: true, checkboxSelection: false, editable: false, filter: 'number', type: 'Numeric' },
     { headerName: 'Data Code', field: 'dataCode', sortable: true, filter: true, checkboxSelection: false, editable: false },
      { headerName: 'Data Name', field: 'dataName', sortable: true, filter: true, checkboxSelection: false, editable: false },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', editable: false },
      { headerName: '', field: 'Detail', cellRenderer: this.CustomDetailIconFunc, type: 'Action', hide: !this.isChild },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
  get f() { return this.GenericTableDataForm.controls; }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index;
    if (this.Module == 'SYS') {
      index = Permissions.findIndex(c => c.menuID == "113");
    } else if (this.Module == 'INV') {
      index = Permissions.findIndex(c => c.menuID == "206");
    } else if (this.Module == 'DOC') {
      index = Permissions.findIndex(c => c.menuID == "501");
    }
    else if (this.Module == 'POS') {
      index = Permissions.findIndex(c => c.menuID == "407");
    }
    else if (this.Module == 'DOC') {
      index = Permissions.findIndex(c => c.menuID == "501");
    }
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      if (!this.all_Access) {
        if (!this.write_Access) {

        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {

      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }

  BindTables() {
    this.tabledataservice.getAllModulesTables(this.Module).subscribe((resp: any) => {
      this.AllTables = resp.data.tables;
      this.Loading = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onTableChange(event) {
    console.log(event);
    if (event == "-1") {
      this.AgLoad = false;
      this.SelectedID = null;
      this.RowData = [];
    } else {
      this.BindTableDataByID(event)
    }

  }

  BindTableDataByID(ID) {
    this.SelectedID = ID;
    let index = this.AllTables.findIndex(c => c.id == ID);
    if (index >= 0) {
      this.isChild = this.AllTables[index].isChild;
      this.selectedtable = this.AllTables[index].tableName
    }


    this.GetAgColumns();
    this.AgLoad = false;
    this.tabledataservice.getTableDataByTableID(ID).subscribe((resp: any) => {
      console.log(resp.data);
      this.RowData = resp.data.tabledata;

      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindTableDataByTableDataID(ID) {

    this.tabledataservice.getTableDataByTableDataID(ID).subscribe((resp: any) => {
      let lBSSYSTableData: any = resp.data.tabledata;
      console.log(resp.data)
      this.ParentTableID = lBSSYSTableData.id;

      this.GenericTableDataForm.patchValue({
        ID: lBSSYSTableData.id,
        //Organisation: lBSSYSDocumentTemplates.companyID,
        DataCode: lBSSYSTableData.dataCode,
        DataName: lBSSYSTableData.dataName
      });
      if (!lBSSYSTableData.deleted) {
        this.GenericTableDataForm.enable();
        this.IsActive = true;
        this.IsParentActive = true;
      } else {
        this.GenericTableDataForm.disable();
        this.IsActive = false;
        this.IsParentActive = false;
      }
      this.Mode = 'Edit';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  OnSaveall() {
    this.tabledataservice.addUpdateParentData(this.RowData).subscribe((resp: any) => {
      if (!resp.isSuccess) {
        this.toastrService.warning(resp.message);
      } else {
        this.toastrService.success('Data added successfully');
        this.BindTableDataByID(this.SelectedID)
        this.Mode = 'List';
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Cancel() {
    //  this.ResetForm();
    this.BindTableDataByID(this.SelectedID); 
    this.Mode = 'List';
    this.submitted = false;
    this.GenericTableDataForm.get('TblSelectedID').enable();
  }

  onSaveold(saveAction) {
    debugger;
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    debugger;
    this.submitted = true;
    if (this.GenericTableDataForm.invalid) {
      return;
    }
    let lBSSYSTableData = new LBSSYSTableData();
    lBSSYSTableData.CompanyID = this.CompanyId;
    lBSSYSTableData.TableID = this.SelectedID;
    lBSSYSTableData.CreatedBY = localStorage.getItem('LoginID');
    lBSSYSTableData.DataCode = this.GenericTableDataForm.get('DataCode').value;
    lBSSYSTableData.DataName = this.GenericTableDataForm.get('DataName').value;
    if (this.Mode == 'Add') {
      this.tabledataservice.addTableData(lBSSYSTableData).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastrService.success('Data added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
          //  this.BindTableDataByID(this.SelectedID);
            this.Mode = 'List';
          }
          else {
            this.Edit(resp.data.id);
            this.BindTableDataByID(this.SelectedID);
            this.Mode = 'Edit';
          }
          this.Loading = false;
        } else {
          // this.toastrService.success('Data added successfully') ;
          // //this.BindTables();
          // this.BindTableDataByID(this.SelectedID)
          // this.Mode = 'List';
          this.toastrService.warning(resp.message)
          this.Loading = false;
        }


        //this.Loading = false; 
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    else if (this.Mode == 'Edit') {
      lBSSYSTableData.ID = this.GenericTableDataForm.get('ID').value;
      this.tabledataservice.updateTableData(lBSSYSTableData).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastrService.success('Data updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            // this.ResetForm();
            this.BindTableDataByID(this.SelectedID);
          }
          else {
            this.Edit(this.GenericTableDataForm.get('ID').value);
          }
        } else {
          this.Loading = false;
          this.toastrService.warning(resp.message);
        }

      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    this.Loading = false;
  }

  Edit(ID): void {
    this.Mode = 'Edit';
    this.BindTableDataByTableDataID(ID)
    //  this.Mode = 'Edit';
  }

  Cancelnew() {
    this.GenericTableDataForm.patchValue({
      TblSelectedID: this.SelectedID
    });
    this.BindTableDataByID(this.SelectedID)
    this.Mode = 'List';
  }

  // AddNew(): void {
  //   this.GenericTableDataForm.patchValue({
  //     ID:null,
  //     //Organisation: lBSSYSDocumentTemplates.companyID,
  //     DataCode:'',
  //     DataName:''
  //   });
  //   this.Mode = 'Add';
  // }
  AddNew() {
    this.GenericTableDataForm.patchValue({
      ID: null,
      DataCode: null,
      DataName: null
    });
    debugger;
    this.GenericTableDataForm.enable();
    this.Mode = 'Add';
    this.IsActive = true;
  }
  /* FOR Aggird Start */

  OnActionClick(event: any) {

    var colId = event.column.getId();
    if (colId == 'Detail') {
      if (event.data.id) {
        if (event.data.deleteStatus == 'Active') {
          this.IsParentActive = true;
        } else {
          this.IsParentActive = false;
        }
         
        this.ParentTableID = event.data.id;
        this.ParentName = event.data.dataName;
        this.IsChildData = true;
        this.Mode = '';
      }
    } else
      if (colId == 'Edit') {
        // if(event.data.id){
        this.ParentTableID = event.data.id;
        this.ParentName = event.data.dataName;
        this.Edit(event.data.id);
        this.Mode = 'Edit';
        // }
        // this.Edit(event.data.id)
      } else if (colId == 'Delete') {
        this.onDelete(event.data.id)
      }
  }

  CustomDetailIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-align-justify"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  /* FOR Aggird End  */
  onDelete(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SYS_TableData', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindTableDataByID(this.SelectedID);
      // this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  addParentData() {
    this.AgLoad = false;
    let tableobject = {
      companyID: this.CompanyId,
      tableID: this.SelectedID,
      parentCodeID: null,
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
    //this.RowData.push(tableobject); 
    this.RowData.splice(0, 0, tableobject);
    this.AgLoad = false;
    this.AgLoad = true;
  }
  OnCloseChild() {
    this.Mode = 'List';
    this.IsChildData = false;
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
