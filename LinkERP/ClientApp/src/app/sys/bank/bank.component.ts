import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BankService } from '../services/bank.service';
import { LbsSysBank } from 'src/app/models/sys/lbs-sys-bank';
import { LbsSysBankAccount } from 'src/app/models/sys/lbs-sys-bank-account';
import { ToastrService } from 'ngx-toastr';
import { LbsSysBankAccountMapping } from 'src/app/models/sys/lbs-sys-bank-account-mapping';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BankAccountMappingComponent } from './bank-account-mapping/bank-account-mapping.component';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
  BankForm: FormGroup;
  BankAddForm: FormGroup;
  Mode: any = 'List';
  view: any;
  ColumnDefs;
  RowData: any;
  Bankid: any;
  AgLoad: boolean = false
  submitted: boolean;
  Loading: any = false;
  CompanyId = localStorage.getItem('CompanyID');
  banks: any;
  TotalRow: number;
  buttonDisabled: boolean;
  BankNamedetail: any;
  BankAccountAccess: LbsSysBankAccount[] = [];
  IsActive: boolean;
  bankvalue: any;
  AccountNodetail: any;
  BankID: any;
  bankaccounts: any;
  bankaccountdetail: any;
  //AccessTab: any = 'BankAccount';
  AccessTab: string
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  PageSize: any;
  modalRef: BsModalRef;
  read: boolean;
  Currentpage: string;
  constructor(
    private BankFB: FormBuilder,
    private bankService: BankService,
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    public modalService: BsModalService
  ) { }

  ngOnInit() {
    this.Currentpage = "0";
    this.AgLoad = false;
    this.PageSize = "50";
    this.Mode = "List";
    this.AccessTab = 'Bank';
    this.CreateForm();
    this.SetPermissions();
    this.BindBank();
    this.AgGridColumns();
  }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "111");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.BankForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.BankForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.BankForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  CreateForm() {
    this.BankForm = this.BankFB.group({
      ID: [''],
      Name: [''],
      Code: ['', Validators.required],
    });
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Code', field: 'bankCode', sortable: true, filter: true },
      { headerName: 'Name', field: 'bankName', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 80, },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, width: 20, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access, width: 20, }
    ];
  }

  get f() { return this.BankForm.controls; }

  //To bind the data of Bank to controls.
  BindBank() {
    this.Loading = true;
    this.AgLoad = false;
    this.bankService.getBank().subscribe((resp: any) => {
      this.banks = resp.data.bank;
      this.RowData = resp.data.bank;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //Add new Bank
  AddNew(): void {

    this.Mode = 'Add';
    this.read = false;
    this.AccessTab = 'Bank';
    this.BankForm.enable();
    this.IsActive = true;
  }



  BindBankDetailsByID(event) {
    this.read = false;
    this.BankID = event.id;
    this.Mode = 'Edit';
    this.BankForm.patchValue({
      ID: event.id,
      Name: event.bankName,
      Code: event.bankCode,

    });
    this.BankForm.get('Code').enable();
    this.BankForm.get('Name').enable();
    if (event.deleteStatus == 'Active') {
      this.BankForm.enable();
      this.IsActive = true;
    } else {
      this.BankForm.disable();
      this.IsActive = false;

    }

    //  this.IsActive =true;
  }
  //To bind the data of Bank to controls for edit/update.
  BindBankByID(ID) {
    this.BankForm.get('Code').enable();
    this.BankForm.get('Name').enable();
    this.bankService.getBankByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.BindBankDetailsByID(resp.data.bank);
      }
    });

  }

  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.submitted = false;
    this.BankAccountDetails = null;
    this.Mode = "List";
    this.BindBank();
  }
  OnCancel() {
    this.ResetForm();
    this.Mode = 'Add';
  }
  //To save the Bank details to database table by calling the API service
  /*  onSave() {
     this.confirmation.ConfirmationPopup('Are you sure to save record?');
   } */
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    this.submitted = true;
    if (this.BankForm.invalid) {
      return;
    }
    // this.Loading = true;
    let bank = new LbsSysBank();
    bank.BankName = this.BankForm.get('Name').value;
    bank.BankCode = this.BankForm.get('Code').value;
    bank.CreatedBY = localStorage.getItem('LoginID');
    bank.CompanyID = this.CompanyId;


    if (this.AccessTab == 'BankAccountMapping') {
      this.BankAccountMapping.AddBankAccountMapping();
    }

    this.Loading = true;
    if (this.BankAccountMappingDetails != null) {
      if (this.CheckMappingNumberExists()) {
        this.toastr.warning('Duplicate Mapping Number not allowed');
        this.Loading = false;
        return;
      }
    }


    if (this.Mode == 'Add') {
      this.bankService.addBank(bank).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Bank details saved successfully');
          this.IsActive = true;
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindBank();
            this.Mode = 'List';
          } else {
            this.BindBankByID(resp.data.id);
            this.BindBank();

          }
          this.Loading = false;
        }
        else {
          this.toastr.warning("Bank Code is Already Exist");
          this.Loading = false;
        }
      }
      );
    }
    else if (this.Mode == 'Edit') {
      bank.ID = this.BankForm.get('ID').value;
      this.BankAccountSave();
      this.BankAccountMappingSave();
      this.bankService.updateBank(bank).subscribe((resp: any) => {
        if (resp.isSuccess) {

          //this.toastr.success('Bank details Updated successfully');
          if (!this.isDuplicate) {
            this.toastr.success('Bank details Updated successfully');
          }
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.BindBank();
          } else {
            this.Mode = 'Edit';
            this.BindBankByID(resp.data.id);
          }

        } else {
          this.toastr.warning("Bank Code is Already Exist");
          this.Loading = false;
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });

    }
    this.Loading = false;
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Mode = 'Edit';
      this.AccessTab = 'Bank';
      this.BindBankDetailsByID(event.data);
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
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
  /* FOR Aggird End  */


  //Delete the record
  onDeleteChecked(ID) {
    //  this.Loading = true;
    this.bankService.deleteBankByID(ID, localStorage.getItem('LoginID')).subscribe((resp: any) => {

      if (resp.isSuccess == true) {
        this.BindBank();
      }
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      // console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }

  //Resetting the form after Add/Edit
  ResetForm() {
    this.BankForm.patchValue({
      ID: '',
      Code: '',
      Name: '',
    });
    this.BankAccountMappingDetails = null;
  }
  BankAccountDetails: FormArray;
  BankAccountArrayChange(bankAccountDetails: FormArray) {
    this.BankAccountDetails = bankAccountDetails;
  }

  BankAccountMappingDetails: FormArray;
  BankAccountMappingArrayChange(BankAccountMappingDetails: FormArray) {
    this.BankAccountMappingDetails = BankAccountMappingDetails;
  }
  isDuplicate: boolean = false;
  //To save the BankAccount details to database table by calling the API service
  BankAccountSave() {

    debugger;

    if (this.BankAccountDetails != null) {
      let lstLbsSysBankAccount: LbsSysBankAccount[] = [];
      let check = '0';
      this.isDuplicate = false;
      this.BankAccountDetails.controls.forEach(ba => {
        let lstBankAccess: any;
        lstBankAccess = new LbsSysBankAccount();
        if (check == '1') {
          let index = lstLbsSysBankAccount.findIndex(c => c.AccountNo == ba.get('AccountNo').value);

          if (index >= 0) {
            this.toastr.warning('duplicate accountNo');
            this.Loading = false;
            this.isDuplicate = true;
            return;
          }
        }
        check = '1';
        lstBankAccess.AccountName = ba.get('AccountName').value;
        lstBankAccess.AccountNo = ba.get('AccountNo').value;
        lstBankAccess.RegNo = ba.get('RegNo').value;
        lstBankAccess.DefaultAccount = ba.get('IsDefault').value;
        lstBankAccess.ID = this.BankID;
        lstBankAccess.CreatedBY = localStorage.getItem('LoginID');
        lstLbsSysBankAccount.push(lstBankAccess)

      });
      if (!this.isDuplicate) {

        this.bankService.addBankAccount(lstLbsSysBankAccount).subscribe((resp: any) => {

        });
      }
    }
  }

  CheckMappingNumberExists(): boolean {
    debugger;
    let length: number = this.BankAccountMappingDetails.length;

    for (let i = 0; i < length; i++) {
      let BankNumber = this.BankAccountMappingDetails.at(i).get('BankNumber').value;
      for (let j = 0; j < length; j++) {
        if (i != j) {
          if (this.BankAccountMappingDetails.at(j).get('BankNumber').value != null && BankNumber != null)
            if (this.BankAccountMappingDetails.at(j).get('BankNumber').value == BankNumber) {
              //alert(this.BankAccountMappingDetails.at(j).get('BankNumber').value + ' - ' + BankNumber);
              return true;
            }
        }
      }
    }
    return false;
  }
  //To save the BankAccountMapping details to database table by calling the API service
  BankAccountMappingSave() {
    if (this.AccessTab == 'BankAccountMapping') {
      this.BankAccountMapping.AddBankAccountMapping();
    }

    this.Loading = true;
    if (this.BankAccountMappingDetails != null) {
      // if (this.CheckMappingNumberExists()) {
      //   this.toastr.warning('Duplicate Mapping Number not allowed');
      //   this.Loading = false;
      //   return;
      // }

      let lstBankAccountMapping: LbsSysBankAccountMapping[] = [];
      this.BankAccountMappingDetails.controls.forEach(bam => {
        let bankAccountMapping: any = new LbsSysBankAccountMapping();
        bankAccountMapping.ID = bam.get('ID').value;
        bankAccountMapping.BankCodeFrom = bam.get('BankCodeFromID').value;
        bankAccountMapping.BankCodeTo = bam.get('BankCodeToID').value;
        bankAccountMapping.BankNumber = bam.get('BankNumber').value;
        bankAccountMapping.Deleted = bam.get('Deleted').value;
        bankAccountMapping.CreatedBY = localStorage.getItem('LoginID');
        lstBankAccountMapping.push(bankAccountMapping)
      });

      this.bankService.addBankAccountMapping(lstBankAccountMapping).subscribe((resp: any) => {
        this.Loading = false;
        this.BankAccountMapping.BindBank();

      }, (error: any) => {

      });

    }
  }



  DeletedAccountNo: any[] = [];
  DeletedBankAccountChange(deletedaccountNo: any[]) {
    //alert(deletedaccountNo.length);
    this.DeletedAccountNo = deletedaccountNo;
  }
  DeletedBankAccountChanged() {
    if (this.DeletedAccountNo.length > 0) {
      this.bankService.deleteBankAccountByID(this.DeletedAccountNo, this.BankID, localStorage.getItem('LoginID')).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          //  alert("ok");
        }
      });
    }
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }

  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  @ViewChild('BankAccountMapping') BankAccountMapping: BankAccountMappingComponent;
  OnTabChanged(TabName) {
    if (this.AccessTab == 'BankAccountMapping') {
      this.BankAccountMapping.AddBankAccountMapping();
      this.AccessTab = TabName;
    }
    else {
      this.AccessTab = TabName;
    }
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;


}

