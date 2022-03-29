import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { NextNumberService } from '../services/next-number.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { LbsPosNextNumber } from 'src/app/models/pos/lbs_pos_nextNumber';

@Component({
  selector: 'app-next-number',
  templateUrl: './next-number.component.html',
  styleUrls: ['./next-number.component.css']
})
export class NextNumberComponent implements OnInit {
  NextNumberForm: FormGroup;
  ColumnDefs;
  RowData: any;
  PageSize: any;
  Currentpage: any;
  AgLoad: boolean;
  Loading: any = false;
  Mode: any = 'List';
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  Warehouse: any;
  submitted: boolean;
  TerminalID: any;
  SaveAction: string;
  IsActive: boolean;

  NextNumberID: any;
  constructor(
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    private nextNumberServcie:NextNumberService,
    private deleteRecordsService: DeleteRecordsService,
    private invCommonService:InvCommonService,
    private FB: FormBuilder,
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.CreateForm();
    this.GetAgColumns();
    this.GetNextNumberList();
    this.SetPermissions();
    this.BindWarehouse();
    this.Currentpage = "0";
    this.PageSize = "50";
  }
  get f() { return this.NextNumberForm.controls; }

  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "406");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.NextNumberForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.NextNumberForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.NextNumberForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  GetAgColumns() {
    this.ColumnDefs = [
      { headerName: 'Warehouse', field: 'wareHouseName', sortable: true, filter: true },
      { headerName: 'Description', field: 'description', sortable: true, filter: true },
      { headerName: 'Next Number Prefix', field: 'nextNumberPrefix', sortable: true, filter: true },
      { headerName: 'Next Number', field: 'nextNumber', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 80, },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    ];
  }

  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  AddNew(): void {
    this.Mode = 'Add';
    this.NextNumberForm.get('Description').enable();
    this.NextNumberForm.get('Warehouse').enable();
    this.NextNumberForm.get('NextNumberPrefix').enable();
    this.NextNumberForm.get('NextNumber').enable();
    this.IsActive = true;
  }
  CreateForm() {
    this.NextNumberForm = this.FB.group({
      ID: [''],
      Description: ['', Validators.required],
      Warehouse: ['-1', CustomValidators.notEqual('-1')],
      NextNumberPrefix: ['', Validators.required],
      NextNumber: ['', Validators.required]
    });
  }

  //Resetting the form after Add/Edit
  ResetForm() {
    this.NextNumberForm.patchValue({
      ID: '',
      Description: '',
      Warehouse: '-1',
      NextNumberPrefix: '',
      NextNumber: ''
    });
    this.NextNumberForm.markAsUntouched();
    this.NextNumberForm.markAsPristine();
    this.submitted = false;
  }

  BindWarehouse() {
    this.invCommonService.getWareHouse().subscribe((resp: any) => {
      this.Warehouse = resp.data.warehouse;
    })
  }
  GetNextNumberList() {
    this.Loading = true;
    this.AgLoad = false;
    this.nextNumberServcie.GetNextNumbers().subscribe((res: any) => {
      this.RowData = res.data.nextNumber;
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.AgEdit(event.data)

    } else if (colId == 'Delete') {
      this.onDeleteTerminal(event.data.id)
    }
  }

  AgEdit(event) {
    console.log(event);
    
    this.NextNumberForm.patchValue({
      ID: event.id,
      Description: event.description,
      Warehouse: event.warehouseID,
      NextNumber:event.nextNumber,
      NextNumberPrefix:event.nextNumberPrefix,
    });
    this.NextNumberID = event.id;
    this.Mode = 'Edit';
    //  this.readonly = true;
    if (event.deleteStatus == 'Active') {
      this.NextNumberForm.enable();
      this.IsActive = true;
    } else {
      this.NextNumberForm.disable();
      this.IsActive = false;
    }
  }
  //Delete the record
  onDeleteTerminal(ID) {
    this.Loading = true;
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SOP_WarehouseNextNumber', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.GetNextNumberList();
      }
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }
  Cancel(): void {
    this.NextNumberForm.reset();
    this.ResetForm();
    this.GetNextNumberList();
    this.Mode = "List";
  }
  OnSubmit() {
    this.submitted = true;
    if (this.NextNumberForm.invalid) {
      return;
    }
    this.Loading = true;
    let nextNumber = new LbsPosNextNumber();
    nextNumber.Description = this.NextNumberForm.get('Description').value;
    nextNumber.WarehouseID = this.NextNumberForm.get('Warehouse').value;
    nextNumber.CompanyID = localStorage.getItem('CompanyID');
    nextNumber.NextNumber = this.NextNumberForm.get('NextNumber').value;
    nextNumber.NextNumberPrefix = this.NextNumberForm.get('NextNumberPrefix').value;
    nextNumber.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      this.nextNumberServcie.addNextNumber(nextNumber).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success(resp.message);
          if (this.SaveAction == 'SaveNClose') {
            this.ResetForm();
            this.GetNextNumberList();
            this.Mode = 'List';
          }
          else {
            this.NextNumberID = resp.data.id;
            // this.readonly = true;
            this.Mode = 'Edit';
          }
          this.submitted = false;
          this.Loading = false;
        }

      }, (error) => {
        this.Loading = false;
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      nextNumber.ID = this.NextNumberForm.get('ID').value;
      this.nextNumberServcie.updateNextNumber(nextNumber).subscribe((resp: any) => {
        this.toastr.success('Next Number details updated successfully');
        if (this.SaveAction == 'SaveNClose') {

          this.ResetForm();
          this.Mode = 'List';
          this.submitted = false;
          this.Loading = false;
        }
        else {
          this.Mode = 'Edit';
        }
      }, (error) => {
      });
      this.submitted = false;
    }
  }
}
