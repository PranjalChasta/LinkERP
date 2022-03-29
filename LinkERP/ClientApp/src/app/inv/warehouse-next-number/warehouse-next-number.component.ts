import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { WarehouseNextNumberService } from '../services/warehouse-next-number.service';
import { ToastrService } from 'ngx-toastr';
import { LbsInvWarehouseNextNumbers } from 'src/app/models/inv/lbs-inv-warehouse-next-numbers';
import { WarehouseService } from '../services/warehouse.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
@Component({
  selector: 'app-warehouse-next-number',
  templateUrl: './warehouse-next-number.component.html',
  styleUrls: ['./warehouse-next-number.component.css']
})
export class WarehouseNextNumberComponent implements OnInit {
  WareHouseNumberForm: FormGroup;
  Loading: any = false;
  Mode: any = 'List';
  submitted: boolean;
  addreadonly: boolean;

  WareHouse: any[] = [];//Array variable of warehouse data to bind grid
  WareHouseDetails: any[] = [];
  //Ag-grid 
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  CompanyId = localStorage.getItem('CompanyID');
  //WarehouseID = localStorage.getItem('WarehouseID');
  @Input() WareHouseID: any;
  @Input() IsActiveParent:any;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  PageSize: any;
  Currentpage: string;

  constructor(
    private NextNumberService: WarehouseNextNumberService,
    private WareHouseService: WarehouseService,
    private WarehousNumberFB: FormBuilder,
    private toastr: ToastrService,
    private deleteRecordsService: DeleteRecordsService,
    private cryptoAes: CryptoAes
    ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Mode = "List";
    //created warehousenumber forms
    this.WareHouseNumberForm = this.WarehousNumberFB.group({
      ID: [''],
      CompanyID: [''],
      WarehuoseID: ['-1'],
      WareHouseName: ['-1'],
      Description: [''],
      NextNumberPrefix: [''],
      NextNumber: ['']
    });
    this.Currentpage = "0";
    this.PageSize = "50";
    this.SetPermissions();
    this.BindWareHouseNumber();
    //this.BindWareHouse();
    this.ColumnDefs = [
     // { headerName: 'Name', field: 'name', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Description', field: 'description', sortable: true, filter: true },
      { headerName: 'Next Number Prefix', field: 'nextNumberPrefix', sortable: true, filter: true },
      { headerName: 'Next Number', field: 'nextNumber', sortable: true, filter: true, cellStyle: { textAlign: 'left' },},
     // { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit',  type: 'EditAction', hide: false, },
    //  { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
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
      this.WareHouseNumberForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.WareHouseNumberForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.WareHouseNumberForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
   
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  //Add new warehouse
  AddNew(): void {
    this.Mode = 'Add';
    this.addreadonly = false;
  }
  //To bind the data of warehouse to the controls to edit/update.
  Edit(ID): void {
    this.BindWareHouseNumberByID(ID);
    this.Mode = 'Edit';
    this.addreadonly = true;
  }
  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.Mode = "List";
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Edit(event.data.id)
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
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
    this.WareHouseNumberForm.patchValue({
      ID: '',
      CompanyID: '',
      WarehouseID: '-1',
      Description: '',
      NextNumberPrefix: '',
      NextNumber: '',
      WareHouseName: '',
    });
    this.WareHouseNumberForm.markAsTouched();
    this.WareHouseNumberForm.markAsPristine();
    this.submitted = false;
  }


  //To bind the data of all warehouse to the Grid.
  BindWareHouseNumber() {
    debugger;
    this.Loading = true;
    this.AgLoad = false;
    this.NextNumberService.getWareHouseNextNumberByWareHouseID(this.WareHouseID).subscribe((resp: any) => {
      this.WareHouse = resp.data.warehousenumber;
      this.RowData = resp.data.warehousenumber;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the data of all warehouse to the Grid.
  BindWareHouse() {
    this.Loading = true;
    // this.AgLoad = false;
    this.WareHouseService.getWareHouse().subscribe((resp: any) => {
      this.WareHouseDetails = resp.data.warehouse;
      // this.RowData = resp.data.warehouse;
      //this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To save the warehouse next number details to database table by calling the API service
  onSave() {
    this.submitted = true;
    if (this.WareHouseNumberForm.invalid) {
      return;
    }
    this.Loading = true;
    let warehouse = new LbsInvWarehouseNextNumbers();
    warehouse.CompanyID = this.CompanyId;
    warehouse.WarehouseID = this.WareHouseID;
    warehouse.Description = this.WareHouseNumberForm.get('Description').value;
    warehouse.NextNumberPrefix = this.WareHouseNumberForm.get('NextNumberPrefix').value;
    warehouse.NextNumber = this.WareHouseNumberForm.get('NextNumber').value;
    //warehouse.Name =this.WareHouseNumberForm.get('WareHouseName').value;

    //If the mode is Add then it will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.NextNumberService.addWareHouseNumber(warehouse).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('warehouse-Number  details updated successfully');
          this.ResetForm();
          this.BindWareHouseNumber();
          this.Mode = 'List';
          this.Loading = false;
        }
      }
      );
    }
    else if (this.Mode == 'Edit') {
      warehouse.ID = this.WareHouseNumberForm.get('ID').value;
      this.NextNumberService.updateWareHouseNumber(warehouse).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('warehouse Number details updated successfully');
          this.ResetForm();
          this.BindWareHouseNumber();
          this.Mode = 'List';
        }
        else if (!resp.isSuccess) {
          this.toastr.warning(resp.message)
          // this.Mode = 'List';
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  //Bind Warehouse next number by  ID
  BindWareHouseNumberByID(ID) {
    this.NextNumberService.getWareHouseNumberByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        let warehouseDetails: any = new LbsInvWarehouseNextNumbers();
        debugger;
        warehouseDetails = resp.data.house;
        this.WareHouseNumberForm.patchValue({
          ID: warehouseDetails.id,
          CompanyID: warehouseDetails.companyID,
          WarehouseID: warehouseDetails.warehouseID,
          //WareHouseName:warehouseDetails.name,
          Description: warehouseDetails.description,
          NextNumberPrefix: warehouseDetails.nextNumberPrefix,
          NextNumber: warehouseDetails.nextNumber
        });
      }
    });
  }

  //Delete the record
  onDeleteChecked(ID) {
    this.Loading = true;
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_WarehouseNextNumbers', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.Mode = 'List';
      this.BindWareHouseNumber();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}



