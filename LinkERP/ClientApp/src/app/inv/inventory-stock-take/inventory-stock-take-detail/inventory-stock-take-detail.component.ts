import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { WareHouseBinService } from '../../services/ware-house-bin.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { InventoryStockTakeService } from '../../services/inventory-stock-take.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
import { InventoryStockAllocationDetailsService } from '../../services/inventory-stock-allocation-details.service';
import { InventoryStockTakeDetailService } from '../../services/inventory-stock-take-detail.service';
import { LBSINVInventoryStockTakeDetail } from 'src/app/models/inv/lbs-inv-inventory-stock-take-detail';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { CustomValidators } from 'ngx-custom-validators';
import { BsModalService, BsModalRef, idLocale } from 'ngx-bootstrap';

@Component({
  selector: 'app-inventory-stock-take-detail',
  templateUrl: './inventory-stock-take-detail.component.html',
  styleUrls: ['./inventory-stock-take-detail.component.css']
})
export class InventoryStockTakeDetailComponent implements OnInit {
  @Input() StockTakeNo: any;
  @Input() SelectedStockTakeID: any;
  @Input() StockTakeStatus: any;
  @Input() isStockCreater: boolean;
  @Input() SelectedWareHouseID: any;
  @Input() isStockApprover: boolean;
  @Input() showInStock: boolean = false;
  @Input()  IsActive:boolean;
  @Output() UpdateStockTakeStatus = new EventEmitter();
  @Output() OnStockTakeCancel = new EventEmitter();
  InventoryStockTakeDetailForm: FormGroup;
  Mode: any = 'List';
  submitted: any = false;
  Loading: any = false;
  CompanyId = localStorage.getItem('CompanyID');
  //Permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  //Ag-grid 
  ColumnDefs;
  RowData: any[] = [];
  AgLoad: boolean = false
  Inventorystocktakedetail: any[] = [];
  BindInventory: any[] = [];
  BindWareHouseBin: any[] = [];
  InventoryStockTake: any[] = [];
  inventoryList: any;
  WareHouseBinlist: any;
  modalRef: BsModalRef;
  SelectedProductID: any;
  SelectedQuantity: any;
  SelectedStockTakeDetailID: any;
  isStockReject: boolean;
  stock_Reject_write_Access: boolean;
  stock_Reject_all_Access: boolean;
  constructor(private deleteRecordsService: DeleteRecordsService,
    private cryptoAes: CryptoAes,
    private wareHouseBinService: WareHouseBinService,
    private sysCommonService: SysCommonService,
    private stocktake: InventoryStockTakeService,
    private FB: FormBuilder, private toastr: ToastrService,
    private inventoryservice: InventoryService, private modalService: BsModalService,
    private stocktakedetailservice: InventoryStockTakeDetailService
  ) { }

  ngOnInit() {
    this.RowData = [];
    console.log(this.StockTakeNo)
    this.AgLoad = false;
    this.Mode = "List";
    this.CreateForm();
    this.SetPermissions();
    this.GetAgColumns();
    this.BindInventoryStockTakeDetail();
    this.BindInventories();
    this.BindWareHouseBins();
    this.SetStockRejectPermissions();
    if (this.StockTakeStatus == 'Approved') {
      this.InventoryStockTakeDetailForm.disable();
    }
    // this.BindInventoryStockTake();
  }

  SetStockRejectPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "215");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.stock_Reject_write_Access = ModulePermissions.write_Access;
      this.isStockReject = true;
      if (!this.stock_Reject_all_Access) {
        if (!this.stock_Reject_write_Access) {
          this.isStockReject = false;
        }
      } else {
        this.stock_Reject_write_Access = true;
        this.stock_Reject_all_Access = true;
      }
    }
    else {
      this.isStockReject = false;
      this.stock_Reject_write_Access = false;
      this.stock_Reject_all_Access = false;
    }
  }
  productName
  SerialiseDetail(serialise: TemplateRef<any>, product: TemplateRef<any>, other: TemplateRef<any>, i) {
    /* this.SelectedProductID = this.RowData[i].productID;
    this.SelectedAdjustmentDetail_ID = this.RowData[i].id;
    this.SelectedQuantity = this.RowData[i].convertedQuantity;
    this.productName = this.RowData[i].productName; */
    //let product: TemplateRef<any>;
    this.SelectedStockTakeDetailID = this.RowData[i].id;
    this.SelectedProductID = this.RowData[i].productID;
    this.SelectedQuantity = this.RowData[i].countQuantity_text;
    let index = this.inventoryList.findIndex(c => c.id == this.RowData[i].productID);
    if (index >= 0) {
      let productID = this.RowData[i].productID;
      this.productName = this.inventoryList[index].productCode +' - '+this.inventoryList[index].productName;
      if (this.inventoryList[index].serialisedProduct) {
        this.modalRef = this.modalService.show(serialise);
      }
      else if (this.inventoryList[index].productStyleMatrixEnabled) {
        this.modalRef = this.modalService.show(product);
      }
      else {
        this.modalRef = this.modalService.show(other);
      }
    }


  }

  CreateForm() {
    //created InventoryStockTakeDetailForm 
    this.InventoryStockTakeDetailForm = this.FB.group({
      ID: [''],
      CompanyID: ['-1'],
      StockTakeNo: [this.StockTakeNo],
      ProductID: ['-1', CustomValidators.notEqual('-1')],
      BinNo: ['-1'],
      CurrentAvailableQuantity: [''],
      CountQuantity: [''],
      VarianceQuantity: [''],
      Cost: [''],
      TotalCostVariance: ['']
    });
  }
  GetAgColumns() {
    let IsSavehide: boolean;
    if (this.StockTakeStatus == 'New' && this.isStockCreater) {
      IsSavehide = false;
    }
    else {
      IsSavehide = true;
    }
    this.ColumnDefs = [
      { headerName: 'Stock Take No', field: 'stockName', sortable: true, filter: true, checkboxSelection: false, editable: false },
      { headerName: 'Product', field: 'productName', sortable: true, filter: true, editable: false },
      { headerName: 'Bin No', field: 'binName', sortable: true, filter: true, editable: false },
      { headerName: 'Count Quantity', field: 'countQuantity_text', sortable: true, filter: true, editable: !IsSavehide },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Save', cellRenderer: this.CustomSaveIconFunc, type: 'Action', hide: IsSavehide },
      { headerName: '', field: 'Delete', cellRenderer: this.CustomDeleteIconFunc, type: 'Action', hide: IsSavehide },
    ];
  }
  get f() { return this.InventoryStockTakeDetailForm.controls; }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "212");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.InventoryStockTakeDetailForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryStockTakeDetailForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryStockTakeDetailForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomSaveIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-save"></i></div>';
    return cellContent
  }

  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }

  AddNew(): void {
    this.Mode = 'Add';
  }

  Cancel(): void {
    this.Mode = "List";
    this.BindInventoryStockTakeDetail();
    this.OnStockTakeCancel.emit();
  }
  //To bind the data of all price-group to the Grid.
  BindInventoryStockTakeDetail() {
    this.Loading = true;
    this.AgLoad = false;
    this.stocktakedetailservice.getInventoryStockTakeDetailByStockTakeNo(this.SelectedStockTakeID).subscribe((resp: any) => {
      this.Inventorystocktakedetail = resp.data.inventorystocktakebyid;
      this.RowData = resp.data.inventorystocktakebyid;
      console.log(this.RowData);
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }
  BindInventories() {
    debugger;
    this.sysCommonService.getFinishedProducts().subscribe((resp: any) => {
      this.inventoryList = resp.data.productkits;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindInventoryStockTake() {
    this.Loading = true;
    this.stocktake.getInventoryStockTake().subscribe((resp: any) => {
      this.InventoryStockTake = resp.data.inventorystocktake;
      this.Loading = false;

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To save the price-group details to database table by calling the API service
  onSave() {
    this.submitted = true;
    if (this.InventoryStockTakeDetailForm.invalid) {
      return;
    }
    this.Loading = true;
    let stock = new LBSINVInventoryStockTakeDetail();
    stock.CreatedBY=localStorage.getItem('LoginID');
    stock.CompanyID = this.CompanyId;
    stock.StockTakeNo = this.StockTakeNo;
    stock.ProductID = this.InventoryStockTakeDetailForm.get('ProductID').value;
    stock.BinNo = this.InventoryStockTakeDetailForm.get('BinNo').value;
    stock.CurrentAvailableQuantity = this.InventoryStockTakeDetailForm.get('CurrentAvailableQuantity').value;
    stock.CountQuantity = this.InventoryStockTakeDetailForm.get('CountQuantity').value;
    stock.VarianceQuantity = this.InventoryStockTakeDetailForm.get('VarianceQuantity').value;
    stock.Cost = this.InventoryStockTakeDetailForm.get('Cost').value;
    stock.TotalCostVariance = this.InventoryStockTakeDetailForm.get('TotalCostVariance').value;
    if (this.Mode == 'Add') {
      this.stocktakedetailservice.addInventoryStockTakeDetail(stock).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Internal Transfer details added successfully');
          this.BindInventoryStockTakeDetail();
          this.Mode = 'List';
          this.Loading = false;
        }
        else {
          this.toastr.error(resp.message);
        }
      }, (error) => {
      });
    }
    else if (this.Mode == 'Edit') {
      stock.ID = this.InventoryStockTakeDetailForm.get('ID').value;
      this.stocktakedetailservice.updateInventoryStockTakeDetail(stock).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Internal Transfer  details updated successfully');
          this.BindInventoryStockTakeDetail();
          this.Mode = 'List';
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
      // this.AgEdit(event.data)
    } else if (colId == 'Delete') {
      this.OnDelete(event.data.id)
    }
    else if (colId == 'Save') {
      debugger;
      this.AgSave(event.data)
    }
  }

  OnDelete(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryStockTakeDetail', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.toastr.success('Currency  details deleted successfully');
      this.BindInventoryStockTakeDetail();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  addNewStockTake() {
    this.AgLoad = false;
    let object = {
      'companyID': localStorage.getItem('CompanyID'),
      'stockTakeNo': this.StockTakeNo,
      'StockTakeID': this.SelectedStockTakeID,
      'productID': "",
      'binNo': "",
      'currentAvailableQuantity': null,
      'countQuantity': null,
      'countQuantity_text': 0,
      'varianceQuantity_text': 0,
      'varianceQuantity': 0,
      'cost': 0,
      'totalCostVariance': null,
      'productName': "",
      'binName': "",
      'stockName': this.StockTakeNo,
      'id': "",
      'createdBY':  localStorage.getItem('LoginID'),
      'dateCreated': "0001-01-01T00:00:00",
      'deleted': false,
      'deletedBy': null,
      'deleteDate': "0001-01-01T00:00:00",
      'deleteStatus': "Active"
    }
    this.RowData.push(object);
    this.AgLoad = true;
  }

  AgSave(event) {
    debugger;
    let stock = new LBSINVInventoryStockTakeDetail();
    stock.ID = event.id,
      stock.CompanyID = event.companyID;
    stock.StockTakeNo = event.stockTakeNo;
    stock.ProductID = event.productID;
    stock.BinNo = event.binNo;
    stock.CurrentAvailableQuantity = event.currentAvailableQuantity_text;
    stock.CountQuantity = event.countQuantity_text;
    stock.VarianceQuantity = event.varianceQuantity_text;
    stock.Cost = event.cost_text;
    stock.TotalCostVariance = event.totalCostVariance_text;
    this.stocktakedetailservice.updateInventoryStockTakeDetail(stock).subscribe((resp: any) => {
      if (resp.isSuccess) {
        this.toastr.success('Internal Transfer  details updated successfully');
        this.BindInventoryStockTakeDetail();
        this.Mode = 'List';
      }
      else {
        this.toastr.error(resp.message);
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }

  Deleteindex(i) {
    debugger;
    this.RowData.splice(i, 1);
  }

  UpdateChanges() {   
    this.stocktakedetailservice.UpdateInventoryStockTakeDetailList(this.RowData).subscribe((resp: any) => {
      this.toastr.success('StockTake details Saved successfully');
      this.BindInventoryStockTakeDetail();
      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindWareHouseBins() {
    this.wareHouseBinService.getWareHouseBinByWareHouseID(this.SelectedWareHouseID).subscribe((resp: any) => {
      this.WareHouseBinlist = resp.data.warehousebin;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  DeleteInventoryStockTakeDetail(ID, productStatus) {
    debugger;
    // Bug #1326
    // if (productStatus != 'F') {
      this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryStockTakeDetail', localStorage.getItem('LoginID')).subscribe((resp: any) => {
        this.BindInventoryStockTakeDetail();
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    //}
    // else {
    //   this.toastr.error('Cant Delete this Record!');
    // }
  }
  Closenote() {
    this.modalRef.hide();
    this.BindInventoryStockTakeDetail();
  }
  OnUpdateStockTakeStatus(StockTakeStatus) {
    this.stocktakedetailservice.UpdateInventoryStockTakeDetailList(this.RowData).subscribe((resp: any) => {
      this.UpdateStockTakeStatus.emit(StockTakeStatus)
      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
    
  }
  onProductChange(ID, index: number) {
    //alert(ID + ':' + i);
    for (let i = 0; i < this.RowData.length; i++) {
      if (i != index) {
        if (this.RowData[i].productID == ID) {
          this.toastr.warning('The selected product already existed in the list.');
          this.RowData[index].productID = '-1';
          return;
        }
      }
    }

  }
}
