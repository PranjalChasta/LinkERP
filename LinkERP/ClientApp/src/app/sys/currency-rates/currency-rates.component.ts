import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CurrencyRatesService } from '../services/currency-rates.service';
import { ToastrService } from 'ngx-toastr';
import { LBSSYSCurrencyRates } from 'src/app/models/sys/lbs-sys-currency-rates';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CurrencyService } from '../services/currency.service';
import { LBSSYSCurrency } from 'src/app/models/sys/lbs-sys-currency';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { formatDate } from '@angular/common';
import { date } from 'ngx-custom-validators/src/app/date/validator';
import { SysCommonService } from '../services/sys-common.service';
import { location } from 'ngx-bootstrap/utils/facade/browser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-currency-rates',
  templateUrl: './currency-rates.component.html',
  styleUrls: ['./currency-rates.component.css']
})
export class CurrencyRatesComponent implements OnInit {
  @Input() SelectedCurrencyRateID: any;
  CurrencyRateForm: FormGroup;
  Mode: any = 'List';
  submitted: boolean;
  Loading: any = false;
  CID: any;
  Currency: any[] = [];//Array variable of Currency data to bind grid
  CurrencyTable: any[] = [];//Array variable of Currencytable data to bind grid
  CurrencyList: any[] = [];//Array variable of Currencylist data to bind grid
  CurrencyRate: any[] = [];
  //Permission

  MinEffectiveDate: any = new Date('2000-01-01');
  MaxEffectiveDate: any;//= new Date(Date.now());
  CurrMaxDate: any = new Date(Date.now());
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  @Input() IsActive: boolean;

  /* FOR Aggird Start */
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  read: boolean;
  /* FOR Aggird End  */
  today = new Date();
  EndDate: any;
  jstoday = '';
  addRows: boolean;
  NewRows: any = [];
  Addbutton: boolean;
  IsEdit: boolean;

  AccessTab: string;
  HeaderNames: any;
  changeDate: any;
  SelectedCode: any;
  // daterows:any=[].push(object)
  @Output() onModeChange = new EventEmitter();
  constructor(
    private CurrencyRateService: CurrencyRatesService,
    private currencyservice: CurrencyService,
    private CurrencyRateFB: FormBuilder,
    private deleteRecordsService: DeleteRecordsService,
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    private router: Router,
    private sysCommonService: SysCommonService
  ) {
    //  this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
  }

  ngOnInit() {
    this.AccessTab = "CurrencyRate";
    this.HeaderNames = "Currency Rate";
    this.AgLoad = false;
    debugger;
    this.CreateForm();
    this.SetPermissions();
    //this.GetAgColumns();
    // this.BindCurrencyRate();
    //this.BindCurrency();
    if (this.SelectedCurrencyRateID) {
      this.onCurrencyChange(this.SelectedCurrencyRateID)
    }
    this.Mode == 'Add'
    this.Addbutton = true;
    this.changeDate = this.CurrencyRateForm.get('DateEnd').value;

  }
  //To create the CurrencyRateForm  Controls.
  CreateForm() {
    let date = new Date();
    let endDate = new Date(date.getFullYear(), 12, 0);
    this.CurrencyRateForm = this.CurrencyRateFB.group({
      ID: [''],
      CurrencyID: [this.SelectedCurrencyRateID],
      CurrecnyName: [''],
      DateCreated: [new Date()],
      Effective: [new Date(Date.now()), [Validators.required]],
      DateEnd: [new Date(date.getFullYear(), 12, 31)],
      Decimal: [''],
      TransactionRate: ['0']
    });
  }
  get f() { return this.CurrencyRateForm.controls; }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "115");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      //this.CurrencyRateForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          //  this.CurrencyRateForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      //this.CurrencyRateForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  //Add new currency rate
  AddNew(): void {
    this.Mode = 'Add';
    // this.read = false;
  }

  addnew() {
    let date = new Date();
    let endDate = new Date(date.getFullYear(), 12, 0);
    let object = {
      'dateCreated': '',
      'effectiveDate': new Date(),
      'dateEnd': new Date(date.getFullYear(), 12, 0),
      'transactionRate': ''
    }
    debugger
    this.addRows = true;
    this.NewRows.push(object);

  }
  Deleteindex(i) {
    this.NewRows.splice(i, 1);
  }

  //Cancel the Add/Edit
  Cancel() {
    this.Loading = true;
    this.Loading = false;
    this.ResetForm();
    this.submitted = false;
    this.Mode = 'List';
  }
  //To bind the data of all currency to the Grid.
  BindCurrency() {
    this.Loading = true;
    this.sysCommonService.getCurrency().subscribe((resp: any) => {
      console.log(resp);
      this.CurrencyList = resp.data.cuurency;
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Mode = 'Edit'
      this.AgEdit(event.data)
    } else if (colId == 'Delete') {
      this.onDelete(event.data.id)
    }
  }

  //based on currency dropdown should be bind
  onCurrencyChange(ID) {

    this.MinEffectiveDate = new Date('2000-01-01');
    let date = new Date();
    this.CurrencyRateForm.patchValue({
      ID: '',
      DateCreated: new Date(Date.now()),
      Effective: new Date(Date.now()),
      DateEnd: new Date(date.getFullYear(), 12, 0),
      TransactionRate: '0'
    });
    debugger;
    this.NewRows = [];
    if (ID != '-1') {
      this.IsEdit = true;
      this.SelectedCurrencyRateID = ID;
      /*  let index = this.CurrencyList.findIndex(c => c.id == ID);
       let data = this.CurrencyList[index];
       this.CurrencyRateForm.patchValue({
         CurrecnyName: data.currencyCode
       });
       this.SelectedCode = data.currencyCode + ' ' + data.currecnyName; */
      this.BindCurrencyExchangeRate(ID);
      this.addnew();
      this.Addbutton = true;
      // this.ResetForm();
      this.Mode = 'List';
    }
    else if (ID == '-1') {
      this.IsEdit = false;
      this.CurrencyRateForm.patchValue({ CurrecnyName: '' })
      //this.BindCurrencyRate();
      this.CurrencyRate = [];
    }
    else {
      this.IsEdit = false;
      this.CurrencyRateForm.patchValue({
        CurrecnyName: ''
      });
    }
  }
  //To bind the data of all currency-rate to the Grid.
  BindCurrencyRate() {
    this.Loading = true;
    //this.Mode = 'List';
    this.AgLoad = false;
    this.CurrencyRateService.getcurrencyrates().subscribe((resp: any) => {
      console.log(resp);
      this.Currency = resp.data.currency;
      this.RowData = resp.data.currency;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindCurrencyExchangeRate(ID) {
    this.Loading = true;
    this.CurrencyRateService.getcurrencyratesexchange(ID).subscribe((resp: any) => {
      debugger;
      this.CurrencyRate = resp.data.currencyratesexchange;
      console.log(this.CurrencyRate);
      if (this.CurrencyRate.length > 0) {
        debugger;
        //let lastEffectiDate: Date = new Date(this.CurrencyRate[this.CurrencyRate.length - 1].effectiveDate);
        let lastEffectiDate: Date = new Date(this.CurrencyRate[0].effectiveDate);
        this.MinEffectiveDate = new Date(lastEffectiDate.setDate(lastEffectiDate.getDate() + 1));
      }
      else {
        this.MinEffectiveDate = new Date('2000-01-01');
      }

      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To save the currency-rate details to database table by calling the API service
  onSave() {
    debugger;
    this.submitted = true;
    if (this.CurrencyRateForm.invalid) {
      return;
    }
    let index = this.CurrencyRate.findIndex(c => c.effectiveDate == this.CurrencyRateForm.get('Effective').value);
    

    console.log('CurrencyID :' + this.CurrencyRateForm.get('CurrencyID').invalid)
    console.log('DateCreated :' + this.CurrencyRateForm.get('DateCreated').invalid)
    console.log('Effective :' + this.CurrencyRateForm.get('Effective').invalid + ' | value:' + this.CurrencyRateForm.get('Effective').value)
    console.log(this.CurrencyRateForm.controls.Effective);
    console.log('DateEnd :' + this.CurrencyRateForm.get('DateEnd').invalid)
    console.log('TransactionRate :' + this.CurrencyRateForm.get('TransactionRate').invalid)
    // console.log(' :' + this.CurrencyRateForm.get('').invalid)
    // console.log(' :' + this.CurrencyRateForm.get('').invalid)

    if (this.CurrencyRateForm.invalid) {
      // return;
    }
    this.Loading = true;
    let rates = new LBSSYSCurrencyRates();
    rates.CurrencyID = this.SelectedCurrencyRateID; //this.CurrencyRateForm.get('CurrencyID').value;
    rates.DateCreated = this.CurrencyRateForm.get('DateCreated').value;
    rates.EffectiveDate = this.CurrencyRateForm.get('Effective').value;
    rates.EffectiveDate = rates.EffectiveDate;
    rates.DateEnd = this.CurrencyRateForm.get('DateEnd').value;
    rates.DateEnd = rates.DateEnd.toDateString();
    rates.CreatedBY = localStorage.getItem('LoginID');
    rates.TransactionRate = (this.CurrencyRateForm.get('TransactionRate').value == null || this.CurrencyRateForm.get('TransactionRate').value == '') ? 0 : this.CurrencyRateForm.get('TransactionRate').value;
    //If the mode Add will insert data to DB table else update the row by ID
    console.log(rates);

    if (this.Mode == 'Add') {
      if (this.CurrencyRateForm.get('TransactionRate').value == 0 || this.CurrencyRateForm.get('TransactionRate').value == '0') {
        this.toastr.warning('Please enter currency rate ');
        return;
      }
      this.CurrencyRateService.addCurrencyRate(rates).subscribe((resp: any) => {
        console.log(resp);
        if (!resp.isSuccess) {
          this.toastr.warning(resp.message);
          this.ResetForm();
          this.Loading = true;
        } else {
          this.toastr.success('Currency rate  details added successfully');
          let cid = this.CurrencyRateForm.get('CurrencyID').value
          this.BindCurrencyExchangeRate(cid);
          this.ResetForm();
          this.Loading = true;
        }
        // if (resp.isSuccess) {
        //   this.toastr.success('Currency rate  details added successfully');

        //   // this.BindCurrencyRate();
        //   let cid = this.CurrencyRateForm.get('CurrencyID').value
        //   this.BindCurrencyExchangeRate(cid);
        //   this.ResetForm();
        //   this.Mode = 'Add';
        //   this.Mode = 'List';
        //   this.Loading = false;
        // }
        // else {
        //   this.toastr.error(resp.message);
        //   this.Loading=false;
        // }
      }, (error) => {
        // console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      rates.ID = this.CurrencyRateForm.get('ID').value;
      this.CurrencyRateService.updateCurrencyRate(rates).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Currency rate details updated successfully');
          this.ResetForm();
          this.BindCurrencyRate();
          this.Mode = 'List';
          // this.Loading = false;
        }
      }, (error) => {
        //console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }


  //To create the currency-rate Form Controls.
  ResetForm() {
    let date = new Date();
    let endDate = new Date(date.getFullYear(), 12, 0);
    this.CurrencyRateForm.patchValue({
      ID: '',
      CurrencyID: this.CurrencyRateForm.get('CurrencyID').value,
      CurrecnyName: this.CurrencyRateForm.get('CurrecnyName').value,
      DateCreated: new Date(Date.now()),
      Effective: new Date(),
      DateEnd: new Date(date.getFullYear(), 12, 0),
      Decimal: '',
      TransactionRate: ''

    });
  }
  //edit function
  AgEdit(event) {
    this.read = true;
    let index = this.CurrencyList.findIndex(c => c.id == event.currencyID);
    let data = this.CurrencyList[index];
    this.CurrencyRateForm.patchValue({
      ID: event.id,
      CurrencyID: event.currencyID,
      CurrecnyName: data.currencyCode,
      Decimal: data.decimalPlaces,
      Effective: event.effectiveDate,
      DateEnd: event.dateEnd,
      TransactionRate: event.transactionRate
    });
    //this.Loading = false;

    this.Mode = 'Edit';


  }
  Edit(ID) {
    this.CurrencyRateService.getCurrencyRateByID(ID).subscribe((resp: any) => {
      let rates: any = new LBSSYSCurrencyRates();
      rates = resp.data.currencyrates;
      let index = this.CurrencyList.findIndex(c => c.id == ID);
      let data = this.CurrencyList[index];
      this.CurrencyRateForm.patchValue({
        ID: rates.id,
        CurrencyID: rates.currencyID,
        CurrecnyName: data.currencyCode,
        Decimal: data.decimalPlaces,
        Effective: rates.effectiveDate,
        DateEnd: rates.dateEnd,
        TransactionRate: rates.transactionRate
      });
      this.Mode = 'Edit';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  //delete records 
  onDelete(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SYS_CurrencyRates', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      //this.toastr.success('Currency rate  details deleted successfully');
      this.BindCurrencyRate();
      this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  Close() {
    this.router.navigate(['/home']);
  }
  error: any = { isError: false, errorMessage: '' };
  // compareTwoDates() {
  //   debugger;
  //   if (new Date(this.CurrencyRateForm.controls['Effective'].value) < new Date(this.CurrencyRateForm.controls['DateEnd'].value)) {
  //     this.error = { isError: true, errorMessage: 'end date canot start before' };
  //   }
  // }

  // ChangeDate() {
  //   this.CurrMaxDate = new Date('2020-05-31');
  // }
  OnModeChanged() {
    this.onModeChange.emit('List');
  }
  Back() {
    this.OnModeChanged();
  }

  transactionrateChange(user, i) {
    debugger;
    let rates = new LBSSYSCurrencyRates();
    rates.CurrencyID = this.SelectedCurrencyRateID; //this.CurrencyRateForm.get('CurrencyID').value;
    rates.DateCreated = user.dateCreated;
    rates.EffectiveDate = user.effectiveDate;
    rates.EffectiveDate = rates.EffectiveDate;
    rates.DateEnd = user.dateEnd;
    rates.DateEnd = rates.DateEnd;
    rates.CreatedBY = localStorage.getItem('LoginID');
    rates.TransactionRate = (user.transactionRate == null || user.transactionRate == '') ? 0 : user.transactionRate;
    rates.ID = user.id;
    this.CurrencyRateService.updateCurrencyRate(rates).subscribe((resp: any) => {
      if (resp.isSuccess) {
        this.toastr.success('Currency rate details updated successfully');
        this.ResetForm();
        this.BindCurrencyRate();
        this.Mode = 'List';
        // this.Loading = false;
      }
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
}
