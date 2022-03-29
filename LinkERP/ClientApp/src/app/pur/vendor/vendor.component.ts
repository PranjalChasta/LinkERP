import { Component, OnInit, TemplateRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LBSSYSCompany } from '../../models/sys/lbs-sys-company';
import { ToastrService } from 'ngx-toastr';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { CustomValidators } from 'ngx-custom-validators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { VendorService } from '../services/vendor.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { InventoryVendorService } from 'src/app/inv/services/inventory-vendor.service';
import { CurrencyService } from 'src/app/sys/services/currency.service';
import { WorkflowService } from 'src/app/sys/services/workflow.service';
import { LBSACPVendor } from 'src/app/models/pur/lbs-acp-vendor';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {
  Mode: any = 'List';
  Submitted: any = false;
  Loading: any = false;
  organisations: any[] = [];//Array variable of organisations data to bind grid
  countries: any[] = [];//Array variable of countries data to bind dropdownlist
  states: any[] = [];//Array variable of states data to bind dropdownlist
  cities: any[] = [];//Array variable of cities data to bind dropdownlist
  Currency:any[]=[];
  IsActive:boolean;
  VendorForm: FormGroup;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  AccessTab: string;
  RecID = '';
  HeaderNames: any; //OrganisationsPermissions;
  read_Access;
  write_Access;
  delete_Access;
  all_Access;
  workflowdeatil: any;
  vendor: any;
  CompanyID = localStorage.getItem('CompanyID');
  VendorCode: string;
  vendorname: string;
  SelectedVendorid: any;
  PageSize: any;
  Currentpage: string;
  constructor(
    private vendorService: VendorService,
    private inventoryVendor:InventoryVendorService,
    private sysCommonService: SysCommonService,
    private CurrencyService:CurrencyService,
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    private workflowservice:WorkflowService,
    private deleteservice:DeleteRecordsService,
    public modalService: BsModalService,
    private FB: FormBuilder,
    private commonService: SysCommonService,
  ) { }

  ngOnInit() {
    this.AccessTab='Vendor';
    this.PageSize = "50";
    this.Currentpage = "0";
    this.BindCountries();
    this.BindVendor();
    this.BindCurrency();
    this.BindWorkFlows();
    this.CreateForm();
    this.SetPermissions();
    this.AgGridColumn();
 
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  AgGridColumn(){
    this.ColumnDefs = [
      { headerName: 'Code', field: 'vendorCode', sortable: true, filter: true },
      { headerName: 'Name', field: 'vendorAccountName', sortable: true, filter: true },
     // { headerName: 'Phone Number', field: 'phoneNumber', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "226");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.VendorForm.enable();


      if (!this.all_Access) {
        if (!this.write_Access) {
          this.VendorForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.VendorForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  get f() { return this.VendorForm.controls; }

  BindVendor() {
    debugger;
    this.Mode = "List";
    this.AgLoad = false;
    this.Loading = true;
    this.vendorService.getVendors().subscribe((resp: any) => {
     console.log(resp);
      this.vendor = resp.data.vendor;
      this.RowData = resp.data.vendor;
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
     // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindWorkFlow: any[] = [];
  BindWorkFlows() {
    this.Loading = true;
    this.sysCommonService.getWorkflow().subscribe((resp: any) => {
      this.BindWorkFlow = resp.data.workFlow;
      this.Loading = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
 
  CreateForm() {
    this.VendorForm = this.FB.group({
      ID: [''],
      CompanyID: [''],
      VendorCode: ['',Validators.required],
      VendorAccountName: ['',Validators.required],
      TaxIdentificationNumber: [''],
      TradingName: [''],
      CompanyName: [''],
      ProprietorName: [''],
      Laddr1: [''],
      Laddr2: [''],
      Laddr3: [''],
      Paddr1: [''],
      Paddr2: [''],
      Paddr3: [''],
      ZipCode: [''],
      Phone: [''],
      Fax: [''],
      EmailAddress: [''],
      TradingStatus: [true],
      BankAccountName: [''],
      BankName: [''],
      BankAccountNumber: [''],
      BSB: [''],
      BankSwiftCode: [''],
      DefaultPaymentType: [true],
      CreditLimit: [null],
      LastPurchaseDate: [null],
      LastPaymentDate: [null],
      TermsDays: [null],
      PurchaseOrderValidityDays: [''],
      CurrentBalance: [null],
      Period1: [null, Validators.required],
      Period2: [null, Validators.required],
      Period3: [null, Validators.required],
      Period4: [null, Validators.required],
      UseForeignCurrency: [true],
      CurrencyID: ['00000000-0000-0000-0000-000000000000'],
      FXCurrentBalance: [null, Validators.required],
      FXPeriod1: [null, Validators.required],
      FXPeriod2: [null, Validators.required],
      FXPeriod3: [null, Validators.required],
      FXPeriod4: [null, Validators.required],
      DefaultPurchaseOrderWorkflow: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      Country: ['00000000-0000-0000-0000-000000000000'],
      State: ['00000000-0000-0000-0000-000000000000'],
      City: ['00000000-0000-0000-0000-000000000000']

    });
  }
  BindCurrency() {
    this.Loading = true;
    this.AgLoad = false;
    this.commonService.getCurrency().subscribe((resp: any) => {
      console.log(resp);
      this.Currency = resp.data.cuurency;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
   //The method executes when country dropdownlist CHANGE event by passing the Country ID
   onCountrySelected(ID) {
    this.states = [];
    this.cities = [];
    this.BindStates(ID);
    this.VendorForm.patchValue({
      State: '00000000-0000-0000-0000-000000000000',
      City: '00000000-0000-0000-0000-000000000000'
    });
  }
  //Bind States by country ID
  BindStates(countryID) {
    //  this.Loading = true;
    this.sysCommonService.getStatesBYCountryID(countryID).subscribe((resp: any) => {
      this.states = resp.data.states;
      // this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }

  //The method executes when country dropdownlist CHANGE event by passing the Country ID
  onStatesSelected(ID) {
    this.cities = [];
    this.BindCities(ID);
    this.VendorForm.patchValue({
      City: '00000000-0000-0000-0000-000000000000'
    });
  }
  //Bind States by country ID
  BindCities(stateID) {
    // this.Loading = true;
    this.sysCommonService.getCitiesByStateID(stateID).subscribe((resp: any) => {
      this.cities = resp.data.cities;
      // this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }
 
  BindCountries() {
    this.Loading = true;
    this.sysCommonService.getActiveCountries().subscribe((resp: any) => {
      this.countries = resp.data.countries;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }
  OnCancel() {
    this.ResetForm();
    this.Mode = 'Add';
    this.BindVendor();
  }
  AddNew(): void {
    this.VendorForm.enable();
    this.Mode = 'Add';
    this.IsActive = true;
    this.VendorCode = '';
    this.vendorname = '';
  }
    
      //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.Mode = "List";
    this.BindVendor();
  }
 /* FOR Aggird Start */
 OnActionClick(event: any) {
  var colId = event.column.getId();
  if (colId == 'Edit') {
    this.SelectedVendorid = event.data.id;
    this.VendorCode = event.data.debtorCode;
    this.vendorname = event.data.debtorAccountName;
    this.Edit(event.data.id);
   // this.SelectedDebtorid = event.data.id;
  } else if (colId == 'Delete') {
    debugger;
    this.onDeleteChecked(event.data.id)
  }
}
ResetForm() {
  this.VendorCode = '';
  this.vendorname = '';
  this.states = [];
  this.cities = [];
  this.VendorForm.patchValue({
    ID: '',
    CompanyID: '',
    VendorCode: '',
    VendorAccountName: '',
    TaxIdentificationNumber: '',
    TradingName: '',
    CompanyName: '',
    ProprietorName: '',
    Laddr1: '',
    Laddr2: '',
    Laddr3: '',
    Paddr1:'',
    Paddr2: '',
    Paddr3: '',
    ZipCode: '',
    Phone: '',
    Fax: '',
    EmailAddress: '',
    TradingStatus: true,
    BankAccountName: '',
    BankName: '',
    BankAccountNumber: '',
    BSB: '',
    BankSwiftCode: '',
    DefaultPaymentType: true,
    CreditLimit: null,
    LastPurchaseDate: null,
    LastPaymentDate: null,
    TermsDays: null,
    PurchaseOrderValidityDays: null,
    CurrentBalance: null,
    Period1: null,
    Period2: null,
    Period3: null,
    Period4: null,
    UseForeignCurrency: true,
    CurrencyID: '00000000-0000-0000-0000-000000000000',
    FXCurrentBalance: null,
    FXPeriod1: null,
    FXPeriod2: null,
    FXPeriod3: null,
    FXPeriod4: null,
    DefaultPurchaseOrderWorkflow: '00000000-0000-0000-0000-000000000000',
    Country: '00000000-0000-0000-0000-000000000000',
    State: '00000000-0000-0000-0000-000000000000',
    City: '00000000-0000-0000-0000-000000000000'
  });
  this.VendorForm.markAsUntouched();
  this.VendorForm.markAsPristine();
  this.Submitted = false;
}
Edit(ID): void {

  this.Mode = 'Edit';
  this.BinddebtorById(ID);

}
BinddebtorById(ID) {
  debugger;
 // this.SelectedDebtorid=ID;
  this.vendorService.getVendorbyID(ID).subscribe((resp: any) => {
    console.log(resp);
    if (resp.isSuccess == true) {
      let acrdebtor: any = new LBSACPVendor();
      acrdebtor = resp.data.vendor;
      this.BindStates(acrdebtor.country);
      this.BindCities(acrdebtor.state);
      this.SelectedVendorid = acrdebtor.id;
      this.VendorCode = acrdebtor.vendorCode;
      this.vendorname = acrdebtor.vendorAccountName;
      this.VendorForm.patchValue({
        ID: acrdebtor.id,
        VendorCode:acrdebtor.vendorCode ,
        VendorAccountName:acrdebtor.vendorAccountName,
        TaxIdentificationNumber:acrdebtor.taxIdentificationNumber,
        TradingName: acrdebtor.tradingName,
        CompanyName: acrdebtor.companyName,
        ProprietorName: acrdebtor.proprietorName,
        Laddr1: acrdebtor.laddr1,
        Laddr2: acrdebtor.laddr2,
        Laddr3: acrdebtor.laddr3,
        Paddr1: acrdebtor.paddr1,
        Paddr2: acrdebtor.paddr2,
        Paddr3: acrdebtor.paddr3,
        ZipCode: acrdebtor.zipCode,
        Phone: acrdebtor.phone,
        Fax: acrdebtor.fax,
        EmailAddress: acrdebtor.emailAddress,
        TradingStatus: acrdebtor.tradingStatus,
        BankAccountName: acrdebtor.bankAccountName,
        BankName: acrdebtor.bankName,
        BankAccountNumber: acrdebtor.bankAccountNumber,
        BSB: acrdebtor.bsb,
        BankSwiftCode: acrdebtor.bankSwiftCode,
        DefaultPaymentType: acrdebtor.defaultPaymentType,
        CreditLimit: acrdebtor.creditLimit_text,
        LastPurchaseDate: acrdebtor.lastPurchaseDate,
        LastPaymentDate: acrdebtor.lastPaymentDate,
        TermsDays: acrdebtor.termsDays,
        PurchaseOrderValidityDays: acrdebtor.purchaseOrderValidityDays,
        CurrentBalance: acrdebtor.currentBalance_text,
        Period1: acrdebtor.period1_text,
        Period2: acrdebtor.period2_text,
        Period3: acrdebtor.period3_text,
        Period4: acrdebtor.period4_text,
        UseForeignCurrency: acrdebtor.useForeignCurrency,
        CurrencyID: acrdebtor.currencyID,
        FXCurrentBalance: acrdebtor.fxCurrentBalance_text,
        FXPeriod1: acrdebtor.fxPeriod1_text,
        FXPeriod2: acrdebtor.fxPeriod2_text,
        FXPeriod3: acrdebtor.fxPeriod3_text,
        FXPeriod4: acrdebtor.fxPeriod4_text,
        DefaultPurchaseOrderWorkflow: acrdebtor.defaultPurchaseOrderWorkflow,
        Country: acrdebtor.country,
        State: acrdebtor.state,
        City: acrdebtor.city,
  
      });
      if (!acrdebtor.deleted) {
        this.VendorForm.enable();
        this.IsActive = true;
      } else {
        this.VendorForm.disable();
        this.IsActive = false;
      }
    }

  },
    (error) => {
     // console.error('Problem with the sevice. Please try later : ' + error);
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
onSaveold(saveAction) {
  debugger;
  this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
}
//To save the price-group details to database table by calling the API service
onSave(saveAction) {
  debugger;
  this.Submitted = true;
  if (this.VendorForm.invalid) {
    return;
  }
  this.Loading = true;
  let acpdebtor = new LBSACPVendor();
  acpdebtor.CompanyID = this.CompanyID;
  acpdebtor.VendorCode  = this.VendorForm.get('VendorCode').value;
  acpdebtor.VendorAccountName = this.VendorForm.get('VendorAccountName').value;
  acpdebtor.TaxIdentificationNumber = this.VendorForm.get('TaxIdentificationNumber').value;
  acpdebtor.TradingName = this.VendorForm.get('TradingName').value;
  acpdebtor.CompanyName = this.VendorForm.get('CompanyName').value;
  acpdebtor.ProprietorName = this.VendorForm.get('ProprietorName').value;
  acpdebtor.Laddr1 = this.VendorForm.get('Laddr1').value;
  acpdebtor.Laddr2 = this.VendorForm.get('Laddr2').value;
  acpdebtor.Laddr3 = this.VendorForm.get('Laddr3').value;
  acpdebtor.Paddr1 = this.VendorForm.get('Paddr1').value;
  acpdebtor.Paddr2 = this.VendorForm.get('Paddr2').value;
  acpdebtor.Paddr3 = this.VendorForm.get('Paddr3').value;
  acpdebtor.ZipCode = this.VendorForm.get('ZipCode').value;
  acpdebtor.Phone = this.VendorForm.get('Phone').value;
  acpdebtor.Fax = this.VendorForm.get('Fax').value;
  acpdebtor.EmailAddress = this.VendorForm.get('EmailAddress').value;
  acpdebtor.TradingStatus = this.VendorForm.get('TradingStatus').value;
  acpdebtor.BankAccountName = this.VendorForm.get('BankAccountName').value;
  acpdebtor.BankName = this.VendorForm.get('BankName').value;
  acpdebtor.BankAccountNumber = this.VendorForm.get('BankAccountNumber').value;
  acpdebtor.BSB  = this.VendorForm.get('BSB').value;
  acpdebtor.BankSwiftCode = this.VendorForm.get('BankSwiftCode').value;
  acpdebtor.DefaultPaymentType = this.VendorForm.get('DefaultPaymentType').value;
  acpdebtor.CreditLimit = this.VendorForm.get('CreditLimit').value;
  acpdebtor.LastPurchaseDate = this.VendorForm.get('LastPurchaseDate').value;
  acpdebtor.LastPaymentDate = this.VendorForm.get('LastPaymentDate').value;
  acpdebtor.TermsDays = this.VendorForm.get('TermsDays').value;
  acpdebtor.PurchaseOrderValidityDays = this.VendorForm.get('PurchaseOrderValidityDays').value;
  acpdebtor.CurrentBalance = this.VendorForm.get('CurrentBalance').value;
  acpdebtor.Period1 = this.VendorForm.get('Period1').value;
  acpdebtor.Period2 = this.VendorForm.get('Period2').value;
  acpdebtor.Period3 = this.VendorForm.get('Period3').value;
  acpdebtor.Period4 = this.VendorForm.get('Period4').value;
  acpdebtor.UseForeignCurrency = this.VendorForm.get('UseForeignCurrency').value;
  acpdebtor.CurrencyID = this.VendorForm.get('CurrencyID').value;
  acpdebtor.FXCurrentBalance = this.VendorForm.get('FXCurrentBalance').value;
  acpdebtor.FXPeriod1 = this.VendorForm.get('FXPeriod1').value;
  acpdebtor.FXPeriod2 = this.VendorForm.get('FXPeriod1').value;
  acpdebtor.FXPeriod3 = this.VendorForm.get('FXPeriod3').value;
  acpdebtor.FXPeriod4 = this.VendorForm.get('FXPeriod4').value;
  acpdebtor.DefaultPurchaseOrderWorkflow = this.VendorForm.get('DefaultPurchaseOrderWorkflow').value;
  acpdebtor.Country = this.VendorForm.get('Country').value;
  acpdebtor.State = this.VendorForm.get('State').value;
  acpdebtor.City = this.VendorForm.get('City').value;
  acpdebtor.CreatedBY = localStorage.getItem('LoginID');
  //If the mode Add will insert data to DB table else update the row by ID
  if (this.Mode == 'Add') {
    debugger;
    this.vendorService.addVendors(acpdebtor).subscribe((resp: any) => {
      debugger;
      console.log(resp);
      if (resp.isSuccess) {
        this.toastr.success('Vendor  details added successfully');
        if (saveAction == 'Close') {
          this.Cancel();
          this.BindVendor();
          this.Mode = 'List';
          this.ResetForm();
        }
        else {
          let ID = resp.data.id;
          this.Edit(ID);
          this.BindVendor();
          this.Mode = 'Edit';
       //  this.ResetForm();
     
        }
       
        this.Loading = false;
        //this.ResetForm();
      }
      else {
        this.toastr.warning('Vendor code  already exists')
        this.Loading = false;
      }
    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  else if (this.Mode == 'Edit') {
    debugger;
    acpdebtor.ID = this.VendorForm.get('ID').value;
    this.vendorService.updatevendors(acpdebtor).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.toastr.success('Vendor Group  details updated successfully');
        if (saveAction == 'Close') {
          this.Cancel();
          this.Mode = 'List';
         this.ResetForm();
          this.BindVendor();
        }
        else {
          let ID = this.VendorForm.get('ID').value;
          this.Edit(ID);
        }
      }
      else {
        this.Loading = false;
        this.toastr.warning('Vendor code  already exists')
      }
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  this.Loading = false;
}
// onDeleteChecked(ID) {
//   //this.Loading = true;
//   this.inventoryVendor.deleteInventoryVendorByID(ID, 'LBS_ACP_Vendor', localStorage.getItem('LoginID')).subscribe((resp: any) => {
//     if (resp.isSuccess == true) {
//       this.BindVendor();
//     }
//     //this.Loading = false;
//   }, (error) => {
//     //this.Loading = false;

//     // console.error('Problem with the sevice. Please try later : ' + error.message);
//   });
// }
onDeleteChecked(ID) {
  debugger;
  this.deleteservice.deleteRecordsBYID(ID, 'LBS_ACP_Vendor', localStorage.getItem('LoginID')).subscribe((resp: any) => {
    this.BindVendor();
    this.ResetForm();
    this.Mode = 'List';
  }, (error) => {
   // console.error('Problem with the sevice. Please try later : ' + error);
  });
}
@ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
