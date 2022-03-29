import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RequisitionService } from 'src/app/inv/services/requisition.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { WarehouseService } from 'src/app/inv/services/warehouse.service';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { InventoryService } from 'src/app/inv/services/inventory.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InternalTransfersService } from '../services/internal-transfers.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CustomValidators } from 'ngx-custom-validators';
import { LBSPURInternalTransfers } from 'src/app/models/pur/lbs-pur-internal-transfers';
import { PurCommonService } from '../services/pur-common.service';
import { TemplateRef } from '@angular/core/src/linker/template_ref';

@Component({
  selector: 'app-initiate-internal-transfers',
  templateUrl: './initiate-internal-transfers.component.html',
  styleUrls: ['./initiate-internal-transfers.component.css']
})
export class InitiateInternalTransfersComponent implements OnInit {
  Mode: any = 'List';
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  InternalTransferForm: FormGroup;
  Requisitions: any;
  CompanyID = localStorage.getItem('CompanyID');
  AgLoad: boolean = false
  ColumnDefs;
  RowData;
  PageSize: any;
  Currentpage: string;
  InternalTransfers: any;
  SubMode: any;
  modalRef: BsModalRef;
  BatchID: any;
  ProductID: any;

  constructor(private Requisitionservice: RequisitionService,
    private deleteRecordsService: DeleteRecordsService,
    private WareHouseService: WarehouseService,
    private commonService: InvCommonService,
    private inventoryService: InventoryService,
    private cryptoAes: CryptoAes,
    private purCommonService: PurCommonService,
    private TransferService: InternalTransfersService,
    private FB: FormBuilder,
    private toastr: ToastrService,
    public modalService: BsModalService) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Mode = "List";
    this.PageSize = "50";
    this.Currentpage = "0";
    this.CreateForm();
    this.AgGridColumns();
    this.SetPermissions();
    this.BindInternalTransfers();
  }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "304");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.InternalTransferForm.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InternalTransferForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InternalTransferForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  CreateForm() {
    //created warehousenumber forms
    this.InternalTransferForm = this.FB.group({
      ID: [''],
      CompanyID: ['-1'],
      InternalTransferBatchNumber: [''],
      RequisitionID: ['-1', CustomValidators.notEqual('-1')],
      ProductID: ['-1', CustomValidators.notEqual('-1')],
      RequestedQuantity: [''],
      WareHouseID: ['-1'],
      AvailableQuantity: [''],
      TransferQuantity: ['0.00'],
      TransferNo: [''],
    });
  }

  AddBatch() {
    this.Mode = 'AddBatch';
    this.SubMode = 'SelectReq';
    // this.BindRequisitions();
    this.getPurchaseRequisition();
  }
  RequisitionList: any;
  getPurchaseRequisition() {
    this.RequisitionList = [];
    this.TransferService.getPurchaseRequisitionNumbers().subscribe((resp: any) => {
      console.log(resp);
      this.RequisitionList = resp.data.purchaseRequisitions;
      //  return options;
    }, (error) => {
      //this.Loading = false;
      // this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
      //return options;
    });
  }
  Back() {
    this.BindInternalTransfers();
    this.Mode = 'List';
  }
  BindRequisitions() {
    debugger;
    this.TransferService.getRequisitionDetailsByCompanyID(this.CompanyID).subscribe((resp: any) => {
      console.log(resp.data.internaltransfer);
      this.Requisitions = resp.data.internaltransfer;

    }, (error) => {
      this.toastr.error(error);
      //   console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  IsAllSelected;
  checkAll(event, Status) {
    let b: boolean;
    if (this.IsAllSelected) {
      b = true;
    } else {
      b = false;
    }
    for (let i = 0; i <= this.Requisitions.length - 1; i++) {
      // if (this.RowData[i].requisitionLineStatus != 'Approved' || Status == 'New') {
      this.Requisitions[i].isSelect = b;
      this.Requisitions[i].createdBY = localStorage.getItem('LoginID');
      //}
    }
  }
  IsAllRequisitionSelected;
  checkAllRequisitions(event, Status) {
    let b: boolean;
    if (this.IsAllRequisitionSelected) {
      b = true;
    } else {
      b = false;
    }
    for (let i = 0; i <= this.RequisitionList.length - 1; i++) {
      // if (this.RowData[i].requisitionLineStatus != 'Approved' || Status == 'New') {
      this.RequisitionList[i].isSelect = b;
      //}
    }
  }


  InternalTransfer: any;
  BindInternalTransfers() {
    this.AgLoad = false;
    this.TransferService.getInternalTransfer().subscribe((resp: any) => {
      this.RowData = resp.data.internalTransferDetails;
      console.log(this.RowData);
      this.Mode = "List";
      this.AgLoad = true;
    }, (error) => {
      // this.toastr.error(error);
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'BatchNumber', field: 'internalTransferBatchNumber', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Batch Status', field: 'batchStatusText', type: 'DeleteStatus' },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    ];
  }
  onSearchChange(transferQty, i): void {
    debugger;
    // if (!searchValue) {
    //   this.Requisitions[i].transferQuantity = 0;
    // } else if (Number(this.Requisitions[i].availableQuantity) < Number(this.Requisitions[i].transferQuantity)) {
    //   this.toastr.warning("Transfer quantity cannot be greater than Available quantity");
    //   this.Requisitions[i].transferQuantity = 0;
    // } else {
    //   this.Requisitions[i].transferQuantity = Number(searchValue);
    // }
    if (!transferQty) {
      this.Requisitions[i].transferQuantity = 0;
    } else if (Number(transferQty) > Number(this.Requisitions[i].availableQuantity)) {
      this.toastr.warning("Transfer quantity cannot be greater than Available quantity!");
      this.Requisitions[i].transferQuantity = 0;
    } else if (Number(transferQty) > Number(this.Requisitions[i].requestedQuantity)) {
      this.toastr.warning("Transfer quantity cannot be greater than Requested quantity!");
      this.Requisitions[i].transferQuantity = 0;
    }
    else {
      this.Requisitions[i].transferQuantity = Number(transferQty);
    }
  }
  onOptionSelected(i, val) {
    console.log(val);
    this.Requisitions[i].createdBY = localStorage.getItem('LoginID');
  }
  SaveChanges() {
    this.TransferService.updateInventoryPURInternalTransfersList(this.Requisitions).subscribe((resp: any) => {
      console.log(resp.data);
      this.toastr.success('Internal transfers added successfully')
      this.BindInternalTransfers();
    }, (error) => {
      this.toastr.error(error);
      //   console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.SelectedBatchStstus = event.data.batchStatusText;
      this.Edit(event.data.internalTransferBatchNumber)
    } else if (colId == 'Delete') {
      this.TransferService.getInternalTransferByBatchNumber(event.data.internalTransferBatchNumber).subscribe((resp: any) => {
        this.InternalTransfers = resp.data.internalTransfer;
        if (this.InternalTransfers) {
          this.InternalTransfers.forEach(obj => {
            this.OnDelete(obj.id);
          });
        }
        
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
      
    }
  }
  SelectedBatchNumber: string;
  SelectedBatchStstus: string;
  Edit(BatchNumber): void {
    this.SelectedBatchNumber = BatchNumber;
    this.BindInternalTransferbyID(BatchNumber);
  }
  OnDelete(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_PUR_InternalTransfers', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.toastr.success('Currency  details deleted successfully');
      this.BindInternalTransfers();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  AgLoadTransfer: boolean;
  BindInternalTransferbyID(BatchNumber) {
    this.AgLoadTransfer = false;
    this.TransferService.getInternalTransferByBatchNumber(BatchNumber).subscribe((resp: any) => {
      this.InternalTransfers = resp.data.internalTransfer;
      this.AgLoadTransfer = true;
      console.log(this.InternalTransfers);
      this.Mode = 'Edit';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  UpdateChanges() {
    this.TransferService.updateInventoryPURInternalTransfersList(this.InternalTransfers).subscribe((resp: any) => {
      console.log(resp.data);
      this.BindInternalTransfers();
      this.toastr.success('Internal transfers updated successfully')
    }, (error) => {
      this.toastr.error(error);
      //   console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  Changestatus() {
    this.TransferService.initiateTransfer(this.SelectedBatchNumber, localStorage.getItem('LoginID'), this.CompanyID).subscribe((resp: any) => {
      console.log(resp.data);
      if (resp.isSuccess == true) {
        console.log(resp.data)
        this.BindInternalTransfers();
        this.toastr.success('Internal transfers updated successfully')
      }
      else {
        this.toastr.warning('Transfer quantity should be equal to detailed transfer quantity')
      }

    }, (error) => {
      this.toastr.error(error);
      //   console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


  SearchReq() {
    console.log(this.RequisitionList);
    this.TransferService.RequistionDetailList(this.RequisitionList).subscribe((resp: any) => {
      console.log(resp.data);
      this.Requisitions = resp.data.id;
      this.SubMode = 'Select2';
    }, (error) => {
      this.toastr.error(error);
      //   console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  PopupDetail(serialise: TemplateRef<any>, i) {
    this.ProductID = this.InternalTransfers[i].productID;
    this.BatchID = this.InternalTransfers[i].id;
    /* this.BatchID = this.RowData[i].productID;
    this.SelectedAdjustmentDetail_ID = this.RowData[i].id;
    this.SelectedQuantity = this.RowData[i].convertedQuantity_text;
    this.productName = this.RowData[i].productName; */
    this.modalRef = this.modalService.show(serialise);
  }
  Closenote() {
    this.BindInternalTransferbyID(this.SelectedBatchNumber);
    this.modalRef.hide();
  }
}
