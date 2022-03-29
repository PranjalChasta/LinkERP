import { Component, OnInit, ViewChild,TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { DebtorService } from 'src/app/inv/services/debtor.service';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { LBSACRDebtor } from 'src/app/models/inv/lbs-acr-debtor';
import { CurrencyService } from 'src/app/sys/services/currency.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { WorkflowService } from 'src/app/sys/services/workflow.service';
import { InventoryService } from 'src/app/inv/services/inventory.service';
import { InventoryVendorService } from 'src/app/inv/services/inventory-vendor.service';
import { CustomValidators } from 'ngx-custom-validators';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-debtors',
  templateUrl: './debtors.component.html',
  styleUrls: ['./debtors.component.css']
})
export class DebtorsComponent implements OnInit {
  DebtorForm: FormGroup;
  Loading: any = false;
  Mode: any = 'List';
  submitted: boolean;
  Debtor:any[];
  Currency:any[];
  countries: any[] = [];//Array variable of countries data to bind dropdownlist
  states: any[] = [];//Array variable of states data to bind dropdownlist
  cities: any[] = [];//Array variable of cities data to bind dropdownlist
   //Permission
   read_Access: boolean;
   write_Access: boolean;
   delete_Access: boolean;
   all_Access: boolean;
   PageSize: any;
   CompanyID = localStorage.getItem('CompanyID');
     //Ag-grid 
  ColumnDefs;
  RowData: any;
  AccessTab: any;
  IsActive: boolean;
  HeaderNames: any;
  AgLoad: boolean = false
  SelectedDebtorid: any;
  Debtorname: any;
  DebtorCode: any;
  Currentpage: string;
  DebtorID: any;
  constructor( private router: Router, private route: ActivatedRoute,  
    private FB: FormBuilder,   
    private debtorservice: DebtorService,
    private deleteservice:DeleteRecordsService,
    private sysCommonService:SysCommonService,
    private inventoryVendor:InventoryVendorService,
    private workflowservice:WorkflowService,
    private CurrencyService:CurrencyService,
    private toastr: ToastrService, 
     private cryptoAes: CryptoAes
     ) {this.DebtorID = this.route.snapshot.paramMap.get("id") }

  ngOnInit() {
   
    this.AgLoad = false;
    this.Mode = "List";
    this.HeaderNames = "Debtor";
    this.AccessTab = "Debtor";
    this.PageSize = "50";
    this.BindDebtor();
    this.BindCurrency();
    this.BindCountries();
    this.BindWorkFlows();
    this.CreateForm();
    this.Currentpage = "0";
    this.PageSize = "50";
    this.SetPermissions();
    this.AgGridColumn();
    this.BindPriceWorkflows();
    debugger;
    if(this.DebtorID)
    {
      this.Edit(this.DebtorID);
      this.SelectedDebtorid=this.DebtorID;
    }
    console.log(this.DebtorID);
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  CreateForm(){
    this.DebtorForm = this.FB.group({
      ID: [''],
      CompanyID: [''],
      DebtorCode: ['', Validators.required],
      DebtorAccountName: ['', Validators.required],
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
      DefaultSalesInvoiceWorkflow: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      Country: ['00000000-0000-0000-0000-000000000000'],
      State: ['00000000-0000-0000-0000-000000000000'],
      City: ['00000000-0000-0000-0000-000000000000'],
      PriceWorkFlow: ['00000000-0000-0000-0000-000000000000']

    });
  }
  get f() { return this.DebtorForm.controls; }
  SetPermissions() {
   debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "601");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.DebtorForm.enable();


      if (!this.all_Access) {
        if (!this.write_Access) {
          this.DebtorForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.DebtorForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  AgGridColumn(){
    this.ColumnDefs = [
      { headerName: 'Code', field: 'debtorCode', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Name', field: 'debtorAccountName', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access, }
    ];
  }
  BindPriceWorkFlow: any;
  BindPriceWorkflows() {
 
    this.Loading = true;
    this.debtorservice.getPriceWorkflows().subscribe((resp: any) => {
      this.BindPriceWorkFlow = resp.data.price;
      this.Loading = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindDebtor() {
    this.AgLoad = false;
    this.Mode = "List";
    this.debtorservice.getDebtor().subscribe((resp: any) => {
      console.log(resp);
      this.Debtor = resp.data.debtor;
      this.RowData = resp.data.debtor;
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindCurrency() {
    this.Loading = true;

    this.AgLoad = false;
    this.sysCommonService.getCurrency().subscribe((resp: any) => {
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
    this.DebtorForm.patchValue({
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
    this.DebtorForm.patchValue({
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
  BindWorkFlow:any[]=[];
  BindWorkFlows() {
    this.Loading = true;
    this.sysCommonService.getWorkflow().subscribe((resp: any) => {
      this.BindWorkFlow = resp.data.workFlow;
      this.Loading = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
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
    this.BindDebtor();
  }
  AddNew(): void {
    this.Mode = 'Add';
    this.DebtorForm.enable();
    this.IsActive = true;
    this.DebtorCode = '';
    this.Debtorname = '';
  }
    
      //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.Mode = "List";
    this.BindDebtor();
  }
 /* FOR Aggird Start */
 OnActionClick(event: any) {
  var colId = event.column.getId();
  if (colId == 'Edit') {
   
 
    this.Edit(event.data.id);
    this.SelectedDebtorid = event.data.id;
    this.DebtorCode = event.data.debtorCode;
    this.Debtorname = event.data.debtorAccountName;
   // this.SelectedDebtorid = event.data.id;
  } else if (colId == 'Delete') {
  this.CheckDebtorTranction(event.data.id);
    //this.onDeleteChecked(event.data.id)
  }
}
ResetForm() {
  this.DebtorCode = '';
  this.Debtorname = '';
  this.states = [];
  this.cities = [];
  this.DebtorForm.patchValue({
    ID: '',
    CompanyID: '',
    DebtorCode: '',
    DebtorAccountName: '',
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
    DefaultSalesInvoiceWorkflow: '00000000-0000-0000-0000-000000000000',
    Country: '00000000-0000-0000-0000-000000000000',
    State: '00000000-0000-0000-0000-000000000000',
    City: '00000000-0000-0000-0000-000000000000',
    PriceWorkFlow: '00000000-0000-0000-0000-000000000000',
  });
  this.DebtorForm.markAsUntouched();
  this.DebtorForm.markAsPristine();
  this.submitted = false;
}
Edit(ID): void { 
  this.Mode = 'Edit';
  this.BinddebtorById(ID); 
}
BinddebtorById(ID) {
 // this.SelectedDebtorid=ID;
  this.debtorservice.getDebtorByID(ID).subscribe((resp: any) => {
    console.log(resp);
    if (resp.isSuccess == true) {
      let acrdebtor: any = new LBSACRDebtor();
      acrdebtor = resp.data.debtorbyId;
      this.BindStates(acrdebtor.country);
      this.BindCities(acrdebtor.state);
      this.SelectedDebtorid = acrdebtor.id;
      this.DebtorCode = acrdebtor.debtorCode;
      this.Debtorname = acrdebtor.debtorAccountName;
      this.DebtorForm.patchValue({
        ID: acrdebtor.id,
        DebtorCode:acrdebtor.debtorCode ,
        DebtorAccountName:acrdebtor.debtorAccountName,
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
        DefaultSalesInvoiceWorkflow: acrdebtor.defaultSalesInvoiceWorkflow,
        Country: acrdebtor.country,
        State: acrdebtor.state,
        City: acrdebtor.city,
        PriceWorkFlow: acrdebtor.priceWorkFlow
  
      });
      if (!acrdebtor.deleted) {
        this.DebtorForm.enable();
        this.IsActive = true;
      } else {
        this.DebtorForm.disable();
        this.IsActive = false;
      }
    }

  },
    (error) => {
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
onSaveold(saveAction) {
  
  this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
}
//To save the price-group details to database table by calling the API service
onSave(saveAction) {

  this.submitted = true;
  if (this.DebtorForm.invalid) {
    return;
  }
  this.Loading = true;
  let acpdebtor = new LBSACRDebtor();
  acpdebtor.CompanyID = this.CompanyID;
  acpdebtor.DebtorCode  = this.DebtorForm.get('DebtorCode').value;
  acpdebtor.DebtorAccountName = this.DebtorForm.get('DebtorAccountName').value;
  acpdebtor.TaxIdentificationNumber = this.DebtorForm.get('TaxIdentificationNumber').value;
  acpdebtor.TradingName = this.DebtorForm.get('TradingName').value;
  acpdebtor.CompanyName = this.DebtorForm.get('CompanyName').value;
  acpdebtor.ProprietorName = this.DebtorForm.get('ProprietorName').value;
  acpdebtor.Laddr1 = this.DebtorForm.get('Laddr1').value;
  acpdebtor.Laddr2 = this.DebtorForm.get('Laddr2').value;
  acpdebtor.Laddr3 = this.DebtorForm.get('Laddr3').value;
  acpdebtor.Paddr1 = this.DebtorForm.get('Paddr1').value;
  acpdebtor.Paddr2 = this.DebtorForm.get('Paddr2').value;
  acpdebtor.Paddr3 = this.DebtorForm.get('Paddr3').value;
  acpdebtor.ZipCode = this.DebtorForm.get('ZipCode').value;
  acpdebtor.Phone = this.DebtorForm.get('Phone').value;
  acpdebtor.Fax = this.DebtorForm.get('Fax').value;
  acpdebtor.EmailAddress = this.DebtorForm.get('EmailAddress').value;
  acpdebtor.TradingStatus = this.DebtorForm.get('TradingStatus').value;
  acpdebtor.BankAccountName = this.DebtorForm.get('BankAccountName').value;
  acpdebtor.BankName = this.DebtorForm.get('BankName').value;
  acpdebtor.BankAccountNumber = this.DebtorForm.get('BankAccountNumber').value;
  acpdebtor.BSB  = this.DebtorForm.get('BSB').value;
  acpdebtor.BankSwiftCode = this.DebtorForm.get('BankSwiftCode').value;
  acpdebtor.DefaultPaymentType = this.DebtorForm.get('DefaultPaymentType').value;
  acpdebtor.CreditLimit = this.DebtorForm.get('CreditLimit').value;
  acpdebtor.LastPurchaseDate = this.DebtorForm.get('LastPurchaseDate').value;
  acpdebtor.LastPaymentDate = this.DebtorForm.get('LastPaymentDate').value;
  acpdebtor.TermsDays = this.DebtorForm.get('TermsDays').value;
  acpdebtor.PurchaseOrderValidityDays = this.DebtorForm.get('PurchaseOrderValidityDays').value;
  acpdebtor.CurrentBalance = this.DebtorForm.get('CurrentBalance').value;
  acpdebtor.Period1 = this.DebtorForm.get('Period1').value;
  acpdebtor.Period2 = this.DebtorForm.get('Period2').value;
  acpdebtor.Period3 = this.DebtorForm.get('Period3').value;
  acpdebtor.Period4 = this.DebtorForm.get('Period4').value;
  acpdebtor.UseForeignCurrency = this.DebtorForm.get('UseForeignCurrency').value;
  acpdebtor.CurrencyID = this.DebtorForm.get('CurrencyID').value;
  acpdebtor.FXCurrentBalance = this.DebtorForm.get('FXCurrentBalance').value;
  acpdebtor.FXPeriod1 = this.DebtorForm.get('FXPeriod1').value;
  acpdebtor.FXPeriod2 = this.DebtorForm.get('FXPeriod1').value;
  acpdebtor.FXPeriod3 = this.DebtorForm.get('FXPeriod3').value;
  acpdebtor.FXPeriod4 = this.DebtorForm.get('FXPeriod4').value;
  acpdebtor.DefaultSalesInvoiceWorkflow = this.DebtorForm.get('DefaultSalesInvoiceWorkflow').value;
  acpdebtor.Country = this.DebtorForm.get('Country').value;
  acpdebtor.State = this.DebtorForm.get('State').value;
  acpdebtor.City = this.DebtorForm.get('City').value;
  acpdebtor.CreatedBY = localStorage.getItem('LoginID');
  acpdebtor.PriceWorkFlow = this.DebtorForm.get('PriceWorkFlow').value;
  //If the mode Add will insert data to DB table else update the row by ID
  if (this.Mode == 'Add') {
   
    this.debtorservice.addDebtor(acpdebtor).subscribe((resp: any) => {
      
      if (resp.isSuccess) {
        this.toastr.success('Debtor  details added successfully');
        if (saveAction == 'Close') {
          this.Cancel(); 
          this.Mode = 'List';
          this.ResetForm();
        }
        else {
          let ID = resp.data.id;
          this.Edit(ID);
          this.BindDebtor();
          this.Mode = 'Edit';
         ///this.ResetForm();
     
        }
       
        this.Loading = false;
        //this.ResetForm();
      }
      else {
        this.toastr.warning('Debtor code  already exists')
        this.Loading = false;
      }
    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  else if (this.Mode == 'Edit') {
  
    acpdebtor.ID = this.DebtorForm.get('ID').value;
    this.debtorservice.updatedebtor(acpdebtor).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.toastr.success('Debtor Group  details updated successfully');
        if (saveAction == 'Close') {
          this.Cancel();
          this.Mode = 'List';
         this.ResetForm();
          this.BindDebtor();
        }
        else {
          let ID = this.DebtorForm.get('ID').value;
          this.Edit(ID);
        }
      }
      else {
        this.Loading = false;
        this.toastr.warning('Debtor code  already exists')
      }
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  this.Loading = false;
}
// onDeleteChecked(ID) {
//   //this.Loading = true;
//   this.inventoryVendor.deleteInventoryVendorByID(ID, 'LBS_ACR_Debtor', localStorage.getItem('LoginID')).subscribe((resp: any) => {
//     if (resp.isSuccess == true) {
//       this.BindDebtor();
//     }
//     //this.Loading = false;
//   }, (error) => {
//     //this.Loading = false;

//     // console.error('Problem with the sevice. Please try later : ' + error.message);
//   });
// }
onDeleteChecked(ID) {
  this.deleteservice.deleteRecordsBYID(ID, 'LBS_ACR_Debtor', localStorage.getItem('LoginID')).subscribe((resp: any) => {
    this.BindDebtor();
    this.ResetForm();
    this.Mode = 'List';
  }, (error) => {
    console.error('Problem with the sevice. Please try later : ' + error);
  });
}
CheckDebtorTranction(ID) {
  this.debtorservice.CheckUnpaidTranction(ID).subscribe((resp: any) => {
    console.log(resp)
    if (resp.data.availableTranction == "Exist") {
      this.toastr.warning("Tranction has been done for this customer, can't delete");
    }
    else {
      this.onDeleteChecked(ID)
    }
    // 
  }, (error) => {
    console.error('Problem with the sevice. Please try later : ' + error);
  });
}
@ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
