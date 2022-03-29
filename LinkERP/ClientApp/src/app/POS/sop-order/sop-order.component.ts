import { Component,ElementRef, ViewChild , OnInit ,TemplateRef} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { PurchaseOrderService } from 'src/app/pur/services/purchase-order.service';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { WorkflowService } from 'src/app/sys/services/workflow.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';
import { PriceGroupsService } from 'src/app/inv/services/price-groups.service';
import { CustomValidators } from 'ngx-custom-validators';
import { QuotationService } from '../services/quotation.service';
import { LbsSopOrderMain } from 'src/app/models/pos/lbs_sop_ordermain';
import { SopOrderService } from '../services/sop-order.service';
import { SopCommonService } from '../services/sop-common.service';

@Component({
  selector: 'app-sop-order',
  templateUrl: './sop-order.component.html',
  styleUrls: ['./sop-order.component.css']
})
export class SopOrderComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  DebtorList: any;
  SopOrderForm: FormGroup;
  SopOrderEmailForm: FormGroup;
  Mode;
  ColumnDefs;
  SopOrder: any; 
  RowData: any;
  AgLoad = false;
  POTotalTax: number = 0;
  submitted: boolean;
  CompanyID = localStorage.getItem('CompanyID');
  WarehouseList: any;
  SelectedSopOrderID: any;
  SelctedDebtorID: any;
  VendorID: any;
  poWorkFlow: any;
  SopOrderStatus: any;
  isApprover: boolean;
  IsCreatedBY: boolean;
  write_Access: boolean;
  modalRef: BsModalRef;
  AccessTab: string;
  PageSize: any;
  Currentpage: string;
  IsSave: boolean;
  TaxcodeList: any;
  IsActive: boolean;
  PriceWorkflowList: any;
  QuotationList: any;
  SalesOrderTypeList: any;
  WareHouseId: any;
  CreditReason: any;
  CopySOPOrder:boolean;
  CurrentShiftID: any;
  CurrentShiftNo: any;
  OrderStatus:boolean;
  constructor(
    public toastr: ToastrService,
    private FB: FormBuilder,
    private deleteRecordsService: DeleteRecordsService,
    private quotationServcie: QuotationService,
    public invCommonService: InvCommonService,
    private workflowservice: WorkflowService,
    public modalService: BsModalService,
    private commonService: SysCommonService,
    private sopcommonservice: SopCommonService,
    private sharedFormatterService: SharedFormatterService,
    private soporderService: SopOrderService,
  ) { }

  ngOnInit() {
    this.GetCurrentshift()
    this.AccessTab = "SOPOrder";
    this.Mode = "List";
    this.AccessTab = "SOPOrder";
    this.isApprover = true;
    this.write_Access = true;
    this.CreateForm();
    this.GetAgColumns();
    this.GetAllDebtors();
    this.BindWarehouse();
    
    this.GetPriceWorkflowOptions();
    this.GetQuotationMains();
    this.GetCreditReason();
    this.SopOrderForm.reset();
    //this.ResetForm();
    this.GetAllOrderMains();
    this.Mode = "List";
    this.Currentpage = "0";
    this.PageSize = "50";
    this.SalesOrderTypeList =
      [
        { id: '1', name: 'Cash' },
        { id: '2', name: 'Credit' },
        { id: '3', name: 'LayBy' },
        { id: '4', name: 'Invoice Credit Note' }
      ];
    
  }
  get f() { return this.SopOrderForm.controls; }
  CreateForm() {
    this.SopOrderForm = this.FB.group({
      ID: [''],
      CompanyID: [''],
      QuotationID: [''],
      SalesOrderNo: [''],
      DebtorID: ['-1', CustomValidators.notEqual('-1')],
      DebtorContactName: [''],
      TransactionDate: [''],
      CustomerOrderNo: [''],
      InvoiceNotes1: [''],
      InvoiceNotes2: [''],
      Status: [false],
      SalesOrderType: ['00000000-0000-0000-0000-000000000000'],
      WarehouseID: ['-1', CustomValidators.notEqual('-1')],
      ExpectedDeliveryDate: [''],
      PriceSchemeID: ['00000000-0000-0000-0000-000000000000'],
      InvoiceTotal: ['0.0000'],
      Printed: [false],
      Emailed: [false],
      SalesPerson: [''],
      Company: [''],
      Address1: [''],
      Address2: [''],
      Address3: [''],
      Address4: [''],
      PostCode: [''],
      Phone: [''],
      Fax: [''],
      Email: [''],
      ContactName: [''],
      CreditNote: [false],
      CreditNoteSalesOrderID: [''],
      CreditReasonID: ['-1'],
      CreditIntoStock: [false],
      TaxIntegrationStatus: [false],
      SDCInvoiceNumber: [''],
      SDCReprintInvoiceNumber: [''],
      SDCDateTime: [''],
      SDCInvoiceCounter: [''],
      SDCVerificationURL: [''],
      ShiftID: [this.CurrentShiftNo],
    })
  }
  AddNewSopOrder() {
    this.CreateForm()
    this.Mode = 'Add'; 
   // this.SopOrderForm.get('DebtorID').enable();
  }

  GetPriceWorkflowOptions() {
    this.sopcommonservice.GetPriceWorkflowOptions().subscribe((resp: any) => {
      this.PriceWorkflowList = resp.data.price;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  GetQuotationMains() {
    this.sopcommonservice.GetQuotationMains().subscribe((resp: any) => {
      this.QuotationList = resp.data.quotation;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  GetAllDebtors() {
    this.invCommonService.getalldebtor().subscribe((resp: any) => {
      this.DebtorList = resp.data.debtors;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindWarehouse() {
    debugger;
    this.invCommonService.getWareHouse().subscribe((resp: any) => {
      this.WarehouseList = resp.data.warehouse;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  GetAllOrderMains() {
    this.AgLoad = false;
    this.soporderService.GetAllOrderMains().subscribe((resp: any) => {
      this.RowData = resp.data.order;
      console.log(this.RowData);
      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  GetCreditReason() {
    this.soporderService.GetCreditReasonList().subscribe((resp: any) => {
      console.log(resp.data);
      this.CreditReason = resp.data.credit;
      //this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  GetAgColumns() {
    this.ColumnDefs = [
      { headerName: 'Contact Name', field: 'debtorContactName', sortable: true, filter: true },
      { headerName: 'Sales OrderNo', field: 'salesOrderNo', sortable: true, filter: true },
      { headerName: 'SalesPerson', field: 'salesPerson', sortable: true, filter: true },
      //{ headerName: 'Warehouse', field: 'wareHouseName', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 80, },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    ];
  }
  onSave(SaveAction) {
    debugger;
    this.submitted = true;
    if (this.SopOrderForm.invalid) {
      return;
    }

    let lbssoporderMain = new LbsSopOrderMain();
    lbssoporderMain.CompanyID = localStorage.getItem('CompanyID');
    lbssoporderMain.DebtorID = this.SopOrderForm.get('DebtorID').value;
    lbssoporderMain.QuotationID = this.SopOrderForm.get('QuotationID').value;
    //'F9BCF822-358A-4BF9-994A-1D8565257C95';
    //this.SopOrderForm.get('QuotationID').value;
    lbssoporderMain.SalesOrderNo = this.SopOrderForm.get('SalesOrderNo').value;
    lbssoporderMain.DebtorContactName = this.SopOrderForm.get('DebtorContactName').value;
    lbssoporderMain.TransactionDate = this.SopOrderForm.get('TransactionDate').value;
    lbssoporderMain.CustomerOrderNo = this.SopOrderForm.get('CustomerOrderNo').value;
    lbssoporderMain.InvoiceNotes1 = this.SopOrderForm.get('InvoiceNotes1').value;
    lbssoporderMain.InvoiceNotes2 = this.SopOrderForm.get('InvoiceNotes2').value;
    lbssoporderMain.Status = this.SopOrderForm.get('Status').value;
    lbssoporderMain.SalesOrderType = this.SopOrderForm.get('SalesOrderType').value;
    lbssoporderMain.WarehouseID = this.SopOrderForm.get('WarehouseID').value;
    lbssoporderMain.ExpectedDeliveryDate = this.SopOrderForm.get('ExpectedDeliveryDate').value;
    lbssoporderMain.PriceSchemeID = this.SopOrderForm.get('PriceSchemeID').value;
    lbssoporderMain.InvoiceTotal = 0.0000// this.SopOrderForm.get('InvoiceTotal').value;
    lbssoporderMain.Printed = this.SopOrderForm.get('Printed').value;
    lbssoporderMain.Emailed = this.SopOrderForm.get('Emailed').value;
    lbssoporderMain.SalesPerson = this.SopOrderForm.get('SalesPerson').value;
    lbssoporderMain.Company = this.SopOrderForm.get('Company').value;
    lbssoporderMain.Address1 = this.SopOrderForm.get('Address1').value;
    lbssoporderMain.Address2 = this.SopOrderForm.get('Address2').value;
    lbssoporderMain.Address3 = this.SopOrderForm.get('Address3').value;
    lbssoporderMain.Address4 = this.SopOrderForm.get('Address4').value;
    lbssoporderMain.PostCode = this.SopOrderForm.get('PostCode').value;
    lbssoporderMain.Phone = this.SopOrderForm.get('Phone').value;
    lbssoporderMain.Fax = this.SopOrderForm.get('Fax').value;
    lbssoporderMain.Email = this.SopOrderForm.get('Email').value;
    lbssoporderMain.ContactName = this.SopOrderForm.get('ContactName').value;
    lbssoporderMain.CreditNote = this.SopOrderForm.get('CreditNote').value;
    lbssoporderMain.CreditNoteSalesOrderID = this.SopOrderForm.get('CreditNoteSalesOrderID').value;
    lbssoporderMain.CreditReasonID = this.SopOrderForm.get('CreditReasonID').value;
    lbssoporderMain.CreditIntoStock = this.SopOrderForm.get('CreditIntoStock').value;
    lbssoporderMain.TaxIntegrationStatus = this.SopOrderForm.get('TaxIntegrationStatus').value;
    lbssoporderMain.SDCInvoiceNumber = this.SopOrderForm.get('SDCInvoiceNumber').value;
    lbssoporderMain.SDCReprintInvoiceNumber = this.SopOrderForm.get('SDCReprintInvoiceNumber').value;
    lbssoporderMain.SDCDateTime = this.SopOrderForm.get('SDCDateTime').value;
    lbssoporderMain.SDCInvoiceCounter = this.SopOrderForm.get('SDCInvoiceCounter').value;
    lbssoporderMain.SDCVerificationURL = this.SopOrderForm.get('SDCVerificationURL').value;
    lbssoporderMain.ShiftID =this.CurrentShiftID; //this.SopOrderForm.get('ShiftID').value;
    // quotation.QuotationNo = '005';
    // lbssoporderMain.PriceSchemeID = '123ASC';
    if (this.Mode == 'Add' || this.Mode=='Copy') {
      this.soporderService.AddOrderMain(lbssoporderMain).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
         // this.toastr.success('Sop Order Main added successfully');
          this.CopySOPOrder ? this.toastr.success("Sop Order has been copied successfully") : this.toastr.success(resp.message);
          this.submitted = false;
          if (SaveAction == 'Close') {
            /* this.Cancel();
            this.ResetForm();
            this.BindPurchaseOrder(); */
            this.Mode = 'List';
          }
          else {
            /*  this.ResetForm();
             this.SelectedPurchaseOrderID = resp.data.id;
             this.BindPurchaseOrderByID(this.SelectedPurchaseOrderID); */
            //  this.getRequisitionByID();
            // this.BindRequisitions();
            //this.Mode = 'List';
          }
          this.CopySOPOrder = false;
          // this.Loading = false;
        }
      },
        (error) => {
          console.error('Problem with the sevice. Please try later : ' + error.message);
        });
    }
    else if (this.Mode == 'Edit') {
      debugger
      lbssoporderMain.ID = this.SelectedSopOrderID;
      this.soporderService.UpdateOrderMain(lbssoporderMain).subscribe((resp: any) => {
        this.toastr.success('Sop Order has been updated successfully');
         if (SaveAction == 'Close') {
          //this.ResetForm();
          this.Mode = 'List';
          this.submitted = false;
        }
        else {
          this.Mode = 'Edit';
        }
        //this.Loading = false;
      }, (error) => {
        // this.Loading = false;
      });
      this.submitted = false;
    }
  }

  onDebtorChange(e) {
    let debtorId = e;
    this.quotationServcie.getDebtorDetails(debtorId).subscribe((resp: any) => {
      console.log(resp);
      this.SopOrderForm.patchValue({
        Company: resp.data.debtorDetails.companyName,
        Fax: resp.data.debtorDetails.Fax,
        Phone: resp.data.debtorDetails.Phone,
        EmailAddress: resp.data.debtorDetails.emailAddress,
        PostCode: resp.data.debtorDetails.zipCode,
        Address1: resp.data.debtorDetails.address1,
        Address2: resp.data.debtorDetails.address2,
        Address3: resp.data.debtorDetails.address3,
        Address4: resp.data.debtorDetails.address4,
        DebtorContactName: resp.data.debtorDetails.debtorAccountName
      })
    });
  }

  OnActionClick(event: any) {
    var colId = event.column.getId();
    debugger;

    if (colId == 'Edit') {
      this.SelectedSopOrderID = event.data.id;
      this.WareHouseId = event.data.warehouseID;
      this.SelctedDebtorID=event.data.debtorID;
      this.OrderStatus=event.data.status;
      this.Onedit();
      /* this.wareHouseId = event.data.warehouseID;
       this.AgEdit(event.data)
       this.AccessTab = 'Quotation';
       this.SelectedSopOrderID = event.data.id; */
    } else if (colId == 'Delete') {
      //this.onDeleteQuotation(event.data.id)
    }
  }

  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  Onedit() {
    this.soporderService.GetOrderMainByID(this.SelectedSopOrderID).subscribe((resp: any) => {
      this.AgEdit(resp.data.order);
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  AgEdit(event) {
    console.log(event);
    this.SopOrderForm.patchValue({
      ID: event.id,
      CompanyID: event.companyID,
      QuotationID: event.quotationID,
      SalesOrderNo: event.salesOrderNo,
      DebtorID: event.debtorID,
      DebtorContactName: event.debtorContactName,
      TransactionDate: event.transactionDate,
      CustomerOrderNo: event.customerOrderNo,
      InvoiceNotes1: event.invoiceNotes1,
      InvoiceNotes2: event.invoiceNotes2,
      Status: event.status,
      SalesOrderType: event.salesOrderType,
      WarehouseID: event.warehouseID,
      ExpectedDeliveryDate: event.expectedDeliveryDate,
      PriceSchemeID: event.priceSchemeID,
      InvoiceTotal: event.invoiceTotal != null? event.invoiceTotal.toString().indexOf(".") !== -1 ? event.invoiceTotal:event.invoiceTotal +".0000":"0.0000",
      Printed: event.printed,
      Emailed: event.emailed,
      SalesPerson: event.salesPerson,
      Company: event.company,
      Address1: event.address1,
      Address2: event.address2,
      Address3: event.address3,
      Address4: event.address4,
      PostCode: event.postCode,
      Phone: event.phone,
      Fax: event.fax,
      Email: event.email,
      ContactName: event.contactName,
      CreditNote: event.creditNote,
      CreditNoteSalesOrderID: event.creditNoteSalesOrderID,
      CreditReasonID: event.creditReasonID,
      CreditIntoStock: event.creditIntoStock,
      TaxIntegrationStatus: event.taxIntegrationStatus,
      SDCInvoiceNumber: event.sdcInvoiceNumber,
      SDCReprintInvoiceNumber: event.sdcReprintInvoiceNumber,
      SDCDateTime: event.sdcDateTime,
      SDCInvoiceCounter: event.sdcInvoiceCounter,
      SDCVerificationURL: event.sDCVerificationURL,
      ShiftID: event.shiftNo
    });
    this.SelectedSopOrderID = event.id;
    this.Mode = 'Edit';
    //  this.readonly = true;
    if (event.deleteStatus == 'Active') {
      this.SopOrderForm.enable();
      this.IsActive = true;
    } else {
      this.SopOrderForm.disable();
      this.IsActive = false;
    }
    this.SopOrderForm.get('DebtorID').disable();
  }
  Cancel(): void {
    this.SopOrderForm.reset();
    //this.ResetForm();
    this.GetAllOrderMains();
    this.Mode = "List";
  }
  Email(email: TemplateRef<any>) {
    //Send Email
    debugger;
    localStorage.getItem('Email');
    this.SopOrderEmailForm = this.FB.group({
      FromEmail: [''],
      ToEmail: [this.SopOrderForm.get('Email').value],
      Subject: [''],
      MessageBody: [''],

    });
    this.modalRef = this.modalService.show(email);

    this.SopOrderEmailForm;
  }
  CopySopOrder(){
    //Copy SameQuote to a new one
    this.Mode = 'Copy';
    this.CopySOPOrder = true;
    this.SopOrderForm.enable();
  }
  ProcessSalesOrder(){

    this.SopOrderForm.patchValue({ Status: false });

   }
  closePopUp(){
    this.closeBtn.nativeElement.click();
    // document.getElementById("myModal").hidden = false;
    // document.getElementById("myModal").style.visibility = "hidden";
    // document.getElementById("myModal").style.display = "none";
  }
 
  GetCurrentshift()
  {
   
    this.soporderService.GetShift(this.CompanyID).subscribe((resp: any) => {
   this.CurrentShiftID=resp.data.id;
   this.CurrentShiftNo=resp.data.shiftNo;
    console.log(this.CurrentShiftNo)
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}
