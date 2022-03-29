import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { WareHouseBinService } from '../services/ware-house-bin.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { WarehouseService } from '../services/warehouse.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LBSINVWareHouseBin } from 'src/app/models/inv/lbs-inv-ware-house-bin';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { inputs } from '@syncfusion/ej2-angular-dropdowns/src/drop-down-list/dropdownlist.component';

@Component({
  selector: 'app-ware-house-bin',
  templateUrl: './ware-house-bin.component.html',
  styleUrls: ['./ware-house-bin.component.css']
})
export class WareHouseBinComponent implements OnInit {
  Mode: any = 'List';
  Submitted: boolean;
  WareHouseBinForm: FormGroup;
  Loading: any = false;
  // Companies: any[] = [];
  // LbsInvWarehouse: any;
  // WareHouseBins: any;
  // WareHouseName: any;
  BindWareHouseBin: any;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  CompanyId = localStorage.getItem('CompanyID');
  @Input() WareHouseID: any;
  @Input() IsActiveParent: any;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  PageSize: any;
  Currentpage: string;
  IsActive: boolean;
  constructor(
    private sysCommonService: SysCommonService,
    private wareHouseBinService: WareHouseBinService,
    private warehouseService: WarehouseService,
    private WareHouseBinFB: FormBuilder,
    private toastrModule: ToastrModule,
    private toastrService: ToastrService,
    private deleteRecordsService: DeleteRecordsService,
    private cryptoAes: CryptoAes
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Submitted = false;
    this.Mode = "List";
    this.PageSize = "50";
    this.Currentpage = "0";
    this.BindWareHouseBins();
    // this.BindWareHouse();
    this.WareHouseBinForm = this.WareHouseBinFB.group({
      ID: [''],
      BinCode: ['', Validators.required],
      BinName: [''],
      Default: ['']
      //WareHouseName: ['-1']
    });
    this.SetPermissions();
    this.ColumnDefs = [
      //{ headerName: 'WareHouse Name', field: 'wareHouseName', sortable: true, filter: true, checkboxSelection: false, editable:false },
      { headerName: 'Bin Code', field: 'binCode', sortable: true, filter: true, checkboxSelection: false, editable: this.write_Access },
      { headerName: 'Bin Name', field: 'binName', sortable: true, filter: true, checkboxSelection: false, editable: this.write_Access },
      { headerName: 'Default', field: 'defaultStatus', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false },
      //  { headerName: '', field: 'Save', cellRenderer: this.CustomSaveIconFunc, type: 'Action', hide: !this.write_Access},
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
  get f() { return this.WareHouseBinForm.controls; }

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
      this.WareHouseBinForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.WareHouseBinForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.WareHouseBinForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }

  //BindWareHouseNames
  /* BindWareHouse() {
    this.Loading = true;
    this.warehouseService.getWareHouse().subscribe((resp: any) => {
      this.WareHouseBins = resp.data.warehouse;
      this.Loading = false;

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  } */
  //To bind the data of all WareHouse Bin   to the Grid
  BindWareHouseBins() {
    this.Loading = true;
    this.AgLoad = false;
    this.wareHouseBinService.getWareHouseBinByWareHouseID(this.WareHouseID).subscribe((resp: any) => {
      this.BindWareHouseBin = resp.data.warehousebin;
      this.RowData = resp.data.warehousebin;
      this.RowData = this.RowData.filter(s => s.deleted == 0 || s.deleted == 1);
      console.log(this.RowData);
      this.AgLoad = true;
      this.Loading = false;

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindWareHouseBinByID(ID) {
    this.wareHouseBinService.getWareHouseBinByID(ID).subscribe((resp: any) => {
      let lBSINVWareHouseBin: any = resp.data.warehousebin;
      this.WareHouseBinForm.patchValue({
        ID: lBSINVWareHouseBin.id,
        //Organisation: lBSSYSDocumentTemplates.companyID,
        WareHouseName: lBSINVWareHouseBin.WareHouseID,
        BinCode: lBSINVWareHouseBin.binCode,
        BinName: lBSINVWareHouseBin.binName,
        Default: lBSINVWareHouseBin.default,
      });
      if (!lBSINVWareHouseBin.deleted) {
        this.WareHouseBinForm.enable();
        this.IsActive = true;
      } else {
        this.WareHouseBinForm.disable();
        this.IsActive = false;
      }
      this.Mode = 'Edit';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  Edit(ID) {
    this.Mode = 'Edit';
    this.BindWareHouseBinByID(ID);

  }
  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.BindWareHouseBins();
    this.Mode = "List";
  }
  //Add New WareHouse Bin
  AddNew(): void {
    this.Mode = 'Add';
    this.IsActive = true;
    this.WareHouseBinForm.enable();
  }
  OnCancel() {
    this.ResetForm();
    this.Mode = 'Add';
  }
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  //To save the WareHouse Bin to database table by calling the API service
  onSave(saveAction) {
    this.Submitted = true;
    if (this.WareHouseBinForm.invalid) {
      return;
    }
    this.Loading = true;
    let lBSINVWareHouseBin = new LBSINVWareHouseBin();
    lBSINVWareHouseBin.CompanyID = this.CompanyId;
    lBSINVWareHouseBin.WareHouseID = this.WareHouseID;
    lBSINVWareHouseBin.BinCode = this.WareHouseBinForm.get('BinCode').value;
    lBSINVWareHouseBin.BinName = this.WareHouseBinForm.get('BinName').value;
    lBSINVWareHouseBin.Default = this.WareHouseBinForm.get('Default').value;
    lBSINVWareHouseBin.CreatedBY = localStorage.getItem('LoginID');
    //If the Mode is Add then it will insert data to DB else update the row by ID
    if (this.Mode == 'Add') {
      this.wareHouseBinService.addWareHouseBin(lBSINVWareHouseBin).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastrService.success(' Warehouse bin added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindWareHouseBins();
            this.Mode = 'List';
          }
          else {
            this.Edit(resp.data.id);
            this.BindWareHouseBins();
            this.Mode = 'Edit';
          }
          // this.ResetForm();
          // this.BindWareHouseBins();
          // // this.Edit(resp.data.id);
          // this.Mode = 'List';
          this.Loading = false;
        }
        else {
          this.toastrService.warning('Warehouse bin code  already exists')
          this.Loading = false;
        }
      });
    }
    else if (this.Mode == 'Edit') {
      lBSINVWareHouseBin.ID = this.WareHouseBinForm.get('ID').value;
      this.wareHouseBinService.updateWareHouseBin(lBSINVWareHouseBin).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastrService.success('WareHouse  bin Updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindWareHouseBins();
          }
          else {
            this.Edit(this.WareHouseBinForm.get('ID').value);
          }
          // this.ResetForm();
          // this.BindWareHouseBins();
          // this.Mode = 'Edit';
        }
        else {
          this.toastrService.warning('WareHouse bin  code already exists')
          this.Loading = false;
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    this.Loading = false;
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      //  this.AgEdit(event.data);
      this.Edit(event.data.id);
    } else if (colId == 'Delete') {
      debugger;
      this.wareHouseBinService.checkwarehouseBin(event.data.id, event.data.wareHouseID, localStorage.getItem('CompanyID')).subscribe((resp: any) => {
        if (resp.data.warehousebin != 0)
          this.toastrService.warning('This WarehouseBin is in Use! Cant Delete');
        else
          this.onDeleteChecked(event.data.id);
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
      //this.onDeleteChecked(event.data.id)
    } else if (colId == 'Save') {
      this.AgSave(event.data)
    }
  }
  AgEdit(event) {
    this.WareHouseBinForm.patchValue({
      ID: event.id,
      //Organisation: lBSSYSDocumentTemplates.companyID,
      // WareHouseName: this.WareHouseID,
      BinCode: event.binCode,
      BinName: event.binName
    });
    this.Mode = 'Edit';
  }
  AgSave(event) {
    let lBSINVWareHouseBin = new LBSINVWareHouseBin();
    lBSINVWareHouseBin.CompanyID = this.CompanyId;
    lBSINVWareHouseBin.WareHouseID = this.WareHouseID;
    lBSINVWareHouseBin.BinCode = event.binCode;
    lBSINVWareHouseBin.BinName = event.binName;
    lBSINVWareHouseBin.Default = event.default;
    lBSINVWareHouseBin.ID = event.id;
    this.wareHouseBinService.updateWareHouseBin(lBSINVWareHouseBin).subscribe((resp: any) => {
      this.toastrService.success('WareHouse Bin updated successfully')
      {
        this.ResetForm();
        this.BindWareHouseBins();
        this.Mode = 'List';
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });

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

  //Delete the record 
  onDeleteChecked(ID) {
    this.Loading = true;
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_WareHouseBin', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.Mode = 'List';
      this.BindWareHouseBins();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //Resetting the form after Add/Edit
  ResetForm() {
    this.WareHouseBinForm.patchValue({
      ID: '',
      BinCode: '',
      BinName: '',
      Default: ''
      // WareHouseName: '-1',
    });
    this.WareHouseBinForm.markAsTouched();
    this.WareHouseBinForm.markAsPristine();
    this.Submitted = false;
  }

  CustomSaveIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-save"></i></div>';
    return cellContent
  }

  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value);
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
}
