import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { QuotationService } from '../../services/quotation.service';
import { CustomValidators } from 'ngx-custom-validators';
import { LbsPosQuotationDetail } from 'src/app/models/pos/lbs_pos-quotationDetail';
import { EnumExtension } from 'src/app/shared/enums/enum-extension';
import { ProductType } from 'src/app/shared/enums/product-type';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { PriceGroupsService } from 'src/app/inv/services/price-groups.service';
import { LandedCostImportCostService } from 'src/app/pur/services/landed-cost-import-cost.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { SopOrderService } from '../../services/sop-order.service';

@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.css']
})
export class QuotationDetailsComponent implements OnInit {
  @Input() QuotationMainID: any;
  @Input() WarehouseID: any;
  @Output() Cancel = new EventEmitter();
  @Input() SelectedQuotationID: any;
  QuotationDetailsForm: FormGroup;
  public QuotationDetailsData: any = [];
  submitted: boolean;
  CompanyID = localStorage.getItem('CompanyID');
  taxcodes: any;
  posInventoryType: any;
  inventoryList: any;
  InventoryUnitOfMeasure: any[];
  UOMList: any;
  Mode: string = 'Add';
  submitName: string = "Add Quotation Details";
  taxDetails: boolean;
  modalRef: BsModalRef;
  selectedTaxId: any;
  makeAsTextBox: boolean;
  Loading: boolean;
  CommentLine: boolean = false;
  SerialisedProduct: any;
  SelectedproductID: any;
  SelectedQuantity: any;
  SelectedUnitprice: any;
  SelectedDiscount: any;
  selectedDetailID;
  selectedInventoryID;
  @Input() RevisedQty: number;
  SelectedTotal: any;
  public selectedRow: any;
  @Input() SelectedNewRow: any;
  @Input() SelectedNewRowVal: any;
  @Input() OrderStatus: boolean;
  selectedRowValue: any;
  TotalSum: any;
  total: any;
  selectedOrderDetailId: any;
  @Input() IsActive: any;
  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private quotationServcie: QuotationService,
    private sysCommonService: SysCommonService,
    private priceservice: PriceGroupsService,
    private landedImportCostService: LandedCostImportCostService,
    private modalService: BsModalService,
    private sopOrderService: SopOrderService
  ) { }

  ngOnInit() {
    this.Loading = true;
    this.posInventoryType = EnumExtension.getNamesAndValuestring(ProductType);
    console.log(this.posInventoryType);

    this.CreateForm();
    this.BindInventoryDetail();
    this.onChanges();
    this.BindUOM();
    this.BindGetTaxCode();
    setTimeout(() => {
      this.BindQuotationDetails();
    }, 1000);
  }
  // get QuotationDetails(): FormArray {
  //   return this.QuotationDetailsForm.get('QuotationDetails') as FormArray;
  // }
  get f() { return this.QuotationDetailsForm.controls; }

  CreateForm() {
    this.QuotationDetailsForm = this.FB.group({
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
      TransactionQuantity: [0.00, Validators.required],
      UOM: ['-1', CustomValidators.notEqual('-1')],
      DiscountType: ['-1', CustomValidators.notEqual('-1')],
      UnitPrice: [0.0000, Validators.required],
      DiscountAmount: [0.0000],
      TaxID: ['-1', CustomValidators.notEqual('-1')],
      TaxRate: ['0.0000'],
      TaxLabel: [''],
      LineTotalExcludingTax: ['0.0000'],
      LineTotalTaxAmount: ['0.0000'],
      LineTotalIncludingTax: ['0.0000']
    });
  }

  onChanges() {
    //When Inventory Type Changes
    this.QuotationDetailsForm.get('InventoryType').valueChanges.subscribe(val => {
      if (val == 'INV') {
        this.makeAsTextBox = false;
        this.BindInventoryDetail();
      } else if (val == 'Non') {
        //Non Inventory Item
        this.makeAsTextBox = true;
        this.QuotationDetailsForm.patchValue({
          'Description': '',
          'ProductID': '',
          'ProductWeight': '',
          'ProductCubic': '',
          'DecimalPlaces': '',
          'InventoryGLClassification': '',
          'InventoryCost': '',
          'TransactionQuantity': ''
        });
      } else {
        //Comment
        this.CommentLine = true;
        this.QuotationDetailsForm.disable();
        this.QuotationDetailsForm.get('InventoryType').enable();
        this.QuotationDetailsForm.get('Description').enable();
      }
    });
  }
  //When Product Changes
  onProductChange(e) {
    let val = e.target.value;
    let invDetails = this.inventoryList.filter(x => x.productID == val);
    console.log(invDetails);
    this.QuotationDetailsForm.patchValue({
      'Description': invDetails[0].description,
      'ProductID': invDetails[0].productID,
      'ProductWeight': invDetails[0].productWeight,
      'ProductCubic': invDetails[0].productCubic,
      'DecimalPlaces': invDetails[0].decimalPlaces,
      'InventoryGLClassification': invDetails[0].inventoryGLClassification,
      'InventoryCost': invDetails[0].inventoryDefaultCost,
      'TransactionQuantity': invDetails[0].transactionQuantity,
      'UOM': invDetails[0].unitOfMeasureID
    });
  }

  BindGetTaxCode() {
    // this.priceservice.getalltaxcode().subscribe((resp: any) => {
    //   this.taxcodes = resp.data.taxcode;
    // }, (error) => {
    //   this.toastr.error(error);
    //   console.error('Problem with the sevice. Please try later : ' + error);
    // });

    this.landedImportCostService.getTaxCode().subscribe((resp: any) => {
      this.taxcodes = resp.data.taxDetails;
      console.log(this.taxcodes);
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindInventoryDetail() {
    debugger;
    if (this.WarehouseID == null || this.WarehouseID == undefined || this.WarehouseID == '') { }
    else {
      this.quotationServcie.GetInventoryDetail(this.WarehouseID).subscribe((resp: any) => {
        this.inventoryList = resp.data.inventoryDetails;
        console.log(this.inventoryList);
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }

  BindUOM() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_UnitOfMeasure).subscribe((resp: any) => {
      this.UOMList = resp.data.tabledata;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindQuotationDetails() {
    debugger;
    if (this.QuotationMainID == null || this.QuotationMainID == '' || this.QuotationMainID == undefined) {
      this.Loading = false;
    }
    else {
      this.quotationServcie.GetAllQuotationDetails(this.QuotationMainID).subscribe((resp: any) => {
        this.QuotationDetailsData = resp.data.quotation;
        if (this.QuotationDetailsData.length > 0) {
          this.QuotationDetailsData[0].quotationMainID = this.QuotationMainID;
          for (let i = 0; i < this.QuotationDetailsData.length; i++) {
            if (this.QuotationDetailsData[i].inventoryType == 'INV') {
              let invDetails = this.inventoryList.filter(x => x.productID == this.QuotationDetailsData[i].productID);
              console.log(invDetails);
              if (invDetails.length > 0)
                this.QuotationDetailsData[i].productName = invDetails[0].productName;
              else
                this.QuotationDetailsData[i].productName = this.QuotationDetailsData[i].productID;
            } else {
              this.QuotationDetailsData[i].productName = this.QuotationDetailsData[i].productID;
            }
          }
          this.Loading = false;
        }
        this.Loading = false;
      }, (error) => {
        this.Loading = false;
        //console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  Close() {
    this.Cancel.emit()
  }

  //Delete Quotation Detail Row
  deleteQuotationDetailRow(ID) {
    debugger;
    this.quotationServcie.deleteQuotationDetailByID(ID, 'LBS_SOP_QuotationDetail', localStorage.getItem('LoginID')).subscribe((response) => {
      console.log(response);
      if (response) {
        this.toastr.success("Quotation detail row has been deleted successfully");
        this.BindQuotationDetails();
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
      this.QuotationDetailsForm.patchValue({ TaxRate: result[0].taxRate, TaxLabel: result[0].taxLabel });
    }
  }

  TaxDetail(tax: TemplateRef<any>, taxID) {
    this.selectedTaxId = taxID;
    this.modalRef = this.modalService.show(tax);

  }
  closePopUp() {
    this.modalRef.hide();
  }

  ResetForm() {
    this.QuotationDetailsForm.patchValue({
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
      TransactionQuantity: 0.00,
      UOM: '-1',
      DiscountType: '-1',
      UnitPrice: 0.0000,
      DiscountAmount: 0.0000,
      TaxID: '-1',
      TaxRate: '0.0000',
      TaxLabel: '',
      LineTotalExcludingTax: '0.0000',
      LineTotalTaxAmount: '0.0000',
      LineTotalIncludingTax: '0.0000'
    });
    this.QuotationDetailsForm.markAsUntouched();
    this.QuotationDetailsForm.markAsPristine();
    this.submitted = false;
  }

  Edit(data) {

    this.Mode = 'Edit';
    this.submitName = "Update Quotation Details";
    data.inventoryType == 'INV' ? this.makeAsTextBox = false : this.makeAsTextBox = true;
    this.QuotationDetailsForm.patchValue({
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

  onSave() {
    debugger;
    this.submitted = true;
    // if (this.QuotationDetailsForm.invalid) {
    //   return;
    // }
    debugger
    let submitQuotationDetail: any = new LbsPosQuotationDetail();
    if (this.QuotationDetailsForm.get('InventoryType').value == 'Com') {
      submitQuotationDetail.LineNum = 0;
      submitQuotationDetail.QuotationMainID = this.QuotationMainID;
      submitQuotationDetail.CompanyID = this.CompanyID;
      submitQuotationDetail.InventoryType = this.QuotationDetailsForm.get('InventoryType').value;
      // submitQuotationDetail.ProductID = '';
      submitQuotationDetail.Description = this.QuotationDetailsForm.get('Description').value;
      submitQuotationDetail.ProductWeight = 0;
      submitQuotationDetail.ProductCubic = 0;

      submitQuotationDetail.DecimalPlaces = 0;
      submitQuotationDetail.InventoryCost = 0;
      submitQuotationDetail.TransactionQuantity = 0;
      // submitQuotationDetail.UOM = '';
      submitQuotationDetail.UnitPrice = 0;
      submitQuotationDetail.DiscountType = 0;

      submitQuotationDetail.DiscountAmount = 0;
      // submitQuotationDetail.TaxID = ;
      submitQuotationDetail.TaxRate = 0.0000;
      submitQuotationDetail.LineTotalExcludingTax = 0;

      submitQuotationDetail.LineTotalTaxAmount = 0;
      submitQuotationDetail.LineTotalIncludingTax = 0;
      submitQuotationDetail.CreatedBy = localStorage.getItem('LoginID');
    } else {
      submitQuotationDetail.QuotationMainID = this.QuotationMainID;
      submitQuotationDetail.CompanyID = this.CompanyID;
      submitQuotationDetail.LineNum = +this.QuotationDetailsForm.get('LineNum').value;
      submitQuotationDetail.InventoryType = this.QuotationDetailsForm.get('InventoryType').value;
      submitQuotationDetail.ProductID = this.QuotationDetailsForm.get('ProductID').value;
      submitQuotationDetail.Description = this.QuotationDetailsForm.get('Description').value;
      submitQuotationDetail.ProductWeight = this.QuotationDetailsForm.get('ProductWeight').value;
      submitQuotationDetail.ProductCubic = this.QuotationDetailsForm.get('ProductCubic').value;

      submitQuotationDetail.DecimalPlaces = this.QuotationDetailsForm.get('DecimalPlaces').value;
      submitQuotationDetail.InventoryGLClassification = this.QuotationDetailsForm.get('InventoryGLClassification').value;

      submitQuotationDetail.InventoryCost = +this.QuotationDetailsForm.get('InventoryCost').value;
      submitQuotationDetail.TransactionQuantity = +this.QuotationDetailsForm.get('TransactionQuantity').value;
      submitQuotationDetail.UOM = this.QuotationDetailsForm.get('UOM').value;
      submitQuotationDetail.UnitPrice = +this.QuotationDetailsForm.get('UnitPrice').value;
      submitQuotationDetail.DiscountType = + 0;

      submitQuotationDetail.DiscountAmount = +this.QuotationDetailsForm.get('DiscountAmount').value;
      submitQuotationDetail.TaxID = this.QuotationDetailsForm.get('TaxID').value;
      submitQuotationDetail.TaxRate = this.QuotationDetailsForm.get('TaxRate').value;


      submitQuotationDetail.TaxLabel = this.QuotationDetailsForm.get('TaxLabel').value;
      submitQuotationDetail.LineTotalExcludingTax = +this.QuotationDetailsForm.get('LineTotalExcludingTax').value;

      submitQuotationDetail.LineTotalTaxAmount = +this.QuotationDetailsForm.get('LineTotalTaxAmount').value;
      submitQuotationDetail.LineTotalIncludingTax = +this.QuotationDetailsForm.get('LineTotalIncludingTax').value;
      submitQuotationDetail.CreatedBy = localStorage.getItem('LoginID');
    }
    console.log(submitQuotationDetail);
    if (this.Mode == 'Add') {
      debugger;
      if (this.QuotationDetailsData.length > 0) {
        this.QuotationDetailsData[0].quotationMainID = this.QuotationMainID;
        this.quotationServcie.submitQuotationDetails(this.QuotationDetailsData).subscribe((response) => {
          console.log(response);
          if (response) {
            this.toastr.success("Quotation detail has been submitted successfully");
            this.ResetForm();
            this.BindQuotationDetails();
          }
        })
      }

    }
    else if (this.Mode == 'Edit') {
      debugger
      submitQuotationDetail.ID = this.QuotationDetailsForm.get('ID').value;
      console.log(submitQuotationDetail);
      this.quotationServcie.updateQuotationDetails(this.QuotationDetailsData).subscribe((response) => {
        console.log(response);
        if (response) {
          this.toastr.success("Quotation detail has been updated successfully");
          this.ResetForm();
          this.BindQuotationDetails();
          this.Mode = 'Add';
          this.submitName = "Add Quotation Details";
        }
      })
    }
    this.CommentLine = false;
  }
  AddNewrow() {
    let no = 1;
    if (this.QuotationDetailsData.length > 0) {
      no = this.QuotationDetailsData.length + 1;
    }
    let object = {
      'companyID': this.CompanyID,
      'salesOrderMainID': this.QuotationMainID,
      'lineNum': no,
      'inventoryType': null,
      'productID': null,
      'p_ID': null,
      'description': null,
      'productWeight': 0.00,
      'productCubic': 0.00,
      'places': null,
      'inventoryGLClassification': null,
      'inventoryCost': 0.00,
      'transactionQuantity': null,
      'UOM': null,
      'unitPrice': null,
      'discountType': 0,
      'lineTotalIncludingTax': null,
      'discountAmount': null,
      'taxID': null,
      'taxRate': null,
      'taxLabel': null,
      'lineTotalTaxAmount': 0.00,
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

    this.QuotationDetailsData.push(object);
  }
  Deleteindex(i) {
    this.QuotationDetailsData.splice(i, 1);
  }
  changedetails(event, matrix: TemplateRef<any>, serial: TemplateRef<any>, Kit: TemplateRef<any>, i) {
    debugger;
    this.selectedRow = event;
    let index = this.QuotationDetailsData.findIndex(c => c.p_ID == event.ID);
    if (index >= 0) {
      this.QuotationDetailsData[index].transactionQuantity = Number(this.QuotationDetailsData[index].transactionQuantity) + 1;
      if (i != index) {
        this.QuotationDetailsData.splice(i, 1);
      }
      this.GetTotalAmount(i);
      return;
    }

    this.QuotationDetailsData[i].p_ID = event.ID;
    this.QuotationDetailsData[i].productID = event.ID;
    if (this.RevisedQty != undefined)
      this.QuotationDetailsData[i].transactionQuantity = this.RevisedQty;
    else
      this.QuotationDetailsData[i].transactionQuantity = 1;
    this.QuotationDetailsData[i].description = event.Productname;
    this.QuotationDetailsData[i].discountAmount = 0;
    this.GetUnitPrice(this.SelectedQuotationID, event.ID, i);
    this.GetProductDetails(event.ID, i);
    this.ProductStyleMatrix(event, matrix, serial, Kit, i)
  }

  ProductStyleMatrix(event, matrix: TemplateRef<any>, serial: TemplateRef<any>, Kit: TemplateRef<any>, i) {
    this.selectedInventoryID = event.ID
    this.selectedOrderDetailId = event.ID;
    if ((event.ProductStatus == "F" || event.ProductStatus == "f") && event.ProductStyleMatrixEnabled) {
      this.modalRef = this.modalService.show(matrix);
    }
    else if ((event.ProductStatus == "F" || event.ProductStatus == "f") && event.SerialisedProduct) {
      this.modalRef = this.modalService.show(serial);
    }
    else if ((event.ProductStatus == "C" || event.ProductStatus == "c") && event.CustomKit) {
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
        this.QuotationDetailsData[i].unitPrice = Number(response.data.unitprice).toFixed(2);
      } else {
        response.data.unitprice = 0;
      }
      this.GetTotalAmount(i);
    })
  }
  GetProductDetails(ProductID, i) {
    this.sopOrderService.getProductDetails(ProductID).subscribe((response: any) => {
      console.log(response.data.product);
      this.QuotationDetailsData[i].taxLabel = response.data.product.cycleName;
      this.QuotationDetailsData[i].taxID = response.data.product.taxID;
      this.QuotationDetailsData[i].taxRate = response.data.product.length;
      this.QuotationDetailsData[i].allowDiscount = response.data.product.allowDiscount;
    })
  }

  GetTotalAmount(i) {
    let Quantity = this.QuotationDetailsData[i].transactionQuantity
    let unitPrice = this.QuotationDetailsData[i].unitPrice
    if (Quantity != null && unitPrice != null) {
      let res = Number(this.QuotationDetailsData[i].unitPrice) * Number(this.QuotationDetailsData[i].transactionQuantity);
      this.QuotationDetailsData[i].lineTotalIncludingTax = Number(res).toFixed(4);
      this.QuotationDetailsData[i].discountAmount = this.QuotationDetailsData[i].lineTotalIncludingTax;
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
    if (this.QuotationDetailsData[i].productID) {
      this.SelectedproductID = this.QuotationDetailsData[i].productID;
      this.SelectedQuantity = this.QuotationDetailsData[i].transactionQuantity;
      this.modalRef = this.modalService.show(quantity);
    }
  }

  OnunitpriceChange(unitprice: TemplateRef<any>, i) {
    debugger;
    this.selectedRowValue = i;
    if (this.QuotationDetailsData[i].productID) {
      this.SelectedproductID = this.QuotationDetailsData[i].productID;
      this.SelectedUnitprice = this.QuotationDetailsData[i].unitPrice;
      this.modalRef = this.modalService.show(unitprice);
    }
  }
  LineBeforeDiscount
  OndiscountChange(discount: TemplateRef<any>, i) {
    debugger;
    if (this.QuotationDetailsData[i].allowDiscount) {
      this.selectedRowValue = i;
      if (this.QuotationDetailsData[i].productID) {
        this.SelectedproductID = this.QuotationDetailsData[i].productID;
        this.SelectedDiscount = this.QuotationDetailsData[i].discountGiven;
        this.LineBeforeDiscount = Number(this.QuotationDetailsData[i].unitPrice) * Number(this.QuotationDetailsData[i].transactionQuantity);
        this.SelectedTotal = this.QuotationDetailsData[i].lineTotalIncludingTax;
        this.SelectedQuantity = this.QuotationDetailsData[i].transactionQuantity;
        this.modalRef = this.modalService.show(discount);
      }
    }
    else {
      this.toastr.warning("Discount cannot be applied to this item. check the allow Discount flag in inventory information");
    }
  }

  setQuantity(revQty) {
    console.log(revQty)
    this.QuotationDetailsData[this.selectedRowValue].transactionQuantity = revQty;
    this.GetTotalAmount(this.selectedRowValue);

  }
  setUnitprice(revUnitprice) {
    this.QuotationDetailsData[this.selectedRowValue].unitPrice = revUnitprice;
    this.GetTotalAmount(this.selectedRowValue);
    /*  for (var i = 0; i < this.RowData.length; i++) {
       if (this.SelectedproductID == this.RowData[i].productID){
         this.RowData[i].unitPrice = revUnitprice.toFixed(2);
         this.GetTotalAmount(i);
       }
     } */
  }
  setDiscount(Event) {
    debugger;
    console.log(Event)
    this.QuotationDetailsData[this.selectedRowValue].lineTotalIncludingTax = Event.TotalAmount;
    this.QuotationDetailsData[this.selectedRowValue].discountGiven = Event.Discount;
    this.GetTotalSum();
    //  this.GetTotalAmount(this.selectedRowValue);
    /* for (var i = 0; i < this.RowData.length; i++) {
      if (this.SelectedproductID == this.RowData[i].productID){
        this.RowData[i].discountAmount = revDiscount;
        this.RowData[i].total = (this.RowData[i].total - this.RowData[i].discountAmount).toFixed(2);
      }
    } */
  }
  GetTotalSum() {
    this.TotalSum = this.QuotationDetailsData.reduce((sum, item) => sum + Number(item.lineTotalIncludingTax), 0);
    this.TotalSum = Number(this.TotalSum).toFixed(4);
  }
  CheckOut() {
    this.Mode = 'PaymentScreen';
  }
  ProductMatrixSave(data) {
    debugger;
    for (var i = 0; i < this.QuotationDetailsData.length; i++) {
      if (this.QuotationDetailsData[i].productID == data.ProductStyleMatrixForSave[0].productID.toLowerCase())
        this.QuotationDetailsData[i].transactionQuantity = data.ProductStyleMatrixForSave[0].transactionQuantity;
    }
    // this.total = data.Total;
  }
  SerializedProductSave(data) {
    for (var i = 0; i < this.QuotationDetailsData.length; i++) {
      if (this.QuotationDetailsData[i].productID == data.SerializedProductForSave[0].productID.toLowerCase())
        this.QuotationDetailsData[i].transactionQuantity = data.SerializedProductForSave[0].transactionQuantity;
    }
  }
}
