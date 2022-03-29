import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryProductPriceService } from 'src/app/inv/services/inventory-product-price.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { ToastrService } from 'ngx-toastr';
import { LBSINVInventoryProductPrice } from 'src/app/models/inv/lbs-inv-inventory-product-price';
import { CommonProductPrice } from 'src/app/models/inv/common-product-price';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { DatePipe, formatDate } from '@angular/common'
import { PurCommonService } from 'src/app/pur/services/pur-common.service';
import { CustomValidators } from 'ngx-custom-validators';
import { InventoryDebtorPriceService } from 'src/app/inv/services/inventory-debtor-price.service';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { InventoryPriceLevelService } from 'src/app/inv/services/inventory-price-level.service';
import { DebtorService } from 'src/app/inv/services/debtor.service';
import { CryptoAes } from '../crypto-aes';
import { TableDataService } from 'src/app/sys/services/table-data.service';
import { ConfigurationService } from 'src/app/sys/services/configuration.service';
import { number } from 'ngx-custom-validators/src/app/number/validator';
@Component({
  selector: 'app-inventory-price',
  templateUrl: './inventory-price.component.html',
  styleUrls: ['./inventory-price.component.css']
})
export class InventoryPriceComponent implements OnInit {

  @Input() InventryID: any;
  @Input() IsInventoryActive: boolean;
  Loading: any = false;
  InventoryProductPriceForm: FormGroup;
  Mode: any = 'List';
  Submitted: any = false;
  @Input() ColumnDefs;
  @Input() RowData: any;
  @Input() IsDebtor: any = false;
  @Input() IsLocation: any = false;
  @Input() SelectedLocationName: any;
  @Input() IsProductPrice: any = false;
  @Input() IsWareHousePrice: any;
  BindInventoryProductPrice: any[] = [];
  CustomerName: any;
  Debtor: any;
  AgLoad: boolean = false;
  CompanyId = localStorage.getItem('CompanyID');
  addreadonly: boolean;
  save;
  @Output() OnAddPrice = new EventEmitter<any>();
  @Output() saveOrCloseAction = new EventEmitter<any>();
  @Output() OnCancelPrice = new EventEmitter<any>();
  @Output() OnDeletePrice = new EventEmitter<any>();
  @Input() BindInventoryPrice: any;
  IsActiveDebtor:boolean=true;
  PromotionDays: any;
  inventorylevel: any;
  PTimeTo: any;
  PTimeFrom: any;
  PromotionTypeList =
    [
      { id: true, name: 'None' },
      { id: false, name: 'Price' }
    ];
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  PromotionPriceChangeAlert: any;
  PriceChangeReasons: any = [];
  dateModel: Date = new Date();
  dateModal: Date = new Date();
  constructor(
    private productservice: InventoryProductPriceService,
    private deleteRecordsService: DeleteRecordsService,
    private purCommonService: PurCommonService,
    private inventoryPriceLevelService: InventoryPriceLevelService,
    private toastr: ToastrService,
    private InvCommonService: InvCommonService,
    private debtorservice: DebtorService,
    private invCommonService: InvCommonService,
    public datepipe: DatePipe,
    private debtorPriceService: InventoryDebtorPriceService,
    private FB: FormBuilder,
    private cryptoAes: CryptoAes,
    private tabledataservice: TableDataService,
    private configuration: ConfigurationService) { }

  ngOnInit() {
    this.GetPriceReasonById();
    this.AllConfigurationByModuleID();
    if (this.IsLocation) {
      this.save = "Save WareHouse"
    } else {
      this.save = "Save"
    }
    this.BindInventoryPriceLevel();

    //this.AgLoad = false;
    /*this.ColumnDefs= [
       { headerName: 'Promotion Days', field: 'promotionDays', sortable: true, filter: true, checkboxSelection: false },
       { headerName: 'Price Level1 ', field: 'priceLevel1', sortable: true, filter: true },
       //{ headerName: 'InventoryGL ClassificationID', field: 'inventoryGLClassificationID', sortable: true, filter: true },
      
       
       { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
       { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false },
       { headerName: '', field: 'Delete', cellRenderer: this.CustomDeleteIconFunc, type: 'Action', hide: false }
     ];*/
    // this.BindInventoryProductPriceDetails();
    console.log(this.BindInventoryPrice);
    //this.BindCustomers();

    this.BindPromotionDays();
    if (this.IsDebtor) {
      this.BindCustomerDebtorprice();
    }
    this.InventoryProductPriceForm = this.FB.group({
      ID: [''],
      PromotionQuantityLimit: [0.00],
      PromotionQuantitySold: [0.00],
      PriceLevel1: [''],
      PriceLevel2: [''],
      PriceLevel3: [''],
      PriceLevel4: [''],
      PriceLevel5: [''],
      PriceLevel6: [''],
      PriceLevel7: [''],
      PriceLevel8: [''],
      PriceLevel9: [''],
      PriceLevel10: [''],
      EnablCostPlusMarkup: [''],
      Percentage: [''],
      PromotionType: [false],
      Days: ['-1'],
      PromotionDateFrom: [null],
      PromotionDateTo: [null],
      PromotionTimeFrom: [new Date()],
      PromotionTimeTo: [new Date()],
      Price: [''],
      PriceChangeReason: ['00000000-0000-0000-0000-000000000000'],
      QuantityBreak1: [1.00],
      QuantityBreak2: [''],
      QuantityBreak3: [''],
      QuantityBreak4: [''],
      QuantityBreak5: [''],
      PriceBreak1: [''],
      PriceBreak2: [''],
      PriceBreak3: [''],
      PriceBreak4: [''],
      PriceBreak5: [''],
      CustomerName: ['-1', CustomValidators.notEqual('-1')]
    })
    // if(this.IsDebtor){
    //   this.InventoryProductPriceForm = this.FB.group({
    //     CustomerName: ['-1', CustomValidators.notEqual('-1')]
    //   })
    // }
    debugger;
    if (this.BindInventoryPrice && this.BindInventoryPrice.length != 0) {
      this.AgEdit(this.BindInventoryPrice);
    }



    this.SetPermissions();
    this.InventoryProductPriceForm.get('QuantityBreak1').disable();
  }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "220");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.InventoryProductPriceForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryProductPriceForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryProductPriceForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  get f() { return this.InventoryProductPriceForm.controls; }

  BindInventoryPriceLevel() {

    this.inventoryPriceLevelService.getInventoryPriceLevel().subscribe((resp: any) => {
      this.inventorylevel = resp.data.inventoryPriceLevel;
      console.log(resp);
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Cancel() {
    // this.ResetForm();
    this.OnCancelPrice.emit();
    this.Mode = "List";
  }
  onSaveold(saveAction) {

    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    // let frmDate = this.InventoryProductPriceForm.get('PromotionDateFrom').value;
    // frmDate = new Date(frmDate).getDate();
    // let toDate = this.InventoryProductPriceForm.get('PromotionDateTo').value;
    // toDate = new Date(toDate).getDate();
    debugger;
    let currDate = new Date();
    const cValue = formatDate(currDate, 'yyyy-MM-dd', 'en-US');
    let CurrentDate = new Date(cValue).getTime();
    let PromotionDateTo = this.InventoryProductPriceForm.get('PromotionDateTo').value;
    PromotionDateTo = formatDate(PromotionDateTo, 'yyyy-MM-dd', 'en-US');
    PromotionDateTo = new Date(PromotionDateTo)
    let DateTo = new Date(PromotionDateTo).getTime();

    let FromDate = this.InventoryProductPriceForm.get('PromotionDateFrom').value;
    FromDate = formatDate(FromDate, 'yyyy-MM-dd', 'en-US');
    FromDate = new Date(FromDate);
    let Fomdate = new Date(FromDate).getTime();
    //let Currentyear=new Date(TodaysDate).valueOf();
    var Difference_In_Time = DateTo - Fomdate;
    if (Fomdate != 0 || DateTo != 0) {
      if (CurrentDate > Fomdate) {
        this.toastr.warning('Promotion From Date must be greater than equal to the creation date');
        return;
      }
      if (Fomdate > DateTo) {
        this.toastr.warning('Promotion From Date Cannot be greater than a promotion to date');
        return;
      }
      if (Fomdate > DateTo) {
        this.toastr.warning('Promotion to date cannot smaller than  promotion date from');
        return;
      }
    }
    //  if(DateTo<Fromdate)
    //  {
    //   this.toastr.warning('Promotion From Date should be grater than or equal to Current Date');
    //    return; 
    //  }

    // let FromTime=this.InventoryProductPriceForm.get('PromotionDateFrom').value;
    // FromTime= new Date(FromTime).getTime();
    // let ToTime=this.InventoryProductPriceForm.get('PromotionDateTo').value;
    // FromTime= new Date(ToTime).getTime();
    // if (frmDate < currDate) {
    //   this.toastr.warning('From Date should be grater than or equal to Current Date');
    //   return;
    // }

    // if (toDate < frmDate ||toDate != frmDate) {
    //   this.toastr.warning('To Date should be greater than or equal to From Date');
    //   return;
    // }
    sessionStorage.setItem("saveAction", saveAction);
    this.Submitted = true;
    if(this.IsDebtor)
    {
      if (this.InventoryProductPriceForm.invalid) {
        return;
      }
    }
    if (this.Mode == 'Edit') {

      if (this.InventoryProductPriceForm.get('PriceChangeReason').value == "00000000-0000-0000-0000-000000000000") {
        this.toastr.warning('Please Select Price Change Reason');
        return;
      }
    }
    //this.Loading = true;
    let InventoryProductPrice = new CommonProductPrice();
    /*  InventoryProductPrice.CompanyID = this.CompanyId;
     InventoryProductPrice.ProductID = this.InventryID */
    console.log(this.PTimeFrom)
    console.log(this.InventoryProductPriceForm.get('PromotionDateFrom').value);
    console.log(this.InventoryProductPriceForm.get('PromotionDateTo').value);
    InventoryProductPrice.PriceChangeReason = this.InventoryProductPriceForm.get('PriceChangeReason').value
    //let latest_date = this.datepipe.transform(this.InventoryProductPriceForm.get('PromotionDateFrom').value, 'DD-MM-YYYY HH:MM:SS');

    if (!this.IsDebtor) {
      InventoryProductPrice.PriceLevel1 = this.InventoryProductPriceForm.get('PriceLevel1').value;
      InventoryProductPrice.PriceLevel2 = this.InventoryProductPriceForm.get('PriceLevel2').value;
      InventoryProductPrice.PriceLevel3 = this.InventoryProductPriceForm.get('PriceLevel3').value;
      InventoryProductPrice.PriceLevel4 = this.InventoryProductPriceForm.get('PriceLevel4').value;
      InventoryProductPrice.PriceLevel5 = this.InventoryProductPriceForm.get('PriceLevel5').value;
      InventoryProductPrice.PriceLevel6 = this.InventoryProductPriceForm.get('PriceLevel6').value;
      InventoryProductPrice.PriceLevel7 = this.InventoryProductPriceForm.get('PriceLevel7').value;
      InventoryProductPrice.PriceLevel8 = this.InventoryProductPriceForm.get('PriceLevel8').value;
      InventoryProductPrice.PriceLevel9 = this.InventoryProductPriceForm.get('PriceLevel9').value;
      InventoryProductPrice.PriceLevel10 = this.InventoryProductPriceForm.get('PriceLevel10').value;
    }
    if (this.IsDebtor) {
      InventoryProductPrice.PriceLevel1 = this.InventoryProductPriceForm.get('CustomerName').value;
    }
    InventoryProductPrice.EnablCostPlusMarkup = this.InventoryProductPriceForm.get('EnablCostPlusMarkup').value;
    InventoryProductPrice.MarkupPercentage = this.InventoryProductPriceForm.get('Percentage').value;
    // if (this.InventoryProductPriceForm.get('PromotionType').value == "-1") {
    //   InventoryProductPrice.PromotionType = true;
    // } else {
    //   InventoryProductPrice.PromotionType = this.InventoryProductPriceForm.get('PromotionType').value;
    // }
    InventoryProductPrice.PromotionType = this.InventoryProductPriceForm.get('PromotionType').value;
    InventoryProductPrice.PromotionDays = this.InventoryProductPriceForm.get('Days').value;
    //if (this.InventoryProductPriceForm.get('PromotionDateFrom').value && (this.InventoryProductPriceForm.get('PromotionDateFrom').value.length > 11 || !this.InventoryProductPriceForm.get('PromotionDateFrom').value.length)) {

    //  InventoryProductPrice.PromotionDateFrom = this.datepipe.transform(this.InventoryProductPriceForm.get('PromotionDateFrom').value, 'dd-MM-yyyy HH:MM:SS');

    //  InventoryProductPrice.PromotionTimeFrom = this.datepipe.transform(this.InventoryProductPriceForm.get('PromotionDateFrom').value, 'dd-MM-yyyy') + ' ' + this.PTimeFrom;
    //} else {
    //  InventoryProductPrice.PromotionDateFrom = null;
    //  InventoryProductPrice.PromotionTimeFrom = null;
    // /*  InventoryProductPrice.PromotionDateFrom = this.InventoryProductPriceForm.get('PromotionDateFrom').value + ' 00:00:00';
    //  InventoryProductPrice.PromotionTimeFrom = this.InventoryProductPriceForm.get('PromotionDateFrom').value + ' ' + this.PTimeFrom; */
    //}
    //if (this.InventoryProductPriceForm.get('PromotionDateTo').value && (this.InventoryProductPriceForm.get('PromotionDateTo').value.length > 11 || !this.InventoryProductPriceForm.get('PromotionDateTo').value.length)) {
    //  InventoryProductPrice.PromotionDateTo = this.datepipe.transform(this.InventoryProductPriceForm.get('PromotionDateTo').value, 'dd-MM-yyyy HH:MM:SS');
    //  InventoryProductPrice.PromotionTimeTo = this.datepipe.transform(this.InventoryProductPriceForm.get('PromotionDateTo').value, 'dd-MM-yyyy') + ' ' + this.PTimeTo;
    //} else {
    //  InventoryProductPrice.PromotionDateTo = null;
    //  InventoryProductPrice.PromotionTimeTo =null;
    // /*  InventoryProductPrice.PromotionDateTo = this.InventoryProductPriceForm.get('PromotionDateTo').value + ' 00:00:00';
    //  InventoryProductPrice.PromotionTimeTo = this.InventoryProductPriceForm.get('PromotionDateTo').value + ' ' + this.PTimeTo; */
    //}
    if (this.IsProductPrice || this.IsWareHousePrice || this.IsDebtor) {
      InventoryProductPrice.PromotionQuantityLimit = this.InventoryProductPriceForm.get('PromotionQuantityLimit').value;
      InventoryProductPrice.PromotionQuantitySold = this.InventoryProductPriceForm.get('PromotionQuantitySold').value;
    }
    InventoryProductPrice.PromotionDateFrom = this.InventoryProductPriceForm.get('PromotionDateFrom').value;
    InventoryProductPrice.PromotionDateTo = this.InventoryProductPriceForm.get('PromotionDateTo').value;
    InventoryProductPrice.PromotionTimeFrom = this.InventoryProductPriceForm.get('PromotionTimeFrom').value;
    InventoryProductPrice.PromotionTimeTo = this.InventoryProductPriceForm.get('PromotionTimeTo').value;
    //this.InventoryProductPriceForm.get('PromotionDateTo').value;
    //this.InventoryProductPriceForm.get('PromotionTimeFrom').value;
    //this.InventoryProductPriceForm.get('PromotionTimeTo').value;

    InventoryProductPrice.PromotionalPrice = this.InventoryProductPriceForm.get('Price').value;

    InventoryProductPrice.QuantityBreak1 = this.InventoryProductPriceForm.get('QuantityBreak1').value;
    InventoryProductPrice.QuantityBreak2 = this.InventoryProductPriceForm.get('QuantityBreak2').value;
    InventoryProductPrice.QuantityBreak3 = this.InventoryProductPriceForm.get('QuantityBreak3').value;
    InventoryProductPrice.QuantityBreak4 = this.InventoryProductPriceForm.get('QuantityBreak4').value;
    InventoryProductPrice.QuantityBreak5 = this.InventoryProductPriceForm.get('QuantityBreak5').value;

    InventoryProductPrice.PriceBreak1 = this.InventoryProductPriceForm.get('PriceBreak1').value;
    InventoryProductPrice.PriceBreak2 = this.InventoryProductPriceForm.get('PriceBreak2').value;
    InventoryProductPrice.PriceBreak3 = this.InventoryProductPriceForm.get('PriceBreak3').value;
    InventoryProductPrice.PriceBreak4 = this.InventoryProductPriceForm.get('PriceBreak4').value;
    InventoryProductPrice.PriceBreak5 = this.InventoryProductPriceForm.get('PriceBreak5').value;
    console.log(InventoryProductPrice);
    this.saveOrCloseAction.emit(saveAction);
    this.OnAddPrice.emit(InventoryProductPrice);
    //  if (saveAction == 'Close') {
    //    this.Mode="Edit";
    //    this.Mode = 'List';
    //    // this.Cancel();
    //  }
    //  else{
    //   //this.OnAddPrice.emit(InventoryProductPrice);
    //  }
    // if (saveAction == 'Close') {
    //   this.Cancel();
    //   this.Mode = 'List';
    // } else {
    //   this.Mode = 'Edit';
    // }
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {

    var colId = event.column.getId();
    if (colId == 'Edit') {

      this.Mode = 'Edit'
      this.AgEdit(event.data)
    } else if (colId == 'Delete') {

      this.OnDeletePrice.emit(event.data.id);
      // this.onDelete(event.data.id)
    }
  }
  GetPriceReasonById() {
    this.tabledataservice.GetPriceReasonById('00000000-0000-0000-0000-000000000000').subscribe((resp: any) => {
      this.PriceChangeReasons = resp.data.tabledata;
      console.log(resp);
      this.Loading = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To create the States Form Controls.
  ResetForm() {
    this.InventoryProductPriceForm.patchValue({
      ID: '',
      PriceLevel1: '',
      PriceLevel2: '',
      PriceLevel3: '',
      PriceLevel4: '',
      PriceLevel5: '',
      PriceLevel6: '',
      PriceLevel7: '',
      PriceLevel8: '',
      PriceLevel9: '',
      PriceLevel10: '',
      EnablCostPlusMarkup: '',
      Percentage: '',
      PromotionType: false,
      Days: '-1',
      PromotionDateFrom: null,
      PromotionDateTo: null,
      PromotionTimeFrom: null,
      PromotionTimeTo: null,
      Price: '',
      PromotionQuantityLimit: 0,
      PromotionQuantitySold: 0,
      PriceChangeReason: '00000000-0000-0000-0000-000000000000',
      QuantityBreak1: '1.00',
      QuantityBreak2: '',
      QuantityBreak3: '',
      QuantityBreak4: '',
      QuantityBreak5: '',
      PriceBreak1: '',
      PriceBreak2: '',
      PriceBreak3: '',
      PriceBreak4: '',
      PriceBreak5: '',
      CustomerName: '-1'

    });
  }
  //PromotionDateFrom = this.datepipe.transform(this.InventoryProductPriceForm.get('PromotionDateFrom').value, 'dd-MM-yyyy HH:MM:SS');
  AgEdit(event) {
    debugger;
    if (this.IsDebtor) {
      if(event.deleted)
      {
      this.IsActiveDebtor=false;
      }
      else{
        this.IsActiveDebtor=true;
      }
      if (event.customerID) {
        this.InventoryProductPriceForm.get('CustomerName').enable();
      } else {
        this.InventoryProductPriceForm.get('CustomerName').enable();
      }
    }
    this.InventoryProductPriceForm.get('QuantityBreak1').disable();
    if(event.priceChangeReason==null||event.priceChangeReason=='null')
    {
      event.priceChangeReason='00000000-0000-0000-0000-000000000000';
    }
    this.InventoryProductPriceForm.patchValue({
      ID: event.id,
      PriceLevel1: event.priceLevel1_text,
      PriceLevel2: event.priceLevel2_text,
      PriceLevel3: event.priceLevel3_text,
      PriceLevel4: event.priceLevel4_text,
      PriceLevel5: event.priceLevel5_text,
      PriceLevel6: event.priceLevel6_text,
      PriceLevel7: event.priceLevel7_text,
      PriceLevel8: event.priceLevel8_text,
      PriceLevel9: event.priceLevel9_text,
      PriceLevel10: event.priceLevel10_text,
      EnablCostPlusMarkup: event.enablCostPlusMarkup,
      Percentage: event.markupPercentage_text,
      PromotionType: event.promotionType,
      PriceChangeReason: event.priceChangeReason,
      Days: event.promotionDays,
      CustomerName: event.customerID,
      PromotionDateFrom: event.promotionDateFrom,
      PromotionDateTo: event.promotionDateTo,
      PromotionTimeFrom: event.promotionTimeFrom,
      PromotionTimeTo: event.promotionTimeTo,
      PromotionQuantityLimit: event.quantityLimit_text,
      PromotionQuantitySold: event.quantitySold_text,
      //PromotionDateFrom: this.datepipe.transform(event.promotionTimeFrom, 'dd-MM-yyyy'),
      //// event.promotionDateFrom,
      //PromotionDateTo: this.datepipe.transform(event.promotionDateTo, 'dd-MM-yyyy'),
      //// event.promotionDateTo,
      //PromotionTimeFrom: //this.datepipe.transform(event.promotionTimeFrom, 'HH:MM'),
      //  event.promotionTimeFrom,
      //PromotionTimeTo: //this.datepipe.transform(event.promotionDateTo, 'HH:MM'),
      //  event.promotionTimeTo,
      Price: event.promotionalPrice_text,
      QuantityBreak1: '1.00',
      QuantityBreak2: event.quantityBreak2_text,
      QuantityBreak3: event.quantityBreak3_text,
      QuantityBreak4: event.quantityBreak4_text,
      QuantityBreak5: event.quantityBreak5_text,
      PriceBreak1: event.priceBreak1_text,
      PriceBreak2: event.priceBreak2_text,
      PriceBreak3: event.priceBreak3_text,
      PriceBreak4: event.priceBreak4_text,
      PriceBreak5: event.priceBreak5_text
    });
    if (event.promotionType) {
      // this.InventoryProductPriceForm.get('Days').disable();
      // this.InventoryProductPriceForm.get('Price').disable();
      // this.InventoryProductPriceForm.get('PromotionDateFrom').disable();
      // this.InventoryProductPriceForm.get('PromotionDateTo').disable();
      // this.InventoryProductPriceForm.get('PromotionTimeFrom').disable();
      // this.InventoryProductPriceForm.get('PromotionTimeTo').disable();
    }
    else {
      this.InventoryProductPriceForm.get('Days').enable();
      this.InventoryProductPriceForm.get('Price').enable();
      this.InventoryProductPriceForm.get('PromotionDateFrom').enable();
      this.InventoryProductPriceForm.get('PromotionDateTo').enable();
      this.InventoryProductPriceForm.get('PromotionTimeFrom').enable();
      this.InventoryProductPriceForm.get('PromotionTimeTo').enable();
    }
    this.Mode = 'Edit';
    if (!this.IsInventoryActive) {
      this.InventoryProductPriceForm.disable();
    }
  }


  BindPromotionDays() {
    this.invCommonService.getPromotionDays().subscribe((resp: any) => {
      this.PromotionDays = resp.data.promotiondays;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //PTimeToChange($event) {
  //  if ($event) {
  //    console.log(this.InventoryProductPriceForm.get('PromotionDateTo').value)
  //    this.PTimeTo = $event;
  //    let hours = this.PTimeTo.getHours();
  //    hours = hours.toFixed();

  //    let minutes = this.PTimeTo.getMinutes();
  //    minutes = minutes.toFixed();
  //    if (hours.length == 1) {
  //      hours = 0 + hours;
  //    }
  //    if (minutes.length == 1) {
  //      minutes = 0 + minutes;
  //    }
  //    this.PTimeTo = hours + ':' + minutes;
  //    console.log(this.PTimeTo)
  //  }
  //}

  //PTimefromChange($event) {
  //  if ($event) {

  //    this.PTimeFrom = $event;
  //    let hours = this.PTimeFrom.getHours();
  //    hours = hours.toFixed();

  //    let minutes = this.PTimeFrom.getMinutes();
  //    minutes = minutes.toFixed();
  //    if (hours.length == 1) {
  //      hours = 0 + hours;
  //    }
  //    if (minutes.length == 1) {
  //      minutes = 0 + minutes;
  //    }
  //    this.PTimeFrom = hours + ':' + minutes;
  //    console.log(this.PTimeFrom)
  //  }
  //}

  /*  BindCustomers() {
     this.purCommonService.getCustomers().subscribe((resp: any) => {
       console.log(resp);
       this.CustomerName = resp.data.customers;
     }, (error) => {
       //this.Loading = false;
       this.toastr.error(error);
       console.error('Problem with the sevice. Please try later : ' + error);
     });
   } */
  BindCustomerDebtorprice() {
    this.debtorPriceService.getCustomersDebtorPrice(this.InventryID, 'GetCustomersAdd').subscribe((resp: any) => {
      console.log(resp);
      this.Debtor = resp.data.customers;
    }, (error) => {
      //this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  // /* BindCustomerDebtorprice() {
  //   this.InvCommonService.getalldebtor().subscribe((resp: any) => {
  //     console.log(resp);
  //     this.Debtor = resp.data.debtors;
  //   }, (error) => {
  //     //this.Loading = false;
  //     this.toastr.error(error);
  //     console.error('Problem with the sevice. Please try later : ' + error);
  //   });
  // } */
  onPromotionChange(Val) {
    console.log(Val);
    if (Val == "false") {
      this.InventoryProductPriceForm.get('Days').enable();
      this.InventoryProductPriceForm.get('Price').enable();
      this.InventoryProductPriceForm.get('PromotionDateFrom').enable();
      this.InventoryProductPriceForm.get('PromotionDateTo').enable();
      this.InventoryProductPriceForm.get('PromotionTimeFrom').enable();
      this.InventoryProductPriceForm.get('PromotionTimeTo').enable();
    }
    else {
      this.InventoryProductPriceForm.get('Days').disable();
      this.InventoryProductPriceForm.get('Price').disable();
      this.InventoryProductPriceForm.get('PromotionDateFrom').disable();
      this.InventoryProductPriceForm.get('PromotionDateTo').disable();
      this.InventoryProductPriceForm.get('PromotionTimeFrom').disable();
      this.InventoryProductPriceForm.get('PromotionTimeTo').disable();
    }

  }
  onFromDateChange(e) {

    alert(e);
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
  AllConfigurationByModuleID() {
    this.configuration.getAllConfigurationByModuleID("INV").subscribe((resp: any) => {
      var Data = resp.data.configurationbyIds.filter(o => o.flag == "Flag31");
      debugger
      this.PromotionPriceChangeAlert = Data[0].value;
      this.PromotionPriceAlert();
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  PromotionPriceAlert() {
    debugger;
    let PromotionType = this.InventoryProductPriceForm.get('PromotionType').value;
    let PromotionDateTo = this.InventoryProductPriceForm.get('PromotionDateTo').value;
    if ((PromotionType || PromotionType == "true") && (PromotionDateTo != '' || PromotionDateTo != null)) {


      let DateTo = new Date(PromotionDateTo).getTime();
      let TodaysDate = new Date();
      let CurrentDate = new Date(TodaysDate).getTime();
      //let Currentyear=new Date(TodaysDate).valueOf();
      var Difference_In_Time = DateTo - CurrentDate;
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      var CheckDays = Math.sign(Difference_In_Days);
      if (CheckDays == 1) {
        if ((Number(this.PromotionPriceChangeAlert)) > (Number(Difference_In_Days))) {
          this.toastr.warning('Promotion Price is going to expire within  ' + this.PromotionPriceChangeAlert + '   Days' +
            ' ' + Difference_In_Days + 'Left to expire');
        }
      }
      else {
        this.toastr.warning('Promotion Price is already expired');
      }


    }

  }
}
