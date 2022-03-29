import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { GoodsReceivedNotesService } from '../services/goods-received-notes.service';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { LBSPURPurchaseGoodsReceiveNote } from 'src/app/models/pur/lbs-pur-purchase-goods-receive-note';
import { ToastrService } from 'ngx-toastr';
import { LbsPurPurchaseOrderDetails } from 'src/app/models/pur/lbs_pur_purchase-order-details';
import { LBSPURPurchaseGRNDetails, PurchaseGoodsReceiveNote } from 'src/app/models/pur/lbs-pur-purchase-grndetails';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { TemplateRef } from '@angular/core/src/linker/template_ref';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PriceGroupsService } from 'src/app/inv/services/price-groups.service';
import { forEach } from '@angular/router/src/utils/collection';
import { empty } from 'rxjs';

@Component({
  selector: 'app-goods-received-note',
  templateUrl: './goods-received-note.component.html',
  styleUrls: ['./goods-received-note.component.css']
})
export class GoodsReceivedNoteComponent implements OnInit {

  Mode: any = 'List'
  GoodsReceivedNoteCols: any;
  GoodsReceivedNotes: any[] = [];

  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  IsActive: boolean = true;
  AgLoad: any = true;
  AccessTab: any;
  Loading: any = false;
  productName: any;
  MaxReceivedDate: any = new Date();

  GoodsReceivedNoteForm: FormGroup;
  PurchaseGRNDetailsSearch: FormArray;
  PurchaseGRNDetailsTemp: FormArray;
  PageSize: any = '50';
  Currentpage: any = '1';
  modalRef: BsModalRef;
  PurchaseOrderDetails: any;
  inventoryList: any;
  SelectedGRNID: any;
  PurchaseOrderrouter: any;
  IsClose: boolean;
  IsInvoiced: boolean;
  submitted: boolean;
  GRNIDrouter: any;
  SelectedPurchaseGRNID:any
  SelectedQuantityOrderedToCheck: any;
  MinEffectiveDate: any = new Date('2000-01-01');
  searchValue: any = "";
  selectedProductCode: any;
  selectedProductDescription: any;
  constructor(private FB: FormBuilder,
    private goodsReceivedNotesService: GoodsReceivedNotesService,
    private sharedFormatterService: SharedFormatterService,
    private invCommonService: InvCommonService,
    private cryptoAes: CryptoAes, private router: Router, private route: ActivatedRoute,
    private sysCommonService: SysCommonService,
    public modalService: BsModalService,
    private priceservice: PriceGroupsService,
    private deleteRecordsService: DeleteRecordsService,
    private toastr: ToastrService
  ) {
    this.PurchaseOrderrouter = this.route.snapshot.paramMap.get("id")
    this.GRNIDrouter = this.route.snapshot.paramMap.get("id")
  }

  ngOnInit() {
    this.AccessTab = 'PurchaseGRN';
    this.CreatForm();
    this.SetPermissions();
    this.BindInventories();
    this.GoodsReceivedNoteCols = [
      { headerName: 'GRN No', field: 'grnNo', sortable: true, filter: true },
      { headerName: 'PurchaseOrder No', field: 'purchaseOrderNumber', sortable: true, filter: true },
      { headerName: 'Warehouse', field: 'wareHouseName', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Reference', field: 'supplierDeliveryReference', sortable: true, filter: true },
      { headerName: 'Vendor', field: 'vendorAccountName', sortable: true, filter: true },
      { headerName: 'Received-Date', field: 'receivedDate', sortable: true, filter: true },
      { headerName: 'Purchase Status ', field: 'statusName', sortable: true, filter: true },
      { headerName: 'Reversed ', field: 'isReversed', sortable: true, filter: true },
      { headerName: 'Invoiced ', field: 'isInvoiced', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteActionGRN', hide: false }
    ];
    this.BindGoodsReceivedNotes();
    this.BindUOM();
    this.BindTaxCode();
    this.BindTax();
    if (this.PurchaseOrderrouter) {
      this.SelectedPurchaseOrderID = this.PurchaseOrderrouter;
      this.Mode = 'Add';
      this.POChanged(this.PurchaseOrderrouter)
      this.BindPurchaseOrder(this.PurchaseOrderrouter);
      this.IsClose = false;
      this.GoodsReceivedNoteForm.enable();
      
      console.log(this.PurchaseOrderrouter)
    }
  }
  get PurchaseGRNDetails() { return this.GoodsReceivedNoteForm.get('PurchaseGRNDetails') as FormArray; }
  get f() { return this.GoodsReceivedNoteForm.controls; }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "306");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.GoodsReceivedNoteForm.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          this.GoodsReceivedNoteForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.GoodsReceivedNoteForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  CreatForm() {
    this.GoodsReceivedNoteForm = this.FB.group({
      ID: [''],
      PurchaseOrderNumber: [''],
      WareHouse: [''],
      WareHouseID: [''],
      GRNNo: [''],
      SupplierDeliveryReference: ['', Validators.required],
      Vendor: [''],
      VendorID: [''],
      ReceivedDate: [''],
      Status: [''],
      Reversed: [''],
      Invoiced: [''],
      PurchaseInvoice: [''],
      Insurance: [''],
      InsuranceTaxID: [''],
      InsuranceTaxRate: [''],
      InsuranceTaxAmount: [''],
      Freight: [''],
      FreightTaxID: [''],
      FreightTaxRate: [''],
      FreightTaxAmount: [''],
      Duty: [''],
      DutyTaxID: [''],
      DutyTaxRate: [''],
      DutyTaxAmount: [''],
      TotalExclusiveofTaxHome: [''],
      TaxTotalHome: [''],
      TotalInclusiveofTaxHome: [''],
      DutyTaxName: [''],
      InsuranceName: [''],
      FreightTaxName: [''],
      AutoFillReceivedQuantity: [true],
      PurchaseGRNDetails: this.FB.array([])
    });
  }
  BindGoodsReceivedNotes() {
    this.AgLoad = false;
    this.Loading = true;
    this.submitted = false;
    this.goodsReceivedNotesService.getAllGoodsReceivedNotes().subscribe((resp: any) => {
      this.GoodsReceivedNotes = resp.data.goodsReceivedNotes;
      //if (this.GRNIDrouter) {
      //  this.BindGRNbyID(this.GRNIDrouter);
      //  // let data = this.GoodsReceivedNotes.filter(pur => pur.id == this.GrnIdrouter);
      //  // this.AgEdit(data[0]);
      //}

      this.GoodsReceivedNotes.forEach(element => {
        let receivedDate = { 'value': element.receivedDate }
        element.receivedDate = this.sharedFormatterService.dateTimeFormatter(receivedDate);
      });

      this.AgLoad = true;
      this.Loading = false;
      debugger;
    }, (error: any) => {
      this.Loading = false;
    });
  }
  UOMs: any[] = [];
  BindUOM() {
    this.invCommonService.getUnitOfMeasures().subscribe((resp: any) => {
      this.UOMs = resp.data.unitOfMeasures;
    }, (error: any) => {

    });
  }
  TaxCodes: any[] = [];
  BindTaxCode() {
    this.invCommonService.getTaxCodes().subscribe((resp: any) => {
      this.TaxCodes = resp.data.taxcode;
      console.log(resp.data)
    }, (error: any) => {

    });
  }
  AddNew() {
    this.Mode = 'Add';
    this.IsClose = false;
    this.submitted = false;
    this.GoodsReceivedNoteForm.enable();
    this.CreatForm();
  }
  SelectedPurchaseOrderID;
  POChanged(PurchaseOrderID: any) {
    this.SelectedPurchaseOrderID = PurchaseOrderID
    this.BindPurchaseOrder(PurchaseOrderID);

  }

  BindPurchaseOrder(purchaseOrderID) {
    this.Loading = true;
    this.goodsReceivedNotesService.getPurchaseOrderDetails(purchaseOrderID).subscribe((resp: any) => {
      this.PurchaseOrderDetails = [];
      debugger;
      let PurchaseOrderDetails = resp.data.purchaseDetails;
      this.PurchaseOrderDetails = resp.data.purchaseDetails;
      if (resp.data.purchaseMain != null) {
        this.SetPurchaseMain(resp.data.purchaseMain);
      }
      //else {
      //  this.BindGRNbyID(purchaseOrderID)
      //}
      

      this.GoodsReceivedNoteForm.setControl('PurchaseGRNDetails', this.setPurchaseGRNDetails(PurchaseOrderDetails));
      
      this.CalculateTotal();
      // this.AutoFillReceivedQuantity(this.GoodsReceivedNoteForm.get('AutoFillReceivedQuantity').value);
      this.Loading = false;
    }, (error: any) => {
      this.Loading = false;
    });
  }
  SetPurchaseMain(PurchaseMain: any) {
    debugger;
    
    let lastEffectiDate: Date = new Date(PurchaseMain.dateCreated);
    this.MinEffectiveDate = new Date(lastEffectiDate.setDate(lastEffectiDate.getDate() - 1));
    this.GoodsReceivedNoteForm.patchValue({
      PurchaseOrderNumber: PurchaseMain.purchaseOrderNumber,
      WareHouseID: PurchaseMain.shiptoWarehouse,
      //GRNNo:PurchaseMain.,
      // SupplierDeliveryReference:PurchaseMain.,
      Vendor: PurchaseMain.vendorCode + ' - ' + PurchaseMain.vendorAccountName,
      VendorID: PurchaseMain.vendorID,
      ReceivedDate: new Date(Date.now()),
      //Status:PurchaseMain.,
      Reversed: false,
      //Invoiced:PurchaseMain.,
      //PurchaseInvoice:PurchaseMain.,
      WareHouse: PurchaseMain.wareHouseName,
      Insurance: PurchaseMain.insurance,
      InsuranceTaxID: PurchaseMain.insuranceTaxID,
      InsuranceTaxRate: PurchaseMain.insuranceTaxAmount, //PurchaseMain.insuranceTaxRate,
      InsuranceTaxAmount: PurchaseMain.insuranceTaxInclusive,
      Freight: PurchaseMain.freight,
      FreightTaxID: PurchaseMain.freightTaxID,
      FreightTaxRate: PurchaseMain.freightTaxAmount, //PurchaseMain.freightTaxRate,
      FreightTaxAmount: PurchaseMain.freightTaxInclusive,
      Duty: PurchaseMain.duty,
      DutyTaxID: PurchaseMain.dutyTaxID,
      DutyTaxRate: PurchaseMain.dutyTaxAmount,//PurchaseMain.dutyTaxRate,
      DutyTaxAmount: PurchaseMain.dutyTaxInclusive,
      TotalExclusiveofTaxHome: PurchaseMain.poTaxExclusiveTotal,
      TaxTotalHome: PurchaseMain.poTotalTax,
      TotalInclusiveofTaxHome: PurchaseMain.poTaxInclusiveTotal,
      DutyTaxName: PurchaseMain.dutyTaxName,
      InsuranceName: PurchaseMain.insuranceTaxName,
      FreightTaxName: PurchaseMain.freightTaxName
    });

  }
  setPurchaseGRNDetails(PurchaseGRNDetails: any[]): FormArray {
    debugger;
    const formArray = new FormArray([]);
    PurchaseGRNDetails.forEach(po => {
      let pid;
      if (po.productID == '00000000-0000-0000-0000-000000000000') {
        pid = null;
      } else {
        pid = po.productID;
      }
      formArray.push(this.FB.group({
        ID: null,
        PurchaseOrderNumber: this.GoodsReceivedNoteForm.get('PurchaseOrderNumber').value,
        ProductCode: po.productCode,
        ProductName: po.productName,
        PurchaseOrderLineID: po.id,
        PurchaseOrderID: po.purchaseOrderID,
        LineNo: po.lineNo,
        PurchaseLineStatus: po.purchaseLineStatus,
        ProductType: po.productType,
        ProductID: pid,
        ProductDescription: po.productDescription,
        OrderedQuantity: po.orderedQuantity,// po.convertedOrderedQuantity,
        ReceivedQuantity: Number(po.convertedOrderedQuantity) - Number(po.totalReceivedQuantity),
        //this.GoodsReceivedNoteForm.get('AutoFillReceivedQuantity').value ? po.orderedQuantity : 0,
        TotalReceivedQuantity: po.totalReceivedQuantity,
        UnitOfMeasure: po.unitOfMeasure,
        UnitCost: po.homeConvertedUnitCost,
        DiscountType: po.discountType,
        DiscountAmount: po.discountAmount,
        DiscountedUnitCost: po.discountedUnitCost,
        LineTotalCostTaxEclusive: po.lineTotalCostTaxEclusive,//(po.orderedQuantity * po.unitCost)
        TaxID: po.taxID,
        TaxRate: po.taxRate,
        /*  LineTotalTaxAmount: ((po.orderedQuantity * po.unitCost) * po.taxRate) / 100, //po.lineTotalTaxAmount,
         UnitCostInclusiveTax: po.unitCost + ((po.unitCost * po.taxRate) / 100),
         LineTotalCostTaxInclusive: (po.orderedQuantity * po.unitCost) + (((po.orderedQuantity * po.unitCost) * po.taxRate) / 100),//po.lineTotalCostTaxInclusive, */
        LineTotalTaxAmount: po.lineTotalTaxAmount,
        UnitCostInclusiveTax: po.discountedUnitCostForeign,
        LineTotalCostTaxInclusive: po.lineTotalCostTaxInclusive,//(po.orderedQuantity * po.unitCost),
        CurrencyID: po.currencyID,
        FXRate: po.fxRate,
        ForeignExchangeUnitCost: po.foreignExchangeUnitCost,
        LineTotalForeignExchangeCostTaxExclusive: po.lineTotalForeignExchangeCostTaxExclusive,
        LineTotalForeignExchangeCostTaxInclusive: po.lineTotalForeignExchangeCostTaxInclusive,
        LineTotalHomeAmount: po.lineTotalHomeAmount,
        LineTotalForeignAmount: po.lineTotalForeignAmount,
        SupplierSKU: po.supplierSKU,
        ClassificationID: '',// po.classificationID,
        AllowPartialReceiving: po.allowPartialReceiving,
        RequisitionID: po.requisitionID,
        VendorPriceSchemeID: po.vendorPriceSchemeID,
        ConvertedOrderedQuantity: po.convertedOrderedQuantity,
        CovertedReceivedQuantity: po.covertedReceivedQuantity,
        HomeUnitCost: po.homeConvertedUnitCost,
        DiscountedUnitCostHome: po.discountedUnitCostHome,
        LineTotalCostTaxExclusiveHome: po.lineTotalCostTaxExclusiveHome,
        LineTotalTaxAmountHome: po.lineTotalTaxAmountHome,
        LineTotalCostTaxInclusiveHome: po.lineTotalCostTaxInclusiveHome,
        DiscountedUnitCostForeign: po.discountedUnitCostForeign,
        LineTotalForeignExchangeTaxAmount: po.lineTotalForeignExchangeTaxAmount,
        HomeConvertedUnitCost: po.homeConvertedUnitCost,
        PartialReceived: po.allowPartialReceiving,
        barcode: po.barcode,
        vendorSKU: po.vendorSKU,
        vendorBarCode: po.vendorBarCode,
      }));
    });
    this.PurchaseGRNDetailsSearch = Object.assign([], formArray);

    this.CalculateTotal();
    return formArray;
  }

  getdetails() {
    let lBSPURPurchaseGRNDetails: LBSPURPurchaseGRNDetails[] = [];
    this.PurchaseGRNDetails.controls.forEach(ba => {
      let GRNDetails: any;

      GRNDetails = new LBSPURPurchaseGRNDetails();
      GRNDetails.CompanyID = localStorage.getItem('CompanyID');
      GRNDetails.GRNID = null;
      GRNDetails.ID = ba.get('ID').value;
      GRNDetails.PurchaseOrderID = ba.get('PurchaseOrderID').value;
      GRNDetails.PurchaseOrderLineID = ba.get('PurchaseOrderLineID').value;
      GRNDetails.PurchaseLineStatus = ba.get('PurchaseLineStatus').value;
      GRNDetails.ProductType = ba.get('ProductType').value;
      GRNDetails.ProductID = ba.get('ProductID').value;
      GRNDetails.ProductDescription = ba.get('ProductDescription').value;
      GRNDetails.ReceivedQuantity = ba.get('ReceivedQuantity').value;
      GRNDetails.UnitOfMeasure = ba.get('UnitOfMeasure').value == "00000000-0000-0000-0000-000000000000" ? null : ba.get('UnitOfMeasure').value;
      GRNDetails.SuppliersUnitCost = ba.get('HomeUnitCost').value;
      GRNDetails.DiscountType = ba.get('DiscountType').value;
      GRNDetails.DiscountAmount = ba.get('DiscountAmount').value;
      GRNDetails.DiscountedUnitCost = ba.get('DiscountedUnitCost').value;
      GRNDetails.LineTotalCostTaxEclusive = ba.get('LineTotalCostTaxEclusive').value;
      GRNDetails.TaxID = ba.get('TaxID').value;
      GRNDetails.TaxRate = ba.get('TaxRate').value;
      GRNDetails.LineTotalTaxAmount = ba.get('LineTotalTaxAmount').value;
      GRNDetails.LineTotalCostTaxInclusive = ba.get('LineTotalCostTaxInclusive').value;
      GRNDetails.CurrencyID = ba.get('CurrencyID').value;
      GRNDetails.FXRate = ba.get('FXRate').value;
      GRNDetails.ForeignExchangeUnitCost = ba.get('ForeignExchangeUnitCost').value;
      GRNDetails.LineTotalForeignExchangeCostTaxExclusive = ba.get('LineTotalForeignExchangeCostTaxExclusive').value;
      GRNDetails.LineTotalForeignExchangeCostTaxInclusive = ba.get('LineTotalForeignExchangeCostTaxInclusive').value;
      GRNDetails.LineTotalHomeAmount = ba.get('LineTotalHomeAmount').value;
      GRNDetails.LineTotalForeignAmount = ba.get('LineTotalForeignAmount').value;
      GRNDetails.SupplierSKU = ba.get('SupplierSKU').value;
      GRNDetails.ClassificationID = ba.get('ClassificationID').value;
      lBSPURPurchaseGRNDetails.push(GRNDetails)
    });
    this.PurchaseGRNDetailsSearch = Object.assign([], this.PurchaseGRNDetails);

    console.log(lBSPURPurchaseGRNDetails)
    return lBSPURPurchaseGRNDetails;
  }
  onSave(saveAction) {

    console.log(this.PurchaseGRNDetails);
    this.submitted = true;
    if (this.GoodsReceivedNoteForm.invalid) {
      return;
    }
    //this.Loading = true;
    let goods = new LBSPURPurchaseGoodsReceiveNote();

    let lBSPURPurchaseGRNDetails = this.getdetails();
    console.log(lBSPURPurchaseGRNDetails)
    goods.WareHouseID = this.GoodsReceivedNoteForm.get('WareHouseID').value;
    goods.GRNNo = this.GoodsReceivedNoteForm.get('GRNNo').value;
    goods.SupplierDeliveryReference = this.GoodsReceivedNoteForm.get('SupplierDeliveryReference').value;
    goods.VendorID = this.GoodsReceivedNoteForm.get('VendorID').value;
    goods.ReceivedDate = this.GoodsReceivedNoteForm.get('ReceivedDate').value;
    goods.Status = 1;
    //goods.Status = this.GoodsReceivedNoteForm.get('Status').value;
    goods.Invoiced = this.GoodsReceivedNoteForm.get('Invoiced').value;
    // goods.PurchaseInvoiceID = this.GoodsReceivedNoteForm.get('PurchaseInvoiceID').value;
    goods.Insurance = this.GoodsReceivedNoteForm.get('Insurance').value;
    goods.InsuranceTaxID = this.GoodsReceivedNoteForm.get('InsuranceTaxID').value;
    goods.InsuranceTaxRate = this.GoodsReceivedNoteForm.get('InsuranceTaxRate').value;
    goods.InsuranceTaxAmount = this.GoodsReceivedNoteForm.get('InsuranceTaxAmount').value;
    goods.Freight = this.GoodsReceivedNoteForm.get('Freight').value;
    goods.FreightTaxID = this.GoodsReceivedNoteForm.get('FreightTaxID').value;
    goods.FreightTaxRate = this.GoodsReceivedNoteForm.get('FreightTaxRate').value;
    goods.FreightTaxAmount = this.GoodsReceivedNoteForm.get('FreightTaxAmount').value;
    goods.Duty = this.GoodsReceivedNoteForm.get('Duty').value;
    goods.DutyTaxID = this.GoodsReceivedNoteForm.get('DutyTaxID').value;
    goods.DutyTaxRate = this.GoodsReceivedNoteForm.get('DutyTaxRate').value;
    goods.DutyTaxAmount = this.GoodsReceivedNoteForm.get('DutyTaxAmount').value;
    goods.TotalExclusiveofTax = this.GoodsReceivedNoteForm.get('TotalExclusiveofTaxHome').value;
    goods.TaxTotal = this.GoodsReceivedNoteForm.get('TaxTotalHome').value;
    goods.TotalInclusiveofTax = this.GoodsReceivedNoteForm.get('TotalInclusiveofTaxHome').value;
    goods.CreatedBY = localStorage.getItem('LoginID');
    goods.CompanyID = localStorage.getItem('CompanyID');
    let purchaseGoodsReceiveNote = new PurchaseGoodsReceiveNote();
    purchaseGoodsReceiveNote.LBS_PUR_PurchaseGoodsReceiveNote = goods;
    purchaseGoodsReceiveNote.LBS_PUR_PurchaseGRNDetails = lBSPURPurchaseGRNDetails;
    debugger;
    //If the mode Add will insert data to DB table else update the row by ID 
    if (this.Mode == 'Add') {
      this.goodsReceivedNotesService.addPurchasegoodsreceivenote(purchaseGoodsReceiveNote).subscribe((resp: any) => {
        debugger;
        this.submitted = false;
        if (resp.isSuccess) {
          this.GoodsReceivedNoteForm.patchValue({
            ID: resp.data.id
          })
          goods.ID = this.GoodsReceivedNoteForm.get('ID').value;
          this.toastr.success('Purchase Goods Receive Note details added successfully');
          if (saveAction == 'Close') {
            
            this.BindGoodsReceivedNotes();
            this.Mode = 'List';
            //this.ResetForm();
          }
          else {
            this.Mode = 'Edit';
            this.BindGoodsReceivedNotes();
            this.BindGRNbyID(goods.ID);
            // this.SelectedPurchaseGRNID=resp.data.id;
            // this.Edit(resp.data.id);
            // this.BindPurchaseGoodsReceiveNote();

          }

          this.Loading = false;
        }
        else {
          this.toastr.warning('Supplier Delivery Reference Already Exists');
        }
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      goods.ID = this.GoodsReceivedNoteForm.get('ID').value;
      this.goodsReceivedNotesService.EditPurchasegoodsreceivenote(purchaseGoodsReceiveNote).subscribe((resp: any) => {
        debugger;
        this.submitted = false;
        if (resp.isSuccess) {
          this.toastr.success('Purchase Goods Receive Note details updated successfully');
          if (saveAction == 'Close') {
            this.BindGoodsReceivedNotes();
            this.Mode = 'List';

          }
          else {
            let ID = this.GoodsReceivedNoteForm.get('ID').value;
            if (ID != "" && ID != null) {
              this.BindGRNbyID(ID);
            }
            
            this.SelectedPurchaseOrderID = ID;
            //  this.Edit(ID);
          }
          // this.ResetForm();
          // this.BindPurchaseGoodsReceiveNote();
          // this.Mode = 'List';
        }
        else {
          this.toastr.warning('Supplier Delivery Reference Already Exists');
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }

  AutoFillReceivedQuantity(value) {
    debugger;
    if (value == true) {
      value = 'Enable';
      let ID = this.GoodsReceivedNoteForm.get('ID').value;
      if (ID != "" && ID != null) {
        this.BindGRNbyID(ID);
      }
      // let autoFillReceivedQuantity = value;//value.target.checked;
      // let rowCount = 0;
      // this.PurchaseGRNDetailsTemp.controls.forEach((po) => {
      //   debugger;
      //   let checked = po.get('PartialReceived').value;
      //   this.PurchaseGRNDetails.at(rowCount).patchValue({
      //     ReceivedQuantity: autoFillReceivedQuantity == 'Enable' /*&& checked == false*/ ? po.get('ReceivedQuantity').value : 0,
      //     PartialReceived: checked == true ? true : false
      //   });

      //   rowCount++;
      // });

      
    
      
    }
    else {
      value = 'Disable';
      this.PurchaseGRNDetailsTemp = Object.assign([], this.PurchaseGRNDetails);
    let autoFillReceivedQuantity = value;//value.target.checked;
    let rowCount = 0;
    let receivedQty: any[] = [];
    this.PurchaseGRNDetails.controls.forEach((po) => {
      let res = po.get('OrderedQuantity').value - po.get('TotalReceivedQuantity').value;
      let checked = po.get('PartialReceived').value;
      this.PurchaseGRNDetails.at(rowCount).patchValue({
        ReceivedQuantity: autoFillReceivedQuantity == 'Disable' && checked == false ? po.get('ReceivedQuantity').value : 0,
        PartialReceived: checked == true ? true : false
      });

      //this.PurchaseGRNDetails.at(rowCount).patchValue({ ReceivedQuantity: autoFillReceivedQuantity ? po.get('OrderedQuantity').value : 0 });
      rowCount++;
    });
      }
  }
  TaxCode
  BindTax() {
    this.priceservice.getalltaxcode().subscribe((resp: any) => {
      this.TaxCode = resp.data.taxcode;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  LineCalculation(value, i) {

    let unitCost = this.PurchaseGRNDetails.at(i).get('UnitCost').value;
    let taxRate = this.PurchaseGRNDetails.at(i).get('TaxRate').value;
    let convertedOrderedQuantity = this.PurchaseGRNDetails.at(i).get('OrderedQuantity').value;
    if (convertedOrderedQuantity < value) {
      this.toastr.warning("Received quantity should be less than or equal to OrderedQuantity");
      this.PurchaseGRNDetails.at(i).patchValue({ ReceivedQuantity: this.PurchaseGRNDetails.at(i).get('OrderedQuantity').value });
      return;
    }
    let discountedUnitCostHome = this.PurchaseGRNDetails.at(i).get('DiscountedUnitCostHome').value;
    let OrderedQty = value;
    // this.RowData[i].orderedQuantity;
    let TaxID = this.PurchaseGRNDetails.at(i).get('TaxID').value;
    let index = this.TaxCode.findIndex(c => c.id == TaxID);
    let reslineTotalCostTaxEclusive, reslineTotalCostTaxInclusive, reslineTotalTaxAmount;
    if (index != "-1") {
      if (!this.TaxCode[index].taxInclusiveExclusiveFlag) {
        reslineTotalCostTaxEclusive = Number((OrderedQty * discountedUnitCostHome)).toFixed(4);
        let per = ((reslineTotalCostTaxEclusive / 100) * taxRate).toFixed(4);
        reslineTotalTaxAmount = Number(per).toFixed(4);
        let TaxInclusive = Number(Number(reslineTotalCostTaxEclusive) + Number(reslineTotalTaxAmount)).toFixed(4);
        reslineTotalCostTaxInclusive = Number(TaxInclusive).toFixed(4);
      } else {

        reslineTotalCostTaxInclusive = Number(OrderedQty) * Number(discountedUnitCostHome);


        let TR = Number(taxRate) / 100;
        TR = 1 + TR;

        let A = Number(reslineTotalCostTaxInclusive) / Number(TR);
        let res = Number(reslineTotalCostTaxInclusive) - A;
        reslineTotalTaxAmount = Number(res).toFixed(4);

        reslineTotalCostTaxEclusive = Number((reslineTotalCostTaxInclusive - reslineTotalTaxAmount)).toFixed(4);

        // this.RowData[i].lineTotalTaxAmount;   
        /* this.RowData[i].lineTotalCostTaxInclusive;
         let lineTotalTaxAmount = this.RowData[i].lineTotalTaxAmount;
         let lineTotalCostTaxEclusive = Number((lineTotalCostTaxInclusive - lineTotalTaxAmount)).toFixed(4);
         this.RowData[i].lineTotalCostTaxEclusive = lineTotalCostTaxEclusive; */
      }
    }
    if (reslineTotalTaxAmount == '0.0000' || !reslineTotalTaxAmount) {
      reslineTotalTaxAmount = 0;
    }
    if (reslineTotalCostTaxEclusive == '0.0000' || !reslineTotalCostTaxEclusive) {
      reslineTotalCostTaxEclusive = 0;
    }
    if (reslineTotalCostTaxInclusive == '0.0000' || !reslineTotalCostTaxInclusive) {
      reslineTotalCostTaxInclusive = 0;
    }

    this.PurchaseGRNDetails.at(i).patchValue({
      LineTotalTaxAmount: reslineTotalTaxAmount,
      LineTotalCostTaxEclusive: reslineTotalCostTaxEclusive,
      LineTotalCostTaxInclusive: reslineTotalCostTaxInclusive,
      PartialReceived: value < convertedOrderedQuantity ? true : false
    });
    //  this.PurchaseGRNDetails.at(i).patchValue({ LineTotalCostTaxEclusive: (unitCost * taxRate) });

    this.CalculateTotal();
    // ((po.orderedQuantity * po.unitCost) * po.taxRate) / 100

    // if (value == null) {
    //   alert('Blank');
    // }
    // else {
    //   alert(value);
    // }
  }

  CalculateTotal() {
    let totalTaxAmount: Number = 0;
    let totalExclusiveofTaxHome: Number = 0;
    let totalInclusiveofTaxHome: Number = 0;
    this.PurchaseGRNDetails.controls.forEach(pgrn => {
      /*  totalTaxAmount += pgrn.get('LineTotalTaxAmount').value;
       totalExclusiveofTaxHome += pgrn.get('LineTotalCostTaxEclusive').value;
       totalInclusiveofTaxHome += pgrn.get('LineTotalCostTaxInclusive').value; */
      let totalTaxHome: Number = pgrn.get('LineTotalTaxAmount').value;
      // let ExclusiveTax: Number = pgrn.get('LineTotalCostTaxEclusive').value;
      let TaxInclusive: Number = pgrn.get('LineTotalCostTaxInclusive').value;
      totalTaxAmount = Number(totalTaxAmount) + Number(totalTaxHome);
      // totalExclusiveofTaxHome = Number(totalExclusiveofTaxHome) + Number(ExclusiveTax);
      totalInclusiveofTaxHome = Number(totalInclusiveofTaxHome) + Number(TaxInclusive);
    });

    /*  this.GoodsReceivedNoteForm.patchValue({
       TaxTotalHome: Number(totalTaxAmount).toFixed(4),
       TotalExclusiveofTaxHome: Number(totalExclusiveofTaxHome).toFixed(4),
       TotalInclusiveofTaxHome: Number(totalInclusiveofTaxHome).toFixed(4)
     }); */

    // this.GoodsReceivedNoteForm.get('').patchValue();
    // this.GoodsReceivedNoteForm.get('').patchValue();
    // this.GoodsReceivedNoteForm.get('').patchValue();

  }
  OnActionClick(event: any) {
    debugger;
    var colId = event.column.getId();
    if (colId == 'Edit') {
      console.log(event.data)
      //this.AgEdit(event.data)
      this.SelectedPurchaseGRNID=event.data.id;

      this.BindGRNbyID(event.data.id);

      this.IsInvoiced = event.data.invoiced;
      this.SelectedPurchaseOrderID = event.data.id;
      this.Mode = 'Edit';
      // this.GoodsReceivedNoteForm.disable(); 
    } else if (colId == 'Delete') {
      this.DeleteGRNOrder(event.data.id)
    }
  }
  DeleteGRNOrder(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_PUR_PurchaseGoodsReceiveNote', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      //this.toastr.success('Purchase order deleted successfully');
      //   this.BindInventoryProductPriceDetails();
      this.BindGoodsReceivedNotes();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindGRNbyID(GRNID) {

    this.Loading = true;
    debugger;
    this.goodsReceivedNotesService.GetGRNbyID(GRNID).subscribe((resp: any) => {
      console.log(resp.data);
      debugger;
      this.PurchaseOrderDetails = [];

      let PurchaseOrderDetails = resp.data.purchaseDetails;
      this.PurchaseOrderDetails = resp.data.purchaseDetails;
      console.log(resp.data.purchaseDetails);
      this.SetGRNMain(resp.data.purchaseMain);
      this.GoodsReceivedNoteForm.setControl('PurchaseGRNDetails', this.setGRNDetails(PurchaseOrderDetails));
      this.CalculateTotal();
      this.Mode = 'Edit';

      if (resp.data.purchaseMain.status == 'True') {
        this.GoodsReceivedNoteForm.disable();
        this.IsClose = true;
      }
      else {
        this.IsClose = false;
        this.GoodsReceivedNoteForm.enable();
      }

      // this.AutoFillReceivedQuantity(this.GoodsReceivedNoteForm.get('AutoFillReceivedQuantity').value);
      this.Loading = false;
    }, (error: any) => {
      this.Loading = false;
    });
  }

  IsReversed: boolean;
  SelecteWareHouseID: any;
  selectedStatus: boolean;
  SetGRNMain(PurchaseMain: any) {
    this.SelectedGRNID = PurchaseMain.id;
    this.SelectedPurchaseGRNID= PurchaseMain.id;
    this.SelecteWareHouseID = PurchaseMain.shiptoWarehouse;
    this.selectedStatus = PurchaseMain.status;
    this.IsReversed = PurchaseMain.reversed;
    this.GoodsReceivedNoteForm.patchValue({
      ID: PurchaseMain.id,
      PurchaseOrderNumber: PurchaseMain.purchaseOrderNumber,
      WareHouseID: PurchaseMain.shiptoWarehouse,
      GRNNo: PurchaseMain.grnNo,
      SupplierDeliveryReference: PurchaseMain.supplierDeliveryReference,
      Vendor: PurchaseMain.vendorCode + ' - ' + PurchaseMain.vendorAccountName,
      VendorID: PurchaseMain.vendorID,
      ReceivedDate: PurchaseMain.receivedDate,
      Status: PurchaseMain.status,
      Reversed: PurchaseMain.reversed,
      WareHouse: PurchaseMain.wareHouseName,
      //PurchaseInvoice:PurchaseMain.,
      Insurance: PurchaseMain.insurance,
      InsuranceTaxID: PurchaseMain.insuranceTaxID,
      InsuranceTaxRate: PurchaseMain.insuranceTaxRate,
      InsuranceTaxAmount: PurchaseMain.insuranceTaxAmount,
      Freight: PurchaseMain.freight,
      FreightTaxID: PurchaseMain.freightTaxID,
      FreightTaxRate: PurchaseMain.freightTaxRate,
      FreightTaxAmount: PurchaseMain.freightTaxAmount,
      Duty: PurchaseMain.duty,
      DutyTaxID: PurchaseMain.dutyTaxID,
      DutyTaxRate: PurchaseMain.dutyTaxRate,
      DutyTaxAmount: PurchaseMain.dutyTaxAmount,
      TotalExclusiveofTaxHome: PurchaseMain.poTaxExclusiveTotal,
      TaxTotalHome: PurchaseMain.poTotalTax,
      TotalInclusiveofTaxHome: PurchaseMain.poTaxInclusiveTotal,
      UnitCost: PurchaseMain.unitCost,
      DiscountType: PurchaseMain.discountType,
      DiscountAmount: PurchaseMain.discountAmount,
      DiscountedUnitCost: PurchaseMain.discountedUnitCost,
      LineTotalCostTaxEclusive: (PurchaseMain.convertedOrderedQuantity * PurchaseMain.unitCost),
      DutyTaxName: PurchaseMain.dutyTaxName,
      InsuranceName: PurchaseMain.insuranceTaxName,
      FreightTaxName: PurchaseMain.freightTaxName
    });
  }
  Cancel() {
    this.ResetForm();
    this.submitted = false;
    this.BindGoodsReceivedNotes();
    this.Mode = 'List';
    this.GoodsReceivedNoteForm.setControl('PurchaseGRNDetails', this.setGRNDetails([]));
    this.GRNIDrouter = "";
  }

  ResetForm() {
    this.GoodsReceivedNoteForm.patchValue({
      PurchaseOrderNumber: null,
      WareHouse: null,
      WareHouseID: null,
      GRNNo: null,
      SupplierDeliveryReference: null,
      Vendor: null,
      VendorID: null,
      ReceivedDate: null,
      Status: null,
      Reversed: null,
      Invoiced: null,
      PurchaseInvoice: null,
      Insurance: null,
      InsuranceTaxID: null,
      InsuranceTaxRate: null,
      InsuranceTaxAmount: null,
      Freight: null,
      FreightTaxID: null,
      FreightTaxRate: null,
      FreightTaxAmount: null,
      Duty: null,
      DutyTaxID: null,
      DutyTaxRate: null,
      DutyTaxAmount: null,
      TotalExclusiveofTaxHome: null,
      TaxTotalHome: null,
      TotalInclusiveofTaxHome: null,
      DutyTaxName: null,
      InsuranceName: null,
      FreightTaxName: null,
      AutoFillReceivedQuantity: [true]
      // PurchaseGRNDetails: null
    });
    this.IsClose = false;
    this.IsReversed = false;
    this.IsInvoiced = false;
    this.GoodsReceivedNoteForm.enable();
  }


  setGRNDetails(PurchaseGRNDetails: any[]): FormArray {
    debugger;
    const formArray = new FormArray([]);
    PurchaseGRNDetails.forEach(po => {
      formArray.push(this.FB.group({
        ID: po.id,
        PurchaseOrderNumber: this.GoodsReceivedNoteForm.get('PurchaseOrderNumber').value,
        ProductCode: po.productCode,
        ProductName: po.productName,
        PurchaseOrderLineID: po.id,
        PurchaseOrderID: po.purchaseOrderID,
        LineNo: po.lineNo,
        PurchaseLineStatus: po.purchaseLineStatus,
        ProductType: po.productType,
        ProductID: po.productID,
        ProductDescription: po.productDescription,
        OrderedQuantity: po.convertedOrderedQuantity,
        ReceivedQuantity: po.receivedQuantity,//? po.orderedQuantity : 0,
        //this.GoodsReceivedNoteForm.get('AutoFillReceivedQuantity').value ? po.orderedQuantity : 0,
        UnitOfMeasure: po.unitOfMeasure,
        UnitCost: po.homeConvertedUnitCost,
        TotalReceivedQuantity: po.totalReceivedQuantity,
        DiscountType: po.discountType,
        DiscountAmount: po.discountAmount,
        DiscountedUnitCost: po.discountedUnitCost,
        LineTotalCostTaxEclusive: po.lineTotalCostTaxEclusive,//po.unitCost + ((po.unitCost * po.taxRate) / 100),
        TaxID: po.taxID,
        TaxRate: po.taxRate,
        LineTotalTaxAmount: po.lineTotalTaxAmount,
        UnitCostInclusiveTax: po.discountedUnitCostForeign,// po.unitCost + ((po.unitCost * po.taxRate) / 100),
        LineTotalCostTaxInclusive: po.lineTotalCostTaxInclusive,
        CurrencyID: po.currencyID,
        FXRate: po.fxRate,
        ForeignExchangeUnitCost: po.foreignExchangeUnitCost,
        LineTotalForeignExchangeCostTaxExclusive: po.lineTotalForeignExchangeCostTaxExclusive,
        LineTotalForeignExchangeCostTaxInclusive: po.lineTotalForeignExchangeCostTaxInclusive,
        LineTotalHomeAmount: po.lineTotalHomeAmount,
        LineTotalForeignAmount: po.lineTotalForeignAmount,
        SupplierSKU: po.supplierSKU,
        ClassificationID: po.classificationID,
        AllowPartialReceiving: po.allowPartialReceiving,
        RequisitionID: po.requisitionID,
        VendorPriceSchemeID: po.vendorPriceSchemeID,
        ConvertedOrderedQuantity: po.convertedOrderedQuantity,
        CovertedReceivedQuantity: po.covertedReceivedQuantity,
        HomeUnitCost: po.homeConvertedUnitCost,
        DiscountedUnitCostHome: po.discountedUnitCostHome,
        LineTotalCostTaxExclusiveHome: po.lineTotalCostTaxExclusiveHome,
        LineTotalTaxAmountHome: po.lineTotalTaxAmountHome,
        LineTotalCostTaxInclusiveHome: po.lineTotalCostTaxInclusiveHome,
        DiscountedUnitCostForeign: po.discountedUnitCostForeign,
        LineTotalForeignExchangeTaxAmount: po.lineTotalForeignExchangeTaxAmount,
        HomeConvertedUnitCost: po.homeConvertedUnitCost,
        PartialReceived: po.allowPartialReceiving,
        barcode: po.barcode == null ? '': po.barcode ,
        vendorSKU: po.vendorSKU == null ? '' : po.vendorSKU,
        vendorBarCode: po.vendorBarCode == null ? '' : po.vendorBarCode,
      }));
    });
   
    this.PurchaseGRNDetailsSearch = Object.assign([],formArray);
    this.CalculateTotal();
    return formArray;
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
  SelectedQuantity
  SelectedProductID
  SelectedGRNDetailID
  ProductMatrix(serialise: TemplateRef<any>, product: TemplateRef<any>, other: TemplateRef<any>, OrderQuantity, i) {
    debugger;
    this.SelectedQuantityOrderedToCheck = OrderQuantity;
    this.SelectedGRNDetailID = this.PurchaseOrderDetails[i].id;
    this.SelectedProductID = this.PurchaseOrderDetails[i].productID;
    this.SelectedQuantity = this.PurchaseOrderDetails[i].convertedOrderedQuantity;
    this.selectedProductCode = this.PurchaseOrderDetails[i].productCode;
    this.selectedProductDescription = this.PurchaseOrderDetails[i].productName;
    this.SelecteWareHouseID = this.GoodsReceivedNoteForm.get('WareHouseID').value;

    let index = this.inventoryList.findIndex(c => c.id == this.PurchaseOrderDetails[i].productID);
    if (index >= 0) {
      this.productName = this.inventoryList[index].productCode + ' - ' + this.inventoryList[index].productName;
      let productID = this.PurchaseOrderDetails[i].productID;
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
    //this.modalRef = this.modalService.show(matrix);
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  Closenote() {
    this.modalRef.hide();
    this.BindGoodsReceivedNotes();
    this.BindGRNbyID(this.SelectedPurchaseOrderID);
  }
  UpdateStatus() {
    this.goodsReceivedNotesService.ChangeGRNStatus(this.SelectedGRNID).subscribe((resp: any) => {
      if (resp.isSuccess) {
        this.toastr.success('Purchase GRN Received successfully');
        this.BindGRNbyID(this.SelectedGRNID)

        this.Loading = false;
      }
      else {
        this.toastr.warning(resp.message);
      }

      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  ReverseStatus() {
    this.goodsReceivedNotesService.ReverseGRNStatus(this.SelectedGRNID).subscribe((resp: any) => {
      if (resp.isSuccess) {
        this.toastr.success('Purchase GRN Received successfully');
        this.BindGRNbyID(this.SelectedGRNID)
        this.Loading = false;
      }
      else {
        this.Loading = false;
        this.toastr.warning(resp.message);
      }

    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  CreatePurchaseInvoice() {
    this.goodsReceivedNotesService.CreatePurchaseInvoice(this.SelectedGRNID).subscribe((resp: any) => {
      console.log(resp)
      if (resp.isSuccess) {
        this.toastr.success('Purchase GRN Invoice Created successfully');
        this.Loading = false;
        this.router.navigate(['/pur/purchase-invoice']);
      }
      else {
        this.toastr.warning(resp.message);
        this.Loading = false;
        this.router.navigate(['/pur/purchase-invoice']);
      }

    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Search(val) {
    debugger;
    this.searchValue = val;
    if (this.searchValue != "") {
      this.PurchaseGRNDetailsSearch.controls.forEach(po => {
        po.patchValue({
          PurchaseOrderNumber: po.get('PurchaseOrderNumber').value == null ? "" : po.get('PurchaseOrderNumber').value,
          ProductCode: po.get('ProductCode').value == null ? "" : po.get('ProductCode').value,
          ProductName: po.get('ProductName').value == null ? "" : po.get('ProductName').value,
          barcode: po.get('barcode').value == null ? "" : po.get('barcode').value,
          vendorSKU: po.get('vendorSKU').value == null ? "" : po.get('vendorSKU').value,
          vendorBarCode: po.get('vendorBarCode').value == null ? "" : po.get('vendorBarCode').value,
      });
    });

      //this.BindPurchaseOrder(this.SelectedPurchaseOrderID);
      this.PurchaseGRNDetails.controls = this.PurchaseGRNDetailsSearch.controls.filter(res => {
        return res.get('PurchaseOrderNumber').value.toLocaleUpperCase().match(this.searchValue.toLocaleUpperCase()) ||
          res.get('ProductCode').value.toLocaleUpperCase().match(this.searchValue.toLocaleUpperCase()) ||
          res.get('ProductName').value.toLocaleLowerCase().match(this.searchValue.toLocaleLowerCase())|| 
        res.get('barcode').value.toLocaleUpperCase().match(this.searchValue.toLocaleUpperCase()) ||
          res.get('vendorSKU').value.toLocaleUpperCase().match(this.searchValue.toLocaleUpperCase()) ||
          res.get('vendorBarCode').value.toLocaleUpperCase().match(this.searchValue.toLocaleUpperCase())
      });

      //this.PurchaseGRNDetails.controls = this.PurchaseGRNDetailsSearch.controls.filter(res => {
      //  return res.get('PurchaseOrderNumber').value == null ? "": res.get('PurchaseOrderNumber').value.toLocaleUpperCase().match(this.searchValue.toLocaleUpperCase()) ||
      //    res.get('ProductCode').value == null ? "" : res.get('ProductCode').value.toLocaleUpperCase().match(this.searchValue.toLocaleUpperCase()) ||
      //      res.get('ProductName').value == null ? "" : res.get('ProductName').value.toLocaleLowerCase().match(this.searchValue.toLocaleLowerCase()) ||
      //        res.get('barcode').value == null ? "" : res.get('barcode').value.toLocaleUpperCase().match(this.searchValue.toLocaleUpperCase()) ||
      //          res.get('vendorSKU').value == null ? "" : res.get('vendorSKU').value.toLocaleUpperCase().match(this.searchValue.toLocaleUpperCase()) ||
      //            res.get('vendorBarCode').value == null ? "": res.get('vendorBarCode').value.toLocaleUpperCase().match(this.searchValue.toLocaleUpperCase());
      //});

      console.log(this.PurchaseGRNDetails.controls);

    }
    else if (this.searchValue == "") {
      //this.BindPurchaseOrder(this.SelectedPurchaseOrderID);
      this.PurchaseGRNDetails.controls = this.PurchaseGRNDetailsSearch.controls
    }
  }
}
