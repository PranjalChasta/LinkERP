import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, EmailValidator } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { CustomValidators } from 'ngx-custom-validators';
import { QuotationService } from '../services/quotation.service';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { LbsPosQuotation } from 'src/app/models/pos/lbs_pos_quotation';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { LbsSopQuotationemail } from 'src/app/models/pos/lbs-sop-quotationemail';
@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {
  QuotationForm: FormGroup;
  QuotationEmailForm: FormGroup;
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
  submitted: boolean;
  SaveAction: string;
  IsActive: boolean;
  AccessTab: string;
  Warehouse: any;
  SelectedQuotationID: any;
  QuotationID: any;
  Debtor: any;
  wareHouseId: any;
  opportunityList: any;
  opportunityStatusReasonList: any[];
  QuotationNo: any;
  CopyQuote: boolean;
  modalRef: BsModalRef;
  IsCloseQuotation:boolean;
  lbsSopQuotationMail: any = new LbsSopQuotationemail();
  constructor(
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    private FB: FormBuilder,
    private invCommonService: InvCommonService,
    private quotationServcie: QuotationService,
    private sharedFormatterService: SharedFormatterService,
    private sysCommonService: SysCommonService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.IsCloseQuotation=true;
    this.AccessTab = "Quotation";
    this.CreateForm();
    this.SetPermissions();
    this.GetAgColumns();
    this.GetQuotationList();
    this.BindOpportunityStatus();

    this.GetAllDebtors();
    // this.onChange();
    this.BindWarehouse();
    this.Currentpage = "0";
    this.PageSize = "50";
  }
  get f() { return this.QuotationForm.controls; }

  SetPermissions() {
    // let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    // let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    // let Permissions = JSON.parse(Permissionsstr);
    // let index = Permissions.findIndex(c => c.menuID == "404");
    // if (index >= 0) {
    //   let ModulePermissions = Permissions[index];
    //   this.read_Access = ModulePermissions.read_Access;
    //   this.write_Access = ModulePermissions.write_Access;
    //   this.delete_Access = ModulePermissions.delete_Access;
    //   this.all_Access = ModulePermissions.all_Access;
    //   this.QuotationForm.enable();
    //   if (!this.all_Access) {
    //     if (!this.write_Access) {
    //       this.QuotationForm.disable();
    //     }
    //   } else {
    //     this.read_Access = true;
    //     this.write_Access = true;
    //     this.delete_Access = true;
    //     this.all_Access = true;
    //   }
    // }
    // else {
    //   this.QuotationForm.disable();
    //   this.read_Access = false;
    //   this.write_Access = false;
    //   this.delete_Access = false;
    //   this.all_Access = false;
    // }
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "408");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.QuotationForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.QuotationForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.QuotationForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  GetAgColumns() {
    this.ColumnDefs = [
      { headerName: 'DebtorContactName', field: 'debtorContactName', sortable: true, filter: true },
      { headerName: 'ExpectedDeliveryDate', field: 'expectedDeliveryDate', sortable: true, filter: true, valueFormatter: this.sharedFormatterService.dateFormatter },
      { headerName: 'SalesPerson', field: 'salesPerson', sortable: true, filter: true },
      { headerName: 'Warehouse', field: 'wareHouseName', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 80, },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
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
    this.QuotationForm.get('Debtor').enable();
    this.IsActive = true;
    this.IsCloseQuotation=true;
  }

  CreateForm() {
    this.QuotationForm = this.FB.group({
      ID: [''],
      Debtor: ['-1', CustomValidators.notEqual('-1')],
      DebtorContactName: [''],
      TransactionDate: [new Date()],
      QuotationNotes1: [''],
      QuotationNotes2: [''],
      ExpectedDeliveryDate: [new Date()],
      InvoiceTotal: [''],
      OpportunityStatus: ['-1'],
      OpportunityStatusReason: ['-1'],
      QuoteCompetitorWinner: [''],
      QuoteCompetitorPriceDiff: [''],
      SalesPerson: [localStorage.getItem('LoginName')],
      Company: [''],
      Address1: [''],
      Address2: [''],
      Address3: [''],
      Address4: [''],
      PostCode: [''],
      Phone: [''],
      Fax: [''],
      // Email: ['', [Validators.required, Validators.pattern(/^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/)]],
      Email: [''],
      ContactName: ['',],
      Warehouse: ['-1', CustomValidators.notEqual('-1')]
    });
  }

  //Resetting the form after Add/Edit
  ResetForm() {
    this.QuotationForm.patchValue({
      ID: '',
      Debtor: '-1',
      DebtorContactName: '',
      TransactionDate: new Date(),
      QuotationNotes1: '',
      QuotationNotes2: '',
      ExpectedDeliveryDate: new Date(),
      InvoiceTotal: '',
      OpportunityStatus: '-1',
      OpportunityStatusReason: '-1',
      QuoteCompetitorWinner: '',
      QuoteCompetitorPriceDiff: '',
      SalesPerson: localStorage.getItem('LoginName'),
      Company: '',
      Address1: '',
      Address2: '',
      Address3: '',
      Address4: '',
      PostCode: '',
      Phone: '',
      Fax: '',
      Email: '',
      ContactName: '',
      Warehouse: '-1'
    });
    this.QuotationForm.markAsUntouched();
    this.QuotationForm.markAsPristine();
    this.submitted = false;
  }

  BindWarehouse() {
    this.invCommonService.getWareHouse().subscribe((resp: any) => {
      this.Warehouse = resp.data.warehouse;
    })
  }
  BindOpportunityStatus() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_SOP_QuotationStatus).subscribe((resp: any) => {
      console.log(resp);
      this.opportunityList = resp.data.tabledata;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  onOpportunityChange(ID) {
    this.opportunityStatusReasonList = [];
    if (ID != "00000000-0000-0000-0000-000000000000") {
      this.sysCommonService.getChildLookup(GenricTableIDByName.LBS_SOP_QuotationStatus, ID).subscribe((resp: any) => {
        console.log(resp);
        this.opportunityStatusReasonList = resp.data.tabledata;
      }, (error) => {
        this.Loading = false;
        this.toastr.error(error);
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  GetAllDebtors() {
    this.invCommonService.getalldebtor().subscribe((resp: any) => {
      this.Debtor = resp.data.debtors;
    })
  }

  onDebtorChange(e) {

    let debtorId = e;
    this.quotationServcie.getDebtorDetails(debtorId).subscribe((resp: any) => {
      console.log(resp);
      this.QuotationForm.patchValue({
        DebtorContactName: resp.data.debtorDetails.debtorAccountName,
        Company: resp.data.debtorDetails.companyName,
        Fax: resp.data.debtorDetails.Fax,
        Phone: resp.data.debtorDetails.Phone,
        EmailAddress: resp.data.debtorDetails.emailAddress,
        PostCode: resp.data.debtorDetails.zipCode,
        Address1: resp.data.debtorDetails.address1,
        Address2: resp.data.debtorDetails.address2,
        Address3: resp.data.debtorDetails.address3,
        Address4: resp.data.debtorDetails.address4,
      })
    });
  }

  GetQuotationList() {
    this.Loading = true;
    this.AgLoad = false;

    this.quotationServcie.GetQuotationList().subscribe((res: any) => {
      this.RowData = res.data.quotation;
      console.log(this.RowData)
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });

  }

  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.wareHouseId = event.data.warehouseID;
      this.AgEdit(event.data)
      this.AccessTab = 'Quotation';
      this.SelectedQuotationID = event.data.id;
    } else if (colId == 'Delete') {
      this.onDeleteQuotation(event.data.id)
    }
  }

  AgEdit(event) {
    console.log(event);
    this.QuotationForm.patchValue({
      ID: event.id,
      Debtor: event.debtorID,
      DebtorContactName: event.debtorContactName,
      TransactionDate: event.transactionDate,
      QuotationNotes1: event.quotationNotes1,
      QuotationNotes2: event.quotationNotes2,
      ExpectedDeliveryDate: event.expectedDeliveryDate,
      InvoiceTotal: event.invoiceTotal.toString().indexOf(".") !== -1 ? event.invoiceTotal : event.invoiceTotal + ".0000",
      OpportunityStatus: event.opportunityStatus,
      OpportunityStatusReason: event.opportunityStatusReason,
      QuoteCompetitorWinner: event.quoteCompetitorWinner,
      QuoteCompetitorPriceDiff: event.quoteCompetitorPriceDiff.toString().indexOf(".") !== -1 ? event.quoteCompetitorPriceDiff : event.quoteCompetitorPriceDiff + ".0000",
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
      Warehouse: event.warehouseID,
    });
    this.QuotationID = event.id;
    this.Mode = 'Edit';
    //  this.readonly = true;
    if (event.deleteStatus == 'Active') {
      this.QuotationForm.enable();
      this.IsActive = true;
    } else {
      this.QuotationForm.disable();
      this.IsActive = false;
    }
    if (event.status == true) {
      this.QuotationForm.disable();
      this.IsCloseQuotation = false;
      
    } else {
      this.QuotationForm.enable();
      this.IsCloseQuotation = true;
    }
    this.QuotationForm.get('Debtor').disable();
  }
  //Delete the record
  onDeleteQuotation(ID) {
    this.Loading = true;
    this.quotationServcie.deleteRecordsBYID(ID, 'LBS_SOP_QuotationMain', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.GetQuotationList();
      }
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }

  Cancel(): void {
    this.QuotationForm.reset();
    this.ResetForm();
    this.GetQuotationList();
    this.Mode = "List";
  }

  Email(email: TemplateRef<any>) {
    //Send Email
    localStorage.getItem('Email');
    this.QuotationEmailForm = this.FB.group({
      //FromEmail: [''],
      ToEmail: [this.QuotationForm.get('Email').value],
      Subject: [this.QuotationForm.get('QuotationNotes1').value],
      MessageBody: [''],

    });
    this.modalRef = this.modalService.show(email);

    this.QuotationEmailForm;
  }
  closePopUp() {
    this.modalRef.hide();
  }

  ConvertToSalesOrder() {
    //Convert this quote to sales order
    debugger;
    this.quotationServcie.ConvertQuotationToSalesOrder(this.QuotationID).subscribe((res: any) => {
    console.log(res)
    if(res.isSuccess)
    {
      this.toastr.success("Quotation has been Convert to sales order successfully")
      this.Cancel();
      // this.ResetForm();
       this.GetQuotationList();
      
    }
    }, (error) => {
      this.Loading = false;
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });
    
  }

  Copy() {
    //Copy SameQuote to a new one
    this.Mode = 'Copy';
    this.CopyQuote = true;
    this.QuotationForm.enable();
  }

  Close() {
    //close quote
    this.quotationServcie.CloseQuotation(this.QuotationID).subscribe((res: any) => {
      if(res.isSuccess)
      {
        this.toastr.success("Quotation has been close successfully")
        this.Cancel();
        // this.ResetForm();
        // this.ResetForm();
         this.GetQuotationList();
        
        
      }
      }, (error) => {
        this.Loading = false;
        this.toastr.error('Problem with the sevice. Please try later : ' + error);
      });
  }

  SendEmail() {
    debugger;
    // this.lbsSopQuotationMail.FromMail = this.QuotationEmailForm.get('FromEmail').value;
    this.lbsSopQuotationMail.ToMail = this.QuotationEmailForm.get('ToEmail').value;
    this.lbsSopQuotationMail.Subject = this.QuotationEmailForm.get('Subject').value;
    this.lbsSopQuotationMail.MessageBody = this.QuotationEmailForm.get('MessageBody').value;
    // if (this.lbsSopQuotationMail.FromMail == '' || this.lbsSopQuotationMail.FromMail == null) {
    //   this.toastr.warning('Please enter From Email');
    //   return;
    // }
    if (this.lbsSopQuotationMail.ToMail == '' || this.lbsSopQuotationMail.ToMail == null) {
      this.toastr.warning('Please enter To Email');
      return;
    }
    this.quotationServcie.sendEmail(this.lbsSopQuotationMail).subscribe((resp: any) => {
      if (resp.isSuccess)
        this.toastr.success(resp.message);
      else
        this.toastr.error(resp.message);
    }, (error) => {
    });
  }

  OnSubmit() {
    this.submitted = true;
    if (this.QuotationForm.invalid) {
      return;
    }
    this.Loading = true;
    let quotation = new LbsPosQuotation();
    quotation.CompanyID = localStorage.getItem('CompanyID');
    quotation.DebtorID = this.QuotationForm.get('Debtor').value;

    // quotation.QuotationNo = '005';
    quotation.PriceSchemeID = '123ASC';
    quotation.TaxIntegrationStatus = true;
    quotation.Printed = false;
    quotation.Emailed = true;

    quotation.WarehouseID = this.QuotationForm.get('Warehouse').value;
    quotation.DebtorContactName = this.QuotationForm.get('DebtorContactName').value;
    quotation.TransactionDate = this.QuotationForm.get('TransactionDate').value;
    quotation.QuotationNotes1 = this.QuotationForm.get('QuotationNotes1').value;
    quotation.QuotationNotes2 = this.QuotationForm.get('QuotationNotes2').value;
    quotation.ExpectedDeliveryDate = this.QuotationForm.get('ExpectedDeliveryDate').value;
    quotation.InvoiceTotal = +this.QuotationForm.get('InvoiceTotal').value;
    quotation.OpportunityStatus = this.QuotationForm.get('OpportunityStatus').value;
    quotation.OpportunityStatusReason = this.QuotationForm.get('OpportunityStatusReason').value;
    quotation.QuoteCompetitorWinner = this.QuotationForm.get('QuoteCompetitorWinner').value;
    quotation.QuoteCompetitorPriceDiff = +this.QuotationForm.get('QuoteCompetitorPriceDiff').value;
    quotation.SalesPerson = this.QuotationForm.get('SalesPerson').value;
    quotation.ExpectedDeliveryDate = this.QuotationForm.get('ExpectedDeliveryDate').value;
    quotation.Company = this.QuotationForm.get('Company').value;
    quotation.Address1 = this.QuotationForm.get('Address1').value;
    quotation.Address2 = this.QuotationForm.get('Address2').value;
    quotation.Address3 = this.QuotationForm.get('Address3').value;
    quotation.Address4 = this.QuotationForm.get('Address4').value;
    quotation.PostCode = this.QuotationForm.get('PostCode').value;
    quotation.Phone = this.QuotationForm.get('Phone').value;
    quotation.Fax = this.QuotationForm.get('Fax').value;
    quotation.Email = this.QuotationForm.get('Email').value;
    quotation.ContactName = this.QuotationForm.get('ContactName').value;

    quotation.SDCInvoiceNumber = '';
    quotation.SDCReprintInvoiceNumber = '';
    quotation.SDCDateTime = new Date();
    quotation.SDCInvoiceCounter = '';
    quotation.SDCVerificationURL = '';

    quotation.CreatedBY = localStorage.getItem('LoginID');

    if (this.Mode == 'Add' || this.Mode == 'Copy') {
      console.log(quotation);

      this.quotationServcie.AddQuotation(quotation).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.QuotationForm.get('Debtor').disable();
          this.CopyQuote ? this.toastr.success("Quotation has been copied successfully") : this.toastr.success(resp.message);
          if (this.SaveAction == 'SaveNClose') {
            this.Cancel();
            // this.ResetForm();
            this.GetQuotationList();
            this.Mode = 'List';
          }
          else {
            this.QuotationID = resp.data.id;
           
            this.Mode = 'Edit';
          }
          this.CopyQuote = false;
          this.submitted = false;
          this.Loading = false;
        }

      }, (error) => {
        this.Loading = false;
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      debugger
      quotation.ID = this.QuotationForm.get('ID').value;
      console.log(quotation);

      this.quotationServcie.UpdateQuotation(quotation).subscribe((resp: any) => {
        this.toastr.success('Quotation has been updated successfully');
        this.QuotationForm.get('Debtor').disable();
        if (this.SaveAction == 'SaveNClose') {
          this.Cancel();
          //this.ResetForm();
          this.Mode = 'List';
          this.submitted = false;
        }
        else {
          this.Mode = 'Edit';
        }
        this.Loading = false;
      }, (error) => {
        this.Loading = false;
      });
      this.submitted = false;
    }
  }

}
