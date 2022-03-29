import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { RequisitionService } from 'src/app/inv/services/requisition.service';
import { ToastrService } from 'ngx-toastr';
import { WarehouseService } from 'src/app/inv/services/warehouse.service';
import { UserService } from 'src/app/sys/services/user.service';
import { LBSPURRequisition } from 'src/app/models/pur/lbs-pur-requisition';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';
import * as moment from 'moment';

@Component({
  selector: 'app-requisition',
  templateUrl: './requisition.component.html',
  styleUrls: ['./requisition.component.css']
})
export class RequisitionComponent implements OnInit {
  Mode: any = 'List';
  RequisitionForm: FormGroup;
  AccessTab: string;
  Requisitions: any[] = [];
  WareHouse: any[] = [];
  Users: any[] = [];
  Vendor: any[] = [];
  VenderId: any;
  Status: any[] = [];
  modalRef: BsModalRef;
  IsActive: boolean;
  PageSize: any;
  //Permission

  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  read: boolean;
  SelectedRequisitionID: any;
  SelectedWharehouseID: any;
  Loading: any = false;
  submitted: boolean;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  RequisitionStatus: string;
  isApprover: boolean;
  IsCreatedBY: boolean;
  IsNextApprover: boolean;
  NextApprover: string;
  requisitionrouter: any;
  Currentpage: string;
  CompanyID = localStorage.getItem('CompanyID');
  constructor(
    private Requisitionservice: RequisitionService,
    private router: Router, private route: ActivatedRoute,
    private commonService: InvCommonService,
    private deleteRecordsService: DeleteRecordsService,
    private userService: UserService,
    private warehouseService: WarehouseService, private cryptoAes: CryptoAes,
    private FB: FormBuilder,
    private toastr: ToastrService,
    public modalService: BsModalService,
    private sharedFormatterService: SharedFormatterService
  ) {
    this.requisitionrouter = this.route.snapshot.paramMap.get("id")
    console.log(this.route.snapshot.paramMap.get("id"));
  }

  ngOnInit() {
    this.AccessTab = "Requisitions";
    this.Createform();
    this.SetPermissions();
    this.GetAgColumns();
    this.BindWareHouse();
    this.getUsers();
    this.BindVendor();
    this.BindStatus();
    this.BindRequisitions();
    this.PageSize = "50";
    this.Currentpage = "0";
  }
  GetAgColumns() {
    this.ColumnDefs = [
      { headerName: 'Number', field: 'requisitionNumber', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Warehouse', field: 'wareHouseName', sortable: true, filter: true },
      { headerName: 'Requisition Status', field: 'requisitionStatus', sortable: true, filter: true },
      { headerName: 'ReceiveBy', field: 'receiveBy', sortable: true, filter: true },
      { headerName: 'RequestedBy', field: 'requestedBy', sortable: true, filter: true },
      { headerName: 'Vendor Name', field: 'name', sortable: true, filter: true },
      { headerName: 'NextApprover', field: 'nextApprover', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 95 },
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
  Createform() {
    this.RequisitionForm = this.FB.group({
      ID: [''],
      CompanyID: ['-1'],
      RequisitionNumber: [''],
      WarehouseID: ['-1', CustomValidators.notEqual('-1')],
      RequisitionStatus: ['1'],
      ReceiveBy: ['', Validators.required],
      RequestedBy: ['-1', CustomValidators.notEqual('-1')],
      VendorID: ['-1'],
      NextApprover: ['']
    });
  }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "301");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.RequisitionForm.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          this.RequisitionForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.RequisitionForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;

    }
  }


  get f() { return this.RequisitionForm.controls; }

  AddNew() {
    this.Mode = 'Add';
    this.read = false;
    this.IsActive = true;
    this.RequisitionStatus = "0";
    this.RequisitionForm.get('WarehouseID').enable();
    this.RequisitionForm.get('ReceiveBy').enable();
    this.RequisitionForm.get('VendorID').enable();
    this.RequisitionForm.get('RequestedBy').enable();
    this.RequisitionForm.enable();
    this.RequisitionForm.patchValue({
      RequestedBy: localStorage.getItem('LoginID'),
    });
  }
  Cancel() {
    debugger;
    this.ResetForm();
    this.requisitionrouter = '';
    this.BindRequisitions();
    this.isApprover = false;
    this.Mode = 'List';

  }

  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  BindRequisitions() {
    debugger
    this.AgLoad = false;
    this.Mode = "List";
    this.Requisitionservice.getrequisitions().subscribe((resp: any) => {
      console.log(resp.data.requisitions);
      this.Requisitions = resp.data.requisitions;
      this.RowData = resp.data.requisitions;

      this.RowData.forEach(element => {
        let receiveBy = { 'value': element.receiveBy }
        element.receiveBy = this.sharedFormatterService.dateTimeFormatter(receiveBy);
      });
      if (this.requisitionrouter) {
        let data = this.RowData.filter(r => r.requisitionNumber == this.requisitionrouter);
        this.AgEdit(data[0]);
      }
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
    });
  }
  //To bind the data of all BindWareHouse to the Grid.
  BindWareHouse() {
    this.Loading = true;
    this.commonService.getWareHouse().subscribe((resp: any) => {
      console.log(resp);
      this.WareHouse = resp.data.warehouse;
      this.Loading = false;

    }, (error) => {
    });
  }
  BindVendor() {
    this.Loading = true;
    this.commonService.getVendor().subscribe((resp: any) => {
      console.log(resp);
      this.Vendor = resp.data.vendors;
      this.Loading = false;
    }, (error) => {
    });
  }
  BindStatus() {
    this.Loading = true;
    this.Requisitionservice.getStatus().subscribe((resp: any) => {
      console.log(resp);
      this.Status = resp.data.status;
      this.Loading = false;

    }, (error) => {
    });
  }
  getUsers() {
    this.Loading = true;
    this.commonService.getUsers().subscribe((resp: any) => {
      console.log(resp);
      this.Users = resp.data.users;
      this.Loading = false;

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  old(saveAction) {
    debugger;
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    this.submitted = true;
    if (this.RequisitionForm.invalid) {
      return;
    }
    this.Loading = true;
    let request = new LBSPURRequisition();
    request.CompanyID = this.CompanyID;
    request.CreatedBY = localStorage.getItem('LoginID');
    request.RequisitionNumber = this.RequisitionForm.get('RequisitionNumber').value;
    request.WarehouseID = this.RequisitionForm.get('WarehouseID').value;
    request.RequisitionStatus = '1'; //this.RequisitionForm.get('RequisitionStatus').value;
    request.ReceiveBy = this.RequisitionForm.get('ReceiveBy').value;
    request.RequestedBy = this.RequisitionForm.get('RequestedBy').value;

    request.NextApprover = this.RequisitionForm.get('NextApprover').value;
    if (this.RequisitionForm.get('VendorID').value == "-1") {
      request.VendorID = null;
      this.VenderId = null;
    } else {
      request.VendorID = this.RequisitionForm.get('VendorID').value;
      this.VenderId = this.RequisitionForm.get('VendorID').value;
    }
    request.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      this.Requisitionservice.addRequisition(request).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Requisition Details added successfully');

          if (saveAction == 'Close') {
            this.Cancel();
            this.BindRequisitions();
            this.Mode = 'List';
            this.ResetForm();
          }

          else {
            //this.ResetForm();
            this.SelectedRequisitionID = resp.data.id;
            this.getRequisitionByID();
            // this.BindRequisitions();
            //this.Mode = 'List';
          }
          
        }
        else {

        }

        //  this.ResetForm();
        //  this.BindRequisitions();
        // this.Mode = 'List';
        //  this.Loading = false;
        this.Loading = false;
      }, (error) => {
        this.Loading = false;
      });
    }
    else if (this.Mode == 'Edit') {
      request.ID = this.RequisitionForm.get('ID').value;
      this.Requisitionservice.updateRequisition(request).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Requisition  Details updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindRequisitions();
          }
          else {
            this.ResetForm();
            this.SelectedRequisitionID = resp.data.id;
            this.getRequisitionByID();
            //this.Mode = 'List';
          }

          // this.ResetForm();
          // this.BindRequisitions();
          // this.Mode = 'List';
        }
        else {

        }
        this.Loading = false;
      }, (error) => {
        this.Loading = false;
      });
    }
  }
  ResetForm() {
    this.RequisitionForm.patchValue({
      ID: '',
      CompanyID: '-1',
      RequisitionNumber: '',
      WarehouseID: '-1',
      RequisitionStatus: '1',
      ReceiveBy: '',
      RequestedBy: '-1',
      VendorID: '-1',
      NextApprover: ''

    });
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.AgEdit(event.data)
    } else if (colId == 'Delete') {
      this.OnDelete(event.data.id)
    }
  }
  //edit operation

  AgEdit(event) {
    debugger;
    this.read = true;
    this.isApprover = false;
    this.IsCreatedBY = false;
    let userid = localStorage.getItem('LoginID');
    this.IsNextApprover = false;
    this.NextApprover = event.nextApprover;
    this.Requisitionservice.getNextApprover(event.requestedBy, userid, 'PurchaseRequestApprovalWorkFlow', 0).subscribe((resp: any) => {
      console.log(resp.data.nextapprover);
      if (resp.data.nextapprover) {
        this.IsNextApprover = true;
      }
    }, (error) => {
    });
    if (event.nextApprover) {

      if (event.nextApprover == userid) {
        this.isApprover = true;
      }
    }
    if (event.createdBY) {
      if (event.createdBY == userid) {
        this.IsCreatedBY = true;
      }
    }
    this.SelectedRequisitionID = event.id;
    this.SelectedWharehouseID = event.warehouseID;
    console.log(event);
    this.RequisitionStatus = event.requisitionStatus;
    this.VenderId = event.vendorID
    // if(event.vendorID==null|| event.vendorID ==undefined)
    // {
    //   this.VenderId='00000000-0000-0000-0000-000000000000';
    // }
    // else{
    //   this.VenderId=event.vendorID
    // }
    debugger
    this.RequisitionForm.patchValue({
      ID: event.id,
      CompanyID: event.companyID,
      RequisitionNumber: event.requisitionNumber,
      WarehouseID: event.warehouseID,
      RequisitionStatus: event.requisitionStatus,
      ReceiveBy: this.Mode == 'Add' ? event.receiveBy : this.sharedFormatterService.dateTimeFormatterToDateTime(event.receiveBy),
      RequestedBy: event.requestedBy,
      VendorID: event.vendorID,
      NextApprover: event.nextApprover,
    });
    // this.RequisitionForm.disable();
    if (event.deleteStatus == 'Active') {
      this.RequisitionForm.enable();
      this.IsActive = true;
    } else {
      this.RequisitionForm.disable();
      this.IsActive = false;
    }
    this.Mode = 'Edit';
    this.RequisitionForm.get('WarehouseID').disable();
    this.RequisitionForm.get('ReceiveBy').disable();
    this.RequisitionForm.get('VendorID').disable();
    this.RequisitionForm.get('RequestedBy').disable();
  }
  OnDelete(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_PUR_Requisition', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindRequisitions();
      this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  RequstionStatus(StatusID) {
    this.Loading = true;
    let request = new LBSPURRequisition();
    request.CompanyID = this.CompanyID;
    request.CreatedBY = localStorage.getItem('LoginID');
    request.RequisitionNumber = this.RequisitionForm.get('RequisitionNumber').value;
    request.WarehouseID = this.RequisitionForm.get('WarehouseID').value;
    request.ReceiveBy = new Date(this.RequisitionForm.get('ReceiveBy').value);
    request.RequestedBy = this.RequisitionForm.get('RequestedBy').value;
    request.VendorID = this.RequisitionForm.get('VendorID').value;
    request.NextApprover = this.RequisitionForm.get('NextApprover').value;
    request.RequisitionStatus = StatusID;
    request.ID = this.RequisitionForm.get('ID').value;
    this.Requisitionservice.updateRequisition(request).subscribe((resp: any) => {
      this.toastr.success('Requisition  Details updated successfully')
      if (request.RequisitionStatus == '2') {
        this.RequisitionStatus = 'Approval In Progress';
      }
      else if (request.RequisitionStatus == '3') {
        this.RequisitionStatus = 'Delegated';
      }
      else if (request.RequisitionStatus == '5') {
        this.RequisitionStatus = 'Approved';
      }
      else if (request.RequisitionStatus == '6') {
        this.RequisitionStatus = 'Rejected';
      }
      else if (request.RequisitionStatus == '7') {
        this.RequisitionStatus = 'Closed';
      }

      // this.ResetForm();
      // this.BindRequisitions();
      // this.Mode = 'List';
      this.Loading = false;

    }, (error) => {
      this.Loading = false;

    });
  }
  ConfirmDialogClose() {
    // this.ResetForm();

    // this.BindRequisitions();
    // this.Mode = 'List';
    this.modalRef.hide();
  }
  getRequisitionByID() {
    this.Requisitionservice.getRequisitionByID(this.SelectedRequisitionID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        console.log(resp.data.requisitiondetail);
        this.AgEdit(resp.data.requisitiondetail)
        // this.ResetForm();
        // this.BindRequisitions();
        // this.Mode = 'List';
      }


    }, (error) => {
    });
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
