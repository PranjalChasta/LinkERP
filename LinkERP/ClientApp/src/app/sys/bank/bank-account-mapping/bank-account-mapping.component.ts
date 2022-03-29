import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { BankService } from '../../services/bank.service';
import { LbsSysBankAccountMapping } from 'src/app/models/sys/lbs-sys-bank-account-mapping';

@Component({
  selector: 'app-bank-account-mapping',
  templateUrl: './bank-account-mapping.component.html',
  styleUrls: ['./bank-account-mapping.component.css']
})
export class BankAccountMappingComponent implements OnInit {
  TotalRow: number;
  @Input() BankID: any;
  @Input() AccountMapping: any[] = [];
  @Input() BankAccountMappingDetails: FormArray;
  @Output() BankAccountMappingArrayChange = new EventEmitter<any>();
  BankAccountMappingForm: FormGroup;
  banks: any;
  bankAccounts: any;
  @Input() write_Access: boolean;
  @Input() delete_Access: boolean;
  constructor(private FB: FormBuilder, private bankService: BankService) { }

  ngOnInit() {
    this.BankAccountMappingForm = this.FB.group({
      BankID: [''],
      AccountMapping: this.FB.array([]),
      Account: this.FB.group({
        BankCode: [''],
        BankName: [''],
        BankNumber: [''],
      })
    });
    //this.BankByID();
    //alert(this.BankAccountMappingDetails);

    if (this.BankAccountMappingDetails == null) {
      this.BindBank();
    }
    else {
      this.BankAccountMappingForm.setControl('AccountMapping', this.BankAccountMappingDetails);
    }
  }

  BindBank() {
    this.bankService.getBankAccountMappingByBankID(this.BankID).subscribe((resp: any) => {      
      this.banks = resp.data.bankAccountMapping;
      this.BankAccountMappingForm.setControl('AccountMapping', this.setBankAccountMappingDetails(this.banks));
      this.DisablingBankNumber();
      //this.BankAccountMappingDetails();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  // BankByID() {
  //   debugger;
  //   this.bankaccountdetail = [];
  //   this.bankService.getBankByID(this.BankID).subscribe((resp: any) => {

  //     if (resp.isSuccess == true) {

  //       this.banks = resp.data.bank;
  //       //this.BankAccountMappingForm.setControl('AccountMapping', this.setDefaultBankAccountMappingDetails(this.banks));
  //       this.BankAccountMappingDetails();
  //       this.BindBank();

  //     }
  //   });
  // }

  setBankAccountMappingDetails(BankAccountMappingDetails: any[]): FormArray {

    const formArray = new FormArray([]);
    BankAccountMappingDetails.forEach(ba => {
      formArray.push(this.FB.group({
        ID: ba.id,
        BankCodeFromID: ba.bankCodeFromID,
        BankCodeToID: ba.bankCodeToID,
        BankCodeTo: ba.bankCodeTo,
        BankName: ba.bankName,
        BankNumber: ba.bankNumber,
        Deleted: ba.deleted,
        DeleteStatus: ba.deleteStatus
      }));
    });
    return formArray;
  }
  DisablingBankNumber() {
    // for (let i = 0; i < this.BankAccountMappingArray.length; i++) {
    //   if (this.BankAccountMappingArray.at(i).get('Deleted').value == true) {
    //     this.BankAccountMappingArray.at(i).get('BankNumber').disable();
    //   }
    // }
  }
  // setDefaultBankAccountMappingDetails(BankAccountMappingDetails: any[]): FormArray {

  //   const formArray = new FormArray([]);
  //   BankAccountMappingDetails.forEach(ba => {
  //     formArray.push(this.FB.group({
  //       ID: ba.id,
  //       BankCode: ba.bankCode,
  //       BankName: ba.bankName,
  //       BankNumber: '',
  //       Deleted: ba.deleteStatus
  //     }));
  //   });
  //   return formArray;
  // }

  get BankAccountMappingArray(): FormArray {
    return this.BankAccountMappingForm.get('AccountMapping') as FormArray;
  }
  get BankAccountMapping() { return this.BankAccountMappingForm.get('Account') as FormGroup; }

  CreateBankAccount(): FormGroup {

    return this.FB.group({
      ID: '',
      BankID: [''],
      BankCode: [this.banks.bankName],
      BankName: [this.BankAccountMapping.get('BankName').value],
      BankNumber: [this.BankAccountMapping.get('BankNumber').value],

    });
  }
  AddBankAccountMapping() {

    //this.BankAccountMappingArray.push(this.CreateBankAccount());
    //this.BankAccountMappingDetails();
    // this.ResetForm();
    this.BankAccountMappingArrayChange.emit(this.BankAccountMappingArray);
  }




  // BankAccountMappingDetails() {
  //   this.BankAccountMappingArrayChange.emit(this.BankAccountMappingArray);
  // }
  ResetForm() {

    this.BankAccountMapping.patchValue({
      ID: '',
      BankCode: '',
      BankName: '',
      BankNumber: '',
    });
  }
  Delete(index: number) {
  
    let deleted = this.BankAccountMappingArray.at(index).get('Deleted').value;

    this.BankAccountMappingArray.at(index).patchValue({
      Deleted: !deleted,
      DeleteStatus: !deleted == false ? 'ACTIVE' : 'INACTIVE'
    });

    // if (!deleted == false)
    //   this.BankAccountMappingArray.at(index).get('BankNumber').enable();
    // else
    //   this.BankAccountMappingArray.at(index).get('BankNumber').disable();
    // this.bankService.deleteBankAccountMappingByID(ID, 'LBS_SYS_BanK', localStorage.getItem('LoginID')).subscribe((resp: any) => {
    //   if (resp.isSuccess == true) {
    //     this.BindBank();
    //   }
    // }, (error) => {
    // });
  }


}
