import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LBSPURInternalTransfers } from 'src/app/models/pur/lbs-pur-internal-transfers';
import { InternalTransfersService } from '../services/internal-transfers.service';
import { InventoryService } from 'src/app/inv/services/inventory.service';
import { WarehouseService } from 'src/app/inv/services/warehouse.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { RequisitionService } from 'src/app/inv/services/requisition.service';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-internal-transfers',
  templateUrl: './internal-transfers.component.html',
  styleUrls: ['./internal-transfers.component.css']
})
export class InternalTransfersComponent implements OnInit {
  InternalTransferForm: FormGroup;
  Loading: any = false;
  Mode: any = 'List';
  submitted: boolean;
  CompanyID = localStorage.getItem('CompanyID');
  InternalTransfer: any[] = [];
  BindInventory: any[] = [];
  WareHouse: any[] = [];
  Requisitions: any[] = [];
  modalRef: BsModalRef;
  //Permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  //Ag-grid
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  IsActive: boolean;
  SelectedinternaltransferID:any;
  AccessTab: string;
  PageSize: any;
  Currentpage: string;
  constructor(
    private Requisitionservice: RequisitionService,
    private deleteRecordsService: DeleteRecordsService,
    private WareHouseService: WarehouseService,
    private commonService: InvCommonService,
    private inventoryService: InventoryService,
    private cryptoAes: CryptoAes,
    private TransferService: InternalTransfersService,
    private FB: FormBuilder,
    private toastr: ToastrService,
    public modalService: BsModalService
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.AccessTab='Transfer';
    this.Mode = "List";
    this.CreateForm();
    this.AgGridColumns();
    this.SetPermissions();
    this.BindInternalTransfers();
    this.BindWareHouse();
    this.BindRequisitions();
    this.BindInventories();
    this.PageSize = "50";
    this.Currentpage = "0";
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
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  CreateForm() {
    //created warehousenumber forms
    this.InternalTransferForm = this.FB.group({
      ID: [''],
      CompanyID: ['-1'],
      InternalTransferBatchNumber: [''],
      RequisitionID: ['-1', CustomValidators.notEqual('-1')],
      ProductID: ['-1', CustomValidators.notEqual('-1')],
      RequestedQuantity: ['0.00'],
      WareHouseID: ['-1'],
      AvailableQuantity: ['0.00'],
      TransferQuantity: ['0.00'],
      TransferNo: [''],
    });
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'BatchNumber', field: 'internalTransferBatchNumber', sortable: true, filter: true, checkboxSelection: false },
      // { headerName: 'RequisitionID', field: 'requestedQuantity: ', sortable: true, filter: true },
      { headerName: 'Product Name', field: 'productName', sortable: true, filter: true },
      { headerName: 'WareHouse Name', field: 'wareHouseName', sortable: true, filter: true },
      { headerName: 'Requested Quantity', field: 'requestedQuantity', sortable: true, filter: true },
      { headerName: 'Transfer No', field: 'transferNo', sortable: true, filter: true },
      { headerName: 'Available Quantity', field: 'availableQuantity', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    ];
  }
  get f() { return this.InternalTransferForm.controls; }
  //Resetting the form after Add/Edit
  ResetForm() {
    this.InternalTransferForm.patchValue({
      ID: '',
      CompanyID: '-1',
      InternalTransferBatchNumber: '',
      RequisitionID: '-1',
      ProductID: '-1',
      WareHouseID: '-1',
      AvailableQuantity: '0.00',
      TransferQuantity: '0.00',
      TransferNo: ''

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
  /* FOR Aggird End  */

  //add for internal-transfer
  AddNew(): void {
    this.Mode = 'Add';
    this.IsActive = true;
    this.InternalTransferForm.enable();
  }
  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.Mode = "List";
  }

  //To bind the data of all warehouse to the Grid.
  BindWareHouse() {
    this.Loading = true;
    this.commonService.getWareHouse().subscribe((resp: any) => {
      this.WareHouse = resp.data.warehouse;
      console.log(this.WareHouse);
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindRequisitions() {
    this.Loading = true;
    this.Requisitionservice.getrequisitions().subscribe((resp: any) => {
      console.log(resp.data.requisitions);
      this.Requisitions = resp.data.requisitions;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      //   console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindInventories() {
    this.Loading = true;
    this.commonService.getInventory().subscribe((resp: any) => {
      console.log(resp.data.inventory);
      this.BindInventory = resp.data.productkits;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the data of all price-group to the Grid.
  BindInternalTransfers() {
    // this.Loading = true;
    this.AgLoad = false;
    this.TransferService.getInternalTransfer().subscribe((resp: any) => {
      this.InternalTransfer = resp.data.internalTransferDetails;
      this.RowData = resp.data.internalTransferDetails;
      console.log(this.InternalTransfer.findIndex(a => !a.id == a.requisitionID));
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {

      this.Loading = false;
      //  this.toastr.error(error);
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To save the price-group details to database table by calling the API service
  onSaveold(saveAction) {
    debugger;
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    this.submitted = true;
    if (this.InternalTransferForm.invalid) {
      return;
    }
    this.Loading = true;
    let Transfer = new LBSPURInternalTransfers();
    Transfer.CompanyID = this.CompanyID;
    Transfer.InternalTransferBatchNumber = this.InternalTransferForm.get('InternalTransferBatchNumber').value;
    Transfer.RequisitionID = this.InternalTransferForm.get('RequisitionID').value;
    Transfer.ProductID = this.InternalTransferForm.get('ProductID').value;
    Transfer.RequestedQuantity = this.InternalTransferForm.get('RequestedQuantity').value;
    Transfer.WareHouseID = this.InternalTransferForm.get('WareHouseID').value;
    Transfer.AvailableQuantity = this.InternalTransferForm.get('AvailableQuantity').value;
    Transfer.TransferQuantity = this.InternalTransferForm.get('TransferQuantity').value;
    Transfer.TransferNo = this.InternalTransferForm.get('TransferNo').value;
    Transfer.CreatedBY = localStorage.getItem('LoginID');
    //If the mode Add will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.TransferService.addInternalTransfer(Transfer).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Internal Transfer details added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindInternalTransfers();
            this.Mode = 'List';
            this.ResetForm();
          }
          else {
            this.Mode = 'Edit';
            this.Edit(resp.data.id);
            this.BindInternalTransfers();
          }
          // this.ResetForm();
          // this.BindInternalTransfers();
          // this.Mode = 'List';
          this.Loading = false;
        }
        else {
          this.toastr.error(resp.message);
        }
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      Transfer.ID = this.InternalTransferForm.get('ID').value;
      this.TransferService.updateInternalTransfer(Transfer).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Internal Transfer  details updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindInternalTransfers();
            this.Mode = 'List';
            this.ResetForm();
          }
          else {
            let ID = this.InternalTransferForm.get('ID').value;
             this.Edit(ID);
          }
          // this.ResetForm();
          // this.BindInternalTransfers();
          // this.Mode = 'List';
        }
        else {
          this.toastr.error(resp.message);
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.AgEdit(event.data)
      this.SelectedinternaltransferID=event.data.id;
    } else if (colId == 'Delete') {
      this.OnDelete(event.data.id)
    }
  }
  //edit operation
  AgEdit(event) {
    // this.SelectedRequisitionID=event.id;
    console.log(event);
    this.InternalTransferForm.patchValue({
      ID: event.id,
      CompanyID: event.companyID,
      InternalTransferBatchNumber: event.internalTransferBatchNumber,
      RequisitionID: event.requisitionID,
      ProductID: event.productID,
      RequestedQuantity: event.requestedQuantity.indexOf(".")!==-1?event.requestedQuantity:event.requestedQuantity+".00",
      WareHouseID: event.wareHouseID,
      AvailableQuantity: event.availableQuantity.indexOf(".")!==-1?event.availableQuantity:event.availableQuantity+".00",
      TransferQuantity: event.transferQuantity.indexOf(".")!==-1?event.transferQuantity:event.transferQuantity+".00",
      TransferNo: event.transferNo
    });
    this.Mode = "Edit";
    if (event.deleteStatus == 'Active') {
      this.InternalTransferForm.enable();
      this.IsActive = true;
    } else {
      this.InternalTransferForm.disable();
      this.IsActive = false;
    }
  }
  Edit(ID): void {
    this.BindInternalTransferbyID(ID);
    this.Mode = 'Edit';
  }

  BindInternalTransferbyID(ID) {
    this.SelectedinternaltransferID=ID;
    this.TransferService.getInternalTransferByID(ID).subscribe((resp: any) => {
      let measure: any = new LBSPURInternalTransfers();
      measure = resp.data.requisitiondetail;
      this.InternalTransferForm.patchValue({
        ID: measure.id,
        CompanyID: measure.companyID,
        InternalTransferBatchNumber: measure.internalTransferBatchNumber,
        RequisitionID: measure.requisitionID,
        ProductID: measure.productID,
        RequestedQuantity: measure.requestedQuantity.indexOf(".")!==-1?measure.requestedQuantity:measure.requestedQuantity+".00",
        WareHouseID: measure.wareHouseID,
        AvailableQuantity: measure.availableQuantity.indexOf(".")!==-1?measure.availableQuantity:measure.availableQuantity+".00",
        TransferQuantity: measure.transferQuantity.indexOf(".") !== -1 ? measure.transferQuantity : measure.transferQuantity +".00",
        TransferNo: measure.transferNo
      });

      this.Mode = 'Edit';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  OnDelete(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_PUR_InternalTransfers', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.toastr.success('Currency  details deleted successfully');
      this.BindInternalTransfers();
      this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
