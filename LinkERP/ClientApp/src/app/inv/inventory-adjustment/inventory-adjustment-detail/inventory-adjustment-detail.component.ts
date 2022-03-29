import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { PurchaseTemplateDetailService } from 'src/app/pur/services/purchase-template-detail.service';
import { CustomValidators } from 'ngx-custom-validators';
import { InventoryAdjustmentDetailService } from '../../services/inventory-adjustment-detail.service';
import { InventoryAdjustmentService } from '../../services/inventory-adjustment.service';
import { LbsInvInventoryAdjustmentDetail } from 'src/app/models/inv/lbs-inv-inventory-adjustment-detail';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InvCommonService } from '../../services/inv-common.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { IfStmt } from '@angular/compiler';
@Component({
  selector: 'app-inventory-adjustment-detail',
  templateUrl: './inventory-adjustment-detail.component.html',
  styleUrls: ['./inventory-adjustment-detail.component.css']
})
export class InventoryAdjustmentDetailComponent implements OnInit {
  @Input() AdjustmentID: any;
  @Input() SelecteWareHouseID: any;
  @Input() CurrentStatus: string;
  @Output() OnSaveAdjustment = new EventEmitter();
  @Output() OnpostAdjustment = new EventEmitter<any>();
  @Output() OnAdjustmentCancel = new EventEmitter();

  RowData: any;
  AgLoad: boolean = false
  UOMList: any;
  UOMAllList: any;
  inventoryList: any;
  InventoryAdjustmentDetailForm: FormGroup;
  InventoryAdjustmentSerialTrackingForm: FormGroup;
  submitted: boolean;
  AdjustmentDetail: any;
  inventoryAdjustment: any;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  @Input() IsActive: boolean;
  CompanyID = localStorage.getItem('CompanyID');
  adjustmentDetail: any;
  modalRef: BsModalRef;
  SelectedProductID: any;
  SelectedAdjustmentDetail_ID: any;
  SelectedQuantity: any;
  detailBtnForOut: boolean[] = [];
  productName: string;
  InventoryUnitOfMeasure: any;
  Istest:boolean;
  selectedProductCode: any;
  selectedProductDescription: any;
  SumoftotalQuantity:any
Decimal:any;
  constructor(private FB: FormBuilder, private toastr: ToastrService, private sysCommonService: SysCommonService, private modalService: BsModalService, private syscommonservice: SysCommonService,
    private purchaseTemplateService: PurchaseTemplateDetailService,
    private deleteRecordsService: DeleteRecordsService, private cryptoAes: CryptoAes,
    private adjustmentdetailService: InventoryAdjustmentDetailService, private commonService: InvCommonService, private inventoryAdjustmentService: InventoryAdjustmentService) { }

  ngOnInit() {
    this.AgLoad = false;
    console.log(this.CurrentStatus);
    this.CreateForm();
    this.SetPermissions();
    this.BindInventoryAdjustmentDetail();
    this.BindInventories();
    this.BindUOM();
    this.BindAlUOM();
    this.CreateSerialTrackingForm();
  }

  BindInventoryUOMConversions(InventoryID, uom, i) {
    this.InventoryUnitOfMeasure = [];
    this.syscommonservice.getUOMConvertionsByInventryID(InventoryID).subscribe((resp: any) => {
      this.InventoryUnitOfMeasure = resp.data.inventoryunitofmeasure;
      this.RowData[i].uomlist =  this.InventoryUnitOfMeasure;
      this.Istest=true;
      this.onUomChange(uom, i);
      console.log(this.InventoryUnitOfMeasure);
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  CreateForm() {
    this.InventoryAdjustmentDetailForm = this.FB.group({
      ID: [''],
      AdjustmentID: [this.AdjustmentID],
      Cost: [''],
      Quantity: [''],
      Product: ['-1', CustomValidators.notEqual('-1')],
      PurchaseUOM: ['-1', CustomValidators.notEqual('-1')],
    })
  }
  /*  GetAgColumns(){
     this.ColumnDefs = [
       { headerName: 'Adjustment', field: 'adjustmentNo', sortable: true, filter: true, checkboxSelection: false, width: 150, },
       { headerName: 'Product', field: 'productName', sortable: true, filter: true, },
       { headerName: 'Cost', field: 'cost', sortable: true, filter: true, width: 130, },
       { headerName: 'Qty', field: 'quantity', sortable: true, filter: true },

       { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
       { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false },
       { headerName: '', field: 'Delete', cellRenderer: this.CustomDeleteIconFunc, type: 'Action', hide: !this.delete_Access }
     ];
   } */
  SetPermissions() {

    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "208");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.InventoryAdjustmentDetailForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryAdjustmentDetailForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryAdjustmentDetailForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  get f() { return this.InventoryAdjustmentDetailForm.controls; }
  totalQuantity: any;
  BindInventoryAdjustmentDetail() {
    this.AgLoad = false;
    this.adjustmentdetailService.getInventoryAdjustmentDetailByAdjustmentID(this.AdjustmentID).subscribe((resp: any) => {
      console.log(resp.data.inventoryadjustmentdetail);
      this.adjustmentDetail = resp.data.inventoryadjustmentdetail;
      this.RowData = resp.data.inventoryadjustmentdetail;
      //this.OnextendCostChange();
      if (this.RowData.length == 0) {
        this.addnew();
      }else{
        for(let i=0;i<=this.RowData.length-1;i++){
         let productID= this.RowData[i].productID;
         let uom=this.RowData[i].uom;
          this.BindInventoryUOMConversions(productID,uom,i)
        }
      }
      this.AgLoad = true;
      this.submitted = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the data of UOM to controls.
  BindUOM() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_UnitOfMeasure).subscribe((resp: any) => {
      console.log(resp);
      this.UOMList = resp.data.tabledata;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindAlUOM() {
    this.inventoryAdjustmentService.getUomforAdjustmentDetail().subscribe((resp: any) => {
      console.log(resp);
      debugger;
      this.UOMAllList = resp.data.inventoryUom;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


  //To bind the data of UOM to controls.
  BindInventoryAdjustment() {
    this.inventoryAdjustmentService.getInventoryAdjustment().subscribe((resp: any) => {
      this.inventoryAdjustment = resp.data.inventoryAdjustment;
      // this.Loading = false;
    }, (error) => {

      // this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindInventoryDetail() {
    this.AgLoad = false;
    this.purchaseTemplateService.getInventories().subscribe((resp: any) => {
      this.inventoryList = resp.data.inventory;
      //this.RowData = resp.data.inventory;
      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindInventories() {
    this.adjustmentdetailService.getInventoriesForAdjustmentdetailsID(this.SelecteWareHouseID).subscribe((resp: any) => {
      console.log(resp.data.inventory);
      this.inventoryList = resp.data.inventory;
debugger;
    }, (error) => {

      this.toastr.error(error);
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


  Cancel(): void {
    this.BindInventoryAdjustmentDetail();
    this.submitted = false;
    this.OnAdjustmentCancel.emit();
  }
  DeleteInventoryAdjustmentDeatil(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryAdjustmentDetail', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.toastr.success('Currency  details deleted successfully');
      this.BindInventoryAdjustmentDetail();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


  AGEdit(adjustment) {
    this.InventoryAdjustmentDetailForm.patchValue({
      ID: adjustment.id,
      Cost: adjustment.cost_text,
      AdjustmentID: adjustment.adjustmentID,
      Quantity: adjustment.quantity_text,
      Product: adjustment.productID,
      PurchaseUOM: adjustment.uom
    });
  }

  BindInventoryAdjustmentDetailByID(ID) {
    this.adjustmentdetailService.getInventoryAdjustmentByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        let adjustment: any = new LbsInvInventoryAdjustmentDetail();
        adjustment = resp.data.inventoryAdjustmentDetail;
        this.InventoryAdjustmentDetailForm.patchValue({
          ID: adjustment.id,
          Cost: adjustment.cost_text,
          AdjustmentID: adjustment.adjustmentID,
          Quantity: adjustment.quantity_text,
          Product: adjustment.productID,
          PurchaseUOM: adjustment.uom
        });
      }
    });
    (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    }
  }


  //To create the States Form Controls.
  ResetForm() {
    this.InventoryAdjustmentDetailForm.patchValue({
      ID: '',
      Cost: '',
      AdjustmentID: '-1',
      Quantity: '',
      Product: '-1',
      PurchaseUOM: '-1',
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

  onProductChange(id,i) {
    debugger;
    this.AgLoad = false;
    if (id != "-1") {
      let index = this.inventoryList.findIndex(c => c.id == id);
      this.RowData[i].productID = id;
      if (index >= 0) {
        this.RowData[i].uom = this.inventoryList[index].unitOfMeasureID;
        this.Decimal=this.inventoryList[index].decimalPlace;
        this.RowData[i].serialisedProduct = this.inventoryList[index].serialisedProduct;
        this.RowData[i].productStyleMatrixEnabled = this.inventoryList[index].productStyleMatrixEnabled;
        this.RowData[i].cost = this.inventoryList[index].inventoryDefaultCost;
        this.RowData[i].cost_text= this.inventoryList[index].inventoryDefaultCost;
        this.RowData[i].extendCost_text=Number(Number( this.RowData[i].quantity_text)*Number(this.inventoryList[index].inventoryDefaultCost)).toFixed(4);
        this.BindInventoryUOMConversions(id, this.RowData[i].uom, i);
        this.OnextendCostChange();
      }
      this.AgLoad = true;
    }
  }

  addnew() {
    this.submitted = false;
    this.AgLoad = false;
    let object = {
      'companyID': this.CompanyID,
      'adjustmentID': this.AdjustmentID,
      'productID': "",
      'uom': "",
      'quantity': 0,
      'inOut': true,
      'cost': 0,
      'extendCost_text':0.0000,
      'quantity_text':0.0000,
      'cost_text':0.0000,
      'convertedQuantity_text':0.0000,
      'serialisedProduct': '',
      'productStyleMatrixEnabled': '',
      'productName': "",
      'productCode': "",
      'convertedQuantity': "",
      'adjustmentNo': "",
      'id': "",
      'uomlist':'',
      'createdBY': localStorage.getItem('LoginID'),
      'dateCreated': "0001-01-01T00:00:00",
      'deleted': false,
      'deletedBy': null,
      'deleteDate': "0001-01-01T00:00:00",
      'deleteStatus': "Active"
    }
    this.RowData.push(object);
    this.AgLoad = true;
  }

  UpdateChanges(saveAction) {
    debugger;
    const unique    = new Set();
    const counter = this.RowData.some(element => unique.size === unique.add(element.productID).size)
    if(counter){
      this.toastr.warning('Duplicate product name');
      return;
    }
     
    let index = this.RowData.findIndex(c => c.productID == '');
    if(index>=0){
      this.toastr.warning('Please select product name');
      return;
    }

    this.submitted = true;

    this.adjustmentdetailService.UpdateInventoryAdjustmentDetailList(this.RowData).subscribe((resp: any) => {
    //     this.toastr.success('Adjustment Detail details Saved successfully');
      this.OnSaveAdjustment.emit(saveAction);
      this.BindInventoryAdjustmentDetail();
      if (saveAction == 'Close') {
        this.Cancel();
      }
      else{
        this.OnSaveAdjustment.emit(saveAction);
        this.BindInventoryAdjustmentDetail();
      }
      this.submitted = false;
      //this.RowData = resp.data.inventoryadjustmentdetail;

      this.AgLoad = true;
    }, (error) => {
     // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  Deleteindex(i) {
    this.RowData.splice(i, 1);
  }
  totQuantity;
  OnextendCostChange() {

    let quantity = this.RowData.reduce((sum, item) => sum + Number(item.quantity_text), 0);
    let totQuantity = this.RowData.reduce((sum, item) => sum + Number(item.extendCost_text), 0);

    let SumoftotalQuantity = this.RowData.reduce((sum, item) => sum + Number(item.quantity_text), 0);
    this.totalQuantity=Number(totQuantity).toFixed(4);
    this.totQuantity=Number(quantity).toFixed(2);
    this.SumoftotalQuantity=Number(SumoftotalQuantity).toFixed(2);
   // this.totalQuantity.slice(0,5);
  }
  handleChange(value, index) {
    if (value) {
      //For In
      this.RowData[index].inOut = value;
      this.detailBtnForOut[index] = false;
    } else {
      //For Out
      this.RowData[index].inOut = value;
      this.detailBtnForOut[index] = true;
    }
  }

  CreateSerialTrackingForm() {
    this.InventoryAdjustmentSerialTrackingForm = this.FB.group({
      BulkNo: [''],
      Cost: [''],
      Quantity: [''],
      SerialNo: [''],
      StartNo: [''],
      PurchaseDate: [''],
      QtyPerLine: [0]
    })
  }
  // Serialise Detail,Serialise Detail Out ,Matrix Detail
  SerialiseDetail(serialise: TemplateRef<any>, i) {
    debugger
    this.SelectedProductID = this.RowData[i].productID;
    this.SelectedAdjustmentDetail_ID = this.RowData[i].id;
    this.SelectedQuantity = this.RowData[i].convertedQuantity_text;
    this.productName = this.RowData[i].productName;
    this.selectedProductCode = this.RowData[i].productCode;
    this.selectedProductDescription = this.RowData[i].productName;
    this.modalRef = this.modalService.show(serialise);
  }

  // SerialiseDetailOut(InvAdj:TemplateRef<any>,i){
  //   this.SelectedProductID= this.RowData[i].productID;
  //   this.SelectedAdjustmentDetail_ID= this.RowData[i].id;
  //   this.SelectedQuantity= this.RowData[i].quantity;
  //   this.productName =this.RowData[i].productName;
  //   this.modalRef = this.modalService.show(InvAdj);
  // }

  Closenote() {
    this.BindInventoryAdjustmentDetail();
    this.modalRef.hide();
  }
  ClosenoteMatrix(){
    this.BindInventoryAdjustmentDetail();
    this.modalRef.hide();
   }
  // MatrixDetail(product:TemplateRef<any>,i){
  //   this.SelectedProductID= this.RowData[i].productID;
  //   this.SelectedAdjustmentDetail_ID= this.RowData[i].id;
  //   this.SelectedQuantity= this.RowData[i].quantity;
  //   this.modalRef = this.modalService.show(product);
  // }

  onUomChange(value, i) {
    // let pid = this.RowData[i].productID;
    // let index = this.UOMAllList.findIndex(c => c.tableID == pid && c.id == value);
    let index2 = this.InventoryUnitOfMeasure.findIndex(c => c.uomidFrom == value);
    if (index2 >= 0 && this.RowData[i].Quantity > 0) {
      this.RowData[i].convertedQuantity_text = this.InventoryUnitOfMeasure[index2].conversionRatio;
    } else {
      this.RowData[i].convertedQuantity_text = 0;
    }
    /*  if (index >= 0 && this.RowData[i].Quantity > 0) {
       this.RowData[i].convertedQuantity = this.UOMAllList[index].dataCode;
     } else {
       this.RowData[i].convertedQuantity = 0;
     } */
    this.OnquantityChange(this.RowData[i].quantity, i);
  }
  OncostChange(value, i) {
      //this.RowData[i].extendCost_text=Number(Number( this.RowData[i].quantity_text)*Number(this.RowData[i].cost_text)).toFixed(4)
      if(!this.RowData[i].inOut)
      {
        this.RowData[i].extendCost_text=(Number(Number( this.RowData[i].cost_text)*Number(this.RowData[i].quantity_text))*-1).toFixed(4)
  
      }
      else{
        this.RowData[i].extendCost_text=Number(Number( this.RowData[i].cost_text)*Number(this.RowData[i].quantity_text)).toFixed(4)
   
      }
      this.OnextendCostChange();
  }
  OnquantityChange(value, i) {
    if (value) {
      let pid = this.RowData[i].productID;
      let uid = this.RowData[i].uom;
      /*  let index = this.UOMAllList.findIndex(c => c.tableID == pid && c.id == uid);
       let conqty = 0;
       if (index >= 0) {
         conqty = this.UOMAllList[index].dataCode;
       } */
      let index2 = this.InventoryUnitOfMeasure.findIndex(c => c.uomidFrom == uid);
      let conqty = 0;
      if (index2 >= 0) {
        conqty = this.InventoryUnitOfMeasure[index2].conversionRatio;
      }
      if (conqty == 0) {
        conqty = 1;
      }
      this.RowData[i].convertedQuantity_text = (Number(value) * conqty).toFixed(4);
      if(!this.RowData[i].inOut)
      {
        this.RowData[i].extendCost_text=(Number(Number( this.RowData[i].cost_text)*Number(this.RowData[i].quantity_text))*-1).toFixed(4)
  
      }
      else{
        this.RowData[i].extendCost_text=Number(Number( this.RowData[i].cost_text)*Number(this.RowData[i].quantity_text)).toFixed(4)
   
      }
          this.OnextendCostChange();
    }
  }
  post() {
    const unique    = new Set();
    const counter = this.RowData.some(element => unique.size === unique.add(element.productID).size)
    if(counter){
      this.toastr.warning('Duplicate product name');
      return;
    }
     
    let index = this.RowData.findIndex(c => c.productID == '');
    if(index>=0){
      this.toastr.warning('Please select product name');
      return;
    }
    this.adjustmentdetailService.UpdateInventoryAdjustmentDetailList(this.RowData).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.BindInventoryAdjustmentDetail();
        this.OnpostAdjustment.emit(this.RowData);
      }
      }, (error) => {

      });
  }

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode == 0) ? null : event.charCode >= 46 && event.charCode <= 57;
    }
}
