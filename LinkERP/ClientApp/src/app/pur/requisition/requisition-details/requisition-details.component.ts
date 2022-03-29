import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RequisitionService } from 'src/app/inv/services/requisition.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { RequisitionDetailsService } from '../../services/requisition-details.service';
import { EnumExtension } from 'src/app/shared/enums/enum-extension';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { ProductType } from 'src/app/shared/enums/product-type'
import { RequisitionLineStatus } from 'src/app/shared/enums/requisition-line-status';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { InventoryService } from 'src/app/inv/services/inventory.service';
import { LBSPURRequisitionDetails } from 'src/app/models/pur/lbs-pur-requisition-details';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
@Component({
  selector: 'app-requisition-details',
  templateUrl: './requisition-details.component.html',
  styleUrls: ['./requisition-details.component.css']
})
export class RequisitionDetailsComponent implements OnInit {
  @Input() RequisitionID: any;
  @Input() isApprover: boolean;
  @Input() RequisitionStatus: string;
  @Input() IsCreatedBY: boolean;
  @Input() SelectedWharehouseID: any;
  @Input() IsNextApprover: any;
  @Input() IsReqActive: boolean;
  @Input() VenderId: any;
  @Input() Action: any = 'InvRequisition';
  @Output() OnRequstionStatus = new EventEmitter<any>();
  Mode: any = 'List';
  RequisitionDetailsForm: FormGroup;
  AccessTab: string;
  Loading: any = false;
  submitted: boolean;
  ColumnDefs;
  RowData: any = [];
  AgLoad: boolean = false;
  IsAllApproved: boolean = false;
  IsAllRejected: boolean = false;
  IsAllNew: boolean = false;
  RequisitionDetails: any[] = [];
  UOMList: any[] = [];
  BindInventoryList: any[] = [];
  CompanyID = localStorage.getItem('CompanyID');
  
  //permission

  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  productValuestatus: boolean = false;
  private productType;
  private requisitionLineStatus;

  IsInventory: boolean;
  IsAllReject: boolean;
  modalRef: BsModalRef;

  SelectedRequisitionID: any;
  ProductID: any;
  SelectedRequisitionDetail_ID: any;
  WareHouseToID: any;
  SelectedQuantity: any;
  IsActive: boolean;

  constructor(
    private FB: FormBuilder,
    private inventoryService: InventoryService,
    private cryptoAes: CryptoAes,
    private Requisitionservice: RequisitionService,
    private sysCommonService: SysCommonService,
    private deleteRecordsService: DeleteRecordsService,
    private requistiondetails: RequisitionDetailsService,
    private toastr: ToastrService, private modalService: BsModalService,
    private commonService: InvCommonService,
    private syscommonservice: SysCommonService
  ) { }

  ngOnInit() {

    this.IsInventory = true;
    console.log(this.isApprover);
    console.log(this.IsReqActive);
    console.log(this.RequisitionStatus);
    this.productType = EnumExtension.getNamesAndValuestring(ProductType);
    this.requisitionLineStatus = EnumExtension.getNamesAndValuestring(RequisitionLineStatus);
    console.log(this.productType);
    console.log(this.requisitionLineStatus);
    this.Createform();
    this.SetPermissions();
    this.GetAgColumns();
    if (this.RequisitionStatus == 'New') {
      this.BindRequisitionDetails();
    } else {
      this.BindRequisitionActiveDetails();
    }

    //this.BindUOM();
    //this.BindInventories();
    debugger;
    if (this.VenderId == null || this.VenderId == undefined) {
      this.BindInventories();
    }
    else {
      this.BindProductByVenderid();
    }
    if (this.RequisitionStatus == 'Closed') {
      this.RequisitionDetailsForm.disable();
    }
  }
  GetAgColumns() {
    this.ColumnDefs = [
      { headerName: 'ProductType', field: 'productType', sortable: true, filter: true, checkboxSelection: false, width: 95, },
      { headerName: 'Product', field: 'productID', sortable: true, filter: true },
      { headerName: 'UnitOfMeasure ', field: 'unitOfMeasure', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false },
      { headerName: '', field: 'Delete', cellRenderer: this.CustomDeleteIconFunc, type: 'Action', hide: !this.delete_Access }
    ];
  }
  Createform() {
    this.RequisitionDetailsForm = this.FB.group({
      ID: [''],
      CompanyID: ['-1'],
      RequisitionID: [''],
      LineNo: [''],
      ProductType: ['INV', CustomValidators.notEqual('-1')],
      ProductID: ['-1', CustomValidators.notEqual('-1')],
      ProductDescription: [''],
      UnitOfMeasure: ['-1'],
      Quantity: [''],
      RequisitionLineStatus: ['New']
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
      this.RequisitionDetailsForm.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          this.RequisitionDetailsForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.RequisitionDetailsForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }


  }
  get f() { return this.RequisitionDetailsForm.controls; }
  ResetForm() {
    this.RequisitionDetailsForm.patchValue({
      ID: '',
      CompanyID: '-1',
      RequisitionID: '',
      LineNo: '',
      ProductType: 'INV',
      ProductID: '-1',
      ProductDescription: '',
      UnitOfMeasure: '-1',
      Quantity: '',
      RequisitionLineStatus: 'New'
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
  BindRequisitionActiveDetails() {
    this.AgLoad = false;
    this.Mode = "List";
    this.RowData = [];
    this.requistiondetails.getActiveRequisitionDetailsByRequisitionID(this.RequisitionID).subscribe((resp: any) => {
      this.RequisitionDetails = resp.data.requisitiondetailbyID;
      this.RowData = resp.data.requisitiondetailbyID;
      this.CheckReject();
      console.log(this.RequisitionDetails);
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      //   console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindRequisitionDetails() {
    this.AgLoad = false;
    this.Mode = "List";
    this.requistiondetails.getRequisitionDetailsByRequisitionID(this.RequisitionID).subscribe((resp: any) => {
      this.RequisitionDetails = resp.data.requisitiondetailbyID;
      this.RowData = resp.data.requisitiondetailbyID;

      this.RowData.forEach(obj => {
        obj.productDescription = (obj.productDescription == null || obj.productDescription == '') ? obj.productName : obj.productDescription;
      });

      this.CheckReject();
      console.log(this.RequisitionDetails);
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      //   console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //Add new 
  AddNew() {
    this.RequisitionDetailsForm.enable();
    this.RequisitionDetailsForm.get('ProductDescription').disable();
    this.RequisitionDetailsForm.get('ProductID').enable();
    this.RequisitionDetailsForm.get('UnitOfMeasure').enable();
    this.RequisitionDetailsForm.get('Quantity').enable();
    this.IsActive = true;
    this.Mode = 'Add';
  }

  Cancel() {
    this.ResetForm();
    this.RequisitionDetailsForm.enable();
    this.IsActive = true;
    this.Mode = 'List';
  }
  onSave() {
    this.submitted = true;
    if (this.RequisitionDetailsForm.invalid) {
      return;
    }
    this.Loading = true;
    let request = new LBSPURRequisitionDetails();
    request.CompanyID = this.CompanyID;
    request.RequisitionID = this.RequisitionID;
    request.ProductType = this.RequisitionDetailsForm.get('ProductType').value;
    if (this.RequisitionDetailsForm.get('ProductID').value == "-1") {
      request.ProductID = null;
    } else {
      request.ProductID = this.RequisitionDetailsForm.get('ProductID').value;
    }
    if (this.RequisitionDetailsForm.get('UnitOfMeasure').value == "-1") {
      request.UnitOfMeasure = null;
    } else {
      request.UnitOfMeasure = this.RequisitionDetailsForm.get('UnitOfMeasure').value;
    }
    request.ProductDescription = this.RequisitionDetailsForm.get('ProductDescription').value;

    request.Quantity = this.RequisitionDetailsForm.get('Quantity').value;
    request.RequisitionLineStatus = this.RequisitionDetailsForm.get('RequisitionLineStatus').value;
    if (this.Mode == 'Add') {

      this.requistiondetails.addRequisitionDetails(request).subscribe((resp: any) => {
        this.toastr.success('Requisition Details added successfully')
        this.ResetForm();
        this.BindRequisitionDetails();
        this.Mode = 'List';
        this.Loading = false;
      }, (error) => {
        //   console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    else if (this.Mode == 'Edit') {
      request.ID = this.RequisitionDetailsForm.get('ID').value;
      this.requistiondetails.updateRequisitionDetails(request).subscribe((resp: any) => {
        this.toastr.success('Requisition  Details updated successfully')
        this.ResetForm();
        this.BindRequisitionDetails();
        this.Mode = 'List';

      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
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
    // this.SelectedRequisitionID=event.id;
    this.BindInventoryUOMConversions(event.productID);
    console.log(event);
    this.RequisitionDetailsForm.patchValue({
      ID: event.id,
      CompanyID: event.companyID,
      RequisitionID: event.requisitionID,
      ProductType: event.productType,
      ProductID: event.productID,
      ProductDescription: event.productDescription,
      UnitOfMeasure: event.unitOfMeasure,//.trim(),
      Quantity: event.quantity,
      RequisitionLineStatus: event.requisitionLineStatus,
    });
   
   
   
    /* if (event.productType == "INV") {
      this.RequisitionDetailsForm.get('ProductDescription').disable();
      this.RequisitionDetailsForm.get('ProductID').enable();
    }
    else {
      this.IsInventory = false;
      this.RequisitionDetailsForm.patchValue({
        ProductID: ''
      });
      this.RequisitionDetailsForm.get('ProductID').disable();
      this.RequisitionDetailsForm.get('ProductDescription').enable();
    } */
    this.RequisitionDetailsForm.patchValue({
      ProductDescription: event.productDescription
    });
    this.Mode = 'Edit';
    if (event.deleteStatus == 'Active') {
      this.RequisitionDetailsForm.enable();
      this.productTypeStatus(event.productType);
      this.RequisitionDetailsForm.patchValue({
        ProductDescription: event.productDescription,
      });
      this.IsActive = true;
    } else {
      this.RequisitionDetailsForm.disable();
      this.IsActive = false;
    }
  }

  OnDelete(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_PUR_RequisitionDetails', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.toastr.success('Currency  details deleted successfully');
      this.BindRequisitionDetails();
      this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindUOM() {
    this.Loading = true;
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_UnitOfMeasure).subscribe((resp: any) => {
      console.log(resp);
      this.UOMList = resp.data.tabledata;
      this.UOMList = this.UOMList.filter(r => r.deleted == 0)
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindInventories() {
    debugger;
    this.Loading = true;
    this.commonService.getInventory().subscribe((resp: any) => {
      console.log(resp.data.inventory);
      this.BindInventoryList = resp.data.productkits;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindProductByVenderid() {
    debugger;
    this.requistiondetails.bindProductByVenderid(this.VenderId, this.CompanyID).subscribe((resp: any) => {
      console.log(resp)
      this.BindInventoryList = resp.data.product;
      debugger;
    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  productTypeStatus(ID) {
    if (ID == "INV") {
      this.RequisitionDetailsForm.get('ProductDescription').disable();
      this.RequisitionDetailsForm.get('ProductID').enable();
      this.RequisitionDetailsForm.get('UnitOfMeasure').enable();
      this.RequisitionDetailsForm.get('Quantity').enable();
    }
    else if (ID == "Com") {
      this.IsInventory = false;
      this.RequisitionDetailsForm.patchValue({
        ProductID: null,
        ProductDescription: '',
        UnitOfMeasure: null,
        Quantity: null,
      });
      this.RequisitionDetailsForm.get('UnitOfMeasure').disable();
      this.RequisitionDetailsForm.get('Quantity').disable();
      this.RequisitionDetailsForm.get('ProductID').disable();
      this.RequisitionDetailsForm.get('ProductDescription').enable();
    }
    else {
      this.IsInventory = false;
      this.RequisitionDetailsForm.patchValue({
        ProductID: '',
        ProductDescription: ''
      });
      this.RequisitionDetailsForm.get('ProductID').disable();
      this.RequisitionDetailsForm.get('ProductDescription').enable();
      this.RequisitionDetailsForm.get('UnitOfMeasure').enable();
      this.RequisitionDetailsForm.get('Quantity').enable();
    }
  }
  onOptionSelected(index, event, Status) {
    console.log(event);
    this.IsAllApproved = false;
    this.IsAllRejected = false;
    this.IsAllNew = false;
    if (event.target.checked) {
      this.RowData[index].requisitionLineStatus = Status;
    } else {
      this.RowData[index].requisitionLineStatus = 'New';
    }

  }


  checkAll(event, Status) {
    console.log(event);
    this.IsAllApproved = false;
    this.IsAllRejected = false;
    this.IsAllNew = false;
    if (Status == 'Approved') {
      this.IsAllApproved = true;
    } else if (Status == 'Rejected') {
      this.IsAllRejected = true;
    }
    else if (Status == 'New') {
      this.IsAllNew = true;
    }
    if (!event.target.checked) {
      Status = 'New';
    }
    for (let i = 0; i <= this.RowData.length - 1; i++) {
      // if (this.RowData[i].requisitionLineStatus != 'Approved' || Status == 'New') {
      this.RowData[i].requisitionLineStatus = Status;
      //}
    }
  }
  EditRoleModule(index) {
    this.AgEdit(this.RowData[index])
  }
  DeleteRoleModule(index) {
    this.OnDelete(this.RowData[index].id)
  }
  Isreject: boolean;
  UpdateStatus() {
    debugger;
    let Approved = this.RowData.find(ob => ob['requisitionLineStatus'] === 'Approved');
    let Rejected = this.RowData.find(ob => ob['requisitionLineStatus'] === 'Rejected');
    if (!Approved && !Rejected) {
      this.toastr.warning('please select atlest one record to approve or reject')
      return;
    }

    if (!Approved && !Rejected) {
      this.toastr.warning('please select atlest one record to approve or reject')
      return;
    }
    let lstLBSPURRequisitionDetails: LBSPURRequisitionDetails[] = [];
    this.Isreject = true;
    for (let i = 0; i <= this.RowData.length - 1; i++) {
      if (this.RowData[i].requisitionLineStatus == 'Approved') {
        this.Isreject = false;
      }
      let _LBSPURRequisitionDetails = new LBSPURRequisitionDetails();
      _LBSPURRequisitionDetails.RequisitionLineStatus = this.RowData[i].requisitionLineStatus;
      _LBSPURRequisitionDetails.ID = this.RowData[i].id;
      lstLBSPURRequisitionDetails.push(_LBSPURRequisitionDetails);
    }
    this.requistiondetails.updateRequisitionDetailStatus(lstLBSPURRequisitionDetails).subscribe((resp: any) => {
      this.toastr.success('Requisition  Details updated successfully')
      this.ResetForm();
      this.BindRequisitionDetails();
      this.Mode = 'List';
      let StatusID;
      if (this.Isreject) {
        StatusID = "6";
      } else {
        StatusID = "5";
      }
      this.OnRequstionStatus.emit(StatusID);
    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  CheckReject() {
    let Reject = this.RowData.find(ob => ob['requisitionLineStatus'] != 'Rejected');
    if (Reject) {
      this.IsAllReject = false;
    } else {
      this.IsAllReject = true;
    }
  }
  productChange(ID) {
    debugger;
    console.log(this.VenderId);
    if (ID != "-1") {
      let des = "";
      let index = this.BindInventoryList.findIndex(c => c.id == ID);
      if (index >= 0) {
        des = this.BindInventoryList[index].productName;
      }
      let Inventory = this.BindInventoryList.find(ob => ob['id'] === ID);
      if (Inventory) {
        this.RequisitionDetailsForm.patchValue({
          UnitOfMeasure: Inventory.unitOfMeasureID,
          ProductDescription: des
        });  
        this.BindInventoryUOMConversions(ID);
      }
    }

  }
BindInventoryUOMConversions(InventoryID) {
    this.UOMList = [];
    this.syscommonservice.getUOMConvertionsByInventryID(InventoryID).subscribe((resp: any) => {
      this.UOMList = resp.data.inventoryunitofmeasure;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  ProductMatrix(matrix: TemplateRef<any>, i) {
    debugger;
    this.SelectedRequisitionID = this.RowData[i].requisitionID;
    this.ProductID = this.RowData[i].productID;
    this.SelectedRequisitionDetail_ID = this.RowData[i].id;
    this.WareHouseToID = this.SelectedWharehouseID;
    this.SelectedQuantity = this.RowData[i].quantity;
    this.modalRef = this.modalService.show(matrix);
  }
  Closenote() {
    this.modalRef.hide();
    this.BindRequisitionDetails();
  }

  RequstionStatus(StatusID) {
    this.UpdateStatus();
    this.OnRequstionStatus.emit(StatusID);
  }
}

