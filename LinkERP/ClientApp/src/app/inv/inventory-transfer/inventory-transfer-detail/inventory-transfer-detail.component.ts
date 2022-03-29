import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { PurchaseTemplateDetailService } from 'src/app/pur/services/purchase-template-detail.service';
import { CustomValidators } from 'ngx-custom-validators';
import { InventoryTransferDetailService } from '../../services/inventory-transfer-detail.service';
import { InventoryTransferService } from '../../services/inventory-transfer.service';
import { LbsInvInventoryTransferDetail } from 'src/app/models/inv/lbs-inv-inventory-transfer-detail';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InvCommonService } from '../../services/inv-common.service';
import { LBS_INV_InventoryTransferStatus } from 'src/app/models/inv/lbs_inv-inventory-transfer-status';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { InventoryTransferStatusService } from '../inventory-transfer-status.service';
import { Router } from '@angular/router';
import { ConfigurationService } from 'src/app/sys/services/configuration.service';
import { DecimalPipe, formatNumber } from '@angular/common';
@Component({
  selector: 'app-inventory-transfer-detail',
  templateUrl: './inventory-transfer-detail.component.html',
  styleUrls: ['./inventory-transfer-detail.component.css']
})
export class InventoryTransferDetailComponent implements OnInit {
  @Input() TransferID: any;
  @Input() WareHouseFromID: any;
  @Input() WareHouseToID: any;
  @Input() CurrentStatus: any;
  @Output() OnStatusChanged = new EventEmitter();
  @Output() OnSaveTransfer = new EventEmitter();
  @Output() OnTransferCancel = new EventEmitter();
  SelectedTransferDetail_ID: any;
  @Input() IsActive: boolean;
  @Input() EnableButton: boolean;
  enablebtn: boolean = true;
  Mode: any = 'List';
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  UOMList: any;
  inventoryList: any;
  InventoryTransferDetailForm: FormGroup;
  submitted: boolean = false;
  transferDetail: any;
  inventoryTransfer: any;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  CompanyID = localStorage.getItem('CompanyID');
  isReqQtyReadOnly: boolean = true;
  isShipQtyReadOnly: boolean = true;
  isRecQtyReadOnly: boolean = true;
  uomName = [];
  statusButton = "Submit";
  //submitBtnClicked: boolean = false;
  modalRef: BsModalRef;
  SelectedProductID: any;
  SelectedAdjustmentDetail_ID: any;
  SelectedQuantity: any;
  productName: string;
  comment: any;
  Isvalid: boolean;
  InventoryUnitOfMeasure: any;
  IsdetailSave: boolean;
  RequestedQuantity: any;
  Automaticallyreceivetransferwhenshipped: any;
  constructor(private FB: FormBuilder, private toastr: ToastrService, private sysCommonService: SysCommonService,
    private purchaseTemplateService: PurchaseTemplateDetailService,
    private commonService: InvCommonService, private modalService: BsModalService,
    private deleteRecordsService: DeleteRecordsService, private cryptoAes: CryptoAes,
    private inventorydetailService: InventoryTransferDetailService,
    private syscommonservice: SysCommonService,
    private inventoryTransferService: InventoryTransferService,
    private invStatusService: InventoryTransferStatusService, private router: Router,
    private configuration: ConfigurationService) { }

  ngOnInit() {
    this.AgLoad = false;
    this.IsdetailSave = false;
    this.Mode = "List";
    this.AllConfigurationByModuleID();
    this.checkStatus(this.invStatusService.status);
    this.InventoryTransferDetailForm = this.FB.group({
      ID: [''],
      Cost: [''],
      RequestedQty: [''],
      Product: ['-1'],
      ShippedQty: [''],
      PurchaseUOM: [''],
      ReceivedQty: [''],
    })
    this.SetPermissions();
    this.BindInventoryTransferDetail();
    this.BindUOM();
  }

  BindUOM() {
    debugger;
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_UnitOfMeasure).subscribe((resp: any) => {
      console.log(resp);
      this.UOMList = resp.data.tabledata;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
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
      this.InventoryTransferDetailForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryTransferDetailForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryTransferDetailForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  get f() { return this.InventoryTransferDetailForm.controls; }

  BindInventoryTransferDetail() {
    debugger;
    this.AgLoad = false;
    this.Mode = "List";
    this.inventorydetailService.getInventoryTransferDetailByTransferID(this.TransferID).subscribe((resp: any) => {
      console.log(resp.data.inventoryTransferDetail);
      this.transferDetail = resp.data.inventoryTransferDetail;
      this.RowData = resp.data.inventoryTransferDetail;
      if (this.RowData.length == 0) {
        this.addNewInvTranserDetail();
        this.IsdetailSave = false;
      } else {
        this.IsdetailSave = true;
        for (let i = 0; i <= this.RowData.length - 1; i++) {
          let productID = this.RowData[i].productID;
          let uom = this.RowData[i].uom;
          this.BindInventoryUOMConversions(productID, uom, i)
        }
      }
      this.BindInventoryDetail();

      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the data of UOM to controls.
  // BindUOM() {
  //   this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_UnitOfMeasure).subscribe((resp: any) => {
  //     this.UOMList = resp.data.tabledata;

  //   }, (error) => {
  //     console.error('Problem with the sevice. Please try later : ' + error);
  //   });
  // }


  //To bind the data of UOM to controls.
  BindInventoryTransfer() {
    this.inventoryTransferService.GetInventoryTransfer().subscribe((resp: any) => {
      this.inventoryTransfer = resp.data.inventoryTransfer;
      // this.Loading = false;
    }, (error) => {

      // this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindInventoryDetail() {
    this.AgLoad = false;
    this.inventorydetailService.GetInventorylistForTransfer(this.WareHouseFromID).subscribe((resp: any) => {
      this.inventoryList = resp.data.productsForTransfer;
    // this.sysCommonService.getFinishedProducts().subscribe((resp: any) => {
    //   this.inventoryList = resp.data.productkits;
      // for(var i=0;i<this.RowData.length;i++){
      //   this.getUomName(i);
      // }

      console.log(this.inventoryList);
      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  // AddNew(): void {
  //   this.Mode = 'Add';
  //   // this.read=true;
  // }

  Cancel(): void {
    this.router.navigate(['/inv/inventorytransfer']);
    this.ResetForm();
    this.submitted = false;
    this.BindInventoryTransferDetail();
    this.Mode = "List";
    this.IsdetailSave = false;
    this.OnTransferCancel.emit();
  }

  //To save the State details to database table by calling the API service
  // onSave() {
  //   this.submitted = true;
  //   if (this.InventoryTransferDetailForm.invalid) {
  //     return;
  //   }

  //   let transferdetail = new LbsInvInventoryTransferDetail();

  //   transferdetail.CompanyID = this.CompanyID;
  //   transferdetail.Cost = this.InventoryTransferDetailForm.get('Cost').value;
  //   transferdetail.TransferID = this.TransferID;
  //   transferdetail.RequestedQty = this.InventoryTransferDetailForm.get('RequestedQty').value;
  //   transferdetail.ProductID = this.InventoryTransferDetailForm.get('Product').value;
  //   transferdetail.ShippedQty = this.InventoryTransferDetailForm.get('ShippedQty').value;
  //   transferdetail.UOM = this.InventoryTransferDetailForm.get('PurchaseUOM').value;
  //   transferdetail.ReceivedQty = this.InventoryTransferDetailForm.get('ReceivedQty').value;
  //   if (this.Mode == 'Add') {
  //     this.inventorydetailService.addInventoryTransfer(transferdetail).subscribe((resp: any) => {
  //       if (resp.isSuccess == true) {
  //         this.toastr.success('Inventory Transfer details added successfully');
  //         this.ResetForm();
  //         this.BindInventoryTransferDetail();
  //         this.Mode = 'List';
  //         this.submitted = false;

  //       }
  //       else {
  //       }
  //     },
  //       (error) => {
  //         console.error('Problem with the sevice. Please try later : ' + error.message);
  //       });
  //   }
  //   else if (this.Mode == 'Edit') {
  //     transferdetail.ID = this.InventoryTransferDetailForm.get('ID').value;
  //     this.inventorydetailService.UpdateInventoryTransfer(transferdetail).subscribe((resp: any) => {
  //       if (resp.isSuccess == true) {
  //         this.toastr.success('Inventory Transfer Detail details updated successfully');
  //         this.ResetForm();
  //         this.BindInventoryTransferDetail();
  //         this.Mode = 'List';
  //         this.submitted = false;
  //       }
  //       else {
  //         alert(resp.message);
  //       }
  //     }, (error) => {
  //       console.error('Problem with the sevice. Please try later : ' + error.message);
  //     });
  //   }
  // }

  // OnActionClick(event: any) {

  //   var colId = event.column.getId();
  //   if (colId == 'Edit') {
  //     this.Mode = 'Edit';
  //     this.Edit(event.data.id);

  //   } else if (colId == 'Delete') {
  //     this.DeleteInventoryTransferDeatil(event.data.id)
  //   }
  // }

  DeleteInventoryTransferDeatil(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryTransferDetail', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.toastr.success('Currency  details deleted successfully');
      //   this.BindInventoryProductPriceDetails();
      this.BindInventoryTransferDetail();
      //this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To bind the data of States to the controls to edit/update.
  // Edit(ID): void {
  //   this.BindInventoryTransferDetailByID(ID);
  //   this.Mode = 'Edit';
  // }
  BindInventoryTransferDetailByID(ID) {

    this.inventorydetailService.getInventoryTransferByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        let transfers: any = new LbsInvInventoryTransferDetail();
        transfers = resp.data.inventoryTransferDetail;
        this.InventoryTransferDetailForm.patchValue({
          ID: transfers.id,
          Cost: transfers.cost_text,
          TransferID: transfers.transferID,
          RequestedQty: transfers.requestedQty_text,
          Product: transfers.productID,
          ShippedQty: transfers.shippedQty_text,
          PurchaseUOM: transfers.uom,
          ReceivedQty: transfers.receivedQty_text,

        });
      }
    });
    (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    }
  }

  //Add New Inv Tranfer Detail 
  addNewInvTranserDetail() {
    this.AgLoad = false;
    let object = {
      'companyID': this.CompanyID,
      'transferID': this.TransferID,
      'productID': "-1",
      'uom': "-1",
      'requestedQty': 0,
      'shippedQty': 0,
      'receivedQty': 0,
      'cost': 0,
      'cost_text': 0,
      'requestedQty_text': 0,
      'receivedQty_text': 0,
      'shippedQty_text': 0,
      'serialisedProduct': '',
      'unitRequestedQty': 1,
      'productStyleMatrixEnabled': '',
      'id': "",
      'uomlist': '',
      'createdBY': null,
      'dateCreated': "0001-01-01T00:00:00",
      'deleted': false,
      'deletedBy': null,
      'deleteDate': "0001-01-01T00:00:00",
      'deleteStatus': "Active"
    }

    this.RowData.push(object);
    this.AgLoad = true;
  }

  //To create the States Form Controls.
  ResetForm() {
    this.InventoryTransferDetailForm.patchValue({
      ID: '',
      Cost: 0,
      TransferID: '-1',
      RequestedQty: '',
      Product: '-1',
      ShippedQty: '',
      PurchaseUOM: '-1',
      ReceivedQty: '',

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

  AddEditChanges(saveAction) {
    const unique = new Set();
    const counter = this.RowData.some(element => unique.size === unique.add(element.productID).size)
    if (counter) {
      this.toastr.warning('Duplicate product name');
      return;
    }
    debugger;
    let indexx = this.RowData.findIndex(c => c.productID == '-1');
    if (indexx >= 0) {
      this.toastr.warning('Please select product name');
      return;
    }
    let index = this.RowData.findIndex(c => c.uom == '-1');
    if (index >= 0) {
      this.toastr.warning('Please select UOM');
      return;
    }
    console.log(this.RowData);
    this.submitted = true;
    this.inventorydetailService.addInventoryTransferDetails(this.RowData).subscribe((resp: any) => {
      if (!resp.isSuccess) {
        this.Isvalid = false
        this.toastr.warning(resp.message);
      } else {
        this.Isvalid = true;
        /*  if (i == '1') {
           this.toastr.success('Transfer details saved successfully');
         } */
        this.OnSaveTransfer.emit(saveAction);
        if (saveAction == 'Close') {
          this.OnTransferCancel.emit();
        }
        this.BindInventoryTransferDetail();
        if (this.CurrentStatus == 'Shipped') {
          this.enablebtn = true;
        }
      }
      this.submitted = false;
      //this.RowData = resp.data.inventoryadjustmentdetail;

      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onUomChangenew(value, i) {

    console.log(value)
    /*  let index2 = this.InventoryUnitOfMeasure.findIndex(c => c.uomidFrom == value);
     if (index2 >= 0 && this.RowData[i].requestedQty_text > 0) { 
      this.RowData[i].unitRequestedQty=  parseInt(this.InventoryUnitOfMeasure[index2].conversionRatio)*parseInt(this.RowData[i].requestedQty_text )
     } else {
       this.RowData[i].unitRequestedQty = 0;
     } */
    this.OnrequestChangenew(i);
  }
  OnrequestChangenew(i) {
    debugger;
    let uomval = this.RowData[i].uom;
    let index2 = this.InventoryUnitOfMeasure.findIndex(c => c.id == uomval);
    if (index2 >= 0 && this.RowData[i].requestedQty_text > 0) {
      let conversionRatio = this.InventoryUnitOfMeasure[index2].conversionRatio;
      let requestedQty_text = this.RowData[i].requestedQty_text
      this.RowData[i].unitRequestedQty = parseInt(conversionRatio) * parseInt(requestedQty_text)
    } else {
      this.RowData[i].unitRequestedQty = 0;
    }

  }
  BindInventoryUOMConversions(InventoryID, uom, i) {

    this.InventoryUnitOfMeasure = [];
    this.syscommonservice.getUOMConvertionsByInventryID(InventoryID).subscribe((resp: any) => {
      this.InventoryUnitOfMeasure = resp.data.inventoryunitofmeasure;
      this.RowData[i].uomlist = this.InventoryUnitOfMeasure;
      this.onUomChangenew(uom, i);
      console.log(this.InventoryUnitOfMeasure);
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onProductChange(id, i) {
    debugger;
    this.AgLoad = false;
    let index = this.inventoryList.findIndex(c => c.id == id);
    this.RowData[i].productID = id;
    if (index >= 0) {
      this.RowData[i].uom = this.inventoryList[index].unitOfMeasureID;
      this.RowData[i].uomName = this.inventoryList[index].uomName;
      this.RowData[i].serialisedProduct = this.inventoryList[index].serialisedProduct;
      this.RowData[i].productStyleMatrixEnabled = this.inventoryList[index].productStyleMatrixEnabled;

      this.RowData[i].cost = this.inventoryList[index].inventoryDefaultCost;
      this.RowData[i].cost_text = this.inventoryList[index].inventoryDefaultCost;
      this.BindInventoryUOMConversions(this.RowData[i].productID, this.RowData[i].uom, i);
    }
    this.AgLoad = true;
  }
  UpdateStatus() {
    debugger;
    const unique = new Set();
    const counter = this.RowData.some(element => unique.size === unique.add(element.productID).size)
    if (counter) {
      this.toastr.warning('Duplicate product name');
      return;
    }
    let index = this.RowData.findIndex(c => c.uom == '-1');
    if (index >= 0) {
      this.toastr.warning('Please select UOM');
      return;
    }
    console.log(this.RowData);
    this.inventorydetailService.updateInventoryTransferDetailStatus(this.RowData).subscribe((resp: any) => {
      if (!resp.isSuccess) {
        this.Isvalid = false
        debugger;
        this.toastr.warning(resp.message);
      } else {
        if (this.statusButton == 'Submit') {
          this.CurrentStatus = 'Requested';
        } else if (this.statusButton == 'Shipped') {
          this.CurrentStatus = 'Shipped';
          this.enablebtn = false;
        }
        else if (this.statusButton == 'Receive') {
        }
        this.Isvalid = true;
        // this.toastr.success('Transfer details saved successfully');
        let index = this.RowData.findIndex(x => x.shippedQty_text > (parseInt(x.receivedQty_text, 0) + parseInt(x.previouslyReceviedQty, 0)))

        if (index < 0) {
          this.invStatusService.PartialStatus = false;
          this.CurrentStatus = 'Received';
        } else {
          this.invStatusService.PartialStatus = true;
          this.CurrentStatus = 'PartiallyReceived';
        }
        this.OnStatusChanged.emit();

        this.checkStatus(this.invStatusService.status);
        this.BindInventoryTransferDetail();
        debugger;
        if (this.statusButton == "Receive") {
          if (this.Automaticallyreceivetransferwhenshipped == "y" || this.Automaticallyreceivetransferwhenshipped == "Y") {
            // this.UpdateStatus();
          }
        }


      }

      //this.RowData = resp.data.inventoryadjustmentdetail;

      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });

  }
  ChangeStatus() {
    if (this.statusButton == 'Submit') {
      this.CurrentStatus = 'Requested';
    } else if (this.statusButton == 'Shipped') {
      this.CurrentStatus = 'Shipped';
    }
    else if (this.statusButton == 'Receive') {

    }
    this.AddEditChanges('Save');
    let index = this.RowData.findIndex(x => x.shippedQty_text > x.receivedQty_text)

    if (index < 0) {
      this.invStatusService.PartialStatus = false;
      this.CurrentStatus = 'Received';
    } else {
      this.invStatusService.PartialStatus = true;
      this.CurrentStatus = 'PartiallyReceived';
    }
    this.OnStatusChanged.emit();

    this.checkStatus(this.invStatusService.status);
  }

  checkStatus(status) {
    //this.submitBtnClicked = true;
    this.isReqQtyReadOnly = true;
    this.isShipQtyReadOnly = true;
    this.isRecQtyReadOnly = true;
    if (this.CurrentStatus == LBS_INV_InventoryTransferStatus.New) {
      this.statusButton = "Submit";
      this.isReqQtyReadOnly = false;
    } else if (status == LBS_INV_InventoryTransferStatus.Requested) {
      this.isShipQtyReadOnly = false;
      this.statusButton = "Shipped";
    }
    else if (status == LBS_INV_InventoryTransferStatus.Shipped) {
      this.isRecQtyReadOnly = false;
      this.statusButton = "Receive";
      this.enablebtn = true;
    }
    else if (status == LBS_INV_InventoryTransferStatus.Partially) {

      this.isRecQtyReadOnly = false;
      this.statusButton = "Receive";
    }
    else if (status == LBS_INV_InventoryTransferStatus.Received) {
      this.statusButton = "Receive";
    }
  }

  // Serialise Detail,Serialise Detail Out ,Matrix Detail
  SerialiseDetailOut(serialise: TemplateRef<any>, i) {
    this.BindpopupData(i);
    // this.SelectedProductID= this.RowData[i].productID;
    // this.SelectedTransferDetail_ID= this.RowData[i].id;
    // this.SelectedQuantity= this.RowData[i].quantity;
    // this.productName =this.RowData[i].productName;
    this.modalRef = this.modalService.show(serialise);
  }

  SerialiseDetailIn(serialise: TemplateRef<any>, i) {
    this.BindpopupData(i);
    // this.SelectedProductID= this.RowData[i].productID;
    // this.SelectedTransferDetail_ID= this.RowData[i].id;
    // this.SelectedQuantity= this.RowData[i].quantity;
    // this.productName =this.RowData[i].productName;
    this.modalRef = this.modalService.show(serialise);
  }
  ProductMatrix(matrix: TemplateRef<any>, i) {
    debugger;
    this.BindpopupData(i);
    // this.SelectedProductID= this.RowData[i].productID;
    // this.SelectedTransferDetail_ID= this.RowData[i].id;

    // this.SelectedQuantity= this.RowData[i].quantity;
    // this.productName =this.RowData[i].productName;
    this.modalRef = this.modalService.show(matrix);
  }

  BindpopupData(i) {
    this.SelectedProductID = this.RowData[i].productID;
    this.SelectedTransferDetail_ID = this.RowData[i].id;
    let quantity = 0;
    if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.New) {
      quantity = this.RowData[i].requestedQty_text;
    } else if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.Requested) {
      quantity = this.RowData[i].receivedQty_text;
    } else if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.Shipped) {
      quantity = this.RowData[i].shippedQty_text;
    }
    this.SelectedQuantity = quantity;
    let index = this.inventoryList.findIndex(c => c.id == this.RowData[i].productID);

    if (index >= 0) {
      this.productName = this.inventoryList[index].productCode + ' - ' + this.inventoryList[index].productName;
    } else {
      this.productName = this.RowData[i].productName;
    }
    //+'-'+this.RowData[i].productCode;
    this.RequestedQuantity = this.RowData[i].requestedQty_text;
  }

  Closenote() {
    this.modalRef.hide();
    this.BindInventoryTransferDetail();
  }
  Deleteindex(i) {
    this.RowData.splice(i, 1);
  }
  PartiallyReceiveCloseBtn(commnetPopupForPR: TemplateRef<any>) {
    this.modalRef = this.modalService.show(commnetPopupForPR);
  }
  onReceivedQtyChange(qty, i) {
    // if(this.RowData[i].shippedQty > qty){

    // }
    if (parseInt(this.RowData[i].shippedQty_text) < (parseInt(this.RowData[i].receivedQty_text) + parseInt(this.RowData[i].previouslyReceviedQty))) {
      this.toastr.warning('Received Quantity is greater than Shipped Quantity');
    }
  }
  completeTransfer() {
    this.invStatusService.comment = this.comment;
    this.invStatusService.PartialStatus = false;
    this.OnStatusChanged.emit();
    this.checkStatus(this.invStatusService.status);
    this.Closenote();
  }
  AllConfigurationByModuleID() {
    this.configuration.getAllConfigurationByModuleID("INV").subscribe((resp: any) => {
      var Data = resp.data.configurationbyIds.filter(o => o.flag == "Flag4");
      this.Automaticallyreceivetransferwhenshipped = Data[0].value;

    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}
