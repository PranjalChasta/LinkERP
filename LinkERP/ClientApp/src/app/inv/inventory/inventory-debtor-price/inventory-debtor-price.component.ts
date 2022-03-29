import { Component, OnInit, Input } from '@angular/core';
import { LBSINVInventoryDebtorPrice } from 'src/app/models/inv/lbs-inv-inventorydebtorprice';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { InventoryDebtorPriceService } from '../../services/inventory-debtor-price.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { ToastrService } from 'ngx-toastr';
import { PurCommonService } from 'src/app/pur/services/pur-common.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { CustomValidators } from 'ngx-custom-validators';

@Component({
  selector: 'app-inventory-debtor-price',
  templateUrl: './inventory-debtor-price.component.html',
  styleUrls: ['./inventory-debtor-price.component.css']
})
export class InventoryDebtorPriceComponent implements OnInit {
  @Input() InventryID: any;
  @Input() IsInventoryActive: boolean;
  Mode: any = 'List';
  InventoryDebtorForm: FormGroup;
  CompanyId = localStorage.getItem('CompanyID');
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  inventoryDebtors: any;
  BindInventoryPrice: any;
  CustomerID: any;
  DebtorPriceID: any;
  IsDebtorload: boolean;
  CustomerName: any;
  read_Access: any;
  write_Access: any;
  delete_Access: any;
  all_Access: any;
  // IsCustomer:boolean;
  constructor(private sysCommonService: SysCommonService, private FB: FormBuilder,
    private debtorPriceService: InventoryDebtorPriceService,
    private toastr: ToastrService, private deleteRecordsService: DeleteRecordsService,
    private purCommonService: PurCommonService,
    private cryptoAes: CryptoAes
  ) { }

  ngOnInit() {
    this.IsDebtorload = false;
    this.AgLoad = false;
    this.Mode = "List";
    this.ColumnDefs = [
      //{ headerName: 'Promotion Type', field: 'promotionType', sortable: true, filter: true, checkboxSelection: false },
      // { headerName: 'DateFrom', field: 'promotionDateFrom', sortable: true, filter: true },
      /* { headerName: 'Percentage', field: 'markupPercentage', sortable: true, filter: true },
      { headerName: 'Break1', field: 'quantityBreak1', sortable: true, filter: true },
      { headerName: 'Break2', field: 'quantityBreak2', sortable: true, filter: true, checkboxSelection: false }, */
      { headerName: 'Customer Code', field: 'customerCode', sortable: true, filter: true },
      { headerName: 'Customer Name', field: 'customerName', sortable: true, filter: true },
      { headerName: 'Price Break1', field: 'priceBreak1_text', sortable: true, filter: true },
      // { headerName: 'PriceBreak2', field: 'priceBreak2', sortable: true, filter: true },
      //{ headerName: 'Quantity Break1', field: 'quantityBreak1', sortable: true, filter: true },
      // { headerName: 'Date Created', field: 'dateCreated', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Price', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false },
      { headerName: '', field: 'Delete', cellRenderer: this.CustomDeleteIconFunc, type: 'Action', hide: !this.IsInventoryActive },
      /* { headerName: '', field: 'Price', cellRenderer: this.CustomPriceIconFunc, type: 'Action', hide: false } */

    ];

    this.InventoryDebtorForm = this.FB.group({
      ID: [''],
      Vendor: ['-1'],
      VendorWareHouse: ['-1'],
      PurchaseUOM: ['-1'],
      VendorSKU: [''],
      VendorBarCode: [''],
      Default: [''],
      LastPurchasedDate: [''],
      DateCreated: [''],
      LastPurchasedUnitPrice: [''],
      CustomerName: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')]
    })

    this.BindInventoryDebtorPrice();
    this.BindCustomers();
  }

  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "201");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.InventoryDebtorForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryDebtorForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryDebtorForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }

  BindInventoryDebtorPrice() {
    this.Mode = 'List';
    //this.Loading = true;
    this.AgLoad = false;
    this.sysCommonService.getInventoryDebtorPrice(this.InventryID).subscribe((resp: any) => {
      this.inventoryDebtors = resp.data.inventoryDebtorPrice;
      this.RowData = resp.data.inventoryDebtorPrice;
      console.log( this.RowData )
      this.AgLoad = true;
      //  this.Loading = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  AddNew(): void {

    this.BindInventoryPrice = [];
    this.DebtorPriceID = "";
    this.Mode = "Price";
    this.IsDebtorload = true;
    // this.IsCustomer=true;
    // this.Mode = 'Price';
    // this.read=true;
  }

  Cancel() {
    // this.ResetForm();
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
  CustomPriceIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-usd"></i></div>';
    return cellContent
  }
  OnActionClick(event: any) {
    debugger;
    this.IsDebtorload = false;
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Mode = 'Edit';
      this.IsDebtorload = true;
      this.BindInventoryPrice = event.data;
      //this.AgEdit(event.data)
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
    else if (colId == 'Price') {
      this.IsDebtorload = true;
      this.BindInventoryPrice = event.data;
      this.DebtorPriceID = event.data.id;
      this.CustomerID = event.data.companyID;
      // this.WareHousePriceID = resp.data.inventoryWareHousePricedetails[0].id;
      this.IsDebtorload = true;
      this.Mode = 'Price';
    }
  }

  OnCancelPrice(InventoryProductPrice) {
    this.IsDebtorload = false;
    this.BindInventoryDebtorPrice();
  }

  OnAddPrice(InventoryPrice) {
    debugger;
    let _LBSINVInventoryDebtorPrice = new LBSINVInventoryDebtorPrice();
    _LBSINVInventoryDebtorPrice = InventoryPrice;
    console.log(_LBSINVInventoryDebtorPrice);
    _LBSINVInventoryDebtorPrice.CompanyID = this.CompanyId;
    _LBSINVInventoryDebtorPrice.ProductID = this.InventryID;
    _LBSINVInventoryDebtorPrice.CustomerID = InventoryPrice.PriceLevel1;//this.CustomerID;
    if (this.DebtorPriceID) {
      _LBSINVInventoryDebtorPrice.ID = this.DebtorPriceID;

      this.debtorPriceService.updateInventoryDebtorPrice(_LBSINVInventoryDebtorPrice).subscribe((resp: any) => {

        this.toastr.success('Inventories updated successfully')
        {
          //this.ResetForm();
          this.BindInventoryDebtorPrice();
          this.Mode = 'List';
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    } else {
      this.debtorPriceService.addInventoryDebtorPrice(_LBSINVInventoryDebtorPrice).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Inventory details added successfully');

          // alert(resp.message);
          // this.ResetForm();
          this.BindInventoryDebtorPrice();
          // this.Mode = 'List';
          // this.Loading = false;
        }
        else {
          alert(resp.message);
        }
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }
  BindCustomers() {
    this.debtorPriceService.getCustomersDebtorPrice(this.InventryID,'').subscribe((resp: any) => {
      console.log(resp);
      this.CustomerName = resp.data.customers;
    }, (error) => {
      //this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  onCustomerChange(ID) {
    if (ID != "-1") {
      this.Mode = "Price"
      this.CustomerID = ID;
    } else {
      this.Mode = "list"
    }
  }

  onDeleteChecked(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryDebtorPrice', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindInventoryDebtorPrice();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}
