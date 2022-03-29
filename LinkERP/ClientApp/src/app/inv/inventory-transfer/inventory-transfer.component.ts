import { Component, OnInit, ViewChild } from '@angular/core';
import { PurchaseTemplateService } from '../services/purchase-template.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ngx-custom-validators';
import { InventoryTransferService } from '../services/inventory-transfer.service';
import { UserService } from 'src/app/sys/services/user.service';
import { LBSINVInventoryTransfer } from 'src/app/models/inv/lbs-inv-inventory-transfer';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InvCommonService } from '../services/inv-common.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { LBS_INV_InventoryTransferStatus } from 'src/app/models/inv/lbs_inv-inventory-transfer-status';
import { InventoryTransferStatusService } from './inventory-transfer-status.service';
import { DatePipe, formatDate } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { date } from 'ngx-custom-validators/src/app/date/validator';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inventory-transfer',
  templateUrl: './inventory-transfer.component.html',
  styleUrls: ['./inventory-transfer.component.css']
})
export class InventoryTransferComponent implements OnInit {
  WareHouse: any;
  Mode: any = 'List';
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  InventoryTransferForm: FormGroup;
  CompanyID = localStorage.getItem('CompanyID');
  WareHouseFromID;
  WareHouseToID;
  inventoryTransfer: any;
  read: boolean;
  Users: any;
  submitted: boolean;
  SelectedTransferID: any;
  AccessTab: string;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  Status: any;
  statusChanged: boolean = false;
  WareHouseFrom: any;
  WareHouseTo: any;
  UsersShippedBy: any;
  UsersShippedTo: any;
  UsersReceivedBy: any;
  toadyDate: Date;
  modalRef: BsModalRef;
  CurrentStatus: any;
  HeaderNames: any;
  PageSize: any;
  IsActive: boolean = true;
  Currentpage: string;
  invtransferrouter: any;
  enableButton: boolean = false;
  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    private commonService: InvCommonService,
    private sysCommonService: SysCommonService,
    private deleteRecordsService: DeleteRecordsService,
    private inventoryTransferService: InventoryTransferService,
    private userService: UserService, private invStatusService: InventoryTransferStatusService,
    public modalService: BsModalService,
    private sharedFormatterService: SharedFormatterService, private route: ActivatedRoute, public datepipe: DatePipe
  ) { this.invtransferrouter = this.route.snapshot.paramMap.get("id"); }

  ngOnInit() {
    this.toadyDate = new Date();
    this.AgLoad = false;
    this.IsActive = true;
    this.Mode = "List";
    this.HeaderNames = 'Transfers';
    this.InventoryTransferForm = this.FB.group({
      ID: [''],
      TransferNo: [''],
      WareHouseFrom: ['-1', CustomValidators.notEqual('-1')],
      WareHouseTo: ['-1', CustomValidators.notEqual('-1')],
      TransferReason: ['', Validators.required],
      ReceivedBy: [''],
      ShippedBy: [''],
      DateReceived: [new Date()],
      DateShipped: [new Date()]
    })
    this.AccessTab = "Transfer";
    this.SetPermissions();
    this.ColumnDefs = [
      { headerName: 'Transfer No', field: 'transferNo', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Transfer Reason', field: 'transferReason', sortable: true, filter: true },
      { headerName: 'WareHouse From', field: 'wareHouseFromName', sortable: true, filter: true },
      { headerName: 'WareHouse To', field: 'wareHouseToName', sortable: true, filter: true },
      { headerName: 'Shipped Date', field: 'dateShipped', sortable: true, filter: true, width: 150 },
      { headerName: 'Received Date', field: 'dateReceived', sortable: true, filter: true, width: 150 },
      { headerName: 'Transfer Status', field: 'status', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: !this.write_Access },
      { headerName: '', field: 'Delete', type: 'DeleteActionTransfer', hide: !this.delete_Access }
    ];
    this.Currentpage = "0";
    this.PageSize = "50";
    this.BindInventoryTransfer();
    this.BindWareHouse();
    // this.BindUsers();
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
      this.InventoryTransferForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryTransferForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryTransferForm.disable();
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
  get f() { return this.InventoryTransferForm.controls; }

  //To bind the data of all warehouse to the Grid.
  BindWareHouse() {
    // this.Loading = true;
    //  //bug #654 this.commonService.getWareHouse().subscribe((resp: any) => {
    this.commonService.getWareHouseByRole().subscribe((resp: any) => {
      this.WareHouseFrom = resp.data.warehouse;
      this.WareHouse = resp.data.warehouse;
      this.WareHouseTo = resp.data.warehouse;
      // this.Loading = false;
    }, (error) => {

      // this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


  BindInventoryTransfer() {
    debugger;
    this.AgLoad = false;
    this.inventoryTransferService.GetInventoryTransfer().subscribe((resp: any) => {
      this.inventoryTransfer = resp.data.inventoryTransfer;
      this.RowData = resp.data.inventoryTransfer;
      for (let i = 0; i < this.RowData.length; i++) {
        resp.data.inventoryTransfer[i].dateShipped = resp.data.inventoryTransfer[i].dateShipped == null ? '' : this.datepipe.transform(resp.data.inventoryTransfer[i].dateShipped, 'dd/MM/yyyy hh:mm a');
        resp.data.inventoryTransfer[i].dateReceived = resp.data.inventoryTransfer[i].dateReceived == null ? '' : this.datepipe.transform(resp.data.inventoryTransfer[i].dateReceived, 'dd/MM/yyyy hh:mm a');
      }
      if (this.invtransferrouter) {
        let data = this.RowData.filter(r => r.transferNo == this.invtransferrouter);
        this.SelectedTransferID = data[0].id;
        this.Edit(data[0].id);
      }
      this.AgLoad = true;
      // this.Loading = false;
    }, (error) => {

      // this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });

  }

  BindUsers() {
    // this.Loading = true;
    this.sysCommonService.getUser().subscribe((resp: any) => {
      console.log(resp);
      this.Users = resp.data.users;
      this.UsersShippedBy = resp.data.users;
      this.UsersReceivedBy = resp.data.users;
      //this.Loading = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //Add new InventoryTransfer
  AddNew(): void {
    this.invStatusService.status = "New";
    this.CurrentStatus = "New";
    this.ResetForm();
    this.Mode = 'Add';
    this.read = true;
    this.IsActive = true;
    this.InventoryTransferForm.enable();
  }

  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.submitted = false;
    this.BindInventoryTransfer();
    this.Mode = "List";
  }



  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.read = false;

      this.invStatusService.status = event.data.status;
      if (event.data.status == 'Completed') {
        this.InventoryTransferForm.get('TransferReason').disable();
      }
      this.SelectedTransferID = event.data.id;
      this.Edit(event.data.id);
      //this.Mode = 'Edit';
      if (event.data.deleteStatus == 'Active') {
        this.InventoryTransferForm.enable();
        this.IsActive = true;
      } else {
        this.InventoryTransferForm.disable();
        this.IsActive = false;
      }
      //this.BindDetails(event.data)
    } else if (colId == 'Delete') {
      this.DeleteInventoryTransfer(event.data.id)
    }
  }
  //To bind the data of States to the controls to edit/update.
  Edit(ID): void {

    this.BindInventoryTransferByID(ID);

  }

  BindInventoryTransferByID(ID) {
    this.inventoryTransferService.getInventoryTransferByID(ID).subscribe((resp: any) => {
      console.log(resp);
      if (resp.isSuccess == true) {
        this.WareHouseFromID = resp.data.inventoryTransfer.wareHouseFrom;
        this.WareHouseToID = resp.data.inventoryTransfer.wareHouseTo;
        let transfers: any = new LBSINVInventoryTransfer();
        transfers = resp.data.inventoryTransfer;
        transfers.DateShipped = transfers.dateShipped == null ? new Date() : transfers.dateShipped;
        transfers.DateReceived = transfers.dateReceived == null ? new Date() : transfers.dateReceived;
        //alert(transfers.DateShipped);
        //alert(transfers.DateReceived);
        this.invStatusService.status = transfers.status;
        this.CurrentStatus = transfers.status;
        this.InventoryTransferForm.patchValue({
          ID: transfers.id,
          TransferNo: transfers.transferNo,
          TransferReason: transfers.transferReason,
          WareHouseFrom: transfers.wareHouseFrom,
          WareHouseTo: transfers.wareHouseTo,
          // ReceivedBy:transfers.ReceivedBy
          ReceivedBy: transfers.receivedBy,
          ShippedBy: transfers.shippedBy,
          DateShipped: transfers.dateShipped,
          DateReceived: transfers.dateReceived == null ? new Date() : transfers.dateReceived
        });
        if (this.invStatusService.status != 'New') {
          this.InventoryTransferForm.get('TransferReason').disable();
        } else {
          this.InventoryTransferForm.get('TransferReason').enable();
        }
        //
        this.InventoryTransferForm.get('WareHouseFrom').disable();
        this.InventoryTransferForm.get('WareHouseTo').disable();
        // this.InventoryTransferForm.get('TransferReason').enable();
        this.Mode = 'Edit';
        // this.InventoryTransferForm.get('ShippedBy').disable();
        // this.InventoryTransferForm.get('ReceivedBy').disable();

        // if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.Requested) {
        //   this.InventoryTransferForm.get('DateShipped').enable();
        //   this.InventoryTransferForm.get('DateReceived').disable();
        // } else if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.Shipped) {
        //   this.InventoryTransferForm.get('DateReceived').enable();
        //   this.InventoryTransferForm.get('DateShipped').disable();
        // } else if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.New || this.invStatusService.status == LBS_INV_InventoryTransferStatus.Received || this.invStatusService.status == LBS_INV_InventoryTransferStatus.Partially) {
        //   this.InventoryTransferForm.get('DateReceived').disable();
        //   this.InventoryTransferForm.get('DateShipped').disable();
        // }
      }
    });
    (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    }
  }


  //To create the States Form Controls.
  ResetForm() {
    this.InventoryTransferForm.patchValue({
      ID: '',
      TransferReason: '',
      TransferNo: '',
      WareHouseFrom: '-1',
      WareHouseTo: '-1',
      ShippedBy: '',
      ReceivedBy: ''
    });
  }
  OnCancel() {
    this.ResetForm();
    this.Mode = 'List';
  }
  /* onSave() {
    this.confirmation.ConfirmationPopup('Are you sure to save record?');
  } */
  //To save the Inventory Vendor details to database table by calling the API service
  /* onSave() {
    this.confirmation.ConfirmationPopup('Are you sure to save record?');
  } */
  OnSaveTransfer(saveAction) {
    console.log(saveAction);
    this.onSave(saveAction);
  }
  onSave(saveAction) {
    debugger;
    this.submitted = true;
    if (this.InventoryTransferForm.invalid) {
      return;
    }
    //this.Loading = true;
    let inventorytransfer = new LBSINVInventoryTransfer();
    inventorytransfer.CompanyID = this.CompanyID;
    inventorytransfer.DateShipped = null;
    inventorytransfer.DateReceived = null;
    inventorytransfer.TransferReason = this.InventoryTransferForm.get('TransferReason').value;
    inventorytransfer.TransferNo = this.InventoryTransferForm.get('TransferNo').value;
    inventorytransfer.WareHouseFrom = this.InventoryTransferForm.get('WareHouseFrom').value;
    inventorytransfer.WareHouseTo = this.InventoryTransferForm.get('WareHouseTo').value;
    inventorytransfer.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      inventorytransfer.Status = LBS_INV_InventoryTransferStatus.New;
      this.inventoryTransferService.addInventoryTransfer(inventorytransfer).subscribe((resp: any) => {
        console.log(resp.data.id);
        if (resp.isSuccess == true) {
          this.toastr.success('Inventory Transfer added successfully');
          // this.ResetForm();
          this.submitted = false;
          this.SelectedTransferID = resp.data.id;
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
          } else {
            this.Edit(resp.data.id);
          }


          // this.BindInventoryTransfer();

          //this.Mode = 'List';

          /*  this.invStatusService.status = event.data.status;
           this.Edit(event.data.id);
           this.SelectedTransferID = event.data.id; */
          //this.Loading = false;
        }
        else {
          // alert(resp.message);
        }
      },
        (error) => {
          console.error('Problem with the sevice. Please try later : ' + error.message);
        });
    }
    else if (this.Mode == 'Edit') {
      debugger;
      inventorytransfer.Status = this.invStatusService.status;
      inventorytransfer.CloseComment = this.invStatusService.comment;
      inventorytransfer.ReceivedBy = this.invStatusService.receivedBy;
      inventorytransfer.ShippedBy = this.invStatusService.shippedBy;
      inventorytransfer.ID = this.InventoryTransferForm.get('ID').value;
      inventorytransfer.DateShipped = inventorytransfer.Status == LBS_INV_InventoryTransferStatus.Shipped || LBS_INV_InventoryTransferStatus.Received ? this.InventoryTransferForm.get('DateShipped').value : new Date();
      inventorytransfer.DateReceived = inventorytransfer.Status == LBS_INV_InventoryTransferStatus.Partially || LBS_INV_InventoryTransferStatus.Received ? this.InventoryTransferForm.get('DateReceived').value : new Date();

      this.inventoryTransferService.UpdateInventoryTransfer(inventorytransfer).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          if (this.statusChanged) {
            this.toastr.success('Inventory Transfer status changed successfully to ' + this.invStatusService.status);
            this.statusChanged = false;
            if (inventorytransfer.Status == 'Shipped')
              this.enableButton = false;
            else {
              this.enableButton = true;
            }
          } else {
            this.toastr.success('Inventory Transfer updated successfully');
            /*  this.ResetForm();
             this.BindInventoryTransfer(); */
            this.Mode = 'Edit';
          }
          let ID = this.InventoryTransferForm.get('ID').value;
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
          } else {
            this.Edit(ID);
          }

        }
        else {
          this.toastr.error(resp.message);
        }
        this.submitted = false;
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }

  DeleteInventoryTransfer(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryTransfer', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindInventoryTransfer();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  onChangeinStatus() {
    this.invStatusService.shippedBy = this.InventoryTransferForm.get('ShippedBy').value;
    this.invStatusService.receivedBy = this.InventoryTransferForm.get('ReceivedBy').value;
    if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.New) {
      this.invStatusService.status = LBS_INV_InventoryTransferStatus.Requested;
      //this.InventoryTransferForm.get('DateShipped').enable();
    } else if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.Requested) {
      this.invStatusService.status = LBS_INV_InventoryTransferStatus.Shipped;
      // this.InventoryTransferForm.get('DateShipped').disable();
      // this.InventoryTransferForm.get('DateReceived').enable();
      this.invStatusService.shippedBy = localStorage.getItem('LoginID');
    }
    else if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.Shipped) {
      // this.InventoryTransferForm.get('DateShipped').disable();
      // this.InventoryTransferForm.get('DateReceived').disable();
      this.invStatusService.receivedBy = localStorage.getItem('LoginID');
      if (this.invStatusService.PartialStatus) {
        this.invStatusService.status = LBS_INV_InventoryTransferStatus.Partially;
      } else {
        this.invStatusService.status = LBS_INV_InventoryTransferStatus.Received;
      }
    }
    else if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.Received || this.invStatusService.status == LBS_INV_InventoryTransferStatus.Partially) {
      // this.InventoryTransferForm.get('DateShipped').disable();
      // this.InventoryTransferForm.get('DateReceived').disable();
      if (this.invStatusService.PartialStatus) {
        this.invStatusService.status = LBS_INV_InventoryTransferStatus.Partially;
      } else {
        this.invStatusService.status = LBS_INV_InventoryTransferStatus.Received;
      }
    }

    this.Mode = "Edit";
    this.statusChanged = true;

    this.onSave('Save');

  }

  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }

  onWarehouseFromChange(event) {
    this.WareHouseTo = this.WareHouse;
    this.WareHouseTo = this.WareHouseTo.filter(x => x.id !== event.target.value)
  }
  onWarehouseToChange(event) {
    this.WareHouseFrom = this.WareHouse;
    this.WareHouseFrom = this.WareHouseFrom.filter(x => x.id !== event.target.value)
  }

  // onShippedByChanged($event){
  //   this.UsersReceivedBy =this.Users;
  //   this.UsersReceivedBy=this.UsersReceivedBy.filter(x=>x.loginID !== $event.target.value)
  // }
  // onReceivedByChanged($event){
  //   this.UsersShippedBy =this.Users;
  //   this.UsersShippedBy=this.UsersShippedBy.filter(x=>x.loginID !== $event.target.value)
  // }
  SetdateShipped() {
    this.InventoryTransferForm.patchValue({ 'DateShipped': this.toadyDate })
  }
  SetdateReceived() {
    this.InventoryTransferForm.patchValue({ 'DateReceived': this.toadyDate })
  }
  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
