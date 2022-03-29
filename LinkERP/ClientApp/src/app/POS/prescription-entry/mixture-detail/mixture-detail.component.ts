import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InventoryDetailService } from 'src/app/inv/services/inventory-detail.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { PrescriptionEntryService } from 'src/app/pos/services/prescription-entry.service';
import { LBSSOPPrescriptionEntry } from 'src/app/models/pos/lbs_sop_prescriptionentry';
import { LbsSopMixture } from 'src/app/models/pos/lbs-sop-mixture';
import { BsModalRef } from 'ngx-bootstrap';
import { PriceGroupsService } from 'src/app/inv/services/price-groups.service';
@Component({
  selector: 'app-mixture-detail',
  templateUrl: './mixture-detail.component.html',
  styleUrls: ['./mixture-detail.component.css']
})
export class MixtureDetailComponent implements OnInit {
  @Input() WarehouseID: any;
  @Input() ModuleName: any;
  @Input() PrescriptionID: any;
  ProductDetails: any = [];
  @Output() OnCancel = new EventEmitter();
  ProductCode: any = '';
  ProductName: any = '';
  Quantity: any = 0;
  TotalQuantity: number = 0.00;
  Total: number = 0;
  TotalPrice: number = 0.00;
  @Output() change = new EventEmitter<any>();
  @Output() OnActionEdit = new EventEmitter<any>();
  @Input() VendorId: any;
  @Input() Action: any;
  public ID: any;
  public checkedList: any = [];
  modalRef: BsModalRef;
  public unitPrice: number = 0;
  PriceGroupID: any;
  public selectedID: any;
  selectedValues: any = [];
  public selectedIds: any = [];
  isSelected: any = false;
  constructor(private sysCommonService: SysCommonService, private inventoryDetailService: InventoryDetailService, private toastr: ToastrService, private prescriptionService: PrescriptionEntryService, private priceservice: PriceGroupsService) { }
  Products: any = [];
  isClicked: any = false;
  public mixtureID: any;
  ngOnInit() {
    //debugger;
    //if (!this.isClicked)
    this.GetMixtureDetailsByID();
  }
  onMedChange(obj) {
    debugger;
    this.isSelected = true;
    this.ID = obj;
    this.inventoryDetailService.getInventoryDetailByID(obj).subscribe((resp: any) => {
      this.ProductCode = resp.data.inventorydetails.productCode;
      this.ProductName = resp.data.inventorydetails.productName;
      this.PriceGroupID = resp.data.inventorydetails.priceGroupID;
      if (this.PriceGroupID != null) {
        this.priceservice.getPriceGroupByID(this.PriceGroupID).subscribe((resp: any) => {
          console.log(resp);
          if (resp.isSuccess == true) {
            this.unitPrice = resp.data.priceDetails.price1;
            this.unitPrice = null ? 0.00 : this.unitPrice;
          }
        });
      }
    }, (error: any) => {
    });
  }
  Clear() {
    // this.ID = '';
    // this.ProductCode = '';
    // this.ProductName = '';
    // this.Quantity = 0;
    // this.Total = 0;
    // this.unitPrice = 0;
    // this.Products = [];
    // this.ProductDetails = [];
    this.TotalPrice = 0.00;
    this.TotalQuantity = 0;
    this.GetMixtureDetailsByID();
  }
  AddMixture(id, code, name, qty, total, unitPrice) {
    debugger;
    this.isClicked = true;
    this.Products = [{ 'productID': id, 'productCode': code, 'productName': name, 'quantity': qty, 'total': total, 'unitPrice': unitPrice }];
    this.Products.forEach(product => {
      this.ProductDetails.push(product);
      this.TotalQuantity += parseFloat(product.quantity);
      this.Total += parseFloat(product.unitPrice) * parseFloat(product.quantity);
      product.total = this.Total;
      this.TotalPrice += this.Total;
    });
    this.ProductName = '';
    this.ProductCode = '';
    this.Quantity = 0;
    this.unitPrice = 0;
    this.Total = 0;
  }
  SaveMixture(data) {
    debugger;
    let mixture = new LbsSopMixture();
    if (data != null || data != 'undefined') {
      for (var i = 0; i < data.length; i++) {
        mixture.CompanyID = localStorage.getItem('CompanyID');
        mixture.ProductID = data[i].productID;
        mixture.ProductCode = data[i].productCode;
        mixture.ProductName = data[i].productName;
        mixture.Quantity = data[i].quantity;
        mixture.UnitPrice = parseFloat(data[i].unitPrice);
        mixture.Tax = 0.00;
        mixture.Total = parseFloat(data[i].unitPrice) * parseFloat(data[i].quantity);
        mixture.UnitCost = 0.00;
        mixture.PrescriptionID = this.PrescriptionID;
        mixture.WareHouseID = this.WarehouseID;
        mixture.Deleted = 0;
        mixture.CreatedBY = localStorage.getItem('LoginID');
        mixture.PrescriptionLineNumber = i + 1;
        mixture.MixtureID = data[i].id;
        this.prescriptionService.AddMixture(mixture).subscribe((resp: any) => {
          if (resp.isSuccess) {
            this.toastr.success('Mixture saved Successfully');
            this.OnCancel.emit();
            this.OnActionEdit.emit(this.PrescriptionID);
          }
        }, (error: any) => {
        });
      }
    }
    else {
      this.toastr.error('No Data to Save!');
    }
  }
  onCheckbxChange(id, event) {
    debugger;
    this.selectedID = id;
    if (event.target.checked) {
      this.checkedList.push(id);
    } else {
      for (var i = 0; i < this.ProductDetails.length; i++) {
        if (this.checkedList[i] == id) {
          this.checkedList.splice(i, 1);
        }
      }
    }
    console.log(this.checkedList);
  }
  DeleteMixture() {
    debugger;
    if (this.checkedList.length > 0) {
      for (var i = 0; i < this.ProductDetails.length; i++) {
        this.checkedList.forEach(row => {
          if (this.ProductDetails[i].id == row) {
            this.TotalQuantity -= parseFloat(this.ProductDetails[i].quantity);
            this.TotalPrice -= parseFloat(this.ProductDetails[i].total);
            this.ProductDetails.splice(i, 1);
          }
        });
      }
      this.checkedList = [];
    }
    else {
      this.toastr.error('Please select any Record to Delete');
    }
  }
  getUnitPrice(ID: any): any {
    debugger;
    if (ID == 'undefined' || ID == null) {
      this.unitPrice = 0.00;
    }
    else {
      this.priceservice.getPriceGroupByID(ID).subscribe((resp: any) => {
        console.log(resp);
        if (resp.isSuccess == true) {
          this.unitPrice = resp.data.priceDetails.price1;
          this.unitPrice = null ? 0.00 : this.unitPrice;
        }
      });
    }
  }
  GetMixtureDetailsByID() {
    debugger;
    //this.isClicked = false;
    this.ProductDetails = [];
    this.prescriptionService.GetMixtureDetailsByID(this.PrescriptionID).subscribe((resp: any) => {
      if (resp.isSuccess) {
        this.ProductDetails = resp.data.mixture;
        this.ProductDetails.forEach(product => {
          this.mixtureID = resp.data.mixture.id;
          this.TotalQuantity += parseFloat(product.quantity);
          this.TotalPrice += parseFloat(product.total);
        });
        this.ProductName = '';
        this.ProductCode = '';
        this.Quantity = 0;
        this.unitPrice = 0;
        this.Total = 0;
      }
    }, (error: any) => {
    });
  }
  Close() {
    this.OnActionEdit.emit(this.PrescriptionID);
  }
}