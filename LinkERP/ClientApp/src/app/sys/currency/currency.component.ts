import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CurrencyService } from '../services/currency.service';
import { LBSSYSCurrency } from 'src/app/models/sys/lbs-sys-currency';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {
  CurrencyForm: FormGroup;
  Mode: any = 'List';
  submitted: boolean;
  Loading: any = false;
  //Permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  modalRef: BsModalRef;
  IsActive: boolean;
  //CodeActive:boolean;
  Currency: any[] = [];
  SelectedCurrency: any;//Array variable of currency data to bind grid
  /* FOR Aggird Start */
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  AccessTab: string;
  HeaderNames: any;
  CurrencyCode: any;
  PageSize: any;
  SelectedCurrencyRateID: any;
  Currentpage: string;
  CompanyID = localStorage.getItem('CompanyID');
  /* FOR Aggird End  */
  constructor(
    private CurrencyService: CurrencyService,
    private deleteservice: DeleteRecordsService,
    private CurrencyFB: FormBuilder,
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    public modalService: BsModalService
  ) { }
  ngOnInit() {
    this.AgLoad = false;
    this.Currentpage = "0";
    this.AccessTab = 'Currency';
    this.HeaderNames = 'Currency';
    this.Mode = 'List';
    this.PageSize = "50";
    this.CreateForm();
    this.SetPermissions();
    this.BindCurrency();
    this.AgGridColumns();
  }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "114");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.CurrencyForm.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          this.CurrencyForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.CurrencyForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  //To create the CurrencyForm  Controls.
  CreateForm() {
    this.CurrencyForm = this.CurrencyFB.group({
      ID: [''],
      CurrecnyName: ['', Validators.required],
      CurrencyCode: ['', Validators.required],
      Decimal: ['']
    });
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: ' Code', field: 'currencyCode', sortable: true, filter: true, checkboxSelection: false },
      { headerName: ' Name', field: 'currecnyName', sortable: true, filter: true },
      // { headerName: ' Rate', field: 'decimalPlaces', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 85 },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
  get f() { return this.CurrencyForm.controls; }
  //Add new Currency
  AddNew(): void {
    this.ResetForm();
    this.Mode = 'Add';
    //this.CurrencyForm.enable();
    this.IsActive = true;
    this.CurrencyCode = '';
    this.CurrencyForm.enable();
    // this.CodeActive = false;
  }
  //edit function
  Edit(ID): void {
    //this.CodeActive =true;
   
    this.BindCurrencyById(ID);

  }
  //Bind currency by  ID
  BindCurrencyById(ID) {
    this.CurrencyService.getCurrencyByID(ID).subscribe((resp: any) => {
      let lbssyscurrency: any = new LBSSYSCurrency();
      this.SelectedCurrency = lbssyscurrency.id;
      this.CurrencyCode = lbssyscurrency.currencyCode;
      lbssyscurrency = resp.data.currencybyID;
      this.SelectedCurrency =ID;
      this.SelectedCurrencyRateID =ID; 
      this.Mode = 'Edit'
      this.CurrencyForm.patchValue({
        ID: lbssyscurrency.id,
        CurrecnyName: lbssyscurrency.currecnyName,
        CurrencyCode: lbssyscurrency.currencyCode,
        Decimal: lbssyscurrency.decimalPlaces
      });
      if (!lbssyscurrency.deleted) {
        this.CurrencyForm.enable();
        this.IsActive = true;
      } else {
        this.CurrencyForm.disable();
        this.IsActive = false;
      }
      //this.CurrencyForm.get('CurrencyCode').disable();
    },
      (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
  }
  //Cancel the Add/Edit
  Cancel() {
    this.ResetForm();
    this.submitted = false;
    this.Mode = 'List';
  }
  //To Reset the Form.
  ResetForm() {
    this.CurrencyForm.patchValue({
      ID: '',
      CurrecnyName: '',
      CurrencyCode: '',
      Decimal: ''
    });
    this.CurrencyForm.markAsUntouched();
    this.CurrencyForm.markAsPristine();
    this.submitted = false;
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      //  this.Mode = 'Edit'
      this.SelectedCurrency = event.data.id;
      this.SelectedCurrencyRateID = event.data.id;
      this.CurrencyCode = event.data.currencyCode;
      this.Edit(event.data.id)
    } else if (colId == 'Delete') {
      this.onDelete(event.data.id)
    }
  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  //To bind the data of all currency to the Grid.
  BindCurrency() {
    this.Loading = true;

    this.AgLoad = false;
    this.CurrencyService.getcurrency().subscribe((resp: any) => {
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
  //delete records
  onDelete(ID) {
    this.deleteservice.deleteRecordsBYID(ID, 'LBS_SYS_Currency', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindCurrency();
      this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To save the currency details to database table by calling the API service
  onSaveold(saveAction) {

    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    this.submitted = true;
    if (this.CurrencyForm.invalid) {
      return;
    }
    //this.Loading = true;
    let lbssyscurrency = new LBSSYSCurrency();
    lbssyscurrency.CompanyID = this.CompanyID;
    lbssyscurrency.CurrecnyName = this.CurrencyForm.get('CurrecnyName').value;
    lbssyscurrency.CurrencyCode = this.CurrencyForm.get('CurrencyCode').value;
    lbssyscurrency.DecimalPlaces = this.CurrencyForm.get('Decimal').value;
    lbssyscurrency.CreatedBY = localStorage.getItem('LoginID');
    //If the mode Add is add then it will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.CurrencyService.addCurrency(lbssyscurrency).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Currency added successfully')

          if (saveAction == 'Close') {
            this.Cancel();
            this.BindCurrency();
            this.Mode = 'List';
          }
          else {
            this.Edit(resp.data.id);
            this.BindCurrency();
          //  this.Mode = 'Edit';
          }
          this.Loading = false;
        }
        else {
          this.toastr.warning('Currency code  already exists')
          this.Loading = false;
        }
      });
    }
    else if (this.Mode == 'Edit') {
      lbssyscurrency.ID = this.CurrencyForm.get('ID').value;
      this.CurrencyService.updateCurrency(lbssyscurrency).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Currency  details updated successfully');

          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindCurrency();
          }
          else {
            this.Edit(this.CurrencyForm.get('ID').value)
          }
        } else {
          this.toastr.warning('Currency code already exists')
          this.Loading = false;
        }
      });
    }
    this.Loading = false;
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
  onModeChange(mode: any) {
    this.Mode = mode;
  }
}
