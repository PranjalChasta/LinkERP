import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryBarcodeService } from '../../services/inventory-barcode.service';
import { LBSINVInventoryBarCode } from 'src/app/models/inv/lbs-inv-inventory-bar-code';
import { ToastrService } from 'ngx-toastr';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';


@Component({
  selector: 'app-inventory-barcode',
  templateUrl: './inventory-barcode.component.html',
  styleUrls: ['./inventory-barcode.component.css']
})
export class InventoryBarcodeComponent implements OnInit {
  @Input() InventryID: any;
  @Input() IsInventoryActive: boolean;
  @Input()  ProductStatus:any;
  Mode: any = 'List';
  CompanyId = localStorage.getItem('CompanyID');
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  InventoryBarCodeForm: FormGroup;
  inventoryBarcodes: any;
  Submitted: any = false;
  AccessTab: string;
  read_Access: boolean;
  IsActive: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  PageSize: any;
  all_Access: boolean;
  LineEditField: string;
  Loading: any = false;
  barcodeevent: any;
  Currentpage: string;
  constructor(
    private FB: FormBuilder,
    private inventoryBarcode: InventoryBarcodeService,
    private toastr: ToastrService,
    private cryptoAes: CryptoAes
  ) { }

  ngOnInit() {
   
    console.log(this.InventryID);
    this.AgLoad = false;
    this.Mode = "List";
    this.LineEditField = "BarCode"
    this.Createform();
    this.PageSize = "50";
    this.Currentpage = "0";
    this.SetPermissions();
    this.AgGridColumns();
    this.BindInventoryBarCode();
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Barcode', field: 'barcode', sortable: true, filter: true, checkboxSelection: false, },
      // { headerName: 'Date Created', field: 'dateCreated', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access || !this.IsInventoryActive },
      //   { headerName: '', field: 'Save', cellRenderer: this.CustomSaveIconFunc, type: 'Action',  hide: !this.write_Access}
    ];
  }
  Createform() {
    this.InventoryBarCodeForm = this.FB.group({
      ID: [''],
      BarCode: ['', Validators.required],
    })
  }
  get f() { return this.InventoryBarCodeForm.controls; }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "201");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.InventoryBarCodeForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryBarCodeForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryBarCodeForm.disable();
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
  Addnew() {
    this.ResetForm();
    this.Mode = 'Add';
    this.IsActive = true;
    this.InventoryBarCodeForm.enable();
  }


  Cancel(): void {
    this.ResetForm();
    this.BindInventoryBarCode();
    this.Mode = "List";
  }
  ResetForm() {
    this.InventoryBarCodeForm.patchValue({
      ID: '',
      BarCode: '',
    });
    this.InventoryBarCodeForm.markAsUntouched();
    this.InventoryBarCodeForm.markAsPristine();
    this.Submitted = false;
  }
  //OnSaveall() {
  //  this.inventoryBarcode.AddUpdateMakeData(this.RowData).subscribe((resp: any) => {
  //    console.log(resp);
  //    this.toastr.success('barcode added successfully');
  //    this.BindInventoryBarCode();
  //    this.Mode = 'List';
  //  }, (error) => {
  //    // console.error('Problem with the sevice. Please try later : ' + error);
  //  });
  //}
  BindInventoryBarCode() {
    this.Loading = true;
    this.Mode = 'List';
    this.AgLoad = false;
    this.inventoryBarcode.getInventoryBarCodeByID(this.InventryID).subscribe((resp: any) => {

      this.inventoryBarcodes = resp.data.inventoryBarcode;
      this.RowData = resp.data.inventoryBarcode;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      //   console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }

  CustomSaveIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-save"></i></div>';
    return cellContent
  }

  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      debugger;
      //  this.Mode = 'Edit';
      //   this.InventryID = event.data.productID;
      this.Edit(event.data.id);


    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
  }
  Edit(ID): void {

    this.Mode = 'Edit';
    this.BindbarcodeById(ID);

  }
  BindbarcodeById(ID) {
    debugger;
    this.barcodeevent = this.InventryID;
    this.inventoryBarcode.GetBarcodebyId(ID).subscribe((resp: any) => {
      console.log(resp);
      if (resp.isSuccess == true) {
        let barcode: any = new LBSINVInventoryBarCode();
        barcode = resp.data.inventoryBarcodebyid;
        this.InventoryBarCodeForm.patchValue({
          ID: barcode.id,
          BarCode: barcode.barcode
        });
        if (!barcode.deleted) {
          this.InventoryBarCodeForm.enable();
          this.IsActive = true;
        } else {
          this.InventoryBarCodeForm.disable();
          this.IsActive = false;
        }
        if (!this.IsInventoryActive) {
          this.InventoryBarCodeForm.disable();
        }
      }

    },
      (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
  }
  AgEdit(event) {
    console.log(event);
    this.barcodeevent = this.InventryID;
    this.InventoryBarCodeForm.patchValue({
      ID: event.id,
      BarCode: event.barcode
    });
    if (!event.deleted) {
      this.InventoryBarCodeForm.enable();
      this.IsActive = true;
    } else {
      this.InventoryBarCodeForm.disable();
      this.IsActive = false;
    }
    // this.Mode = 'Edit';
  }

  onSaveold(saveAction) {
    debugger;
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  //AddInventoryDuplicateBarCode ;et;t't
  onSave(saveAction) {
    this.Submitted = true;
    if (this.InventoryBarCodeForm.invalid) {
      return;
    }
    let barCodeDetail = new LBSINVInventoryBarCode();
    barCodeDetail.CompanyID = this.CompanyId;
    barCodeDetail.InventoryID = this.InventryID;
    barCodeDetail.CreatedBY = localStorage.getItem('LoginID');
    barCodeDetail.Barcode = this.InventoryBarCodeForm.get('BarCode').value;

    if (this.Mode == 'Add') {

      this.inventoryBarcode.addInventoryBarCode(barCodeDetail).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Inventory Barcode Details added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindInventoryBarCode();
            this.Mode = 'List';
          }
          else {
            let Id = resp.data.id;
            this.Edit(Id);
            this.BindInventoryBarCode();
            this.Mode = 'Edit';
          }
          this.Loading = false;
        } else {
          this.toastr.warning(resp.message);
          if(this.ProductStatus !="F" && this.ProductStatus !="N")
          {
            this.confirmation.ConfirmationPopup( resp.message +"   "+"Are you Sure you want to save this record ??");
       
          }
            this.Loading = false;
        }

      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    else if (this.Mode == 'Edit') {

      barCodeDetail.ID = this.InventoryBarCodeForm.get('ID').value;
      this.inventoryBarcode.UpdateInventoryBarCode(barCodeDetail).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Inventory Barcode Details updated successfully');
         
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindInventoryBarCode();
            this.Mode = 'List';
          }
          else {
            this.Edit(this.InventoryBarCodeForm.get('ID').value);
          }
        }
        else {
          this.toastr.warning(resp.message);
          debugger;
          if(this.ProductStatus !="F" && this.ProductStatus !="N")
          {
            this.confirmation.ConfirmationPopup( resp.message +"   "+"Are you Sure you want to save this record ??");
       
          } 
          this.Loading = false;
        }

      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    this.Loading = false;
  }

  ConfirmationPupUp(){
    this.confirmation.ConfirmationPopup('Are you sure, Do you want Automatically Allocate All Credit to Invoice ?');
  }
  OnAccept($event){
    this.AcceptDuplicateBarcode()
  
}
AcceptDuplicateBarcode()
{
  this.Submitted = true;
  if (this.InventoryBarCodeForm.invalid) {
    return;
  }
  let barCodeDetail = new LBSINVInventoryBarCode();
  barCodeDetail.CompanyID = this.CompanyId;
  barCodeDetail.InventoryID = this.InventryID;
  barCodeDetail.CreatedBY = localStorage.getItem('LoginID');
  barCodeDetail.Barcode = this.InventoryBarCodeForm.get('BarCode').value;
  this.inventoryBarcode.AddInventoryDuplicateBarCode(barCodeDetail).subscribe((resp: any) => {
    if (resp.isSuccess == true) {
      this.toastr.success('Inventory Barcode Details added successfully');    
        this.BindInventoryBarCode();
        this.Mode = 'List';
      this.Loading = false;
    }

  }, (error) => {
    console.error('Problem with the sevice. Please try later : ' + error);
  });
}
  AgSave(event) {

    let barCodeDetail = new LBSINVInventoryBarCode();
    barCodeDetail.ID = event.id;
    barCodeDetail.Barcode = event.barcode;
    barCodeDetail.CompanyID = this.CompanyId;
    barCodeDetail.InventoryID = this.InventryID;
    this.inventoryBarcode.UpdateInventoryBarCode(barCodeDetail).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.toastr.success('Inventory BarCode Details updated successfully')
        this.BindInventoryBarCode();
        this.Mode = 'List';
      }
      else {
        this.toastr.warning(resp.message);
      }

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });

  }

  onDeleteChecked(ID) {
    //this.Loading = true;
    this.inventoryBarcode.deleteInventoryBarCodeByID(ID, 'LBS_INV_InventoryBarcode', localStorage.getItem('LoginID')).subscribe((resp: any) => {

      if (resp.isSuccess == true) {
        this.BindInventoryBarCode();
      }
      //this.Loading = false;
    }, (error) => {
      //this.Loading = false;
    });
  }
  
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
