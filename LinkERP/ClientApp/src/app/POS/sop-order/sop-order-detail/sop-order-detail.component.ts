import { Component, OnInit, EventEmitter, Output, Input, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { PriceGroupsService } from 'src/app/inv/services/price-groups.service';
import { EnumExtension } from 'src/app/shared/enums/enum-extension';
import { ProductType } from 'src/app/shared/enums/product-type';
import { LandedCostImportCostService } from 'src/app/pur/services/landed-cost-import-cost.service';
import { CustomValidators } from 'ngx-custom-validators';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { SopOrderService } from '../../services/sop-order.service';
import { LbsSopOrderDetail } from 'src/app/models/pos/lbs_pos_orderDetail';
import { LBS_SOP_ReceiptsMain } from 'src/app/models/pos/lbs_sop_reciptdetails';

@Component({
  selector: 'app-sop-order-detail',
  templateUrl: './sop-order-detail.component.html',
  styleUrls: ['./sop-order-detail.component.css']
})
export class SopOrderDetailComponent implements OnInit {
  @Input() OrderMainID: any;
  @Input() WarehouseID: any;
  @Input() SelctedDebtorID: any;
  @Output() Cancel = new EventEmitter();
  @Output() SetQuantity = new EventEmitter();
  @Input()SalesOredertype:any;
  @Input()SalesOrderTypeList:any;
  ChangeGiven:any;
  public RowData: any = [];
  OrderDetailForm: FormGroup;
  OrderDetailData: any = [];
  submitted: boolean;
  CompanyID = localStorage.getItem('CompanyID');
  taxcodes: any;
  posInventoryType: any;
  inventoryList: any;
  InventoryUnitOfMeasure: any[];
  UOMList: any;
  Mode: string = 'OrderDetail';
  submitName: string = "Add Order Detail";
  taxDetails: boolean;
  modalRef: BsModalRef;
  selectedTaxId: any;
  selectedLineNum;
  selectedDetailID;
  selectedInventoryID;
  makeAsTextBox: boolean;
  selectedOrderDetailId: any;
  Loading: boolean;
  PriceGroupID: any;
  SerialisedProduct: any;
  SelectedproductID: any;
  SelectedQuantity: any;
  SelectedUnitprice: any;
  SelectedDiscount: any;
  @Input() RevisedQty: number;
  SelectedTotal: any;
  public selectedRow: any;
  @Input() SelectedNewRow: any;
  @Input() SelectedNewRowVal: any;
  @Input() OrderStatus: boolean;
  selectedRowValue: any;
  TotalSum:any;
  total: any;
  ReceiptMainID:any;
  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private sysCommonService: SysCommonService,
    private priceservice: PriceGroupsService,
    private landedImportCostService: LandedCostImportCostService,
    private modalService: BsModalService,
    private sopOrderService: SopOrderService
  ) { }

  ngOnInit() {
    debugger;
    console.log(this.SalesOrderTypeList);
    if (this.RevisedQty != undefined) {
      this.AddNewrow();
      //this.changedetails(this.SelectedNewRow, this.SelectedNewRowVal);
    }
    else {
      this.Loading = true;
      this.posInventoryType = EnumExtension.getNamesAndValuestring(ProductType);
      this.CreateForm();
      //     this.BindInventoryDetail();
      this.onChanges();
      this.BindUOM();
      this.BindGetTaxCode();
      setTimeout(() => {
        this.BindOrderDetails();
      }, 1000);
    }
     
  }
  get f() { return this.OrderDetailForm.controls; }

  CreateForm() {
    this.OrderDetailForm = this.FB.group({
      ID: [''],
      LineNum: [''],
      InventoryType: ['INV'],
      ProductID: ['-1', CustomValidators.notEqual('-1')],
      Description: [''],
      ProductWeight: [0.00],
      ProductCubic: [0.00],
      DecimalPlaces: [0],
      InventoryGLClassification: [''],
      InventoryCost: [0.0000, Validators.required],
      TransactionQuantity: [0.0000, Validators.required],
      UOM: ['-1', CustomValidators.notEqual('-1')],
      DiscountType: ['-1', CustomValidators.notEqual('-1')],
      UnitPrice: [0.0000, Validators.required],
      DiscountAmount: [0.0000],
      TaxID: ['-1', CustomValidators.notEqual('-1')],
      TaxRate: ['0.0000'],
      TaxLabel: [''],
      LineTotalExcludingTax: [''],
      LineTotalTaxAmount: [''],
      LineTotalIncludingTax: ['0.0000'],
      WarrantyPeriod: ['0.0000'],
      WarrantyNotes: ['0.0000']
    });
  }

  onChanges() {
    //When Inventory Type Changes
    this.OrderDetailForm.get('InventoryType').valueChanges.subscribe(val => {
      if (val == 'INV') {
        this.makeAsTextBox = false;
        this.BindInventoryDetail();
      } else if (val == 'Non') {
        //Non Inventory Item
        this.makeAsTextBox = true;
        this.OrderDetailForm.patchValue({
          'Description': '',
          'ProductID': '',
          'ProductWeight': '',
          'ProductCubic': '',
          'DecimalPlaces': '',
          'InventoryGLClassification': '',
          'InventoryCost': '',
          'TransactionQuantity': '',
          'WarrantyPeriod': '',
          'WarrantyNotes': ''
        });
      } else {
        //Comment
        // this.OrderDetailForm.disable();
        // this.OrderDetailForm.get('InventoryType').enable();
        // this.OrderDetailForm.get('Description').enable();
      }
    });
  }
  //When Product Changes
  onProductChange(e) {
    debugger;
    //let val = e.target.value;
    let invDetails = this.inventoryList.filter(x => x.productID == e);
    this.OrderDetailForm.patchValue({
      'Description': invDetails[0].productName,
      'ProductID': invDetails[0].productID,
      'ProductWeight': invDetails[0].productWeight,
      'ProductCubic': invDetails[0].productCubic,
      'DecimalPlaces': invDetails[0].decimalPlaces,
      'InventoryGLClassification': invDetails[0].inventoryGLClassification,
      'InventoryCost': invDetails[0].inventoryDefaultCost,
      'TransactionQuantity': "1.00",
      'UOM': invDetails[0].unitOfMeasureID,
      'WarrantyPeriod': '',
      'WarrantyNotes': ''
    });
  }

  BindGetTaxCode() {
    this.landedImportCostService.getTaxCode().subscribe((resp: any) => {
      this.taxcodes = resp.data.taxDetails;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindInventoryDetail() {
    this.sopOrderService.GetInventoryDetail(this.WarehouseID).subscribe((resp: any) => {
      this.inventoryList = resp.data.inventoryDetails;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindUOM() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_UnitOfMeasure).subscribe((resp: any) => {
      this.UOMList = resp.data.tabledata;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindOrderDetails() {
    this.sopOrderService.GetAllOrderDetails(this.OrderMainID).subscribe((resp: any) => {
      this.OrderDetailData = resp.data.order;
      this.RowData = resp.data.order;
      console.log(this.OrderDetailData);
      console.log(this.inventoryList);

      for (let i = 0; i < this.OrderDetailData.length; i++) {
        if (this.OrderDetailData[i].inventoryType == 'INV') {
          let invDetails = this.inventoryList.filter(x => x.productID == this.OrderDetailData[i].productID);
          this.OrderDetailData[i].productName = invDetails[0].productName;
          if (invDetails[0].useWareHousePrice) {
            this.OrderDetailData[i].useWareHousePrice = true;
            this.PriceGroupID = invDetails[0].priceGroupID;
          } else {
            this.OrderDetailData[i].useWareHousePrice = false;
          }

          if (invDetails[0].productStyleMatrixEnabled) {
            this.OrderDetailData[i].productStyleMatrixEnabled = true;
          } else {
            this.OrderDetailData[i].productStyleMatrixEnabled = false;
          }

        } else {
          this.OrderDetailData[i].productName = this.OrderDetailData[i].productID;
          this.OrderDetailData[i].useWareHousePrice = false;
        }
      }
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  Close() {
    this.Cancel.emit();
  }

  //Delete Order Detail Row
  deleteOrderDetailRow(ID) {
    this.sopOrderService.DeleteOrderDetailByID(ID, 'LBS_POS_OrderDetail', localStorage.getItem('LoginID')).subscribe((response) => {
      if (response) {
        this.toastr.success("Order detail row has been deleted successfully");
      }
    })
  }

  onTaxIDChanged($event) {
    let taxID = $event.target.value;
    if (taxID != '-1') {
      this.taxDetails = true;
    }
    let result = this.taxcodes.filter(x => x.id == taxID)
    if (result) {
      this.OrderDetailForm.patchValue({ TaxRate: result[0].taxRate, TaxLabel: result[0].taxLabel });
    }
  }

  TaxDetail(taxLabel: TemplateRef<any>, taxID, id) {
    this.selectedTaxId = taxID;
    this.selectedOrderDetailId = id;
    this.modalRef = this.modalService.show(taxLabel);
  }
  ProductStyleMatrixDetail(data: TemplateRef<any>, orderdetail) {
    this.selectedOrderDetailId = orderdetail.id;
    this.selectedInventoryID = orderdetail.productID;
    this.SerialisedProduct = orderdetail.serialisedProduct;
    this.modalRef = this.modalService.show(data);
  }
  // SerialisedProductDetail(serial: TemplateRef<any>, orderdetail) {
  //   this.selectedOrderDetailId = orderdetail.id;
  //   this.selectedInventoryID = orderdetail.productID;
  //   this.SerialisedProduct = orderdetail.serialisedProduct;
  //   this.modalRef = this.modalService.show(serial);
  // }

  closePopUp() {
    this.modalRef.hide();
  }
  ProductMatrixSave(data)
  {
    console.log(data)
   this.total=data.Total;
  }
  SerializedProductSave(Data)
  {
    console.log(Data)
  }
  AddKIT(orderDetail) {
    this.Mode = 'Kit';
    this.selectedDetailID = orderDetail.id;
    this.selectedInventoryID = orderDetail.productID;
    this.selectedLineNum = orderDetail.lineNum;
  }
  AddPriceGroup(orderDetail) {
    this.Mode = 'PriceScheme';
    this.selectedDetailID = orderDetail.id;
    this.selectedInventoryID = orderDetail.productID;
    this.selectedLineNum = orderDetail.lineNum;
  }

  ResetForm() {
    this.OrderDetailForm.patchValue({
      ID: '',
      LineNum: '',
      InventoryType: 'INV',
      ProductID: '-1',
      Description: '',
      ProductWeight: 0.00,
      ProductCubic: 0.00,
      DecimalPlaces: '',
      InventoryGLClassification: '',
      InventoryCost: 0.0000,
      TransactionQuantity: 1.00,
      UOM: '-1',
      DiscountType: '-1',
      UnitPrice: 0.0000,
      DiscountAmount: 0.0000,
      TaxID: '-1',
      TaxRate: '0.0000',
      TaxLabel: '',
      LineTotalExcludingTax: '0.0000',
      LineTotalTaxAmount: '0.0000',
      LineTotalIncludingTax: '0.0000',
      WarrantyPeriod: '',
      WarrantyNotes: ''
    });
    this.OrderDetailForm.markAsUntouched();
    this.OrderDetailForm.markAsPristine();
    this.submitted = false;
  }

  EditOrderDetailRow(data) {

    this.Mode = 'OrderDetail';
    this.submitName = "Update Order Detail";
    data.inventoryType == 'INV' ? this.makeAsTextBox = false : this.makeAsTextBox = true;
    this.OrderDetailForm.patchValue({
      ID: data.id,
      LineNum: data.lineNum,
      InventoryType: data.inventoryType,
      ProductID: data.productID,
      Description: data.description,
      ProductWeight: data.productWeight.toString().indexOf(".") !== -1 ? data.productWeight : data.productWeight + ".00",
      ProductCubic: data.productCubic.toString().indexOf(".") !== -1 ? data.productCubic : data.productCubic + ".00",
      DecimalPlaces: data.decimalPlaces,
      InventoryGLClassification: data.inventoryGLClassification,
      InventoryCost: data.inventoryCost.toString().indexOf(".") !== -1 ? data.inventoryCost : data.inventoryCost + ".0000",
      TransactionQuantity: data.transactionQuantity.toString().indexOf(".") !== -1 ? data.transactionQuantity : data.transactionQuantity + ".00",
      UOM: data.uom,
      DiscountType: data.discountTypeValue,
      UnitPrice: data.unitPrice.toString().indexOf(".") !== -1 ? data.unitPrice : data.unitPrice + ".0000",
      DiscountAmount: data.discountAmount.toString().indexOf(".") !== -1 ? data.discountAmount : data.discountAmount + ".0000",
      TaxID: data.taxID,
      TaxRate: data.taxRate.toString().indexOf(".") !== -1 ? data.taxRate : data.taxRate + ".0000",
      TaxLabel: data.taxLabel,
      LineTotalExcludingTax: data.lineTotalExcludingTax.toString().indexOf(".") !== -1 ? data.lineTotalExcludingTax : data.lineTotalExcludingTax + ".0000",
      LineTotalTaxAmount: data.lineTotalTaxAmount.toString().indexOf(".") !== -1 ? data.lineTotalTaxAmount : data.lineTotalTaxAmount + ".0000",
      LineTotalIncludingTax: data.lineTotalIncludingTax.toString().indexOf(".") !== -1 ? data.lineTotalIncludingTax : data.lineTotalIncludingTax + ".0000"
    });
  }
  DetailsPage() {
    this.Mode = 'OrderDetail';
  }

  onSave() {
    this.submitted = true;
    if (this.OrderDetailForm.invalid) {
      return;
    }

    let submitOrderDetail: any = new LbsSopOrderDetail();

    submitOrderDetail.SalesOrderMainID = this.OrderMainID;
    submitOrderDetail.CompanyID = this.CompanyID;
    submitOrderDetail.LineNum = +this.OrderDetailForm.get('LineNum').value;
    submitOrderDetail.InventoryType = this.OrderDetailForm.get('InventoryType').value;
    submitOrderDetail.ProductID = this.OrderDetailForm.get('ProductID').value;
    submitOrderDetail.Description = this.OrderDetailForm.get('Description').value;
    submitOrderDetail.ProductWeight = this.OrderDetailForm.get('ProductWeight').value;
    submitOrderDetail.ProductCubic = this.OrderDetailForm.get('ProductCubic').value;

    submitOrderDetail.DecimalPlaces = this.OrderDetailForm.get('DecimalPlaces').value;
    submitOrderDetail.InventoryGLClassification = this.OrderDetailForm.get('InventoryGLClassification').value;

    submitOrderDetail.InventoryCost = +this.OrderDetailForm.get('InventoryCost').value;
    submitOrderDetail.TransactionQuantity = +this.OrderDetailForm.get('TransactionQuantity').value;
    submitOrderDetail.UOM = this.OrderDetailForm.get('UOM').value;
    submitOrderDetail.UnitPrice = +this.OrderDetailForm.get('UnitPrice').value;
    submitOrderDetail.DiscountType = +this.OrderDetailForm.get('DiscountType').value;

    submitOrderDetail.DiscountAmount = +this.OrderDetailForm.get('DiscountAmount').value;
    submitOrderDetail.TaxID = this.OrderDetailForm.get('TaxID').value;
    submitOrderDetail.TaxRate = this.OrderDetailForm.get('TaxRate').value;

    submitOrderDetail.TaxLabel = this.OrderDetailForm.get('TaxLabel').value;
    submitOrderDetail.LineTotalExcludingTax = +this.OrderDetailForm.get('LineTotalExcludingTax').value;

    submitOrderDetail.LineTotalTaxAmount = +this.OrderDetailForm.get('LineTotalTaxAmount').value;
    submitOrderDetail.LineTotalIncludingTax = +this.OrderDetailForm.get('LineTotalIncludingTax').value;
    submitOrderDetail.CreatedBy = localStorage.getItem('LoginID');
    if (this.Mode == 'OrderDetail') {
      this.sopOrderService.AddOrderDetails(submitOrderDetail).subscribe((response) => {
        if (response) {
          this.toastr.success("Order detail has been submitted successfully");
          this.ResetForm();
          this.BindOrderDetails();
        }
      })
    }
    else if (this.Mode == 'OrderDetail') {
      submitOrderDetail.ID = this.OrderDetailForm.get('ID').value;
      this.sopOrderService.UpdateOrderDetails(submitOrderDetail).subscribe((response) => {
        if (response) {
          this.toastr.success("Order detail has been updated successfully");
          this.ResetForm();
          this.BindOrderDetails();
          this.Mode = 'OrderDetail';
          this.submitName = "Add Order Detail";
        }
      })
    }
  }

  AddNewrow() {
    let no = 1;
    if (this.RowData.length > 0) {
      no = this.RowData.length + 1;
    }
    let object = {
      'companyID': this.CompanyID,
      'salesOrderMainID': this.OrderMainID,
      'lineNum': no,
      'inventoryType': null,
      'productID': null,
      'p_ID': null,
      'description': null,
      'productWeight': null,
      'productCubic': null,
      'places': null,
      'inventoryGLClassification': null,
      'inventoryCost': null,
      'transactionQuantity': null,
      'UOM': null,
      'unitPrice': null,
      'discountType': null,
      'lineTotalIncludingTax': null,
      'discountAmount': null,
      'taxID': null,
      'taxRate': null,
      'taxLabel': null,
      'lineTotalTaxAmount': null,
      'warrantyPeriod': null,
      'warrantyNotes': null,
      'unitOfMeasure': "00000000-0000-0000-0000-000000000000",
      'uom': '00000000-0000-0000-0000-000000000000',
      'vendorPriceSchemeID': null,
      'discountTotal': null,
      'discountGiven': null,
      'allowDiscount': null,
    }
    console.log(object);

    this.RowData.push(object);
  }
  Deleteindex(i) {
    this.RowData.splice(i, 1);
  }
  onProductChangenew(event, i) {
    //let unitCost = 0;
    console.log(event);
    let des = "";

    /*  this.PurchaseOrderDetailForm.patchValue({
       UnitCost: unitCost,
       ProductDescription:des
     });
  */
  }
  changedetails(event,matrix: TemplateRef<any>,serial: TemplateRef<any>,Kit: TemplateRef<any>, i)
   {
     debugger;
    this.selectedRow = event;
    let index = this.RowData.findIndex(c => c.p_ID == event.ID);
    if (index >= 0) {
      this.RowData[index].transactionQuantity = Number(this.RowData[index].transactionQuantity) + 1;
      if (i != index) {
        this.RowData.splice(i, 1);
      }
      this.GetTotalAmount(i);
      return;
    }

    this.RowData[i].p_ID = event.ID;
    this.RowData[i].productID = event.ID;
    if (this.RevisedQty != undefined)
      this.RowData[i].transactionQuantity = this.RevisedQty;
    else
      this.RowData[i].transactionQuantity = 1;
    this.RowData[i].description = event.Productname;
    this.RowData[i].discountAmount = 0;
    this.GetUnitPrice(this.SelctedDebtorID, event.ID, i);
    this.GetProductDetails(event.ID, i);
 
  
    //this.RowData[i].productDescription = $event.Productname;
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
   this.ProductStyleMatrix(event,matrix,serial,Kit,i)
  }

  ProductStyleMatrix(event,matrix: TemplateRef<any>,serial: TemplateRef<any>,Kit:TemplateRef<any>, i){
    this.selectedInventoryID=event.ID
    this.selectedOrderDetailId = event.ID;
    if((event.ProductStatus=="F" ||event.ProductStatus=="f") && event.ProductStyleMatrixEnabled)
    {
      this.modalRef = this.modalService.show(matrix);
    }
    else if((event.ProductStatus=="F" ||event.ProductStatus=="f") && event.SerialisedProduct)
    {
      this.modalRef = this.modalService.show(serial);
    }
    else if((event.ProductStatus=="C" ||event.ProductStatus=="c") && event.CustomKit)
    {
      this.modalRef = this.modalService.show(Kit);
    }
    // debugger;
    // this.RowData[i].transactionQuantity=this.total;
    // this.total=1;
  }
  GetUnitPrice(DebtorID, ProductID, i) {
    this.sopOrderService.getUnitPrice(DebtorID, ProductID).subscribe((response: any) => {
      console.log(response);
      if (response.data.unitprice) {
        this.RowData[i].unitPrice = Number(response.data.unitprice).toFixed(2);
      } else {
        response.data.unitprice = 0;
      }
      this.GetTotalAmount(i);
    })
  }
  GetProductDetails(ProductID, i) {
    this.sopOrderService.getProductDetails(ProductID).subscribe((response: any) => {
      console.log(response.data.product);
      this.RowData[i].taxLabel = response.data.product.cycleName;
      this.RowData[i].taxID = response.data.product.taxID;
      this.RowData[i].taxRate = response.data.product.length;
      this.RowData[i].allowDiscount = response.data.product.allowDiscount;
    })
  }
  
  GetTotalAmount(i) {
    let Quantity = this.RowData[i].transactionQuantity
    let unitPrice = this.RowData[i].unitPrice
    if (Quantity != null && unitPrice != null) {
      let res = Number(this.RowData[i].unitPrice) * Number(this.RowData[i].transactionQuantity);
      this.RowData[i].lineTotalIncludingTax = Number(res).toFixed(4);
      this.RowData[i].discountAmount = this.RowData[i].lineTotalIncludingTax;
    }
    this.GetTotalSum();
  }
  /*  OnquantityChange(i) {
     this.quantitypopup();
     this.GetTotalAmount(i);
   } */

  quantitypopup() {
    let quantity: TemplateRef<any>
    this.modalRef = this.modalService.show(quantity);
  }

  OnquantityChange(quantity: TemplateRef<any>, i) {
    this.selectedRowValue = i;
    if (this.RowData[i].productID) {
      this.SelectedproductID = this.RowData[i].productID;
      this.SelectedQuantity = this.RowData[i].transactionQuantity;
      this.modalRef = this.modalService.show(quantity);
    }
  }

  OnunitpriceChange(unitprice: TemplateRef<any>, i) {
    this.selectedRowValue = i;
    if (this.RowData[i].productID) {
      this.SelectedproductID = this.RowData[i].productID;
      this.SelectedUnitprice = this.RowData[i].unitPrice;
      this.modalRef = this.modalService.show(unitprice);
    }
  }
  LineBeforeDiscount
  OndiscountChange(discount: TemplateRef<any>, i) {
    if (this.RowData[i].allowDiscount) {
      this.selectedRowValue = i;
      if (this.RowData[i].productID) {
        this.SelectedproductID = this.RowData[i].productID;
        this.SelectedDiscount = this.RowData[i].discountGiven;
        this.LineBeforeDiscount = Number(this.RowData[i].unitPrice) * Number(this.RowData[i].transactionQuantity); 
        this.SelectedTotal = this.RowData[i].lineTotalIncludingTax; 
        this.SelectedQuantity = this.RowData[i].transactionQuantity;
        this.modalRef = this.modalService.show(discount);
      }
    }
    else {
      this.toastr.warning("Discount cannot be applied to this item. check the allow Discount flag in inventory information");
    }
  }

  setQuantity(revQty) {
    console.log(revQty)
    this.RowData[this.selectedRowValue].transactionQuantity = revQty;
    this.GetTotalAmount(this.selectedRowValue);

  }
  setUnitprice(revUnitprice) {
    this.RowData[this.selectedRowValue].unitPrice = revUnitprice;
    this.GetTotalAmount(this.selectedRowValue);
    /*  for (var i = 0; i < this.RowData.length; i++) {
       if (this.SelectedproductID == this.RowData[i].productID){
         this.RowData[i].unitPrice = revUnitprice.toFixed(2);
         this.GetTotalAmount(i);
       }
     } */
  }
  setDiscount(Event) {
    console.log(Event)
    this.RowData[this.selectedRowValue].lineTotalIncludingTax = Event.TotalAmount;
    this.RowData[this.selectedRowValue].discountGiven = Event.Discount;
    this.GetTotalSum();
  //  this.GetTotalAmount(this.selectedRowValue);
    /* for (var i = 0; i < this.RowData.length; i++) {
      if (this.SelectedproductID == this.RowData[i].productID){
        this.RowData[i].discountAmount = revDiscount;
        this.RowData[i].total = (this.RowData[i].total - this.RowData[i].discountAmount).toFixed(2);
      }
    } */
  }

  OnSave() {
    this.sopOrderService.SaveOrderDetails(this.RowData).subscribe((response) => {
      if (response) {
        this.toastr.success("Order detail has been submitted successfully");
        this.ResetForm();
        this.BindOrderDetails();
      }
    })
  }
    CheckOut() {
        this.Mode = 'PaymentScreen';
    }
    GetTotalSum(){
      this.TotalSum = this.RowData.reduce((sum, item) => sum +Number(item.lineTotalIncludingTax), 0);
      this.TotalSum = Number(this.TotalSum).toFixed(4) ;
    }

    CancelPayment(){
      this.Mode = 'OrderDetail';
    }
    Paymentdetails:any=[];
    OnComplete($event){
      this.Paymentdetails=$event.ReceiptDetails;
   this.ChangeGiven=$event.Change;
    this.AddReceiptMain();
      // this.sopOrderService.SaveOrderDetails(this.RowData).subscribe((response) => {
      //   if (response) {
      //     this.toastr.success("Order detail has been submitted successfully");
      //     this.ResetForm();
      //     this.BindOrderDetails();
      //   }
      // })
    }

    AddReceiptMain(){
      debugger;
      let ReceiptsMain=new LBS_SOP_ReceiptsMain()
      ReceiptsMain.Description=this.SalesOrderTypeList.find(f=>f.id==this.SalesOredertype).name;
      ReceiptsMain.TransactionSourceID=this.OrderMainID;
      ReceiptsMain.WareHouseID=this.WarehouseID;
      this.sopOrderService.addReceptMain(ReceiptsMain).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.ReceiptMainID=resp.data.id
          this.AddReceiptDetail();
          alert("Change :" +this.ChangeGiven);
          this.Cancel.emit();
        }

      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
      
    }
    AddReceiptDetail(){
      debugger;
      this.Paymentdetails.forEach(element => {
        element.ReceiptMainID=this.ReceiptMainID
       });
      this.sopOrderService.AddReceptDetails(this.Paymentdetails).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.ReceiptMainID=resp.data.id
        }

      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
      
    }
}

