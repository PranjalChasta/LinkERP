import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InventoryDetailService } from '../../services/inventory-detail.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { WarehouseService } from '../../services/warehouse.service';
import { InventoryService } from '../../services/inventory.service';
import { WareHouseBinService } from '../../services/ware-house-bin.service';
import { LBSINVInventoryDetail } from 'src/app/models/inv/lbs-inv-inventory-detail';
import { LBS_INV_InventoryWareHousePrice } from 'src/app/models/inv/LBS_INV_InventoryWareHousePrice';
import { InventoryWareHousePriceService } from '../../services/inventory-warehouse-price';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { InvCommonService } from '../../services/inv-common.service';
import { CustomValidators } from 'ngx-custom-validators';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { CryptoAes } from 'src/app/directives/crypto-aes';
@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.css']
})
export class InventoryDetailComponent implements OnInit {
  @Input() InventryID: any;
  @Input() IsWareHousePrice: boolean
  @Input() IsActive: boolean;
  @Input() IsInventoryActive: boolean;
  Mode: any = 'List';
  Submitted: any = false;
  InventoryDetailForm: FormGroup;
  Loading: any = false;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  BindInventoryDetail: any;
  WareHouseBins: any;
  inventoryGLClassifications: any;
  Products: any;
  WareHouse: any;
  CompanyId = localStorage.getItem('CompanyID');
  WareHouseName: any;
  BindInventoryPrice: any;
  ProductPriceID: any;
  WareHouseID: any;
  WareHousePriceID: any;
  IsActivebutton: boolean;
  DetailID;
  SelectedLocationName: any;
  PageSize: any;
  Currentpage: string;
  WarehouseID: any;
  ProductID: any;
  read_Access: any;
  delete_Access: any;
  all_Access: any;
  write_Access: any;
  QtyOnHand: any = 0;
  ActionName: any = '';
  availbleStock: any = 0;
  constructor(
    private inventoryDetailService: InventoryDetailService,
    private sysCommonService: SysCommonService,
    private warehouseService: WarehouseService,
    private inventoryService: InventoryService,
    private cryptoAes: CryptoAes,
    private wareHouseBinService: WareHouseBinService,
    private toastr: ToastrService,
    private WareHousePriceService: InventoryWareHousePriceService,
    private FB: FormBuilder, private commonService: InvCommonService,
    private deleteRecordsService: DeleteRecordsService,
  ) { }
  AccessTab: any = 'Inventory';
  SelectedInventryID: any;
  ngOnInit() {
    this.CreateForm();
    this.SetPermissions();
    //  console.log(this.RowData);
    console.log(this.InventryID)
    this.AgLoad = false;
    this.ColumnDefs = [
      { headerName: 'WareHouse', field: 'wareHouseName', sortable: true, filter: true, checkboxSelection: false, width: 130 },
      // { headerName: 'Bin', field: 'binName', sortable: true, filter: true, width: 95 },
      { headerName: 'Available Qty', field: 'availableQuantity_text', sortable: true, filter: true, cellStyle: { textAlign: 'left' }, width: 130 },
      { headerName: 'Avg Cost', field: 'averageCost_text', sortable: true, filter: true, cellStyle: { textAlign: 'left' }, width: 95 },
      { headerName: 'Std Cost', field: 'standardCost_text', sortable: true, filter: true, cellStyle: { textAlign: 'left' }, width: 95 },
      { headerName: 'Last Cost', field: 'lastCost_text', sortable: true, filter: true, cellStyle: { textAlign: 'left' }, width: 95 },
      { headerName: 'Min Stock', field: 'minimumStock_text', sortable: true, filter: true, cellStyle: { textAlign: 'left' }, width: 105 },
      { headerName: 'Max Stock', field: 'maximumStock_text', sortable: true, filter: true, cellStyle: { textAlign: 'left' }, width: 105 },
      { headerName: 'Min Order', field: 'minimumOrder_text', sortable: true, filter: true, cellStyle: { textAlign: 'left' }, width: 105 },
      { headerName: 'Allow Negative', field: 'allowNegativeStatus', sortable: true, filter: true, width: 130 },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 120, hide: !this.delete_Access },

      {
        headerName: 'Action', type: 'Action',
        children: [
          { headerName: '', field: 'Edit', hide: false, type: 'EditAction' },
          { headerName: '', field: 'Detail', cellRenderer: this.CustomDetailIconFunc, type: 'Action', hide: false },
          { headerName: '', field: 'Price', cellRenderer: this.CustomPriceIconFunc, type: 'Action', hide: !this.IsWareHousePrice },
          { headerName: '', field: 'Delete', hide: !this.delete_Access, type: 'DeleteAction', }

        ]
      },
    ];

    this.BindInventoryDetails();
    this.Currentpage = "0";
    this.PageSize = "50";
    this.BindInventories();
    this.BindClassifications();
    // this.BindWareHouses();



  }
  CustomDetailIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-align-justify"></i></div>';
    return cellContent
  }
  CreateForm() {
    this.InventoryDetailForm = this.FB.group({
      ID: [''],
      WareHouseName: ['-1', CustomValidators.notEqual('-1')],
      ProductName: ['-1'],
      BinName: [null],
      MinimumStock: [0],
      MaximumStock: [0],
      MinimumOrder: [0],
      AverageCost: [0],
      StandardCost: [0],
      LastCost: [0],
      AvailableQuantity: [0],
      InventoryGLClassificationID: ['-1'],
      AllowNegative: [false]
    })
  }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "201");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.InventoryDetailForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryDetailForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryDetailForm.disable();
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
  get f() { return this.InventoryDetailForm.controls; }
  BindInventoryDetails() {
    debugger
    this.Mode = "List";
    this.AgLoad = false;
    this.inventoryDetailService.getInventoryDetailsByInventryID(this.InventryID).subscribe((resp: any) => {
      // console.log(resp.data.inventorydetails[0].id);
      this.BindInventoryDetail = resp.data.inventorydetails;
      this.RowData = resp.data.inventorydetails;
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindWareHouse() {
    debugger;
    this.Loading = true;
    this.commonService.getWarehousebyInventoryDetails(this.InventryID, this.DetailID).subscribe((resp: any) => {
      this.WareHouse = resp.data.inventorydetails;
      this.Loading = false;

    }, (error) => {
      //   console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindInventories() {
    this.Loading = true;
    this.commonService.getInventory().subscribe((resp: any) => {
      this.Products = resp.data.productkits;
      this.Loading = false;

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindClassifications() {
    this.Loading = true;
    this.inventoryDetailService.getInventoryGLClassifications().subscribe((resp: any) => {
      this.inventoryGLClassifications = resp.data.classifications;
      this.Loading = false;

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


  Edit(ID) {
    this.inventoryDetailService.getInventoryDetailsByID(ID).subscribe((resp: any) => {
      let lBSINVInventoryDetail: any = resp.data.inventorydetails;
      console.log(lBSINVInventoryDetail);
      this.InventoryDetailForm.patchValue({
        ID: lBSINVInventoryDetail.id,
        //Organisation: lBSSYSDocumentTemplates.companyID,
        ProductName: this.InventryID,
        WareHouseName: lBSINVInventoryDetail.warehouseID,
        BinName: lBSINVInventoryDetail.binID,
        MinimumStock: lBSINVInventoryDetail.minimumStock_text,
        MaximumStock: lBSINVInventoryDetail.maximumStock_text,
        MinimumOrder: lBSINVInventoryDetail.minimumOrder_text,
        AverageCost: lBSINVInventoryDetail.averageCost_text,
        StandardCost: lBSINVInventoryDetail.standardCost_text,
        LastCost: lBSINVInventoryDetail.lastCost_text,
        AvailableQuantity: lBSINVInventoryDetail.availableQuantity_text,
        InventoryGLClassificationID: lBSINVInventoryDetail.inventoryGLClassificationID,
        AllowNegative: lBSINVInventoryDetail.allowNegative
      });
      this.DetailID = lBSINVInventoryDetail.id;
      this.ProductID = lBSINVInventoryDetail.productID;
      this.WarehouseID = lBSINVInventoryDetail.warehouseID;
      console.log(this.InventoryDetailForm);
      if (!lBSINVInventoryDetail.deleted) {
        this.InventoryDetailForm.enable();
        this.IsActivebutton = true;

      } else {
        this.InventoryDetailForm.disable();
        this.IsActivebutton = true;
      }

      if (!this.IsInventoryActive) {
        //this.InventoryDetailForm.disable();
      }
      this.InventoryDetailForm.get('AvailableQuantity').disable();
      this.InventoryDetailForm.get('AverageCost').disable();
      this.InventoryDetailForm.get('LastCost').disable();
      this.Mode = 'Edit';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  AddNew() {
    this.Mode = 'Add';
    this.IsActivebutton = true;
    this.DetailID = ' ';
    this.BindWareHouse();
    this.InventoryDetailForm.enable();
    this.InventoryDetailForm.get('AvailableQuantity').disable();
    this.InventoryDetailForm.get('AverageCost').disable();
    this.InventoryDetailForm.get('LastCost').disable();
  }

  OnCancel() {
    this.ResetForm();
    this.Mode = 'Add';
  }
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {

    this.Submitted = true;
    if (this.InventoryDetailForm.invalid) {
      return;
    }
    var max = this.InventoryDetailForm.get('MaximumStock').value;
    var min = this.InventoryDetailForm.get('MinimumStock').value;
    if (Number(min) > Number(max)) {
      this.toastr.warning('Minimun stock cannot be gretter than Maximun stock');
      return;
    }
    let lBSINVInventoryDetail = new LBSINVInventoryDetail();
    lBSINVInventoryDetail.CompanyID = this.CompanyId;
    lBSINVInventoryDetail.ProductID = this.InventryID;
    lBSINVInventoryDetail.CreatedBY = localStorage.getItem('LoginID');
    lBSINVInventoryDetail.WarehouseID = this.InventoryDetailForm.get('WareHouseName').value;
    lBSINVInventoryDetail.BinID = this.InventoryDetailForm.get('BinName').value;
    lBSINVInventoryDetail.MinimumStock = this.InventoryDetailForm.get('MinimumStock').value;
    lBSINVInventoryDetail.MaximumStock = this.InventoryDetailForm.get('MaximumStock').value;
    lBSINVInventoryDetail.MinimumOrder = this.InventoryDetailForm.get('MinimumOrder').value;
    lBSINVInventoryDetail.AverageCost = this.InventoryDetailForm.get('AverageCost').value;
    lBSINVInventoryDetail.StandardCost = this.InventoryDetailForm.get('StandardCost').value;
    lBSINVInventoryDetail.LastCost = this.InventoryDetailForm.get('LastCost').value;
    lBSINVInventoryDetail.AvailableQuantity = this.InventoryDetailForm.get('AvailableQuantity').value;
    lBSINVInventoryDetail.InventoryGLClassificationID = this.InventoryDetailForm.get('InventoryGLClassificationID').value;
    lBSINVInventoryDetail.AllowNegative = this.InventoryDetailForm.get('AllowNegative').value;
    if (this.Mode == 'Add') {

      this.inventoryDetailService.addInventoryDetail(lBSINVInventoryDetail).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Inventory Details added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindWareHouse();
            this.Mode = 'List';
          }
          else {
            this.DetailID = resp.data.id;
            this.BindWareHouse();
            this.Edit(resp.data.id);
            this.BindWareHouse();
            this.Mode = 'Edit';
          }
          this.Loading = false;
        }
        else {

        }
      }, (error) => {
        // console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    else if (this.Mode == 'Edit') {

      lBSINVInventoryDetail.ID = this.InventoryDetailForm.get('ID').value;
      this.inventoryDetailService.updateInventoryDetail(lBSINVInventoryDetail).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Inventory Details updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindWareHouse();
          }
          else {
            this.DetailID = this.InventoryDetailForm.get('ID').value;
            this.BindWareHouse();
            this.Edit(this.InventoryDetailForm.get('ID').value);
          }
        }
        else {

        }

      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    this.Loading = false;
  }
  //To Delete a Record

  onDeleteChecked(ProductID,ID, warehouseID, qty, deleteStatus) {
    debugger;
    console.log(this.RowData);
    this.inventoryDetailService.AvailableStocktoDeleteWarehouse(ID,ProductID, warehouseID).subscribe((resp: any) => {
      this.availbleStock = resp.data.availableStock;
      debugger;
      if((resp.data.availableStock !=null ||resp.data.availableStock=='null')&& resp.data.availableStock!="0")
      {
        this.toastr.warning('This Warehouse is in Use, Cant Delete!');
        
      }
      this.BindInventoryDetails();

      // if (this.availbleStock != "0" && this.availbleStock != null) {
      //   //alert(this.availbleStock);
      //   this.toastr.warning('This Warehouse is in Use, Cant Delete!');
      // }
      // if (this.availbleStock == "0") {
      //   //alert(this.availbleStock);
      //   this.ActionName = 'Update';
      //   this.Loading = true;
      //   this.inventoryDetailService.deleteInventoryDetailsByID(ID, warehouseID, localStorage.getItem('LoginID'), this.ActionName).subscribe((resp: any) => {
      //     this.Mode = 'List';
      //     this.BindInventoryDetails();
      //   }, (error) => {
      //     console.error('Problem with the sevice. Please try later : ' + error);
      //   });
      // }
      // if (this.availbleStock == null) {
      //   //alert(this.availbleStock);
      //   this.ActionName = 'Delete';
      //   this.Loading = true;
      //   this.inventoryDetailService.deleteInventoryDetailsByID(ID, warehouseID, localStorage.getItem('LoginID'), this.ActionName).subscribe((resp: any) => {
      //     this.Mode = 'List';
      //     this.BindInventoryDetails();
      //   }, (error) => {
      //     console.error('Problem with the sevice. Please try later : ' + error);
      //   });
      // }
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });

    // if (qty <= 0) {
    //   this.ActionName = 'Delete';
    //   this.Loading = true;
    //   this.inventoryDetailService.deleteInventoryDetailsByID(ID, warehouseID, localStorage.getItem('LoginID'), this.ActionName).subscribe((resp: any) => {
    //     this.Mode = 'List';
    //     this.BindInventoryDetails();
    //   }, (error) => {
    //     console.error('Problem with the sevice. Please try later : ' + error);
    //   });
    // }
    // else {
    //   //this.toastr.warning('Already transction happened for this Warehouse so can not delete');
    //   this.ActionName = 'Update';
    //   this.Loading = true;
    //   this.inventoryDetailService.deleteInventoryDetailsByID(ID, warehouseID, localStorage.getItem('LoginID'), this.ActionName).subscribe((resp: any) => {
    //     this.Mode = 'List';
    //     this.BindInventoryDetails();
    //   }, (error) => {
    //     console.error('Problem with the sevice. Please try later : ' + error);
    //   });
    // }
  }
  onDeleteCheckedInactive(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryDetail', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindInventoryDetails();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //Cancel the Add/Edit
  Cancel() {
    //this.ResetForm();
    this.WareHouseBins = [];
    this.Mode = 'List';
    let InventoryDetail = {
      productID: "-1",
      warehouseID: "-1",
      binID: "-1"
    };
    // this.AgEdit(InventoryDetail);
    this.ResetForm();
    this.BindInventoryDetails();
  }
  Reset() {
    this.InventoryDetailForm.patchValue({
      ID: null,
      ProductName: "-1",
      WareHouseName: "-1",
      BinName: "-1",
      binID: null,
      MinimumStock: 0,
      MaximumStock: 0,
      MinimumOrder: 0,
      AverageCost: 0,
      StandardCost: 0,
      LastCost: 0,
      AvailableQuantity: 0,
      InventoryGLClassificationID: null,
      AllowNegative: false
    });
  }
  OnActionClick(event: any) {
    debugger;
    var colId = event.column.getId();

    if (colId == 'Edit') {

      this.Mode = 'Edit';
      this.DetailID = event.data.id;
      this.ProductID = event.data.productID;
      this.WarehouseID = event.data.warehouseID;
      // alert(this.WarehouseID + ' - ' + this.ProductID)
      this.BindWareHouse();
      this.AgEdit(event.data)
    } else if (colId == 'Delete') {
      if(event.data.deleted)
      {
        this.onDeleteCheckedInactive(event.data.id)
      }
      else{
        this.onDeleteChecked(event.data.productID,event.data.id, event.data.warehouseID, event.data.availableQuantity, event.data.deleteStatus)
      }
      
    }
    else if (colId == 'Price') {
      this.SelectedLocationName = event.data.wareHouseName;//+ ' - ' + event.data.binName;
      this.WareHouseID = event.data.warehouseID;
      this.BindInventoryWareHousePriceDetails();
      this.Mode = 'Price';
    }
    else if (colId == 'Detail') {
      this.WarehouseID = event.data.warehouseID;
      this.Mode = 'InventoryStockAllocationDetails';
    }
  }//
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  CustomPriceIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-usd"></i></div>';
    return cellContent
  }
  AgEdit(event) {
    console.log(event.id);
    this.InventoryDetailForm.patchValue({
      ID: event.id,
      ProductName: event.productID,
      WareHouseName: event.warehouseID,
      BinName: event.binID,
      MinimumStock: event.minimumStock_text,
      MaximumStock: event.maximumStock_text,
      MinimumOrder: event.minimumOrder_text,
      AverageCost: event.averageCost_text,
      StandardCost: event.standardCost_text,
      LastCost: event.lastCost_text,
      AvailableQuantity: event.availableQuantity_text,
      InventoryGLClassificationID: event.inventoryGLClassificationID,
      AllowNegative: event.allowNegative
    });
    if (this.IsActive) {
      this.InventoryDetailForm.enable();
    } else {
      this.InventoryDetailForm.disable();
    }
    if (event.deleteStatus == 'Active') {
      this.InventoryDetailForm.enable();
      this.IsActivebutton = true;
    } else {
      this.InventoryDetailForm.disable();
      this.IsActivebutton = false;
    }
    if (!this.IsInventoryActive) {
      //this.InventoryDetailForm.disable();
    }
    this.onWareHouseChange(event.warehouseID);
    this.InventoryDetailForm.get('AvailableQuantity').disable();
    this.InventoryDetailForm.get('AverageCost').disable();
    if(Number(this.InventoryDetailForm.get('LastCost').value==0))
    {
     this.InventoryDetailForm.get('LastCost').disable();// bug 1097
    }
    else{
      this.InventoryDetailForm.get('LastCost').enable();
    }
    
    this.InventoryDetailForm.get('WareHouseName').disable();
  }
  ResetForm() {
    /* this.InventoryDetailForm.patchValue({
      ID: [''],
      WareHouseName: ['-1'],
      ProductName: ['-1'],
      BinName: [null],
      MinimumStock: [''],
      MaximumStock: [''],
      MinimumOrder: [''],
      AverageCost: [''],
      StandardCost: [''],
      LastCost: [''],
      AvailableQuantity: [''],
      InventoryGLClassificationID: [''],
      AllowNegative: ['']
    }); */
    this.InventoryDetailForm.patchValue({
      ID: null,
      ProductName: null,
      WareHouseName: null,
      BinName: null,
      binID: null,
      MinimumStock: 0,
      MaximumStock: 0,
      MinimumOrder: 0,
      AverageCost: 0,
      StandardCost: 0,
      LastCost: 0,
      AvailableQuantity: 0,
      InventoryGLClassificationID: null,
      AllowNegative: false
    });
    this.InventoryDetailForm.markAsTouched();
    this.InventoryDetailForm.markAsPristine();
    this.Submitted = false;
  }

  onWareHouseChange(ID) {
    this.WareHouseBins = [];
    if (ID != "-1") {
      this.wareHouseBinService.getWareHouseBinByWareHouseID(ID).subscribe((resp: any) => {
        this.WareHouseBins = resp.data.warehousebin;

      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }



  /* ------------------ FOR WAREHOUSEPRICE------------------------------- */
  OnCancelPrice(InventoryProductPrice) {

    this.BindInventoryDetails();
  }

  OnCancelAllocation(InventoryAllocation) {
    debugger;
    this.BindInventoryDetails();
  }

  OnAddPrice(InventoryPrice) {
    debugger;
    let _LBS_INV_InventoryWareHousePrice = new LBS_INV_InventoryWareHousePrice();
    _LBS_INV_InventoryWareHousePrice = InventoryPrice;
    _LBS_INV_InventoryWareHousePrice.CompanyID = this.CompanyId;
    _LBS_INV_InventoryWareHousePrice.ProductID = this.InventryID;
    _LBS_INV_InventoryWareHousePrice.WareHouseID = this.WareHouseID;
    if (this.WareHousePriceID) {
      _LBS_INV_InventoryWareHousePrice.ID = this.WareHousePriceID;

      this.WareHousePriceService.updateInventoryWareHousePrice(_LBS_INV_InventoryWareHousePrice).subscribe((resp: any) => {

        this.toastr.success('Inventories updated successfully')
        {
          // this.ResetForm();
          //this session storage Set from InventryPrice Component
          var saveaction = sessionStorage.getItem("saveAction");
          if (saveaction == 'Close') {
            this.BindInventoryWareHousePriceDetails();
            this.Mode = 'List';
          }
        }

      }, (error) => {
        // console.error('Problem with the sevice. Please try later : ' + error);
      });
    } else {


      this.WareHousePriceService.addInventoryWareHousePrice(_LBS_INV_InventoryWareHousePrice).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success(' Inventory details added successfully');
          // alert(resp.message);
          //this.ResetForm();
          this.BindInventoryWareHousePriceDetails();
          this.Mode = 'List';
          this.Loading = false;
        }
        else {
          alert(resp.message);
        }
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }

  BindInventoryWareHousePriceDetails() {
    this.Mode = "List";
    this.AgLoad = false;
    this.BindInventoryPrice = [];
    this.WareHousePriceID = "";
    this.WareHousePriceService.getInventoryWareHouseByInventryID(this.InventryID, this.WareHouseID).subscribe((resp: any) => {
      console.log(resp);
      debugger;
      if (resp.data.inventoryWareHousePricedetails) {
        this.BindInventoryPrice = resp.data.inventoryWareHousePricedetails[0];
        if (this.BindInventoryPrice) {
          this.WareHousePriceID = resp.data.inventoryWareHousePricedetails[0].id;
        }
        // this.RowData = resp.data.inventorydetails;
        this.Loading = false;

      }
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  OnchaneMin(event) {
    debugger;
    var max = this.InventoryDetailForm.get('MaximumStock').value;
    if (Number(event) > Number(max)) {
      this.InventoryDetailForm.patchValue({
        MinimumStock: max
      })
      this.toastr.warning('Minimun stock cannot be gretter than Maximun stock');

    }
    else {

    }
  }
  // OnchaneMin()
  // {
  //   debugger;
  //   var max= this.InventoryDetailForm.get('MaximumStock').value;
  //   if(Number(max)>Number(event))
  //   {
  //     this.toastr.warning('Minimun stock cannot be greter than Maximun stock')
  //     this.InventoryDetailForm.patchValue({
  //       MinimumStock:max
  //     })
  //   }
  //   else
  //   {

  //   }

  //}
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
