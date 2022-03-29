import { Component, OnInit } from '@angular/core';
import { PurCommonService } from '../services/pur-common.service';
import { TenderTypesService } from 'src/app/POS/services/tender-types.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { CustomValidators } from 'ngx-custom-validators';
import { ToastrService } from 'ngx-toastr';
import { Tendertypes } from 'src/app/models/pur/tendertypes';
import { FieldTypeEnum } from 'src/app/models/pos/fieldtypeEnum';
import { LookUpListEnum } from 'src/app/models/pos/lookupListEnum';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
@Component({
  selector: 'app-tender-types-lookup-list',
  templateUrl: './tender-types-lookup-list.component.html',
  styleUrls: ['./tender-types-lookup-list.component.css']
})
export class TenderTypesLookupListComponent implements OnInit {
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
  SelectetendertypeID: any;
  //private fieldTypeEnum = FieldTypeEnum;
  public fieldTypeEnumOption = [];
  //private lookupListEnum = LookUpListEnum;
  public lookupListEnumOption = [];
  CompanyId = localStorage.getItem('CompanyID');
  Tendertypegroup: any;
  TenderFieldType: any;
  TenderTypesLookupList: any;
  constructor(
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    private tenderTypesService: TenderTypesService,
    private deleteRecordsService: DeleteRecordsService,
    private FB: FormBuilder, private sysCommonService: SysCommonService,
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.CreateForm();
    this.GetAgColumns();
    this.BindTendertypegroup();
    this.BindTenderFieldType();
    this.BindTenderTypesLookupList();
    //this.fieldTypeEnumOption = Object.keys(this.fieldTypeEnum);
    //this.lookupListEnumOption = Object.keys(this.lookupListEnum);
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
      { headerName: 'Caption1', field: 'caption1', sortable: true, filter: true },
      { headerName: 'Caption2', field: 'caption2', sortable: true, filter: true },
      { headerName: 'Caption3', field: 'caption3', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', sortable: true, filter: true },
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
    this.TenderTypeForm.enable();
    this.IsActive = true;
    this.ResetForm();
    this.Mode = 'Add';
  }
  Edit(ID): void {
    debugger;
    this.Mode = 'Edit';
    this.SelectetendertypeID = ID;
    this.BindtenderTpyesByID(ID);
  }
  BindtenderTpyesByID(ID) {
    debugger;
    this.tenderTypesService.BindtenderypyeID(ID).subscribe((resp: any) => {
      console.log(resp);
      if (resp.isSuccess == true) {
        let tendertypes: any = new Tendertypes();
        tendertypes = resp.data.type;
        this.TenderTypeForm.patchValue({
          ID: tendertypes.id,
          Description: tendertypes.description,
          FastKey: tendertypes.fastKey,
          TenderTypesGroup: tendertypes.tenderTypesGroup,
          Caption1: tendertypes.caption1,
          Caption2: tendertypes.caption2,
          Caption3: tendertypes.caption3,
          Caption4: tendertypes.caption4,
          Caption5: tendertypes.caption5,
          Caption6: tendertypes.caption6,
          Caption7: tendertypes.caption7,
          Caption8: tendertypes.caption8,
          Caption1IsRequired: tendertypes.caption1IsRequired,
          Caption2IsRequired: tendertypes.caption2IsRequired,
          Caption3IsRequired: tendertypes.caption3IsRequired,
          Caption4IsRequired: tendertypes.caption4IsRequired,
          Caption5IsRequired: tendertypes.caption5IsRequired,
          Caption6IsRequired: tendertypes.caption6IsRequired,
          Caption7IsRequired: tendertypes.caption7IsRequired,
          Caption8IsRequired: tendertypes.caption8IsRequired,
          Caption1List: tendertypes.caption1List,
          Caption2List: tendertypes.caption2List,
          Caption3List: tendertypes.caption3List,
          Caption4List: tendertypes.caption4List,
          Caption5List: tendertypes.caption5List,
          Caption6List: tendertypes.caption6List,
          Caption7List: tendertypes.caption7List,
          Caption8List: tendertypes.caption8List,
          Caption1FieldType: tendertypes.caption1FieldType,
          Caption2FieldType: tendertypes.caption2FieldType,
          Caption3FieldType: tendertypes.caption3FieldType,
          Caption4FieldType: tendertypes.caption4FieldType,
          Caption5FieldType: tendertypes.caption5FieldType,
          Caption6FieldType: tendertypes.caption6FieldType,
          Caption7FieldType: tendertypes.caption7FieldType,
          Caption8FieldType: tendertypes.caption8FieldType,
          VerifyFromListCaption1: tendertypes.verifyFromListCaption1,
          VerifyFromListCaption2: tendertypes.verifyFromListCaption2,
          VerifyFromListCaption3: tendertypes.verifyFromListCaption3,
          VerifyFromListCaption4: tendertypes.verifyFromListCaption4,
          VerifyFromListCaption5: tendertypes.verifyFromListCaption5,
          VerifyFromListCaption6: tendertypes.verifyFromListCaption6,
          VerifyFromListCaption7: tendertypes.verifyFromListCaption7,
          VerifyFromListCaption8: tendertypes.verifyFromListCaption8,
          SurchargePercentValue: tendertypes.surchargePercentValue,
          SurchargeAmount: tendertypes.surchargeAmount,
          PercentageFlag: tendertypes.discountPercentValue,
          DiscountAmount: tendertypes.discountAmount,
          MultiCurrency: tendertypes.multiCurrency,
          EFT: tendertypes.eft,
          IncludeInBanking: tendertypes.includeInBanking,
          BankAccountCode: tendertypes.bankAccountCode,
          ShiftVarianceAccountCode: tendertypes.shiftVarianceAccountCode,
        })
        if (!tendertypes.deleted) {
          debugger;
          this.TenderTypeForm.enable();
          this.IsActive = true;
        } else {
          this.TenderTypeForm.disable();
          this.IsActive = false;
        }
      }
    },
      (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
  }
  onSave(saveAction) {
    this.submitted = true;
    if (this.TenderTypeForm.invalid) {
      return;
    }
    let tendertypes = new Tendertypes();
    tendertypes.FastKey = this.TenderTypeForm.get('FastKey').value;
    tendertypes.Description = this.TenderTypeForm.get('Description').value;
    tendertypes.TenderTypesGroup = this.TenderTypeForm.get('TenderTypesGroup').value;
    tendertypes.Caption1 = this.TenderTypeForm.get('Caption1').value;
    tendertypes.Caption2 = this.TenderTypeForm.get('Caption2').value;
    tendertypes.Caption3 = this.TenderTypeForm.get('Caption3').value;
    tendertypes.Caption4 = this.TenderTypeForm.get('Caption4').value;
    tendertypes.Caption5 = this.TenderTypeForm.get('Caption5').value;
    tendertypes.Caption6 = this.TenderTypeForm.get('Caption6').value;
    tendertypes.Caption7 = this.TenderTypeForm.get('Caption7').value;
    tendertypes.Caption8 = this.TenderTypeForm.get('Caption8').value;
    tendertypes.Caption1IsRequired = this.TenderTypeForm.get('Caption1IsRequired').value;
    tendertypes.Caption2IsRequired = this.TenderTypeForm.get('Caption2IsRequired').value;
    tendertypes.Caption3IsRequired = this.TenderTypeForm.get('Caption3IsRequired').value;
    tendertypes.Caption4IsRequired = this.TenderTypeForm.get('Caption4IsRequired').value;
    tendertypes.Caption5IsRequired = this.TenderTypeForm.get('Caption5IsRequired').value;
    tendertypes.Caption6IsRequired = this.TenderTypeForm.get('Caption6IsRequired').value;
    tendertypes.Caption7IsRequired = this.TenderTypeForm.get('Caption7IsRequired').value;
    tendertypes.Caption8IsRequired = this.TenderTypeForm.get('Caption8IsRequired').value;
    tendertypes.Caption1FieldType = this.TenderTypeForm.get('Caption1FieldType').value;
    tendertypes.Caption2FieldType = this.TenderTypeForm.get('Caption2FieldType').value;
    tendertypes.Caption3FieldType = this.TenderTypeForm.get('Caption3FieldType').value;
    tendertypes.Caption4FieldType = this.TenderTypeForm.get('Caption4FieldType').value;
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
    tendertypes.VerifyFromListCaption2 = this.TenderTypeForm.get('VerifyFromListCaption2').value;
    tendertypes.VerifyFromListCaption3 = this.TenderTypeForm.get('VerifyFromListCaption3').value;
    tendertypes.VerifyFromListCaption4 = this.TenderTypeForm.get('VerifyFromListCaption4').value;
    tendertypes.VerifyFromListCaption5 = this.TenderTypeForm.get('VerifyFromListCaption5').value;
    tendertypes.VerifyFromListCaption6 = this.TenderTypeForm.get('VerifyFromListCaption6').value;
    tendertypes.VerifyFromListCaption7 = this.TenderTypeForm.get('VerifyFromListCaption7').value;
    tendertypes.VerifyFromListCaption8 = this.TenderTypeForm.get('VerifyFromListCaption8').value;
    tendertypes.SurchargePercentValue = this.TenderTypeForm.get('SurchargePercentValue').value;
    tendertypes.SurchargeAmount = this.TenderTypeForm.get('SurchargeAmount').value;
    tendertypes.DiscountPercentValue = this.TenderTypeForm.get('PercentageFlag').value;
    tendertypes.DiscountAmount = this.TenderTypeForm.get('DiscountAmount').value;
    tendertypes.MultiCurrency = this.TenderTypeForm.get('MultiCurrency').value;
    tendertypes.EFT = this.TenderTypeForm.get('EFT').value;
    tendertypes.IncludeInBanking = this.TenderTypeForm.get('IncludeInBanking').value;
    tendertypes.BankAccountCode = this.TenderTypeForm.get('BankAccountCode').value;
    tendertypes.ShiftVarianceAccountCode = this.TenderTypeForm.get('ShiftVarianceAccountCode').value;
    tendertypes.CompanyID = this.CompanyId;
    tendertypes.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      debugger;
      this.tenderTypesService.addTenderTypes(tendertypes).subscribe((resp: any) => {

        debugger;
        if (resp.isSuccess) {
          this.toastr.success(resp.message);
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
          }
          else {
            this.ResetForm();
            this.Edit(resp.data.id);
            this.GetTenderTypeList();
            this.Mode = 'Edit';
          }
          this.Loading = false;
        }
        else{
          this.toastr.warning(resp.message);
        }
      });
    }
    else if (this.Mode == 'Edit') {
      // purchaseinvoice.ID = this.PurchaseInvoiceForm.get('ID').value;
      tendertypes.ID = this.TenderTypeForm.get('ID').value;
      this.tenderTypesService.updateTenderTypes(tendertypes).subscribe((resp: any) => {
        this.toastr.success('Tender types  updated successfully')
        if (saveAction == 'Close') {
          this.Cancel();
          this.Mode = 'List';
          this.ResetForm();
          this.GetTenderTypeList();
        }
        else {
          let id = this.TenderTypeForm.get('ID').value
          this.ResetForm();
          this.Edit(id);
        }


      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  ResetForm() {
    this.TenderTypeForm.patchValue({
      ID: '',
      Description: '',
      FastKey: '',
      TenderTypesGroup: '-1',
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
      SurchargeAmount: '',
      SurchargePercentValue: false,
      PercentageFlag: false,
      DiscountAmount:'',
      BankAccountCode: '',
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
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Edit(event.data.id);
      this.SelectetendertypeID = event.data.id;
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
  }
  CreateForm() {
    this.TenderTypeForm = this.FB.group({
      ID: [''],
      Description: ['', Validators.required],
      FastKey: ['', Validators.required],
      TenderTypesGroup: ['-1'],
      Caption1: [''],
      Caption2: [''],
      Caption3: [''],
      Caption4: [''],
      Caption5: [''],
      Caption6: [''],
      Caption7: [''],
      Caption8: [''],
      Caption1IsRequired: [false],
      Caption2IsRequired: [false],
      Caption3IsRequired: [false],
      Caption4IsRequired: [false],
      Caption5IsRequired: [false],
      Caption6IsRequired: [false],
      Caption7IsRequired: [false],
      Caption8IsRequired: [false],
      Caption1List: ['-1'],
      Caption2List: ['-1'],
      Caption3List: ['-1'],
      Caption4List: ['-1'],
      Caption5List: ['-1'],
      Caption6List: ['-1'],
      Caption7List: ['-1'],
      Caption8List: ['-1'],
      Caption1FieldType: ['-1'],
      Caption2FieldType: ['-1'],
      Caption3FieldType: ['-1'],
      Caption4FieldType: ['-1'],
      Caption5FieldType: ['-1'],
      Caption6FieldType: ['-1'],
      Caption7FieldType: ['-1'],
      Caption8FieldType: ['-1'],
      VerifyFromListCaption1: [false],
      VerifyFromListCaption2: [false],
      VerifyFromListCaption3: [false],
      VerifyFromListCaption4: [false],
      VerifyFromListCaption5: [false],
      VerifyFromListCaption6: [false],
      VerifyFromListCaption7: [false],
      VerifyFromListCaption8: [false],
      SurchargePercentValue: [false],
      SurchargeAmount: [''],
      PercentageFlag: [false],
      DiscountAmount: [''],
      MultiCurrency: [false],
      EFT: [false],
      IncludeInBanking: [false],
      BankAccountCode: [''],
      ShiftVarianceAccountCode: ['']
    });
  }


  GetTenderTypeList() {
    this.Loading = true;
    this.AgLoad = false;
    this.tenderTypesService.GetTenderTypes().subscribe((res: any) => {
      this.RowData = res.data.tenderTypes;
      console.log(this.RowData);
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  // get f() { return this.TenderTypeForm.controls; }
 
  BindTendertypegroup() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_SOP_TenderTypeGroups).subscribe((resp: any) => {
      console.log(resp);
      this.Tendertypegroup = resp.data.tabledata;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindTenderFieldType() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_SOP_TenderFieldType).subscribe((resp: any) => {
      console.log(resp);
      this.TenderFieldType = resp.data.tabledata;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindTenderTypesLookupList() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_SOP_TenderTypesLookupList).subscribe((resp: any) => {
      console.log(resp);
      this.TenderTypesLookupList = resp.data.tabledata;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  Cancel() {
    //this.ResetForm();
    this.Mode = 'List';
    this.submitted = false;
    this.GetTenderTypeList();
  }
  onDeleteChecked(ID) {
    debugger;
    var del = localStorage.getItem('LoginID')
    console.log(del);
    this.Loading = true;
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SOP_TenderTypes', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.Mode = 'List';
      this.GetTenderTypeList();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}
