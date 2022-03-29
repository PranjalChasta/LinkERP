import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { ToastrService } from 'ngx-toastr';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { LBS_SOP_SalesPerson } from 'src/app/models/sys/SalesPersom';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { UserService } from 'src/app/sys/services/user.service';

@Component({
  selector: 'app-sales-person',
  templateUrl: './sales-person.component.html',
  styleUrls: ['./sales-person.component.css']
})
export class SalesPersonComponent implements OnInit {
  Mode: any = 'List';
  Loading: any = false;
  SalesPersonForm: FormGroup;
  BindTaxCodeDetail: any;
  TaxCodeDetails: any;
  BindTaxCode: any;
  WareHouse: any = [];
  Submitted: boolean;
  ColumnDefs;
  RowData: any;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  AgLoad: boolean = false;
  @Input() RecID: any;
  constructor(private userService: UserService,
    private deleteRecordsService: DeleteRecordsService, private toastrService: ToastrService,
    private commonService: InvCommonService,
    private cryptoAes: CryptoAes,
    private FB: FormBuilder) { }

  ngOnInit() {
    this.Mode = 'List';
    this.delete_Access = false;
    this.write_Access = true;
    this.Createform();
    this.SetPermissions();
    this.BindWareHouse();

   

    this.getall()
  }
  GridColumns() {
    this.ColumnDefs = [
      // { headerName: 'WareHouse', field: 'warehouseID', sortable: true, filter: true },
      { headerName: 'Sales Person', field: 'salesPersonName', sortable: true, filter: true, editType: 'dropdownedit', },
      {
        headerName: 'WareHouse', field: 'warehouseID',
        cellEditor: 'agSelectCellEditor', sortable: true, filter: true,
        cellEditorParams: {
          values: this.WareHouse.map(s => s.wareHouseName)
        },
        valueGetter: (params) => this.WareHouse.find(pa => pa.id == params.data.warehouseID).wareHouseName,
        valueSetter: (params) => {
          params.data.warehouseID = this.WareHouse.find(pa => pa.wareHouseName == params.newValue).id
        }
      },
      { headerName: '', field: 'Edit', cellRenderer: this.CustomSaveIconFunc, type: 'EditAction', hide: !this.write_Access },

      { headerName: '', field: 'Delete', cellRenderer: this.CustomDeleteIconFunc, type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
  CustomSaveIconFunc(event) {
    let cellContent: string = '<div style="cursor: pointer;"><i class="bi fa fa-save"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(event) {

    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  get f() { return this.SalesPersonForm.controls; }
  Createform() {
    this.Submitted = false;
    this.SalesPersonForm = this.FB.group({
      ID: ['00000000-0000-0000-0000-000000000000'],
      // TaxCode:['-1'],
      WareHouseID: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      SalesPersoName: ['', Validators.required]
    })
  }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "118");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.SalesPersonForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.SalesPersonForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.SalesPersonForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  BindWareHouse() {
    // this.Loading = true; 
    this.commonService.getWareHouse().subscribe((resp: any) => {
      this.WareHouse = resp.data.warehouse;
      //this.BindTaxCode=this.WareHouse.map(s => s.wareHouseName)
      //console.log(this.BindTaxCode);
      // this.Loading = false;
      this.GridColumns();
    }, (error) => {

      // this.Loading = false;
      this.toastrService.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onDelete(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SOP_SalesPerson', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.getall()
      this.Createform();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  getall() {
    this.AgLoad = false;
    this.Loading = true;
    this.userService.getSalespersons().subscribe((resp: any) => {
      debugger;
      if (resp.isSuccess) {
        this.Loading = false;
        this.RowData = resp.data.salesPerson;
        this.AgLoad = true;
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onSave(action) {
    debugger;
    this.Submitted = true;
    if (this.SalesPersonForm.invalid) {
      return;
    }
    let SalesPersons = new LBS_SOP_SalesPerson();
    SalesPersons.ID = this.SalesPersonForm.get('ID').value;
    SalesPersons.WarehouseID = this.SalesPersonForm.get('WareHouseID').value;
    SalesPersons.SalesPersonName = this.SalesPersonForm.get('SalesPersoName').value;
    console.log(SalesPersons)
    this.userService.AddSalesPerson(SalesPersons).subscribe((resp: any) => {
      if (resp.isSuccess) {
        this.toastrService.success('Sales Person  added successfully');
        this.getall()
        this.Createform();
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  OnActionClick(event: any) {
    debugger;
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.AgEditSave(event.data)
    } else if (colId == 'Delete') {
      this.onDelete(event.data.id)
    }
  }
  AgEditSave(event) {

    console.log(event)
    let SalesPersons = new LBS_SOP_SalesPerson();
    SalesPersons.ID = event.id
    SalesPersons.WarehouseID = event.warehouseID
    SalesPersons.SalesPersonName = event.salesPersonName
    console.log(SalesPersons)
    this.userService.AddSalesPerson(SalesPersons).subscribe((resp: any) => {
      console.log(resp)
      debugger;
      if (resp.isSuccess) {
        this.toastrService.success('Sales Person  Updated successfully');
        this.getall()
        this.Createform();
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });

  }
}
