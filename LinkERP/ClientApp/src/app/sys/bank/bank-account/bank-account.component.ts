import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BankService } from '../../services/bank.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.css']
})
export class BankAccountComponent implements OnInit {
  TotalRow: number;
  @Input() BankID: any;
  @Input() BankAccounts: any[] = [];
  @Input() BankAccountDetailsArr: FormArray;
  @Input() bankaccountdetail: any;
  @Output() BankAccountArrayChange = new EventEmitter<any>();
  @Output() DeletedBankAccountChange = new EventEmitter();
  @Input() write_Access: boolean;
  @Input() delete_Access: boolean;
  @Input() IsActive : boolean;
  BankAccountForm: FormGroup;

  constructor(private FB: FormBuilder,
    private bankService: BankService,
    private toastr: ToastrService) { }

  ngOnInit() {
    // this.BindBankAccountValue();
    this.BankAccountForm = this.FB.group({
      BankID: [''],
      BankAccounts: this.FB.array([]),
      Account: this.FB.group({
        AccountNo: [''],
        AccountName: [''],
        RegNo: [''],
        IsDefault: [false],
        //Deleted:[true]
      })
    });


    if (this.BankAccountDetailsArr == null) {
      this.BankAccountByBankID();
    }
    else {
      this.BankAccountDetailsArr.controls.forEach(b => {
        this.BankAccountArray.push(b);
      });
    }
    // this.BankAccountByBankID();

  }

  BankAccountByBankID() {
    debugger;
    this.bankaccountdetail = [];
    this.bankService.getBankAccountByBankID(this.BankID).subscribe((resp: any) => {
      // console.log(resp);
      if (resp.isSuccess == true) {

        //let banks: any = new LbsSysBankAccount();
        this.bankaccountdetail = resp.data.bank;
        this.BankAccountForm.setControl('BankAccounts', this.setBankAccountDetails(this.bankaccountdetail));
        this.BankAccountDetails();
        //this.Bankdetails();
      }
    });
  }

  setBankAccountDetails(BankAccountDetails: any[]): FormArray {
    const formArray = new FormArray([]);
    BankAccountDetails.forEach(ba => {
      formArray.push(this.FB.group({
        ID: ba.id,
        AccountNo: ba.accountNo,
        AccountName: ba.accountName,
        RegNo: ba.regNo,
        IsDefault: ba.defaultAccount,
        Deleted: ba.deleteStatus
      }));
    });
    return formArray;
  }

  get BankAccountArray(): FormArray {
    return this.BankAccountForm.get('BankAccounts') as FormArray;
  }
  get BankAccount() { return this.BankAccountForm.get('Account') as FormGroup; }

  CreateBankAccount(): FormGroup {
    if(this.BankAccount.get('IsDefault').value==true){
      this.DefaultSelected();
    }
    return this.FB.group({
      ID: '',
      BankID: [''],
      AccountNo: [this.BankAccount.get('AccountNo').value],
      AccountName: [this.BankAccount.get('AccountName').value],
      RegNo: [this.BankAccount.get('RegNo').value],
      IsDefault: [this.BankAccount.get('IsDefault').value],
      Deleted: ['Active']

    });
  }
  AddBankAccount() {


    this.BankAccountArray.push(this.CreateBankAccount());
 
    let lastIndex = this.BankAccountArray.length;
    this.BankAccountDetails();
    //  this.onDefaultSelected(lastIndex - 1);
    // this.onDefaultSelected(lastIndex);
    this.ResetForm();
  }
  BankAccountDetails() {
    this.BankAccountArrayChange.emit(this.BankAccountArray);
  }
  UpdateBankAccountArray() {
    this.BankAccountDetails();
  }
  ResetForm() {

    this.BankAccount.patchValue({
      ID: '',
      AccountNo: '',
      AccountName: '',
      RegNo: '',
      IsDefault: false
    });
  }
  onDefaultSelected(rowIndex: number) {
    debugger;
    for (let i = 0; i < this.BankAccountArray.length; i++) {
      if (rowIndex != i) {
        this.BankAccountArray.at(i).patchValue({ IsDefault: false });
      }
      else {
        this.BankAccountArray.at(i).patchValue({ IsDefault: true });
      }
    }
  }

  DefaultSelected() {
    for (let i = 0; i < this.BankAccountArray.length; i++) {
      this.BankAccountArray.at(i).patchValue({ IsDefault: false });
    }
  }

  DeletedBankAccountChanged() {
    this.DeletedBankAccountChange.emit(this.DeletedAccountNo);
  }
  DeletedPMD: any[] = [];
  DeletedAccountNo: any[] = [];
  DeleteBank(index: number, AccountNo: any) {
    this.DeletedAccountNo.push(AccountNo);
    this.DeletedBankAccountChanged();

    this.BankAccountArray.removeAt(index);
  }

  DeleteBankAccount(index: number, ID) {
    debugger;
    this.bankService.deleteBankAccountMappingByID(ID, 'LBS_SYS_BankAccounts', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.BankAccountByBankID();
      }
    }, (error) => {
    });

  }


  DeleteBankAccountDetails(index: number, ID, AccountNo) {
    debugger;
    if (ID) {
      this.bankService.DeleteBankAccountDetails(ID, AccountNo).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.BankAccountByBankID();
        }
      }, (error) => {
      });
    }
    else {
      this.BankAccountArray.removeAt(index);
    }
  }

}
