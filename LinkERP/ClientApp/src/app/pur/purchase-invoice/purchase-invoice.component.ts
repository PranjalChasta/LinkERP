import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PurchaseInvoiceService } from '../services/purchase-invoice.service';
import { PurchaseTemplateService } from 'src/app/inv/services/purchase-template.service';
import { LBSPURPurchaseInvoice } from 'src/app/models/pur/lbs-pur-purchase-invoice';
import { CustomValidators } from 'ngx-custom-validators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';
import { PurchaseInvoiceGoodsReceiveNote } from 'src/app/models/pur/PurchaseInvoiceGoodsReceiveNote';
import { LandedCostImportCostService } from '../services/landed-cost-import-cost.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { DeleteRecordsService } from '../../shared/services/deleterecords.service';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.css']
})
export class PurchaseInvoiceComponent implements OnInit {
  Mode: any = 'List';
  Submitted: any = false;
  CompanyID = localStorage.getItem('CompanyID');
  RowData: any;
  AgLoad: boolean = false;
  Loading: any = false;
  PurchaseInvoiceForm: FormGroup
  BindPurchaseInvoice: any;
  VendorList: any;
  ColumnDefs;
  modalRef: BsModalRef;
  PageSize: any;
  Currentpage: string;
  currencyList: any;
  TotalExcludingTax: any;
  TotalLineTax: any;
  VendorID: any;
  GRNList: any;
  displayGRN: boolean;
  ShowGRNTable: boolean = false;
  SelectedInvoiceID: any;
  AccessTab: string;
  CurrencyID: any;
  InventoryList: any;
  NonInventoryList: any;
  ProductList: any = [];
  taxcodes: any;
  IsActive: boolean;
  IsClose:boolean;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  constructor(
    private toastr: ToastrService,
    private FB: FormBuilder,
    private purchaseInvoiceService: PurchaseInvoiceService,
    private purchaseTemplateService: PurchaseTemplateService,
    public modalService: BsModalService,
    private commonService: InvCommonService,
    private sharedFormatterService: SharedFormatterService,
    private deleteRecordsService: DeleteRecordsService,
    private landedImportCostService: LandedCostImportCostService, private cryptoAes: CryptoAes
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.CreateForm();
    this.SetPermissions();
    this.BindPurchaseInvoices();
    this.BindVendors();
    this.BindTaxCode();
    //this.BindCurrency();
    this.onChanges();
    this.PageSize = "50";
    this.Currentpage = "0";
    this.ColumnDefs = [
      { headerName: 'Invoice No', field: 'invoiceNo', sortable: true, filter: true, checkboxSelection: false, },
      { headerName: 'Vendor', field: 'vendorAccountName', sortable: true, filter: true },
      { headerName: 'Invoice Date', field: 'invoiceDate', sortable: true, filter: true, },
      { headerName: 'Due Date ', field: 'dueDate', sortable: true, filter: true,},
      { headerName: 'Total Including Tax', field: 'totalIncludingTaxHome', sortable: true, filter: true },
      // { headerName: 'Currency', field: 'currencyID', sortable: true, filter: true },
      // { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: !this.write_Access },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }

    ];
  }
  get f() { return this.PurchaseInvoiceForm.controls; }
  get GRN(): FormArray {
    return this.PurchaseInvoiceForm.get('GRN') as FormArray;
  }
  //To Create a Form
  CreateForm() {
    this.PurchaseInvoiceForm = this.FB.group({
      ID: [''],
      InvoiceNo: ['', Validators.required],
      VendorID: ['-1', CustomValidators.notEqual('-1')],
      InvoiceDate: [new Date()],
      DueDate: [new Date()],
      Status: [false],
      Reversed: [false],
      Freight: ['', Validators.required],
      FreightTaxID: ['-1', CustomValidators.notEqual('-1')],
      FreightTaxRate: [0],
      FreightTaxAmount: ['', Validators.required],
      Duty: ['', Validators.required],
      DutyTaxID: ['-1', CustomValidators.notEqual('-1')],
      DutyTaxRate: [0],
      DutyTaxAmount: ['', Validators.required],
      Insurance: ['', Validators.required],
      InsuranceTaxID: ['-1', CustomValidators.notEqual('-1')],
      InsuranceTaxRate: [0],
      InsuranceTaxAmount: ['', Validators.required],
      TotalExcludingTaxHome: [0],
      TotalTaxHome: [0],
      InvoiceToleranceAmount: [0],
      InvoicedHomeAmount: [0],
      TotalIncludingTaxHome: [0],
      //CurrencyID: ['-1', CustomValidators.notEqual('-1')],
      GRN: this.FB.array([]),
    });
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  BindTaxCode() {
    this.landedImportCostService.getTaxCode().subscribe((resp: any) => {
      this.taxcodes = resp.data.taxDetails;
      console.log(this.taxcodes);

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onTaxDescriptionChange($event, TaxName) {
    let taxID = $event.target.value;
    let result = this.taxcodes.filter(x => x.id == taxID)
    if (result) {
      if (TaxName == 'FreightTaxRate') {
        this.PurchaseInvoiceForm.patchValue({ FreightTaxRate: result[0].taxRate });
      } else if (TaxName == 'DutyTaxRate') {
        this.PurchaseInvoiceForm.patchValue({ DutyTaxRate: result[0].taxRate });
      } else if (TaxName == 'InsuranceTaxRate') {
        this.PurchaseInvoiceForm.patchValue({ InsuranceTaxRate: result[0].taxRate });
      }

    }
  }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "309");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.PurchaseInvoiceForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.PurchaseInvoiceForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.PurchaseInvoiceForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  //To bind the data of all PurchaseInvoices to the Grid.
  BindPurchaseInvoices() {
    this.Mode = "List";
    this.AgLoad = false;
    this.purchaseInvoiceService.getAllPurchaseInvoice().subscribe((resp: any) => {
      this.BindPurchaseInvoice = resp.data.purchaseMain;
      this.RowData = resp.data.purchaseMain;
      this.RowData.forEach(element => {
        let invoiceDate = {'value': element.invoiceDate}
        let dueDate = {'value': element.dueDate}
        
        element.invoiceDate=this.sharedFormatterService.dateTimeFormatter(invoiceDate);
        element.dueDate=this.sharedFormatterService.dateTimeFormatter(dueDate);
      });
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the vendor names to the dropdown
  BindVendors() {
    this.commonService.getVendor().subscribe((resp: any) => {
      this.VendorList = resp.data.vendors;
      console.log(this.VendorList);

    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  // BindCurrency() {
  //   this.CurrencyService.getcurrency().subscribe((res: any) => {
  //     console.log(res);
  //     this.currencyList = res.data.currency;
  //   })
  // }
  setGRN(GRN: any[]): FormArray {
    const grnArray = new FormArray([]);
    GRN.forEach(a => {
      grnArray.push(this.FB.group({
        GRNNumber: a.grnNo,
        GRNID: a.id,
        WarehouseID: a.wareHouseID,
        Date: a.receivedDate,
        isGRNSelected: false
      }));
    })
    return grnArray
  }
  checkAll(selected) {
    if (selected.target.checked) {
      this.GRN.controls.forEach(a => {
        a.patchValue({ isGRNSelected: true });
      });
    }
    else {
      this.GRN.controls.forEach(a => {
        a.patchValue({ isGRNSelected: false });
      });
    }
  }
  onChanges() {
    //Total of all Insurance+Freight+duty
    this.PurchaseInvoiceForm.get('Freight').valueChanges.subscribe(val => {
      this.TotalExcludingTax = Number(this.PurchaseInvoiceForm.get('Insurance').value) + Number(this.PurchaseInvoiceForm.get('Duty').value) + Number(val);
      this.PurchaseInvoiceForm.patchValue({ TotalExcludingTaxHome: this.TotalExcludingTax });
    });
    this.PurchaseInvoiceForm.get('Duty').valueChanges.subscribe(val => {
      this.TotalExcludingTax = Number(this.PurchaseInvoiceForm.get('Insurance').value) + Number(this.PurchaseInvoiceForm.get('Freight').value) + Number(val);
      this.PurchaseInvoiceForm.patchValue({ TotalExcludingTaxHome: this.TotalExcludingTax });
    });
    this.PurchaseInvoiceForm.get('Insurance').valueChanges.subscribe(val => {
      this.TotalExcludingTax = Number(this.PurchaseInvoiceForm.get('Duty').value) + Number(this.PurchaseInvoiceForm.get('Freight').value) + Number(val);
      this.PurchaseInvoiceForm.patchValue({ TotalExcludingTaxHome: this.TotalExcludingTax });
    });

    //Total of all taxes
    this.PurchaseInvoiceForm.get('FreightTaxAmount').valueChanges.subscribe(val => {
      this.TotalLineTax = Number(this.PurchaseInvoiceForm.get('InsuranceTaxAmount').value) + Number(this.PurchaseInvoiceForm.get('DutyTaxAmount').value) + Number(val);
      this.PurchaseInvoiceForm.patchValue({ TotalTaxHome: this.TotalLineTax });
    });
    this.PurchaseInvoiceForm.get('DutyTaxAmount').valueChanges.subscribe(val => {
      this.TotalLineTax = Number(this.PurchaseInvoiceForm.get('InsuranceTaxAmount').value) + Number(this.PurchaseInvoiceForm.get('FreightTaxAmount').value) + Number(val);
      this.PurchaseInvoiceForm.patchValue({ TotalTaxHome: this.TotalLineTax });
    });
    this.PurchaseInvoiceForm.get('InsuranceTaxAmount').valueChanges.subscribe(val => {
      this.TotalLineTax = Number(this.PurchaseInvoiceForm.get('DutyTaxAmount').value) + Number(this.PurchaseInvoiceForm.get('FreightTaxAmount').value) + Number(val);
      this.PurchaseInvoiceForm.patchValue({ TotalTaxHome: this.TotalLineTax });
    });

    //Dropdown Value Changed

    this.PurchaseInvoiceForm.get('VendorID').valueChanges.subscribe(val => {
      if (val != -1) {
        this.VendorID = this.PurchaseInvoiceForm.get('VendorID').value;
        let VendorData = this.VendorList.filter(x => x.id == this.VendorID)
        this.CurrencyID = VendorData[0].currencyID;
        this.purchaseInvoiceService.getPurchaseGRNList(this.VendorID).subscribe((resp: any) => {
          this.GRNList = resp.data.grnList
          console.log(this.GRNList);
          ;
          if (this.GRNList.length !== 0) {
            this.PurchaseInvoiceForm.setControl('GRN', this.setGRN(this.GRNList));
            this.ShowGRNTable = true;
          }
        })
      }
    });



  }
  //To save the Vendor Price Scheme  to database table by calling the API service
  //onSave() {
  //  this.confirmation.ConfirmationPopup('Are you sure to save record?');
  //}
  onSave(saveAction) {
    this.Submitted = true;
    if (this.PurchaseInvoiceForm.invalid) {
      return;
    }
    debugger;
    let purchaseinvoice = new LBSPURPurchaseInvoice();
    purchaseinvoice.CompanyID = this.CompanyID;
    purchaseinvoice.InvoiceNo = this.PurchaseInvoiceForm.get('InvoiceNo').value;
    purchaseinvoice.VendorID = this.PurchaseInvoiceForm.get('VendorID').value;
    purchaseinvoice.InvoiceDate = this.PurchaseInvoiceForm.get('InvoiceDate').value;
    purchaseinvoice.DueDate = this.PurchaseInvoiceForm.get('DueDate').value;
    // purchaseinvoice.Status = this.PurchaseInvoiceForm.get('Status').value;
    // purchaseinvoice.Reversed = this.PurchaseInvoiceForm.get('Reversed').value;
    purchaseinvoice.Freight = this.PurchaseInvoiceForm.get('Freight').value;
    purchaseinvoice.FreightTaxID = this.PurchaseInvoiceForm.get('FreightTaxID').value;
    purchaseinvoice.FreightTaxRate = this.PurchaseInvoiceForm.get('FreightTaxRate').value;
    purchaseinvoice.FreightTaxAmount = this.PurchaseInvoiceForm.get('FreightTaxAmount').value;
    purchaseinvoice.Duty = this.PurchaseInvoiceForm.get('Duty').value;
    purchaseinvoice.DutyTaxID = this.PurchaseInvoiceForm.get('DutyTaxID').value;
    purchaseinvoice.DutyTaxRate = this.PurchaseInvoiceForm.get('DutyTaxRate').value;
    purchaseinvoice.DutyTaxAmount = this.PurchaseInvoiceForm.get('DutyTaxAmount').value;
    purchaseinvoice.Insurance = this.PurchaseInvoiceForm.get('Insurance').value;
    purchaseinvoice.InsuranceTaxID = this.PurchaseInvoiceForm.get('InsuranceTaxID').value;
    purchaseinvoice.InsuranceTaxRate = this.PurchaseInvoiceForm.get('InsuranceTaxRate').value;
    purchaseinvoice.InsuranceTaxAmount = this.PurchaseInvoiceForm.get('InsuranceTaxAmount').value;
    purchaseinvoice.TotalExcludingTaxHome = this.PurchaseInvoiceForm.get('TotalExcludingTaxHome').value;
    purchaseinvoice.TotalTaxHome = this.PurchaseInvoiceForm.get('TotalTaxHome').value;
    purchaseinvoice.InvoiceToleranceAmount = this.PurchaseInvoiceForm.get('InvoiceToleranceAmount').value;
    purchaseinvoice.InvoicedHomeAmount = this.PurchaseInvoiceForm.get('InvoicedHomeAmount').value;
    purchaseinvoice.TotalIncludingTaxHome = this.PurchaseInvoiceForm.get('TotalIncludingTaxHome').value;
    purchaseinvoice.CurrencyID = this.CurrencyID;
    purchaseinvoice.CreatedBY = localStorage.getItem('LoginID');
    //If the mode is Add then it will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      let submitPurchaseInvoiceGRN: PurchaseInvoiceGoodsReceiveNote[] = [];
      this.GRN.controls.forEach(a => {
        if (a.get('isGRNSelected').value) {
          let purchaseInvoice: any = new PurchaseInvoiceGoodsReceiveNote();
          purchaseInvoice.WarehouseID = a.get('WarehouseID').value;
          purchaseInvoice.GRNID = a.get('GRNID').value;
          purchaseInvoice.GRNNumber = a.get('GRNNumber').value;
          purchaseInvoice.ReceivedDate = a.get('Date').value;
          purchaseInvoice.CraetedBy = localStorage.getItem('LoginID');
          submitPurchaseInvoiceGRN.push(purchaseInvoice);
        }
      });

      let PurchaseInvoiceData = {
        PurchaseInvoice: purchaseinvoice,
        PurchaseInvoiceGRN: submitPurchaseInvoiceGRN
      }
      console.log(PurchaseInvoiceData);

      this.purchaseInvoiceService.addPurchaseInvoice(PurchaseInvoiceData).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success(' Purchase Invoice  added successfully');
          //this.BindPurchaseInvoices();
          //this.Mode = 'List';
          //this.Loading = false;
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindPurchaseInvoices();
            this.Mode = 'List';
          }
          else {
            this.SelectedInvoiceID = resp.data.id;
            this.ResetForm();
            this.getPurchaseInvoiceByID();
            this.BindPurchaseInvoices();
            this.Mode = 'Edit';
            this.AccessTab = 'PurchaseInvoice';
          }
        }
      });
    }
    else if (this.Mode == 'Edit') {
      purchaseinvoice.ID = this.PurchaseInvoiceForm.get('ID').value;
      this.purchaseInvoiceService.updatePurchaseInvoice(purchaseinvoice).subscribe((resp: any) => {
        this.toastr.success('Purchase Invoice  updated successfully')
        if (saveAction == 'Close') {
          this.Cancel();
          this.BindPurchaseInvoices();
          this.Mode = 'List';
        }
        else {
          this.SelectedInvoiceID = resp.data.id;
          this.ResetForm();
          this.getPurchaseInvoiceByID();
          this.BindPurchaseInvoices();
          this.Mode = 'Edit';
          this.AccessTab = 'PurchaseInvoice';
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  getPurchaseInvoiceByID() {
    this.purchaseInvoiceService.getPurchaseInvoiceByID(this.SelectedInvoiceID).subscribe((resp: any) => {
      this.SelectedInvoiceID = resp.data.purchaseMain[0].id;
      this.BindPurchaseInvoiceDetails(resp.data.purchaseMain[0]);
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the data to the grid while editing
  BindPurchaseInvoiceDetails(event) {
    debugger;
    this.SelectedInvoiceID = event.id;
    this.PurchaseInvoiceForm.patchValue({
      ID: event.id,
      InvoiceNo: event.invoiceNo,
      VendorID: event.vendorID,
      InvoiceDate: event.invoiceDate,
      DueDate: event.dueDate,
      Status: event.status,
      Reversed: event.reversed,
      Freight: event.freight,
      FreightTaxID: event.freightTaxID,
      FreightTaxRate: event.freightTaxRate,
      FreightTaxAmount: event.freightTaxAmount,
      Duty: event.duty,
      DutyTaxID: event.dutyTaxID,
      DutyTaxRate: event.dutyTaxRate,
      DutyTaxAmount: event.dutyTaxAmount,
      Insurance: event.insurance,
      InsuranceTaxID: event.insuranceTaxID,
      InsuranceTaxRate: event.insuranceTaxRate,
      InsuranceTaxAmount: event.insuranceTaxAmount,
      TotalExcludingTaxHome: event.totalExcludingTaxHome,
      TotalTaxHome: event.totalTaxHome,
      InvoiceToleranceAmount: event.invoiceToleranceAmount,
      InvoicedHomeAmount: event.invoicedHomeAmount,
      TotalIncludingTaxHome: event.totalIncludingTaxHome,
      CurrencyID: event.currencyID
    })
    if (event.deleteStatus == 'Active') {
      this.PurchaseInvoiceForm.enable();
      this.IsActive = true;
    } else {
      this.PurchaseInvoiceForm.disable();
      this.IsActive = false;
    }
    if(event.status)
    {
      this.PurchaseInvoiceForm.disable();
      this.IsClose=true;
    }
    else{
      this.IsClose=false;
    }
   
  }
  //To Add new Purchase Invoice
  CreatePO() {
    this.IsActive = false;
    this.IsClose=false;
    this.Mode = 'Add';
    this.ShowGRNTable = false;
  }
  //Cancel the Add/Edit
  Cancel() {
    this.ResetForm();
    this.Submitted = false;
    this.Mode = "List";
  }
  //To create the States Form Controls.
  ResetForm() {
    this.PurchaseInvoiceForm.patchValue({
      ID: '',
      InvoiceNo: '',
      VendorID: '-1',
      InvoiceDate: [new Date()],
      DueDate: [new Date()],
      Status: [false],
      Reversed: [false],
      Freight: 0,
      Duty: 0,
      Insurance: 0,
      FreightTaxID: '-1',
      FreightTaxRate: 0,
      FreightTaxAmount: 0,
      DutyTaxID: '-1',
      DutyTaxRate: 0,
      DutyTaxAmount: 0,
      InsuranceTaxID: '-1',
      InsuranceTaxRate: 0,
      InsuranceTaxAmount: 0,
      CurrencyID: '',
      TotalExcludingTaxHome: 0,
      TotalTaxHome: 0,
      InvoiceToleranceAmount: 0,
      InvoicedHomeAmount: 0,
      TotalIncludingTaxHome: 0,
    });


  }
  //For Ag-Grid
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Mode = 'Edit';
      this.AccessTab = 'PurchaseInvoice';
      this.BindPurchaseInvoiceDetails(event.data)

    }
     else if (colId == 'Delete') {
       this.onDeleteChecked(event.data.id)
     }
  }

  onDeleteChecked(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_PUR_PurchaseInvoice', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindPurchaseInvoices();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  DeleteGRN(i, grnID) {

  }
  ShowInventory() {
    this.AccessTab = 'Inventory';
    this.ProductList = [];
    this.purchaseInvoiceService.getPurchaseInvoiceDetailsByID(this.SelectedInvoiceID, 'INV').subscribe((resp: any) => {
      this.ProductList = resp.data.purchaseInvoiceDetails;
      console.log(this.ProductList);
    })
  }
  ShowNonInventory() {
    this.AccessTab = 'Non-Inventory';
    this.ProductList = [];
    this.purchaseInvoiceService.getPurchaseInvoiceDetailsByID(this.SelectedInvoiceID, 'Non').subscribe((resp: any) => {
      console.log(resp);
      this.ProductList = resp.data.purchaseInvoiceDetails;
    })
  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
  AcivateInvoice() {
    debugger;
    this.purchaseInvoiceService.ActivatePurInvoice(this.SelectedInvoiceID).subscribe((resp: any) => {
     // this.ProductList = resp.data.purchaseInvoiceDetails;
     if(resp.isSuccess)
     { this.toastr.success('Purchase Invoice  closed successfully')
        this.PurchaseInvoiceForm.disable();
        this.IsClose = true;
      }
     
    });
  }
}
