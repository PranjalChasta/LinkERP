import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { KitchenviewService } from '../kitchenview.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { CustomValidators } from 'ngx-custom-validators';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { KitchenTables } from 'src/app/models/kitchenview/kitchen-tables';

@Component({
  selector: 'app-table-management',
  templateUrl: './table-management.component.html',
  styleUrls: ['./table-management.component.css']
})
export class TableManagementComponent implements OnInit {
  TablesForm: FormGroup;
  Loading: any = false;
  Mode: any = 'List';
  submitted: boolean;
  //WareHouseID: any;
  tables: any[] = [];//Array variable of warehouse data to bind grid
  addreadonly: boolean;
  //Ag-grid 
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  CompanyId = localStorage.getItem('CompanyID');
  AccessTab: any;
  SelectedTableID: any;
  HeaderNames: any;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  IsActive: boolean;
  PageSize: any;
  Currentpage: string;
  constructor(
    private kitchenviewService: KitchenviewService,
    private TablesFB: FormBuilder,
    private toastr: ToastrService,
    private deleteRecordsService: DeleteRecordsService,
    private cryptoAes: CryptoAes
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Mode = "List";
    this.submitted = false;
    this.HeaderNames = "Table";
    this.AccessTab = "Table";
    //this.WareHouseID = 'D0454214-D3BB-44D2-B5FD-1B83A3556393';
    this.PageSize = "50";
    this.Currentpage = "0";
    this.BindTable();

    //To create the tablesform Form Controls
    this.TablesForm = this.TablesFB.group({
      ID: [''],
      CompanyID: [''],
      TableName: ['', Validators.required],
      NoOfGuests: ['', Validators.required],
      ReservationStartTime: [''],
      ReservationEndTime: ['']
    });
    this.SetPermissions();
    this.ColumnDefs = [
      { headerName: 'Table Name', field: 'tableName', sortable: true, filter: true },
      { headerName: 'No of Guests', field: 'noOfGuests', sortable: true, filter: true },
      { headerName: 'Reservation Start Time', field: 'reservationStartTime', sortable: true, filter: true },
      { headerName: 'Reservation End Time', field: 'reservationEndTime', sortable: true, filter: true },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
  get f() { return this.TablesForm.controls; }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "202");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.TablesForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.TablesForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.TablesForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  //Add new Table
  AddNew(): void {
    this.Mode = 'Add';
    this.IsActive = true;
    this.TablesForm.enable();
  }
  //To bind the data of tables to the controls to edit/update.
  Edit(ID): void {
    this.Mode = 'Edit';
    this.SelectedTableID = ID;
    this.BindTablesByID(ID);

  }
  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.BindTable();
    this.Mode = "List";
  }
  /* FOR Aggrid Start */
  OnActionClick(event: any) {
    debugger;
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Edit(event.data.id);
      this.SelectedTableID = event.data.id;
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id);
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

  //Resetting the form after Add/Edit
  ResetForm() {
    this.TablesForm.patchValue({
      ID: '',
      TableName: '',
      NoOfGuests: 0,
      ReservationStartTime: '',
      ReservationEndTime: ''
    });
    this.TablesForm.markAsTouched();
    this.TablesForm.markAsPristine();
    this.submitted = false;
  }


  //To bind the data of all table to the Grid.
  BindTable() {
    debugger;
    this.Loading = true;
    this.AgLoad = false;
    this.kitchenviewService.getTables().subscribe((resp: any) => {
      this.tables = resp.data.tables;
      this.RowData = resp.data.tables;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {

      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  OnCancel() {
    this.ResetForm();
    this.Mode = 'Add';
  }
  onSaveold(saveAction) {
    debugger;
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  //To save the warehouse details to database table by calling the API service
  onSave(saveAction) {
    debugger;
    this.submitted = true;
    if (this.TablesForm.invalid) {
      return;
    }
    this.Loading = true;
    let kitchenTables = new KitchenTables();
    kitchenTables.CompanyID = this.CompanyId;
    kitchenTables.TableName = this.TablesForm.get('TableName').value;
    kitchenTables.NoOfGuests = this.TablesForm.get('NoOfGuests').value;
    kitchenTables.ReservationStartTime = this.TablesForm.get('ReservationStartTime').value;
    kitchenTables.ReservationEndTime = this.TablesForm.get('ReservationEndTime').value;
    kitchenTables.CreatedBY = localStorage.getItem('LoginID');

    //If the mode is Add then it will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.kitchenviewService.addTable(kitchenTables).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          console.log(resp)
          this.toastr.success(' Table is added Successfully')
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindTable();
            this.Mode = 'List';
          }
          else {
            this.Edit(resp.data.id);
            this.BindTable();
            this.Mode = 'Edit';
          }
          // this.ResetForm();
          // this.BindWareHouse();
          // this.Edit(resp.data.id);
          // this.ResetForm();
          // this.Mode = 'Edit';
          this.Loading = false;
        }
      });
    }

    else if (this.Mode == 'Edit') {
      kitchenTables.ID = this.TablesForm.get('ID').value;
      this.kitchenviewService.updateTable(kitchenTables).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Table details Updated Successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindTable();
          }
          else {
            this.Edit(this.TablesForm.get('ID').value);
          }
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    this.Loading = false;
  }
  //Bind Table by ID
  BindTablesByID(ID) {
    this.kitchenviewService.getTableByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        let kitchenTable: any = new KitchenTables();
        kitchenTable = resp.data.table;
        this.TablesForm.patchValue({
          ID: kitchenTable.id,
          CompanyID: kitchenTable.companyID,
          TableName: kitchenTable.tableName,
          NoOfGuests: kitchenTable.noOfGuests,
          ReservationStartTime: kitchenTable.reservationStartTime,
          ReservationEndTime: kitchenTable.reservationEndTime
        })
        if (!kitchenTable.deleted) {
          debugger;
          this.TablesForm.enable();
          this.IsActive = true;
        } else {
          this.TablesForm.disable();
          this.IsActive = false;
        }
      }
    },
      (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
  }



  //Delete the record
  onDeleteChecked(ID) {
    debugger;
    this.Loading = true;
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SOP_TableManagement', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.Mode = 'List';
      this.BindTable();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
}
