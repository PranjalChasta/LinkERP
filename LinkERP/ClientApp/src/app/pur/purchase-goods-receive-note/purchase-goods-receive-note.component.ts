import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { WarehouseService } from 'src/app/inv/services/warehouse.service';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from 'src/app/inv/services/inventory.service';
import { PurchaseGoodsReceiveNoteService } from '../services/purchase-goods-receive-note.service';
import { LBSPURPurchaseGoodsReceiveNote } from 'src/app/models/pur/lbs-pur-purchase-goods-receive-note';
import { CustomValidators } from 'ngx-custom-validators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';

@Component({
  selector: 'app-purchase-goods-receive-note',
  templateUrl: './purchase-goods-receive-note.component.html',
  styleUrls: ['./purchase-goods-receive-note.component.css']
})
export class PurchaseGoodsReceiveNoteComponent implements OnInit {

  PurchaseGoodsReceiveNoteForm: FormGroup;
  Loading: any = false;
  Mode: any = 'List';
  submitted: boolean;
  Status: boolean;
  switchon: boolean;
  CompanyID = localStorage.getItem('CompanyID');
  Purchasegoodsreceivenotedetails: any[] = [];
  WareHouse: any[] = [];
  Vendor: any[] = [];
  addreadonly: boolean;
  PurchaseInvoice: any[] = [];
  AccessTab: string;
  SelectedPurchaseGRNID: any;
  modalRef: BsModalRef;
  PageSize: any;
  //Ag-grid 
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  IsActive: boolean;
  //Permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  Currentpage: string;
  constructor(
    private ReceiveNote: PurchaseGoodsReceiveNoteService,
    private deleteRecordsService: DeleteRecordsService,
    private WareHouseService: WarehouseService,
    private commonService: InvCommonService,
    private inventoryService: InventoryService,
    private cryptoAes: CryptoAes,
    private FB: FormBuilder,
    private toastr: ToastrService,
    public modalService: BsModalService,
    private sharedFormatterService: SharedFormatterService
  ) { }

  ngOnInit() {
    this.AccessTab = "PurchaseGRN";
    this.AgLoad = false;
    this.Mode = "List";
    //created purchase forms
    this.CreateForm();
    this.SetPermissions();
    this.GetAgColumns();
    this.BindPurchaseGoodsReceiveNote();
    this.BindVendor();
    this.BindWarehouse();
    this.BindPurchaseInvoice();
    this.PageSize = "50";
    this.Currentpage = "0";
  }
  GetAgColumns() {
    this.ColumnDefs = [
      { headerName: 'WareHouse', field: 'wareHouseName', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'GRNNo', field: 'grnNo', sortable: true, filter: true },
      { headerName: 'Reference', field: 'supplierDeliveryReference', sortable: true, filter: true },
      { headerName: 'Vendor', field: 'vendorAccountName', sortable: true, filter: true },
      { headerName: 'Received-Date', field: 'receivedDate', sortable: true, filter: true, valueFormatter: this.sharedFormatterService.dateFormatter },
       { headerName: 'Purchase Status ', field: 'status', sortable: true, filter: true },
      { headerName: 'Invoiced ', field: 'invoiced', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    ];
  }
  CreateForm() {
    this.PurchaseGoodsReceiveNoteForm = this.FB.group({
      ID: [''],
      CompanyID: ['-1'],
      WareHouseID: ['-1', CustomValidators.notEqual('-1')],
      VendorID: ['-1', CustomValidators.notEqual('-1')],
      PurchaseInvoiceID: ['-1', CustomValidators.notEqual('-1')],
      GRNNo: [''],
      SupplierDeliveryReference: [''],
      ReceivedDate: [new Date()],
      Insurance: [''],
      InsuranceTaxID: [''],
      InsuranceTaxRate: [''],
      InsuranceTaxAmount: [''],
      Freight: [''],
      FreightTaxID: [''],
      FreightTaxRate: [''],
      FreightTaxAmount: [''],
      Duty: [''],
      DutyTaxID: [''],
      DutyTaxRate: [''],
      DutyTaxAmount: [''],
      TotalExclusiveofTax: [''],
      TaxTotal: [''],
      TotalInclusiveofTax: [''],
      Status: ['true', Validators.required],
      Invoiced: ['']
    });
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "306");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.PurchaseGoodsReceiveNoteForm.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          this.PurchaseGoodsReceiveNoteForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.PurchaseGoodsReceiveNoteForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }

  get f() { return this.PurchaseGoodsReceiveNoteForm.controls; }
  //Resetting the form after Add/Edit
  ResetForm() {
    this.PurchaseGoodsReceiveNoteForm.patchValue({
      ID: '',
      CompanyID: '-1',
      WareHouseID: '-1',
      VendorID: '-1',
      PurchaseInvoiceID: '-1',
      ProductDescription: '',
      GRNNo: '',
      SupplierDeliveryReference: '',
      ReceivedDate: '',
      Insurance: '',
      InsuranceTaxID: '',
      InsuranceTaxAmount: '',
      Freight: '',
      FreightTaxID: '',
      FreightTaxRate: '',
      FreightTaxAmount: '',
      Duty: '',
      DutyTaxID: '',
      DutyTaxRate: '',
      DutyTaxAmount: '',
      TotalExclusiveofTax: '',
      TaxTotal: '',
      TotalInclusiveofTax: '',
      Status: '',
      Invoiced: new Date(),
    });
    this.PurchaseGoodsReceiveNoteForm.markAsUntouched();
    this.PurchaseGoodsReceiveNoteForm.markAsPristine();
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

  //add 
  AddNew(): void {
    this.Mode = 'Add';
    this.Status = false;
    this.addreadonly = false;
    this.IsActive = true;
    this.PurchaseGoodsReceiveNoteForm.enable();
  }
  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.Mode = "List";
  }
  //To bind the data of all goods to the Grid.
  BindPurchaseGoodsReceiveNote() {
    debugger;
    this.Loading = true;
    this.AgLoad = false;
    this.ReceiveNote.getpurchasegoodsreceivenote().subscribe((resp: any) => {
      console.log(resp);
      this.Purchasegoodsreceivenotedetails = resp.data.purchasegoodsreceivenotedetails;
      this.RowData = resp.data.purchasegoodsreceivenotedetails;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {

      this.Loading = false;
      //  this.toastr.error(error);
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindVendor() {
    this.Loading = true;
    this.commonService.getVendor().subscribe((resp: any) => {
      console.log(resp);
      this.Vendor = resp.data.vendors;
      this.Loading = false;

    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindWarehouse() {
    this.Loading = true;
    this.commonService.getWareHouse().subscribe((resp: any) => {
      console.log(resp);
      this.WareHouse = resp.data.warehouse;
      this.Loading = false;

    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindPurchaseInvoice() {
    this.Loading = true;
    this.ReceiveNote.getAllPurchaseInvoice().subscribe((resp: any) => {
      console.log(resp);
      this.PurchaseInvoice = resp.data.purchaseMain;
      this.Loading = false;

    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  onSaveold(saveAction) {
    debugger;
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    this.submitted = true;
    if (this.PurchaseGoodsReceiveNoteForm.invalid) {
      return;
    }
    this.Loading = true;
    let goods = new LBSPURPurchaseGoodsReceiveNote();
    goods.CompanyID = this.CompanyID;

    goods.WareHouseID = this.PurchaseGoodsReceiveNoteForm.get('WareHouseID').value;
    goods.GRNNo = this.PurchaseGoodsReceiveNoteForm.get('GRNNo').value;
    goods.SupplierDeliveryReference = this.PurchaseGoodsReceiveNoteForm.get('SupplierDeliveryReference').value;
    goods.VendorID = this.PurchaseGoodsReceiveNoteForm.get('VendorID').value;
    goods.ReceivedDate = this.PurchaseGoodsReceiveNoteForm.get('ReceivedDate').value;
    goods.Status = 1;
    //goods.Status = this.PurchaseGoodsReceiveNoteForm.get('Status').value;
    goods.Invoiced = this.PurchaseGoodsReceiveNoteForm.get('Invoiced').value;
    goods.PurchaseInvoiceID = this.PurchaseGoodsReceiveNoteForm.get('PurchaseInvoiceID').value;
    goods.Insurance = this.PurchaseGoodsReceiveNoteForm.get('Insurance').value;
    goods.InsuranceTaxID = this.PurchaseGoodsReceiveNoteForm.get('InsuranceTaxID').value;
    goods.InsuranceTaxRate = this.PurchaseGoodsReceiveNoteForm.get('InsuranceTaxRate').value;
    goods.InsuranceTaxAmount = this.PurchaseGoodsReceiveNoteForm.get('InsuranceTaxAmount').value;
    goods.Freight = this.PurchaseGoodsReceiveNoteForm.get('Freight').value;
    goods.FreightTaxID = this.PurchaseGoodsReceiveNoteForm.get('FreightTaxID').value;
    goods.FreightTaxRate = this.PurchaseGoodsReceiveNoteForm.get('FreightTaxRate').value;
    goods.FreightTaxAmount = this.PurchaseGoodsReceiveNoteForm.get('FreightTaxAmount').value;
    goods.Duty = this.PurchaseGoodsReceiveNoteForm.get('Duty').value;
    goods.DutyTaxID = this.PurchaseGoodsReceiveNoteForm.get('DutyTaxID').value;
    goods.DutyTaxRate = this.PurchaseGoodsReceiveNoteForm.get('DutyTaxRate').value;
    goods.DutyTaxAmount = this.PurchaseGoodsReceiveNoteForm.get('DutyTaxAmount').value;
    goods.TotalExclusiveofTax = this.PurchaseGoodsReceiveNoteForm.get('TotalExclusiveofTax').value;
    goods.TaxTotal = this.PurchaseGoodsReceiveNoteForm.get('TaxTotal').value;
    goods.TotalInclusiveofTax = this.PurchaseGoodsReceiveNoteForm.get('TotalInclusiveofTax').value;
    goods.CreatedBY = localStorage.getItem('LoginID');

    //If the mode Add will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.ReceiveNote.addpurchasegoodsreceivenote(goods).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Purchase Goods Receive Note details added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindPurchaseGoodsReceiveNote();
            this.Mode = 'List';
            this.ResetForm();
          }
          else{
            // this.SelectedPurchaseGRNID=resp.data.id;
            this.Edit(resp.data.id);
            this.BindPurchaseGoodsReceiveNote();
      
          }
      
          this.Loading = false;
        }
        else {
          this.toastr.error(resp.message);
        }
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      goods.ID = this.PurchaseGoodsReceiveNoteForm.get('ID').value;
      this.ReceiveNote.updatepurchasegoodsreceivenote(goods).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Purchase Goods Receive Note details updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindPurchaseGoodsReceiveNote();
            this.Mode = 'List';
            this.ResetForm();
          }
          else{
            let ID = this.PurchaseGoodsReceiveNoteForm.get('ID').value;
            this.Edit(ID);
          }
          // this.ResetForm();
          // this.BindPurchaseGoodsReceiveNote();
          // this.Mode = 'List';
        }
        else {
          this.toastr.error(resp.message);
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.AgEdit(event.data)
    //  this.SelectedPurchaseGRNID = event.data.id;
    } else if (colId == 'Delete') {
      this.OnDelete(event.data.id)
    }
  }
  Edit(ID): void {
    this.BindpurchasegoodsReceivebyID(ID);
    this.Mode = 'Edit';
  }
  BindpurchasegoodsReceivebyID(ID) {
    this.SelectedPurchaseGRNID=ID;
    this.PurchaseGoodsReceiveNoteForm.get('WareHouseID').disable();
    this.Status = true;
    this.addreadonly = true;
    this.ReceiveNote.getpurchasegoodsreceivenoteByID(ID).subscribe((resp: any) => {
      let measure: any = new LBSPURPurchaseGoodsReceiveNote();
      measure = resp.data.requisitiondetail;
      this.PurchaseGoodsReceiveNoteForm.patchValue({
        ID: measure.id,
        CompanyID: measure.companyID,
        WareHouseID: measure.wareHouseID,
        GRNNo: measure.grnNo,
        SupplierDeliveryReference: measure.supplierDeliveryReference,
        VendorID: measure.vendorID,
        ReceivedDate: measure.receivedDate,
        Status: measure.status,
        Invoiced: measure.invoiced,
        PurchaseInvoiceID: measure.purchaseInvoiceID,
        Insurance: measure.insurance,
        InsuranceTaxID: measure.insuranceTaxID,
        InsuranceTaxRate: measure.insuranceTaxRate,
        InsuranceTaxAmount: measure.insuranceTaxAmount,
        Freight: measure.freight,
        FreightTaxID: measure.freightTaxID,
        FreightTaxRate: measure.freightTaxRate,
        FreightTaxAmount: measure.freightTaxAmount,
        Duty: measure.duty,
        DutyTaxID: measure.dutyTaxID,
        DutyTaxRate: measure.dutyTaxRate,
        DutyTaxAmount: measure.dutyTaxAmount,
        TotalExclusiveofTax: measure.totalExclusiveofTax,
        TaxTotal: measure.taxTotal,
        TotalInclusiveofTax: measure.totalInclusiveofTax
      });
       if (!measure.deleted) {
        this.PurchaseGoodsReceiveNoteForm.enable();
        this.IsActive = true;
      } else {
        this.PurchaseGoodsReceiveNoteForm.disable();
        this.IsActive = false;
      }

      this.Mode = 'Edit';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  //edit operation
  AgEdit(event) {
    this.SelectedPurchaseGRNID = event.id;
    this.PurchaseGoodsReceiveNoteForm.get('WareHouseID').disable();
    this.Status = true;
    this.addreadonly = true;
 
    console.log(event);
    this.PurchaseGoodsReceiveNoteForm.patchValue({
      ID: event.id,
      CompanyID: event.companyID,
      WareHouseID: event.wareHouseID,
      GRNNo: event.grnNo,
      SupplierDeliveryReference: event.supplierDeliveryReference,
      VendorID: event.vendorID,
      ReceivedDate: event.receivedDate,
      Status: event.status,
      Invoiced: event.invoiced,
      PurchaseInvoiceID: event.purchaseInvoiceID,
      Insurance: event.insurance,
      InsuranceTaxID: event.insuranceTaxID,
      InsuranceTaxRate: event.insuranceTaxRate,
      InsuranceTaxAmount: event.insuranceTaxAmount,
      Freight: event.freight,
      FreightTaxID: event.freightTaxID,
      FreightTaxRate: event.freightTaxRate,
      FreightTaxAmount: event.freightTaxAmount,
      Duty: event.duty,
      DutyTaxID: event.dutyTaxID,
      DutyTaxRate: event.dutyTaxRate,
      DutyTaxAmount: event.dutyTaxAmount,
      TotalExclusiveofTax: event.totalExclusiveofTax,
      TaxTotal: event.taxTotal,
      TotalInclusiveofTax: event.totalInclusiveofTax,
    })
    if (!event.deleted)  {
      this.PurchaseGoodsReceiveNoteForm.enable();
      this.IsActive = true;
    } else {
      this.PurchaseGoodsReceiveNoteForm.disable();
      this.IsActive = false;
    }

    this.Mode = 'Edit';
  }

  OnDelete(ID) {
    debugger;
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_PUR_PurchaseGoodsReceiveNote', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.toastr.success('Currency  details deleted successfully');
      this.BindPurchaseGoodsReceiveNote();
      this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  onPurchaseInvoiceChange(ID) {
    debugger;
    if (ID != '-1') {
      let index = this.PurchaseInvoice.findIndex(c => c.id == ID);
      let data = this.PurchaseInvoice[index];
      this.PurchaseGoodsReceiveNoteForm.patchValue({
        Invoiced: data.status
      });
    } else {
      this.PurchaseGoodsReceiveNoteForm.patchValue({
        Invoiced: ''
      });
    }
  }
  switch(event) {
    debugger;
    if (event.toElement.checked == false) {
      this.toastr.warning('Invoice switchedoff');
    }
  }
  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;


}
