import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PriceGroupsService } from '../services/price-groups.service';
import { LBSINVPriceGroups } from 'src/app/models/inv/lbs-inv-price-groups';
import { InvCommonService } from '../services/inv-common.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { TableDataService } from 'src/app/sys/services/table-data.service';
import { formatDate } from '@angular/common';
import { ConfigurationService } from 'src/app/sys/services/configuration.service';
import { date } from 'ngx-custom-validators/src/app/date/validator';
import { Data } from 'ngx-bootstrap/positioning/models';

@Component({
  selector: 'app-price-groups',
  templateUrl: './price-groups.component.html',
  styleUrls: ['./price-groups.component.css']
})
export class PriceGroupsComponent implements OnInit {
  PriceGroupForm: FormGroup;
  Loading: any = false;
  Mode: any = 'List';
  submitted: boolean;
  PriceGroup: any[] = [];
  TaxCodes: any[] = [];

  //Permission
  TwelveHourTimeFormat:any;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  PageSize: any;
  CompanyID = localStorage.getItem('CompanyID');
  //Ag-grid 
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  addreadonly: boolean;
  AccessTab: any;
  SelectedPriceID: any;
  HeaderNames: any;
  read: boolean;
  PromotionDays: any;
  IsActive: boolean;
  Currentpage: string;
  PriceChangeReasons:any=[];
  PromotionPriceChangeAlert: any;
  PromotionType =
    [
      { id: true, name: 'None' },
      { id: false, name: 'Price' }
    ];
  // PromotionDays =
  //   [
  //     { id: '0', name: 'Monday' },
  //     { id: '1', name: 'Tuesday' },
  //     { id: '2', name: 'Wednesday' },
  //     { id: '3', name: 'Thursday' },
  //     { id: '4', name: 'Friday' },
  //     { id: '5', name: 'Saturday' },
  //     { id: '6', name: 'Sunday' },
  //     { id: '7', name: 'Weekdays (Monday – Friday)' },
  //     { id: '8', name: 'Weekends (Saturday - Sunday)' },
  //     { id: '9', name: 'All Days (Monday – Sunday)' },
  //   ];
  constructor(
    private priceservice: PriceGroupsService,
    private FB: FormBuilder,
    private toastr: ToastrService,
    private invCommonService: InvCommonService,
    private cryptoAes: CryptoAes,
    private tabledataservice: TableDataService,
    private configuration: ConfigurationService
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Mode = "List";
    
    this.HeaderNames = "Pricegroup";
    this.AccessTab = "Pricegroup";
    this.Currentpage = "0";
    //created warehousenumber forms
    this.PriceGroupForm = this.FB.group({
      ID: [''],
      CompanyID: [''],
      PriceClassCode: ['', Validators.required],
      PriceClassName: ['', Validators.required],
      TaxCode: ['-1'],
      PromotionType: [true],
      PromotionDays: ['-1'],
      PromotionDateFrom: [null],
      PromotionDateTo: [null],
      PromotionTimeFrom: [new Date()],
      PromotionTimeTo: [new Date()],
      PriceChangeReason: ['00000000-0000-0000-0000-000000000000'],
      Price: [''],
      Quantity1: ['1.00'],
      Quantity2: [''],
      Quantity3: [''],
      Quantity4: [''],
      Quantity5: [''],
      Price1: [''],
      Price2: [''],
      Price3: [''],
      Price4: [''],
      Price5: ['']
    });
    this.PageSize = "50";
    this.SetPermissions();
    this.ColumnDefs = [
      { headerName: 'Price GroupCode', field: 'priceClassCode', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Price GroupName', field: 'priceClassName', sortable: true, filter: true },
    //  { headerName: 'Price', field: 'priceText', sortable: true, filter: true, type: 'numericColumn', },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
    this.BindPriceGroups();
    this.BindTaxCode();
    this.BindPromotionDays();
    this.GetPriceReasonById();
 
  }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "205");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.PriceGroupForm.enable();


      if (!this.all_Access) {
        if (!this.write_Access) {
          this.PriceGroupForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.PriceGroupForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  get f() { return this.PriceGroupForm.controls; }

  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  //Add new price-group
  AddNew(): void {
    this.Mode = 'Add';
    this.IsActive = true;
    this.addreadonly = false;
    this.read = false;
    this.ResetForm();
 
    this.PriceGroupForm.get('PromotionDateFrom').enable();
    this.PriceGroupForm.get('PromotionTimeTo').enable();
    this.PriceGroupForm.get('PromotionTimeFrom').enable();
    this.PriceGroupForm.get('PromotionDateFrom').enable();
    this.PriceGroupForm.enable();
    this.PriceGroupForm.get('Quantity1').disable();
    // this.twelveHourTimeFormat();
    // this.PriceGroupForm.patchValue({ PromotionTimeFrom: this.TwelveHourTimeFormat,
    //   PromotionTimeTo:this.TwelveHourTimeFormat});
    
 
  }
  //To bind the data of price-group to the controls to edit/update.
  Edit(ID): void {
    debugger;
    this.Mode = 'Edit';
    this.BindPriceGroupByID(ID);
    this.addreadonly = true;
    this.read = true;
  }
  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.BindPriceGroups();
    this.submitted = false;
    this.Mode = "List";
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.SelectedPriceID = event.data.id;
      this.AllConfigurationByModuleID();
      this.Edit(event.data.id)
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


  //To bind the data of all price-group to the Grid.
  BindPriceGroups() {
    this.Loading = true;
    this.AgLoad = false;
    this.priceservice.getPriceGrroup().subscribe((resp: any) => {
      this.PriceGroup = resp.data.prices;
      this.RowData = resp.data.prices;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {

      this.Loading = false;
      //  this.toastr.error(error);
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //bind taxcode
  GetPriceReasonById() {
    this.tabledataservice.GetPriceReasonById('00000000-0000-0000-0000-000000000000').subscribe((resp: any) => {
      this.PriceChangeReasons = resp.data.tabledata;
     console.log(resp);
      this.Loading = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindTaxCode() {
    this.priceservice.getalltaxcode().subscribe((resp: any) => {
      this.TaxCodes = resp.data.taxcode;
    }, (error) => {
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  OnCancel() {
    this.ResetForm();
    this.Mode = 'Add';
  }
  onSaveold(saveAction) {
    debugger;
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  //To save the price-group details to database table by calling the API service
  onSave(saveAction) {
    debugger;
    debugger;
    let currDate = new Date();
    const cValue = formatDate(currDate, 'yyyy-MM-dd', 'en-US');
    let CurrentDate=new  Date(cValue).getTime();
    let PromotionDateTo = this.PriceGroupForm.get('PromotionDateTo').value;
    PromotionDateTo = formatDate(PromotionDateTo, 'yyyy-MM-dd', 'en-US');
    PromotionDateTo = new Date(PromotionDateTo)
    let DateTo = new Date(PromotionDateTo).getTime();

   let FromDate= this.PriceGroupForm.get('PromotionDateFrom').value;
   FromDate=formatDate(FromDate, 'yyyy-MM-dd', 'en-US');
   FromDate=new Date(FromDate);
   let Fomdate=new Date(FromDate).getTime();
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
    this.submitted = true;
    if (this.PriceGroupForm.invalid) {
      return;
    }
    if (this.Mode == 'Edit') {

      if (this.PriceGroupForm.get('PriceChangeReason').value == "00000000-0000-0000-0000-000000000000") {
        this.toastr.warning('Please Select Price Change Reason');
        return;
      }
    }
    this.Loading = true;
    let INVPriceGroup = new LBSINVPriceGroups();
    INVPriceGroup.CompanyID = this.CompanyID;
    INVPriceGroup.PriceClassCode = this.PriceGroupForm.get('PriceClassCode').value;
    INVPriceGroup.PriceClassName = this.PriceGroupForm.get('PriceClassName').value;
    if(this.PriceGroupForm.get('TaxCode').value=="-1")
    {
      INVPriceGroup.TaxCodeID=null;
    }
    else
    {
      INVPriceGroup.TaxCodeID = this.PriceGroupForm.get('TaxCode').value;
    }
   
    //INVPriceGroup.PromotionType = true;
    INVPriceGroup.PromotionType = this.PriceGroupForm.get('PromotionType').value;
    INVPriceGroup.PromotionDays = this.PriceGroupForm.get('PromotionDays').value;
    INVPriceGroup.PromotionDateFrom = this.PriceGroupForm.get('PromotionDateFrom').value;
    INVPriceGroup.PromotionDateTo = this.PriceGroupForm.get('PromotionDateTo').value;
    INVPriceGroup.PromotionTimeFrom = this.PriceGroupForm.get('PromotionTimeFrom').value;
    INVPriceGroup.PromotionTimeTo = this.PriceGroupForm.get('PromotionTimeTo').value;
    INVPriceGroup.PriceChangeReason = this.PriceGroupForm.get('PriceChangeReason').value;
    INVPriceGroup.PromotionalPrice = this.PriceGroupForm.get('Price').value;
    INVPriceGroup.Quantity1 = this.PriceGroupForm.get('Quantity1').value;
    INVPriceGroup.Quantity2 = this.PriceGroupForm.get('Quantity2').value;
    INVPriceGroup.Quantity3 = this.PriceGroupForm.get('Quantity3').value;
    INVPriceGroup.Quantity4 = this.PriceGroupForm.get('Quantity4').value;
    INVPriceGroup.Quantity5 = this.PriceGroupForm.get('Quantity5').value;
    INVPriceGroup.Price1 = this.PriceGroupForm.get('Price1').value;
    INVPriceGroup.Price2 = this.PriceGroupForm.get('Price2').value;
    INVPriceGroup.Price3 = this.PriceGroupForm.get('Price3').value;
    INVPriceGroup.Price4 = this.PriceGroupForm.get('Price4').value;
    INVPriceGroup.Price5 = this.PriceGroupForm.get('Price5').value;
    INVPriceGroup.CreatedBY = localStorage.getItem('LoginID');

    //If the mode Add will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      debugger;
      this.priceservice.addPriceGroup(INVPriceGroup).subscribe((resp: any) => {
        debugger;
        if (resp.isSuccess) {
          this.toastr.success('Price-Group  details added successfully');
          // alert(resp.message);
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindPriceGroups();
            this.Mode = 'List';
           // this.ResetForm();
          }
          else {
            let ID = resp.data.id;
            this.Edit(ID);
            this.BindPriceGroups();
            this.Mode = 'Edit';
           // this.ResetForm();
          }
          // this.ResetForm();
          // this.BindPriceGroups();
          // this.Mode = 'List';
          this.Loading = false;
          //this.ResetForm();
        }
        else {
          this.toastr.warning('Price code  already exists')
          this.Loading = false;
        }
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      debugger;
      INVPriceGroup.ID = this.PriceGroupForm.get('ID').value;
      this.priceservice.updatePriceGroup(INVPriceGroup).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Price-Group  details updated successfully');
          //  alert(resp.message);
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindPriceGroups();
          }
          else {
            //  this.Edit(this.PriceGroupForm.get('ID').value);
            let ID = this.PriceGroupForm.get('ID').value;
            this.ResetForm();
            this.Edit(ID);
          }
          // this.ResetForm();
          // this.BindPriceGroups();
          // this.Mode = 'List';
        }
        else {
          this.Loading = false;
          this.toastr.warning('Price code  already exists')
        }
      }, (error) => {
        //console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    this.Loading = false;
  }

  //Resetting the form after Add/Edit
  ResetForm() {
    this.PriceGroupForm.patchValue({
      ID: '',
      PriceClassCode: '',
      PriceClassName: '',
      TaxCode: '-1',
      PromotionType: true,
      PromotionDays: '-1',
      PromotionDateFrom: null,
      PromotionDateTo: null,
      PromotionTimeFrom: new Date(),
      PromotionTimeTo: new Date(),
      PriceChangeReason: '00000000-0000-0000-0000-000000000000',
      PromotionalPrice: '',
      Price: '',
      Quantity1: '1.00',
      Quantity2: '',
      Quantity3: '',
      Quantity4: '',
      Quantity5: '',
      Price1: '',
      Price2: '',
      Price3: '',
      Price4: '',
      Price5: ''
    });
    this.PriceGroupForm.markAsUntouched();
    this.PriceGroupForm.markAsPristine();
    this.submitted = false;
  }


  //Bind price-group by  ID
  BindPriceGroupByID(ID) {
    this.priceservice.getPriceGroupByID(ID).subscribe((resp: any) => {
      console.log(resp);
      debugger;
     
      if (resp.isSuccess == true) {
        let pricegroup: any = new LBSINVPriceGroups();
        pricegroup = resp.data.priceDetails;
        if(pricegroup.priceChangeReason==null ||pricegroup.priceChangeReason=="null" )
        {
          pricegroup.priceChangeReason='00000000-0000-0000-0000-000000000000';
        }
        this.PriceGroupForm.patchValue({
          ID: pricegroup.id,
          CompanyID: pricegroup.companyID,
          PriceClassCode: pricegroup.priceClassCode,
          PriceClassName: pricegroup.priceClassName,
          TaxCode: pricegroup.taxCodeID,
          PromotionType: pricegroup.promotionType,
          PromotionDays: pricegroup.promotionDays,
          PromotionDateFrom: pricegroup.promotionDateFrom,
          PromotionDateTo: pricegroup.promotionDateTo,
          PromotionTimeFrom: pricegroup.promotionTimeFrom,
          PromotionTimeTo: pricegroup.promotionTimeTo,
          PriceChangeReason:pricegroup.priceChangeReason,
          Price: pricegroup.priceText,
          Quantity1: pricegroup.quantity1text,
          Quantity2: pricegroup.quantity2text,
          Quantity3: pricegroup.quantity3text,
          Quantity4: pricegroup.quantity4text,
          Quantity5: pricegroup.quantity5text,
          Price1: pricegroup.price1text,
          Price2: pricegroup.price2text,
          Price3: pricegroup.price3text,
          Price4: pricegroup.price4text,
          Price5: pricegroup.price5text
        });
        if (!pricegroup.deleted) {
          this.PriceGroupForm.enable();
          this.IsActive = true;
        } else {
          this.PriceGroupForm.disable();
          this.IsActive = false;
        }

        // this.PriceGroupForm.get('PromotionDateFrom').disable();
        // this.PriceGroupForm.get('PromotionTimeTo').disable();
        // this.PriceGroupForm.get('PromotionTimeFrom').disable();
        // this.PriceGroupForm.get('PromotionDateFrom').disable();
         this.PriceGroupForm.get('Quantity1').disable();
        // this.dealtypestatus(pricegroup.promotionType);

        if (pricegroup.promotionType) {
          // this.PriceGroupForm.get('Price').disable();
          // this.PriceGroupForm.get('PromotionDays').disable();
          // this.PriceGroupForm.get('PromotionDateFrom').disable();
          // this.PriceGroupForm.get('PromotionDateTo').disable();
          // this.PriceGroupForm.get('PromotionTimeFrom').disable();
          // this.PriceGroupForm.get('PromotionTimeTo').disable();
          // this.PriceGroupForm.get('Price').disable();
        }
        else {
          this.PriceGroupForm.get('Price').enable();
          this.PriceGroupForm.get('PromotionDays').enable();
          this.PriceGroupForm.get('PromotionDateFrom').enable();
          this.PriceGroupForm.get('PromotionDateTo').enable();
          this.PriceGroupForm.get('PromotionTimeFrom').enable();
          this.PriceGroupForm.get('PromotionTimeTo').enable();
          this.PriceGroupForm.get('Price').enable();
        }
        this.PromotionPriceAlert();


      }
    });
  }

  //Delete the record
  onDeleteChecked(ID) {
    this.Loading = true;
    this.priceservice.deletePriceGroupByID(ID, localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        //    this.toastr.success('Price-Group  details Deleted successfully'); 
        this.BindPriceGroups();
      }
      this.Loading = false;
    }, (error) => {
      this.Loading = false;

      // console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  //bind promotiondays
  BindPromotionDays() {
    this.invCommonService.getPromotionDays().subscribe((resp: any) => {
      this.PromotionDays = resp.data.promotiondays;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  // dealtypestatus(ID) {
  //   this.ClearingOnPromotionTypeSelected();
  //   if (ID == "true") {
  //     this.PriceGroupForm.get('Price').disable();
  //     this.PriceGroupForm.get('PromotionDays').disable();
  //     this.PriceGroupForm.get('PromotionDateFrom').disable();
  //     this.PriceGroupForm.get('PromotionDateTo').disable();
  //     this.PriceGroupForm.get('PromotionTimeFrom').disable();
  //     this.PriceGroupForm.get('PromotionTimeTo').disable();
  //     this.PriceGroupForm.get('Price').disable();
  //       this.PriceGroupForm.get('Quantity1').disable();
  //      /*  this.PriceGroupForm.get('Quantity2').disable();
  //       this.PriceGroupForm.get('Quantity3').disable();
  //       this.PriceGroupForm.get('Quantity4').disable();
  //       this.PriceGroupForm.get('Quantity5').disable();
  //       this.PriceGroupForm.get('Price1').disable();
  //       this.PriceGroupForm.get('Price2').disable();
  //       this.PriceGroupForm.get('Price3').disable();
  //       this.PriceGroupForm.get('Price4').disable();
  //       this.PriceGroupForm.get('Price5').disable(); */
  //   }
  //   else {
  //     //this.IsVendorPrice = false;
  //     this.PriceGroupForm.get('Price').enable();
  //     this.PriceGroupForm.get('PromotionDays').enable();
  //     this.PriceGroupForm.get('PromotionDateFrom').enable();
  //     this.PriceGroupForm.get('PromotionDateTo').enable();
  //     this.PriceGroupForm.get('PromotionTimeFrom').enable();
  //     this.PriceGroupForm.get('PromotionTimeTo').enable();
  //     this.PriceGroupForm.get('Price').enable();
  //     // this.PriceGroupForm.get('Quantity1').enable();
  //     /*   this.PriceGroupForm.get('Quantity2').enable();
  //       this.PriceGroupForm.get('Quantity3').enable();
  //       this.PriceGroupForm.get('Quantity4').enable();
  //       this.PriceGroupForm.get('Quantity5').enable();
  //       this.PriceGroupForm.get('Price1').enable();
  //       this.PriceGroupForm.get('Price2').enable();
  //       this.PriceGroupForm.get('Price3').enable();
  //       this.PriceGroupForm.get('Price4').enable();
  //       this.PriceGroupForm.get('Price5').enable(); */

  //   }
  // }
  ClearingOnPromotionTypeSelected() {
    this.PriceGroupForm.patchValue({
      PromotionDays: '-1',
      PromotionDateFrom: null,
      PromotionDateTo:null,
      PromotionTimeFrom: null,
      PromotionTimeTo: null,
      PriceChangeReason: '00000000-0000-0000-0000-000000000000',
      PromotionalPrice: '',
      Price: '',
      Quantity1: '1.00',
      Quantity2: '',
      Quantity3: '',
      Quantity4: '',
      Quantity5: '',
      Price1: '',
      Price2: '',
      Price3: '',
      Price4: '',
      Price5: ''
    });

  }
twelveHourTimeFormat(){
var d = new Date();
var year=d.getFullYear();
var Month=(d.getMonth()+1).toString().padStart(2, '0');
var date=d.getDate().toString().padStart(2, '0');
var time =(d.getHours() % 12).toString().padStart(2, '0')+":"+d.getMinutes().toString().padStart(2, '0')+":"+d.getSeconds().toString().padStart(2, '0');
var m=d.getTimezoneOffset;
this.TwelveHourTimeFormat = year+"-"+Month+"-"+date+"T"+time;
//var oo='2020-12-04T05:00:00';
}
AllConfigurationByModuleID() {
  this.configuration.getAllConfigurationByModuleID("INV").subscribe((resp: any) => {
    var Data = resp.data.configurationbyIds.filter(o => o.flag == "Flag31");
    debugger
    this.PromotionPriceChangeAlert = Data[0].value;
  //  this.PromotionPriceAlert();
  }, (error) => {
    this.Loading = false;
    this.toastr.error(error);
    console.error('Problem with the sevice. Please try later : ' + error);
  });
}
PromotionPriceAlert() {
  debugger;
  let PromotionType = this.PriceGroupForm.get('PromotionType').value;
  let PromotionDateTo =  this.PriceGroupForm.get('PromotionDateTo').value;
  let PromotionTimeTo = this.PriceGroupForm.get('PromotionTimeTo').value;
  if ((!PromotionType || PromotionType == "false") && PromotionType != null && (PromotionDateTo != '' && PromotionDateTo != null) && (new Date(PromotionDateTo).setHours(0, 0, 0, 0) != new Date().setHours(0, 0, 0, 0))) {


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
  if ((!PromotionType || PromotionType == "false") && PromotionType != null && (PromotionTimeTo != '' && PromotionTimeTo != null) && (new Date(PromotionDateTo).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0))) {

    let StartDate = new Date();
    let StartDateTmp: any
    StartDateTmp = StartDate;
    StartDateTmp = StartDateTmp.setDate(1);
    StartDateTmp = new Date(StartDateTmp).setMonth(1);
    StartDateTmp = new Date(StartDateTmp).setFullYear(2000);

    var EndDate = new Date(PromotionTimeTo);
    let EndDateTmp: any;
    EndDateTmp = EndDate;
    EndDateTmp = EndDate.setDate(1);
    EndDateTmp = new Date(EndDateTmp).setMonth(1);
    EndDateTmp = new Date(EndDateTmp).setFullYear(2000);


    let DateTo = new Date(EndDateTmp).getTime();
    let CurrentDate = new Date(StartDateTmp).getTime();
    //let Currentyear=new Date(TodaysDate).valueOf();
    var Difference_In_Time = DateTo - CurrentDate;
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    var CheckDays = Math.sign(Difference_In_Days);
    if (CheckDays == 1) {
      //if ((Number(this.PromotionPriceChangeAlert)) > (Number(Difference_In_Days))) {
      //  this.toastr.warning('Promotion Price is going to expire within  ' + this.PromotionPriceChangeAlert + '   Days' +
      //    ' ' + Difference_In_Days + 'Left to expire');
      //}
    }

    else {
      this.toastr.warning('Promotion Price is already expired');
    }

  }


}

  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
