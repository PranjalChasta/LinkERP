import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CustomValidators } from 'ngx-custom-validators';
import { TenderTypesService } from '../services/tender-types.service';
import { FieldTypeEnum } from 'src/app/models/pos/fieldtypeEnum';
import { LookUpListEnum } from 'src/app/models/pos/lookupListEnum';
import { Tendertypes } from 'src/app/models/pur/tendertypes';

@Component({
  selector: 'app-tender-types',
  templateUrl: './tender-types.component.html',
  styleUrls: ['./tender-types.component.css']
})
export class TenderTypesComponent implements OnInit {
  TenderTypeForm: FormGroup;
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
  private fieldTypeEnum = FieldTypeEnum;
  public fieldTypeEnumOption = [];
  private lookupListEnum = LookUpListEnum;
  public lookupListEnumOption = [];

  constructor(
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    private tenderTypesService: TenderTypesService,
    private deleteRecordsService: DeleteRecordsService,
    private FB: FormBuilder,
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.CreateForm();
    this.GetAgColumns();
    this.fieldTypeEnumOption = Object.keys(this.fieldTypeEnum);
    this.lookupListEnumOption = Object.keys(this.lookupListEnum);
    this.GetTenderTypeList();
    this.SetPermissions();
    this.Currentpage = "0";
    this.PageSize = "50";
  }
  get f() { return this.TenderTypeForm.controls; }

  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "405");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.TenderTypeForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.TenderTypeForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.TenderTypeForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  GetAgColumns() {
    this.ColumnDefs = [
      { headerName: 'Fast Key', field: 'fastKey', sortable: true, filter: true },
      { headerName: 'Description', field: 'description', sortable: true, filter: true },
      { headerName: 'Header1', field: 'header1', sortable: true, filter: true },
      { headerName: 'Header2', field: 'header2', sortable: true, filter: true },
      { headerName: 'Header3', field: 'header3', sortable: true, filter: true },
      { headerName: 'Header4', field: 'header4', sortable: true, filter: true },

      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 80, },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
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
    this.TenderTypeForm.get('Description').enable();
    this.TenderTypeForm.get('FastKey').enable();
    this.TenderTypeForm.get('Caption1').enable();
    this.TenderTypeForm.get('Caption2').enable();
    this.TenderTypeForm.get('Caption3').enable();
    this.TenderTypeForm.get('Caption4').enable();
    this.TenderTypeForm.get('Caption5').enable();
    this.TenderTypeForm.get('Caption6').enable();
    this.TenderTypeForm.get('Caption7').enable();
    this.TenderTypeForm.get('Caption8').enable();
    this.TenderTypeForm.get('Caption1IsRequired').enable();
    this.TenderTypeForm.get('Caption2IsRequired').enable();
    this.TenderTypeForm.get('Caption3IsRequired').enable();
    this.TenderTypeForm.get('Caption4IsRequired').enable();
    this.TenderTypeForm.get('Caption5IsRequired').enable();
    this.TenderTypeForm.get('Caption6IsRequired').enable();
    this.TenderTypeForm.get('Caption7IsRequired').enable();
    this.TenderTypeForm.get('Caption8IsRequired').enable();
    this.TenderTypeForm.get('Caption1List').enable();
    this.TenderTypeForm.get('Caption2List').enable();
    this.TenderTypeForm.get('Caption3List').enable();
    this.TenderTypeForm.get('Caption4List').enable();
    this.TenderTypeForm.get('Caption5List').enable();
    this.TenderTypeForm.get('Caption6List').enable();
    this.TenderTypeForm.get('Caption7List').enable();
    this.TenderTypeForm.get('Caption8List').enable();
    this.TenderTypeForm.get('Caption1FieldType').enable();
    this.TenderTypeForm.get('Caption2FieldType').enable();
    this.TenderTypeForm.get('Caption3FieldType').enable();
    this.TenderTypeForm.get('Caption4FieldType').enable();
    this.TenderTypeForm.get('Caption5FieldType').enable();
    this.TenderTypeForm.get('Caption6FieldType').enable();
    this.TenderTypeForm.get('Caption7FieldType').enable();
    this.TenderTypeForm.get('Caption8FieldType').enable();
    this.TenderTypeForm.get('VerifyFromListCaption1').enable();
    this.TenderTypeForm.get('VerifyFromListCaption2').enable();
    this.TenderTypeForm.get('VerifyFromListCaption3').enable();
    this.TenderTypeForm.get('VerifyFromListCaption4').enable();
    this.TenderTypeForm.get('VerifyFromListCaption5').enable();
    this.TenderTypeForm.get('VerifyFromListCaption6').enable();
    this.TenderTypeForm.get('VerifyFromListCaption7').enable();
    this.TenderTypeForm.get('VerifyFromListCaption8').enable();
    this.TenderTypeForm.get('Surcharge').enable();
    this.TenderTypeForm.get('BankAccount').enable();
    this.TenderTypeForm.get('IncludeInBanking').enable();
    this.TenderTypeForm.get('SurchargePercentValue').enable();
    this.TenderTypeForm.get('ShiftVarianceAccountCode').enable();
    this.TenderTypeForm.get('MultiCurrency').enable();
    this.TenderTypeForm.get('IsActive').enable();
    this.TenderTypeForm.get('EFT').enable();
    this.TenderTypeForm.get('IsSystem').enable();
    this.IsActive = true;
  }
  CreateForm() {
    this.TenderTypeForm = this.FB.group({
      ID: [''],
      Description: ['', Validators.required],
      FastKey: ['', Validators.required],
      Caption1: ['', Validators.required],
      Caption2: ['', Validators.required],
      Caption3: ['', Validators.required],
      Caption4: ['', Validators.required],
      Caption5: ['', Validators.required],
      Caption6: ['', Validators.required],
      Caption7: ['', Validators.required],
      Caption8: ['', Validators.required],
      Caption1IsRequired: [false],
      Caption2IsRequired: [false],
      Caption3IsRequired: [false],
      Caption4IsRequired: [false],
      Caption5IsRequired: [false],
      Caption6IsRequired: [false],
      Caption7IsRequired: [false],
      Caption8IsRequired: [false],
      Caption1List: ['-1', CustomValidators.notEqual('-1')],
      Caption2List: ['-1', CustomValidators.notEqual('-1')],
      Caption3List: ['-1', CustomValidators.notEqual('-1')],
      Caption4List: ['-1', CustomValidators.notEqual('-1')],
      Caption5List: ['-1', CustomValidators.notEqual('-1')],
      Caption6List: ['-1', CustomValidators.notEqual('-1')],
      Caption7List: ['-1', CustomValidators.notEqual('-1')],
      Caption8List: ['-1', CustomValidators.notEqual('-1')],
      Caption1FieldType: ['-1', CustomValidators.notEqual('-1')],
      Caption2FieldType: ['-1', CustomValidators.notEqual('-1')],
      Caption3FieldType: ['-1', CustomValidators.notEqual('-1')],
      Caption4FieldType: ['-1', CustomValidators.notEqual('-1')],
      Caption5FieldType: ['-1', CustomValidators.notEqual('-1')],
      Caption6FieldType: ['-1', CustomValidators.notEqual('-1')],
      Caption7FieldType: ['-1', CustomValidators.notEqual('-1')],
      Caption8FieldType: ['-1', CustomValidators.notEqual('-1')],
      VerifyFromListCaption1: [false],
      VerifyFromListCaption2: [false],
      VerifyFromListCaption3: [false],
      VerifyFromListCaption4: [false],
      VerifyFromListCaption5: [false],
      VerifyFromListCaption6: [false],
      VerifyFromListCaption7: [false],
      VerifyFromListCaption8: [false],
      Surcharge: ['', Validators.required],
      SurchargePercentValue: [false],
      BankAccount: ['', Validators.required],
      IncludeInBanking: [false],
      ShiftVarianceAccountCode: ['', Validators.required],
      MultiCurrency: [false],
      IsActive: [true],
      EFT: [false],
      IsSystem: [false]
    });
  }

  //Resetting the form after Add/Edit
  ResetForm() {
    this.TenderTypeForm.patchValue({
      ID: '',
      Description: '',
      FastKey: '',
      Caption1: '',
      Caption2: '',
      Caption3: '',
      Caption4: '',
      Caption5: '',
      Caption6: '',
      Caption7: '',
      Caption8: '',
      Caption1IsRequired: false,
      Caption2IsRequired: false,
      Caption3IsRequired: false,
      Caption4IsRequired: false,
      Caption5IsRequired: false,
      Caption6IsRequired: false,
      Caption7IsRequired: false,
      Caption8IsRequired: false,
      Caption1List: '-1',
      Caption2List: '-1',
      Caption3List: '-1',
      Caption4List: '-1',
      Caption5List: '-1',
      Caption6List: '-1',
      Caption7List: '-1',
      Caption8List: '-1',
      Caption1FieldType: '-1',
      Caption2FieldType: '-1',
      Caption3FieldType: '-1',
      Caption4FieldType: '-1',
      Caption5FieldType: '-1',
      Caption6FieldType: '-1',
      Caption7FieldType: '-1',
      Caption8FieldType: '-1',
      VerifyFromListCaption1: false,
      VerifyFromListCaption2: false,
      VerifyFromListCaption3: false,
      VerifyFromListCaption4: false,
      VerifyFromListCaption5: false,
      VerifyFromListCaption6: false,
      VerifyFromListCaption7: false,
      VerifyFromListCaption8: false,
      Surcharge: '',
      SurchargePercentValue: false,
      BankAccount: '',
      IncludeInBanking: false,
      ShiftVarianceAccountCode: '',
      MultiCurrency: false,
      IsActive: true,
      EFT: false,
      IsSystem: false
    });
    this.TenderTypeForm.markAsUntouched();
    this.TenderTypeForm.markAsPristine();
    this.submitted = false;
  }

  GetTenderTypeList() {
    this.Loading = true;
    this.AgLoad = false;
    this.tenderTypesService.GetTenderTypes().subscribe((res: any) => {
      this.RowData = res.data.tenderTypes;
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  // get f() { return this.TenderTypeForm.controls; }
  OnSubmit() {
    debugger;
    this.submitted = true;
    // if (this.TenderTypeForm.invalid) {
    //   return;
    // }
    let tendertypes = new Tendertypes();
    // purchaseinvoice.CompanyID = this.CompanyID;
    tendertypes.FastKey = this.TenderTypeForm.get('FastKey').value;
    tendertypes.Caption1 = this.TenderTypeForm.get('FastKey').value;
    tendertypes.Caption2 = this.TenderTypeForm.get('Caption1').value;
    tendertypes.Caption2 = this.TenderTypeForm.get('Caption2').value;
    tendertypes.Caption3 = this.TenderTypeForm.get('Caption3').value;
    tendertypes.Caption4 = this.TenderTypeForm.get('Caption4').value;
    tendertypes.Caption5 = this.TenderTypeForm.get('Caption5').value;
    tendertypes.Caption6 = this.TenderTypeForm.get('Caption6').value;
    tendertypes.Caption7 = this.TenderTypeForm.get('Caption7').value;
    tendertypes.Caption1IsRequired = this.TenderTypeForm.get('Caption1IsRequired').value;
    tendertypes.Caption2IsRequired = this.TenderTypeForm.get('Caption2IsRequired').value;
    tendertypes.Caption3IsRequired = this.TenderTypeForm.get('Caption3IsRequired').value;
    tendertypes.Caption4IsRequired = this.TenderTypeForm.get('Caption4IsRequired').value;
    tendertypes.Caption5IsRequired = this.TenderTypeForm.get('Caption5IsRequired').value;
    tendertypes.Caption6IsRequired = this.TenderTypeForm.get('Caption6IsRequired').value;
    tendertypes.Caption7IsRequired = this.TenderTypeForm.get('Caption7IsRequired').value;
    tendertypes.Caption8IsRequired = this.TenderTypeForm.get('Caption8IsRequired').value;
    tendertypes.SurchargeAmount = this.TenderTypeForm.get('Surcharge').value;
    tendertypes.Caption1FieldType = this.TenderTypeForm.get('Caption1FieldType').value;
    tendertypes.Caption2FieldType = this.TenderTypeForm.get('Caption2FieldType').value;
    tendertypes.Caption3FieldType = this.TenderTypeForm.get('Caption3FieldType').value;
    tendertypes.Caption5FieldType = this.TenderTypeForm.get('Caption5FieldType').value;
    tendertypes.Caption6FieldType = this.TenderTypeForm.get('Caption6FieldType').value;
    tendertypes.Caption7FieldType = this.TenderTypeForm.get('Caption7FieldType').value;
    tendertypes.Caption8FieldType = this.TenderTypeForm.get('Caption8FieldType').value;
    tendertypes.Caption1List = this.TenderTypeForm.get('Caption1List').value;
    tendertypes.Caption2List = this.TenderTypeForm.get('Caption2List').value;
    tendertypes.Caption3List = this.TenderTypeForm.get('Caption3List').value;
    tendertypes.Caption4List = this.TenderTypeForm.get('Caption4List').value;
    tendertypes.Caption5List = this.TenderTypeForm.get('Caption5List').value;
    tendertypes.Caption6List = this.TenderTypeForm.get('Caption6List').value;
    tendertypes.Caption7List = this.TenderTypeForm.get('Caption7List').value;
    tendertypes.Caption8List = this.TenderTypeForm.get('Caption8List').value;
    tendertypes.VerifyFromListCaption1 = this.TenderTypeForm.get('VerifyFromListCaption1').value;
    tendertypes.VerifyFromListCaption2 = this.TenderTypeForm.get('VerifyFromListCaption3').value;
    tendertypes.VerifyFromListCaption3 = this.TenderTypeForm.get('VerifyFromListCaption3').value;
    tendertypes.VerifyFromListCaption4 = this.TenderTypeForm.get('VerifyFromListCaption4').value;
    tendertypes.VerifyFromListCaption5 = this.TenderTypeForm.get('VerifyFromListCaption5').value;
    tendertypes.VerifyFromListCaption6 = this.TenderTypeForm.get('VerifyFromListCaption6').value;
    tendertypes.VerifyFromListCaption7 = this.TenderTypeForm.get('VerifyFromListCaption7').value;
    tendertypes.VerifyFromListCaption8 = this.TenderTypeForm.get('VerifyFromListCaption8').value;
    tendertypes.MultiCurrency = this.TenderTypeForm.get('MultiCurrency').value;
    tendertypes.EFT = this.TenderTypeForm.get('EFT').value;
    tendertypes.BankAccountCode = this.TenderTypeForm.get('BankAccountCode').value;

    

    // purchaseinvoice.VendorID = this.PurchaseInvoiceForm.get('VendorID').value;
    // purchaseinvoice.InvoiceDate = this.PurchaseInvoiceForm.get('InvoiceDate').value;
    // purchaseinvoice.DueDate = this.PurchaseInvoiceForm.get('DueDate').value;
    // purchaseinvoice.Status = this.PurchaseInvoiceForm.get('Status').value;[Caption1FieldType]
    // purchaseinvoice.Freight = this.PurchaseInvoiceForm.get('Freight').value;
    // purchaseinvoice.FreightTaxID = this.PurchaseInvoiceForm.get('FreightTaxID').value;
    // purchaseinvoice.FreightTaxRate = this.PurchaseInvoiceForm.get('FreightTaxRate').value;
    // purchaseinvoice.FreightTaxAmount = this.PurchaseInvoiceForm.get('FreightTaxAmount').value;
    // purchaseinvoice.Duty = this.PurchaseInvoiceForm.get('Duty').value;
    // purchaseinvoice.DutyTaxID = this.PurchaseInvoiceForm.get('DutyTaxID').value;
    // purchaseinvoice.DutyTaxRate = this.PurchaseInvoiceForm.get('DutyTaxRate').value;
    // purchaseinvoice.DutyTaxAmount = this.PurchaseInvoiceForm.get('DutyTaxAmount').value;
    // purchaseinvoice.Insurance = this.PurchaseInvoiceForm.get('Insurance').value;
    // purchaseinvoice.InsuranceTaxID = this.PurchaseInvoiceForm.get('InsuranceTaxID').value;
    // purchaseinvoice.InsuranceTaxRate = this.PurchaseInvoiceForm.get('InsuranceTaxRate').value;
    // purchaseinvoice.InsuranceTaxAmount = this.PurchaseInvoiceForm.get('InsuranceTaxAmount').value;
    // purchaseinvoice.TotalExcludingTax = this.PurchaseInvoiceForm.get('TotalExcludingTax').value;
    // purchaseinvoice.TotalLineTax = this.PurchaseInvoiceForm.get('TotalLineTax').value;
    // purchaseinvoice.InvoiceToleranceAmount = this.PurchaseInvoiceForm.get('InvoiceToleranceAmount').value;
    // purchaseinvoice.TotalIncludingTax = this.PurchaseInvoiceForm.get('TotalIncludingTax').value;
    // purchaseinvoice.CurrencyID = this.PurchaseInvoiceForm.get('CurrencyID').value;
    //If the mode is Add then it will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      debugger;
      this.tenderTypesService.addTenderTypes(tendertypes).subscribe((resp: any) => {
        debugger;
        if (resp.isSuccess) {
          this.toastr.success(' Purchase Invoice  added successfully');
          //this.BindPurchaseInvoices();
          //this.Mode = 'List';
          //this.Loading = false;
          // if (saveAction == 'Close') {
          //   // this.Cancel();
          //   // this.BindPurchaseInvoices();
          //   this.Mode = 'List';
          // }
          // else {
          //   // this.BindPurchaseInvoiceDetails(resp.data.id);
          //   // this.BindPurchaseInvoices();
          //   this.Mode = 'Edit';
          // }
        }
      });
    }
    else if (this.Mode == 'Edit') {
      // purchaseinvoice.ID = this.PurchaseInvoiceForm.get('ID').value;
      this.tenderTypesService.updateTenderTypes(tendertypes).subscribe((resp: any) => {
        this.toastr.success('Purchase Invoice  updated successfully')
        {
          // this.BindPurchaseInvoices();
          this.Mode = 'List';
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
}
