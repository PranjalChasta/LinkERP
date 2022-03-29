import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PurchaseGoodsReceiveNoteService } from '../../services/purchase-goods-receive-note.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { ToastrService } from 'ngx-toastr';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { PurchaseGRNDetailsService } from '../../services/purchase-grndetails.service';
import { LBSPURPurchaseGRNDetails } from 'src/app/models/pur/lbs-pur-purchase-grndetails';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { InventoryService } from 'src/app/inv/services/inventory.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { TaxCodeService } from 'src/app/sys/services/tax-code.service';
import { PurchaseOrderDetailService } from '../../services/purchase-order-detail.service';
import { CustomValidators } from 'ngx-custom-validators';
@Component({
  selector: 'app-purchase-grndetails',
  templateUrl: './purchase-grndetails.component.html',
  styleUrls: ['./purchase-grndetails.component.css']
})
export class PurchaseGRNDetailsComponent implements OnInit {
  @Input() GRNID: any;

  PurchaseGRNDetailsForm:FormGroup;
  Loading: any = false;
  Mode: any = 'List';
  submitted: boolean;
  CompanyID = localStorage.getItem('CompanyID');
  Purchasegoodsreceivenotedetails:any[]=[];
  PurchaseGrnDetails:any[]=[];
  PurchaseGrnDetailsByPurchase:any[]=[];
  purchaseOrder:any[]=[];
  UOMList:any[]=[];
  BindInventory:any[]=[];
  BindTaxCode:any[]=[];
  PurchaseOrderDetail:any[]=[];
  DetailsbyPurchaseId:any[]=[];
  Classificationtext:boolean;
  editid:any;
  pur;
   //Ag-grid 
   ColumnDefs;
   RowData: any;
   AgLoad: boolean = false

Purchasechanges:boolean;
   //Permission
   read_Access: boolean;
   write_Access: boolean;
   delete_Access: boolean;
   all_Access: boolean;
    SupplierSKU:any;
  ClassificationID: any;
  PageSize: any;
  Currentpage: string;
  ReceivedQuantity:any;
 lstpurchasegrndetails:LBSPURPurchaseGRNDetails[]=[];
  constructor(
    private ReceiveNote: PurchaseGoodsReceiveNoteService,
    private sysCommonService:SysCommonService,
    private taxCodeService:TaxCodeService,
    private purchaseOrderService:PurchaseOrderService,
    private inventoryService:InventoryService,
    private GrnDetails:PurchaseGRNDetailsService, 
    private purchaseOrderDetailService:PurchaseOrderDetailService,
     private commonService: InvCommonService,
    private deleteRecordsService: DeleteRecordsService,
    private cryptoAes: CryptoAes,
    private FB: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.Purchasechanges=false;
    console.log(this.GRNID);
    this.AgLoad = false;
    //this.Mode = "List";
    this.Mode == 'Add'
    this.CreateForm();
   // this.SetPermissions();
    this.GetAgColumns();
    this.GetGRNDetails();
    this.BindPurchaseOrder();
    this.Currentpage = "0";
    this.PageSize = "50";
  }
  GetAgColumns() {
    this.ColumnDefs = [
      { headerName: 'Purchase Order', field: 'purchaseOrderNumber', sortable: true, filter: true, checkboxSelection: false,editable:false},
      { headerName: 'GRNNo', field: 'grnNo', sortable: true, filter: true ,editable:false},
      { headerName: 'Line', field: 'lineNo', sortable: true, filter: true,editable:false },
      { headerName: 'Classification', field: 'classificationID', sortable: true, filter: true},
      { headerName: 'Received Quantity', field: 'receivedQuantity', sortable: true, filter: true},
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
    //  { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }

    ];
  }

  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  CreateForm() {
    this.PurchaseGRNDetailsForm = this.FB.group({
      ID: [''],
      CompanyID: ['-1'],
      GRNID: [''],
      ProductID:[''],
      PurchaseOrderID: ['-1'],
      PurchaseOrderLineID: [''],
      PurchaseLineStatus : ['New'],
      ProductType : [''],
      UnitOfMeasure: [''],
      ProductDescription : [''],
      ReceivedQuantity : [''],
      SuppliersUnitCost : [''],
      DiscountAmount: [''],
      DiscountedUnitCost : [''],
      LineTotalCostTaxEclusive: [''],
      TaxRate : [''],
      LineTotalTaxAmount: [''],
      LineTotalCostTaxInclusive : [''],
      CurrencyID : [''],
      FXRate: [''],
      ForeignExchangeUnitCost: [''],
      LineTotalForeignExchangeCostTaxExclusive: [''],
      LineTotalForeignExchangeCostTaxInclusive: [''],
      LineTotalHomeAmount : [''],
      LineTotalForeignAmount: [''],
      SupplierSKU : [''],
      ClassificationID:[''],
      DiscountType:['true'],
      TaxID:['']
    });
  }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "306");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.PurchaseGRNDetailsForm.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          this.PurchaseGRNDetailsForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.PurchaseGRNDetailsForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }


  get f() { return this.PurchaseGRNDetailsForm.controls; }
  //Resetting the form after Add/Edit
  ResetForm() {
    this.PurchaseGRNDetailsForm.patchValue({
      ID: '',
      CompanyID: '',
      GRNID: '',
      ProductID:'',
      PurchaseOrderID: '',
      PurchaseOrderLineID: '',
      PurchaseLineStatus : '',
      ProductType : '',
      UnitOfMeasure: '',
      ProductDescription : '',
      ReceivedQuantity : '',
      SuppliersUnitCost : '',
      DiscountAmount: '',
      DiscountedUnitCost : '',
      LineTotalCostTaxEclusive: '',
      TaxRate : '',
      LineTotalTaxAmount: '',
      LineTotalCostTaxInclusive : '',
      CurrencyID : '',
      FXRate: '',
      ForeignExchangeUnitCost: '',
      LineTotalForeignExchangeCostTaxExclusive: '',
      LineTotalForeignExchangeCostTaxInclusive: '',
      LineTotalHomeAmount : '',
      LineTotalForeignAmount: '',
      SupplierSKU : '',
      ClassificationID:'',
      DiscountType:'',
      TaxID:''
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
    CustomSaveIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-save"></i></div>';
    return cellContent
  }
  /* FOR Aggird End  */

  //add 
  AddNew(): void {
    this.Mode = 'Add';
    this.Purchasechanges=true;
  }
  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.Mode = "Add";
  }
  //To bind the data of all goods to the Grid.
  BindPurchaseOrder() {
    this.Loading = false;
    this.purchaseOrderService.getPurchaseMain().subscribe((resp: any) => {
      console.log(resp);
    this.purchaseOrder = resp.data.purchaseMain;
      this.Loading = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
 BindAllOrderDetail(purchaseid) {
  debugger;
    this.Loading = false;
    this.purchaseOrderDetailService.getPurchaseOrderByID(purchaseid).subscribe((resp: any) => {
      this.PurchaseOrderDetail = resp.data.purchaseDetails;
      console.log(this.PurchaseOrderDetail);
      this.Loading = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onpurchaseOderChange(id) {

    if(id!="-1"){
    this.getGRNDetailsBYPurchaseID(id);
    }
    else if(id='-1')
      {
        this.GetGRNDetails();
      }else{
      this.RowData="";
      this.GetGRNDetails();
     this.AgLoad=false;
      this.AgLoad=true;
    }
}

getGRNDetailsBYPurchaseID(id) {
    debugger;
    this.Loading = true;
    this.AgLoad = false;
    this.GrnDetails.getpurchaseGRNDetailsByPurchaseorderID(id,this.GRNID).subscribe((resp: any) => {
      console.log(resp);
      this.PurchaseGrnDetailsByPurchase = resp.data.purchaseGrndetails;
      this.RowData = resp.data.purchaseGrndetails;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {

      this.Loading = false;
      //  this.toastr.error(error);
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


onpurchaseOderLineChange(ID){
  debugger;
  if(ID!='-1'){
    let index = this.PurchaseOrderDetail.findIndex(c => c.id == ID);
    let data = this.PurchaseOrderDetail[index];
    this.PurchaseGRNDetailsForm.patchValue({
      ProductType: data.productType,
      ProductDescription:data.productDescription,
      PurchaseLineStatus:data.purchaseLineStatus,
      ProductID:data.productID,
      UnitOfMeasure: data.unitOfMeasure,
      DiscountType: data.discountType,
      DiscountAmount: data.discountAmount,
      DiscountedUnitCost: data.discountedUnitCost,
      LineTotalCostTaxEclusive: data.lineTotalCostTaxEclusive,
      TaxID:data.taxID,
      TaxRate: data.taxRate,
      LineTotalTaxAmount: data.lineTotalTaxAmount,
      LineTotalCostTaxInclusive: data.lineTotalCostTaxInclusive,
      CurrencyID: data.currencyID,
      FxRate: data.fxRate,
      ForeignExchangeUnitCost:data.foreignExchangeUnitCost,
      LineTotalForeignExchangeCostTaxExclusive: data.lineTotalForeignExchangeCostTaxExclusive,
      LineTotalForeignExchangeCostTaxInclusive: data.lineTotalForeignExchangeCostTaxInclusive,
      LineTotalForeignAmount: data.lineTotalForeignAmount,
      LineTotalHomeAmount: data.lineTotalHomeAmount,
      supplierSKU: data.supplierSKU

    });
  }else{
    
  }
  }

makeempty(){
  this.PurchaseGRNDetailsForm.patchValue({
    ProductType: '',
    ProductDescription:'',
    PurchaseLineStatus:'',
    ProductID:'',
    UnitOfMeasure:'',
    DiscountType:'',
    DiscountAmount:'',
    DiscountedUnitCost:'',
    LineTotalCostTaxEclusive:'',
    TaxID:'',
    TaxRate:'',
    LineTotalTaxAmount:'',
    LineTotalCostTaxInclusive:'',
    CurrencyID:'',
    FxRate:'',
    ForeignExchangeUnitCost:'',
    LineTotalForeignExchangeCostTaxExclusive:'',
    LineTotalForeignExchangeCostTaxInclusive:'',
    LineTotalForeignAmount:'',
    LineTotalHomeAmount:'',
    supplierSKU:''
  });
}

  
  GetGRNDetails() {
    debugger;
    this.Loading = true;
    this.AgLoad = false;
    this.GrnDetails.getpurchaseGRNDetailsByGRNID(this.GRNID).subscribe((resp: any) => {
      console.log(resp);
      this.PurchaseGrnDetails = resp.data.purchaseGrndetails;
      this.RowData = resp.data.purchaseGrndetails;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {

      this.Loading = false;
      //  this.toastr.error(error);
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  

  

  //To save the price-group details to database table by calling the API service
  onSave() {
    debugger;
    this.submitted = true;
    if (this.PurchaseGRNDetailsForm.invalid) {
      return;
    }
    this.Loading = true;
    let grn = new LBSPURPurchaseGRNDetails();
    grn.CompanyID = this.CompanyID;
    grn.GRNID = this.GRNID;
    grn.PurchaseOrderID = this.PurchaseGRNDetailsForm.get('PurchaseOrderID').value;
    grn.PurchaseOrderLineID = this.PurchaseGRNDetailsForm.get('PurchaseOrderLineID').value;
    grn.ProductID=this.PurchaseGRNDetailsForm.get('ProductID').value;
    grn.TaxID = this.PurchaseGRNDetailsForm.get('TaxID').value;
    grn.UnitOfMeasure = this.PurchaseGRNDetailsForm.get('UnitOfMeasure').value;
    grn.PurchaseLineStatus = this.PurchaseGRNDetailsForm.get('PurchaseLineStatus').value;
    grn.ProductType = this.PurchaseGRNDetailsForm.get('ProductType').value;
    grn.ProductDescription = this.PurchaseGRNDetailsForm.get('ProductDescription').value;
    grn.ReceivedQuantity = this.ReceivedQuantity;
    grn.SuppliersUnitCost = this.PurchaseGRNDetailsForm.get('SuppliersUnitCost').value;
    grn.DiscountedUnitCost = this.PurchaseGRNDetailsForm.get('DiscountedUnitCost').value;
    grn.DiscountAmount =this.PurchaseGRNDetailsForm.get('DiscountAmount').value;
    grn.DiscountType =this.PurchaseGRNDetailsForm.get('DiscountType').value;
    grn.LineTotalCostTaxEclusive = this.PurchaseGRNDetailsForm.get('LineTotalCostTaxEclusive').value;
    grn.TaxRate = this.PurchaseGRNDetailsForm.get('TaxRate').value;
    grn.LineTotalTaxAmount = this.PurchaseGRNDetailsForm.get('LineTotalTaxAmount').value;
    grn.LineTotalCostTaxInclusive = this.PurchaseGRNDetailsForm.get('LineTotalCostTaxInclusive').value;
    grn.CurrencyID = this.PurchaseGRNDetailsForm.get('CurrencyID').value;
    grn.FXRate = this.PurchaseGRNDetailsForm.get('FXRate').value;
    grn.ForeignExchangeUnitCost = this.PurchaseGRNDetailsForm.get('ForeignExchangeUnitCost').value;
    grn.LineTotalForeignExchangeCostTaxExclusive = this.PurchaseGRNDetailsForm.get('LineTotalForeignExchangeCostTaxExclusive').value;
    grn.LineTotalForeignExchangeCostTaxInclusive = this.PurchaseGRNDetailsForm.get('LineTotalForeignExchangeCostTaxInclusive').value;
    grn.LineTotalHomeAmount = this.PurchaseGRNDetailsForm.get('LineTotalHomeAmount').value;
    grn.LineTotalForeignAmount = this.PurchaseGRNDetailsForm.get('LineTotalForeignAmount').value;
    grn.SupplierSKU = this.SupplierSKU;
    grn.ClassificationID =this.ClassificationID;

    //If the mode Add will insert data to DB table else update the row by ID
     if (this.Mode == 'Add') {
      this.GrnDetails.addpurchaseGRNDetails(grn).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Purchase GRN Details added successfully');
          //this.ResetForm();
        // this.BindPurchaseGRNDetailsBYGRN();
      let pid=  this.PurchaseGRNDetailsForm.get('PurchaseOrderID').value
         this.getGRNDetailsBYPurchaseID(pid);
       //   this.BindPurchaseGRNDetailsBYPurchaseOrderID(this.pur);
          this.Mode = 'Add';
          this.Loading = false;
        }
        else {
          this.toastr.error(resp.message);
        }
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }  else 
   if (this.Mode == 'Edit') {

      grn.ID = this.editid;
      this.GrnDetails.updatepurchaseGRNDetails(grn).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Purchase GRN Details  updated successfully');
         // this.ResetForm();
         let pid=  this.PurchaseGRNDetailsForm.get('PurchaseOrderID').value
         this.getGRNDetailsBYPurchaseID(pid);
          this.Mode = 'Add';
        }
        else {
          this.toastr.error(resp.message);
        }
      }, (error) => {
     //   console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    debugger;
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Mode=='Edit';
      this.AgEdit(event.data)
      //this.onpurchaseOderChange(event.data.purchaseOrderID)
    } else if (colId == 'Delete') {
      this.OnDelete(event.data.id)
    }
       else if (colId == 'Save') { 
      this.AgSave(event.data)
    }
  
  }

  OnEditStoped(event:any){
    debugger; 
      console.log(event.data);
      let index =  this.lstpurchasegrndetails.findIndex(c => c.ID == event.data.id);
      if (index >= 0) {
        this.lstpurchasegrndetails.splice(index,1);
      }
    
        debugger;
        let _LbsPurchaseGrnDetails = new LBSPURPurchaseGRNDetails();
        _LbsPurchaseGrnDetails.ClassificationID=event.data.classificationID;
        _LbsPurchaseGrnDetails.ReceivedQuantity=event.data.receivedQuantity;
        _LbsPurchaseGrnDetails.ID =event.data.id;
        this.lstpurchasegrndetails.push(_LbsPurchaseGrnDetails);
      
    
     // this.Mutilpledata(event)
      
  }


  Mutilpledata(event){
    debugger;
    
      this.GrnDetails.updateGRNDetailslist(this.lstpurchasegrndetails).subscribe((resp: any) => {
        this.lstpurchasegrndetails=[];
        this.toastr.success(' GRN Details updated successfully')
        this.ResetForm();
        this.GetGRNDetails();
        this.Mode = 'List';
  
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error);
      });
    
    }

   AgSave(event) {
    debugger;
    this.SupplierSKU=event.supplierSKU;
    this.ClassificationID=event.classificationID;
    this.ReceivedQuantity = event.receivedQuantity;
    
    this.editid=event.id;
    this.Mode="Edit";
    this.onSave();
  }
  //edit operation
  AgEdit(event) {
    debugger;
    console.log(event);
   // let index = this.PurchaseOrderDetail.findIndex(c => c.id == event.purchaseOrderLineID );
    //let data = this.PurchaseOrderDetail[index];
    this.PurchaseGRNDetailsForm.patchValue({
      ID: event.id,
      CompanyID: event.companyID,
      GRNID: event.grnid,
      PurchaseOrderID: event.purchaseOrderID,
      PurchaseOrderLineID: event.purchaseOrderLineID,
      PurchaseLineStatus: event.purchaseLineStatus,
      ProductType: event.productType,
      ProductID: event.productID,
      ProductDescription: event.productDescription,
      ReceivedQuantity: event.receivedQuantity,
      UnitOfMeasure: event.unitOfMeasure,
      SuppliersUnitCost: event.suppliersUnitCost,
      DiscountAmount: event.discountAmount,
      DiscountedUnitCost: event.discountedUnitCost,
      LineTotalCostTaxEclusive: event.lineTotalCostTaxEclusive,
      TaxID: event.taxID,
      TaxRate: event.taxRate,
      LineTotalTaxAmount: event.lineTotalTaxAmount,
      LineTotalCostTaxInclusive: event.lineTotalCostTaxInclusive,
      CurrencyID: event.currencyID,
      FXRate: event.fxRate,
      ForeignExchangeUnitCost: event.foreignExchangeUnitCost,
      LineTotalForeignExchangeCostTaxExclusive: event.lineTotalForeignExchangeCostTaxExclusive,
      LineTotalForeignExchangeCostTaxInclusive: event.lineTotalForeignExchangeCostTaxInclusive,
      LineTotalHomeAmount:event.lineTotalHomeAmount,
      LineTotalForeignAmount:event.lineTotalForeignAmount,
      SupplierSKU:event.supplierSKU,
      ClassificationID:event.classificationID,
      DiscountType:event.discountType
    });
  this.Mode = 'Edit';
  }

  OnDelete(ID) {
    debugger;
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_PUR_PurchaseGRNDetails', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.GetGRNDetails();
    //  this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  } 


  
}
