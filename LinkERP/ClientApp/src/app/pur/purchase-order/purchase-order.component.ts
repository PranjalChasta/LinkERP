import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CustomValidators } from 'ngx-custom-validators';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { LbsPurPurchaseOrder } from '../../models/pur/lbs-pur-purchase-order';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { WorkflowService } from 'src/app/sys/services/workflow.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';
import { PriceGroupsService } from 'src/app/inv/services/price-groups.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { LbsSysUser } from '../../models/sys/lbs-sys-user';
import { UserService } from '../../sys/services/user.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  
  Vendors: any;
  PurOrderForm: FormGroup;
  Mode;
  ColumnDefs;
  purchaseOrder: any;
  RowData: any;
  AgLoad = false;
  POTotalTax: number = 0;
  POTaxExclusiveTotal: number = 0;
  POTaxInclusiveTotal: number = 0;
  submitted: boolean;
  CompanyID = localStorage.getItem('CompanyID');
  VendorWareHouse: any;
  Warehouse: any;
  SelectedPurchaseOrderID: any;
  VendorID: any;
  poWorkFlow: any;
  PurchaseStatus: any;
  isApprover: boolean;
  IsCreatedBY: boolean;
  modalRef: BsModalRef;
  AccessTab: string;
  PageSize: any;
  Currentpage: string;
  IsSave: boolean;
  TaxcodeList: any;
  SelectedCurrencyID: any;
  orderAproverouter: any;
  IsActive: boolean;
  taxExclTotal: number = 0.00;
  totalTax: number = 0.00;
  taxInclTotal: number = 0.00;
  colId: any;
  usePurchaseApprovalWorkFlow: any;
  Loading: any = false;

  constructor(
    public toastr: ToastrService,
    private FB: FormBuilder,
    private router: Router, private route: ActivatedRoute,
    private deleteRecordsService: DeleteRecordsService,
    private purchaseOrderService: PurchaseOrderService,
    public invCommonService: InvCommonService,
    private workflowservice: WorkflowService,
    public modalService: BsModalService,
    private commonService: SysCommonService,
    private sharedFormatterService: SharedFormatterService,
    private priceservice: PriceGroupsService, private cryptoAes: CryptoAes,
    private userService: UserService,
  ) {
    this.orderAproverouter = this.route.snapshot.paramMap.get("id")
  }

  ngOnInit() {
    this.AccessTab = "PurchaseOrder";
    this.Mode = "List";
    this.AccessTab = "PurchaseOrder";
    this.isApprover = true;
    
    this.CreateForm();
    this.SetPermissions();
    this.AgGridColumns();
    this.Currentpage = "0";
    this.PageSize = "50";
    //this.BindGetTaxCode();
    this.BindGetTaxCodenew();
    this.BindPurchaseOrder();
    this.BindAllVendor();
    this.BindWarehouse();
    this.BindVendorWareHouse();
    this.BindPOWorkFlow();
    this.onChanges();
    this.GetUserPurchaseOrderWorkflow();

  }

  get f() { return this.PurOrderForm.controls; }

  OnPageSizeChange($event: any) {
    debugger;
    this.taxExclTotal = 0;
    this.totalTax = 0;
    this.taxInclTotal = 0;
    this.PageSize = $event.target.value;
    for (var i = this.PageSize; i < this.RowData.length; i++) {
      this.taxExclTotal += this.RowData[i].poTaxExclusiveTotal.toFixed(2);
      this.totalTax += this.RowData[i].poTotalTax.toFixed(2);
      this.taxInclTotal += this.RowData[i].poTaxInclusiveTotal.toFixed(2);
    }
  }
  OnchangeCurrentpage(page) {
    debugger;
    this.taxExclTotal = 0;
    this.totalTax = 0;
    this.taxInclTotal = 0;
    this.Currentpage = page;
    for (var i = page; i < this.RowData.length; i++) {
      this.taxExclTotal += this.RowData[i].poTaxExclusiveTotal != null ? this.RowData[i].poTaxExclusiveTotal.toFixed(2) : 0;
      this.totalTax += this.RowData[i].poTotalTax != null ? this.RowData[i].poTotalTax.toFixed(2):0;
      this.taxInclTotal += this.RowData[i].poTaxInclusiveTotal !=null ?  this.RowData[i].poTaxInclusiveTotal.toFixed(2):0;
    }
  }
  CreateForm() {
    this.PurOrderForm = this.FB.group({
      ID: [''],
      PurOrderVendorID: ['-1', CustomValidators.notEqual('-1')],
      VendorWareHouseDD: ['-1', CustomValidators.notEqual('-1')],
      ShiptoWarehouseDD: ['-1', CustomValidators.notEqual('-1')],
      PurOrderWorkflowDD: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      Attentionto: [''],
      AttentionPhone: [''],
      PurOrderNumber: [''],
      ExpDeliveryDate: ['', Validators.required],
      PurOrderValDays: [''],
      Freight: ['0', Validators.required],
      Duty: [0, Validators.required],
      Insurance: [0, Validators.required],
      FreightTaxID: ['00000000-0000-0000-0000-000000000000'],
      FreightTaxRate: [0, Validators.required],
      FreightTaxAmount: [0, Validators.required],
      FreightTaxInclusive: [0],
      DutyTaxID: ['00000000-0000-0000-0000-000000000000'],
      DutyTaxRate: [0, Validators.required],
      DutyTaxAmount: [0, Validators.required],
      DutyTaxInclusive: [0],
      InsuranceTaxID: ['00000000-0000-0000-0000-000000000000'],
      InsuranceTaxRate: [0, Validators.required],
      InsuranceTaxAmount: [0, Validators.required],
      InsuranceTaxInclusive: [0],
      POTaxInclusiveTotal: [0],
      POTaxExclusiveTotal: [0],
      POTotalTax: [0],
    })
  }

 

  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Date Created', field: 'dateCreated', sortable: true, filter: true,  },
      { headerName: 'Order Number', field: 'purchaseOrderNumber', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Vendor', field: 'vendorAccountName', sortable: true, filter: true },
      { headerName: 'Ship to Warehouse', field: 'shiptoWareHouseName', sortable: true, filter: true },
      { headerName: 'Exp Delivery Date', field: 'expectedDeliveryDate', sortable: true, filter: true, },
      { headerName: 'Attention To', field: 'attentionto', sortable: true, filter: true },
      { headerName: 'Attention Phone', field: 'attentionPhone', sortable: true, filter: true },
      { headerName: 'Tax Exclusive Total', field: 'poTaxExclusiveTotal', sortable: true, filter: true },
      { headerName: 'Total Tax', field: 'poTotalTax', sortable: true, filter: true },
      { headerName: 'Tax Inclusive Total', field: 'poTaxInclusiveTotal', sortable: true, filter: true },
      { headerName: 'Status', field: 'status', type: 'PurchaseStatus', sortable: true, filter: true },
      { headerName: 'Created By', field: 'createdBY', type: 'PurchaseStatus' , sortable: true, filter: true},
      { headerName: 'Next Approver', field: 'nextApprover', type: 'PurchaseStatus' , sortable: true, filter: true},
      // { headerName: 'Delete Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction',hide: !this.delete_Access }
    ];
  }

  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }

  BindPOWorkFlow() {
    this.commonService.getWorkflow().subscribe((resp: any) => {
      this.poWorkFlow = resp.data.workFlow;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //Add new PurchaseOrder
  AddNewPurchaseOrder(): void {
    this.PurOrderForm.get('ShiptoWarehouseDD').enable();
    this.PurOrderForm.patchValue({
      PurOrderWorkflowDD: this.poWorkFlow.filter(r => r.id == this.usePurchaseApprovalWorkFlow).length > 0 ? this.poWorkFlow.filter(r => r.id == this.usePurchaseApprovalWorkFlow)[0].id : '00000000-0000-0000-0000-000000000000',
    });
    this.PurchaseStatus = "0";
    this.Mode = 'Add';
    this.PurOrderForm.enable();
    this.IsActive = true;

  }
  GetUserPurchaseOrderWorkflow() {
    this.userService.getUserByID(localStorage.getItem('LoginID')).subscribe((resp: any) => {

      if (resp.isSuccess == true) {
        let user: any = new LbsSysUser();
        user = resp.data.users;
        this.usePurchaseApprovalWorkFlow = user.purchaseApprovalWorkFlow;
      }
    });
  }

  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "307");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.PurOrderForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.PurOrderForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.PurOrderForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }

  BindAllVendor() {
    this.invCommonService.getVendor().subscribe((resp: any) => {
      console.log(resp);
      this.Vendors = resp.data.vendors;
    })
  }

  BindVendorWareHouse() {
    this.purchaseOrderService.getVendorWareHouse().subscribe((resp: any) => {
      console.log(resp);
      this.VendorWareHouse = resp.data.vendorWareHouse;
      // this.AgLoad = true;
      // this.Loading = false;
    }, (error) => {

      // this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


  BindWarehouse() {
    this.invCommonService.getWareHouse().subscribe((resp: any) => {
      console.log(resp);
      this.Warehouse = resp.data.warehouse;
    })
  }


  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.BindPurchaseOrder();
    this.submitted = false;
    this.orderAproverouter = '';
    this.Mode = "List";
    this.PurOrderForm.enable();
    this.IsActive = true;
  }

  onChanges() {

    this.PurOrderForm.get('FreightTaxRate').valueChanges.subscribe(val => {
      let Freight = Number(this.PurOrderForm.get('Freight').value);
      // let FreightTaxAmount = Number(val) * Number(Freight);
      this.POFreightTaxAmount();
      let FreightTaxAmount = ((val / 100) * Freight).toFixed(4)
      this.PurOrderForm.patchValue({
        //  POTotalTax: this.POTotalTax,
        // FreightTaxAmount: FreightTaxAmount
      });
    });
    this.PurOrderForm.get('Freight').valueChanges.subscribe(val => {
      let FreightTaxRate = this.PurOrderForm.get('FreightTaxRate').value;
      // let FreightTaxAmount = Number(val) * (Number(FreightTaxRate/ 100))
      let FreightTaxAmount = ((FreightTaxRate / 100) * val).toFixed(4)
      // this.POTotalTax = Number(this.PurOrderForm.get('Insurance').value) + Number(this.PurOrderForm.get('Duty').value) + Number(val);
      this.POTotalTax = (Number(this.PurOrderForm.get('InsuranceTaxAmount').value) + Number(this.PurOrderForm.get('DutyTaxAmount').value) + Number(FreightTaxAmount));
      this.POFreightTaxAmount();
      this.PurOrderForm.patchValue({
        //  POTotalTax: this.POTotalTax,
        //FreightTaxAmount: FreightTaxAmount
      });
    });
    this.PurOrderForm.get('Duty').valueChanges.subscribe(val => {
      // this.POTotalTax = Number(this.PurOrderForm.get('FreightTaxAmount').value) + Number(this.PurOrderForm.get('FreightTaxAmount').value) + Number(val);
      let DutyTaxRate = this.PurOrderForm.get('DutyTaxRate').value;
      // let DutyTaxAmount = Number(val) * Number(DutyTaxRate); 
      let DutyTaxAmount = ((DutyTaxRate / 100) * val).toFixed(4)
      this.POTotalTax = Number(this.PurOrderForm.get('FreightTaxAmount').value) + Number(this.PurOrderForm.get('InsuranceTaxAmount').value) + Number(DutyTaxAmount);
      this.PurOrderForm.patchValue({
        // POTotalTax: this.POTotalTax,
        DutyTaxAmount: DutyTaxAmount
      });
      this.PODutyTaxInclusive();
    });
    this.PurOrderForm.get('DutyTaxRate').valueChanges.subscribe(val => {
      let Duty = this.PurOrderForm.get('Duty').value;
      //let DutyTaxAmount = Number(val) * Number(Duty);
      let DutyTaxAmount = ((val / 100) * Duty).toFixed(4)
      this.PurOrderForm.patchValue({
        DutyTaxAmount: DutyTaxAmount
      });
      this.PODutyTaxInclusive();
    });
    /* this.PurOrderForm.get('Insurance').valueChanges.subscribe(val => {
      let Duty = this.PurOrderForm.get('Duty').value;
      console.log('Insurance2222');
      //let DutyTaxAmount = Number(val) * Number(Duty);
      this.POInsuranceTaxAmount()
    }); */
    this.PurOrderForm.get('Insurance').valueChanges.subscribe(val => {
      console.log('Insurance');
      //this.POTotalTax = Number(this.PurOrderForm.get('Duty').value) + Number(this.PurOrderForm.get('Freight').value) + Number(val);
      let InsuranceTaxRate = this.PurOrderForm.get('InsuranceTaxRate').value;
      // let InsuranceTaxAmount = Number(val) * Number(InsuranceTaxRate);
      let InsuranceTaxAmount = ((InsuranceTaxRate / 100) * val).toFixed(4)
      this.POTotalTax = Number(this.PurOrderForm.get('FreightTaxAmount').value) + Number(this.PurOrderForm.get('DutyTaxAmount').value) + Number(InsuranceTaxAmount);

      this.PurOrderForm.patchValue({
        // POTotalTax: this.POTotalTax,
        // InsuranceTaxAmount: Number(res).toFixed(4)

      });
      this.POInsuranceTaxAmount()
    });
    this.PurOrderForm.get('InsuranceTaxRate').valueChanges.subscribe(val => {
      console.log('InsuranceTaxRate')
      this.POInsuranceTaxAmount()
    });
    /*  this.PurOrderForm.get('FreightTaxInclusive').valueChanges.subscribe(val => {
       console.log('FreightTaxInclusive')
       this.POFreightTaxExclusive();
     }); */

    this.PurOrderForm.get('InsuranceTaxAmount').valueChanges.subscribe(val => {
      // this.POTotalTax = this.PurOrderForm.get('Insurance').value + this.PurOrderForm.get('Duty').value + val;
      this.POtotaltax();
    });
    this.PurOrderForm.get('FreightTaxAmount').valueChanges.subscribe(val => {
      this.POtotaltax();
    });
    this.PurOrderForm.get('DutyTaxAmount').valueChanges.subscribe(val => {
      this.POtotaltax();
    });
    /*   this.PurOrderForm.get('FreightTaxInclusive').valueChanges.subscribe(val => {
        this.POFreightTaxExclusive();
      }); */

  }

  POInsuranceTaxAmount() {
    let Insurance = Number(this.PurOrderForm.get('Insurance').value);
    let InsuranceTaxRate = Number(this.PurOrderForm.get('InsuranceTaxRate').value);
    let InsuranceTaxID = this.PurOrderForm.get('InsuranceTaxID').value;
    let index = this.TaxcodeList.findIndex(c => c.id == InsuranceTaxID);
    let res;
    if (index == "-1") {
      return;
    }
    if (this.TaxcodeList) {
      if (!this.TaxcodeList[index].taxInclusiveExclusiveFlag) {

        res = Number((InsuranceTaxRate / 100) * Insurance).toFixed(4)
      } else {
        /*  let TR = Number(InsuranceTaxRate) / 100;
         TR = 1 + TR;
         let A = Number(Insurance) / Number(TR);
         res = Number(Insurance) - A; */
        res = Number((InsuranceTaxRate / 100) * Insurance).toFixed(4)
      }
      this.PurOrderForm.patchValue({
        InsuranceTaxAmount: Number(res).toFixed(4)
      });
      this.POInsuranceTaxInclusive();
    }
  }
  POFreightTaxAmount() {

    let Freight = Number(this.PurOrderForm.get('Freight').value);
    let TaxRate = Number(this.PurOrderForm.get('FreightTaxRate').value);
    let TaxID = this.PurOrderForm.get('FreightTaxID').value;
    let index = this.TaxcodeList.findIndex(c => c.id == TaxID);
    let res;
    if (index == "-1") {
      return;
    }
    if (!this.TaxcodeList[index].taxInclusiveExclusiveFlag) {
      res = Number((TaxRate / 100) * Freight).toFixed(4)
    }
    else {
      res = Number((TaxRate / 100) * Freight).toFixed(4)
      /* let TR = Number(TaxRate) / 100;
      TR = 1 + TR;
      let A = Number(Freight) / Number(TR);
      res = Number(Freight) - A; */
    }
    this.PurOrderForm.patchValue({
      FreightTaxAmount: Number(res).toFixed(4)
    });
    this.POFreightTaxInclusive();
  }
  POFreightTaxInclusive() {
    debugger;
    let Freight = Number(this.PurOrderForm.get('Freight').value);
    let FreightTaxAmount = Number(this.PurOrderForm.get('FreightTaxAmount').value);
    let res = Number(Freight + FreightTaxAmount).toFixed(4);
    this.PurOrderForm.patchValue({
      FreightTaxInclusive: res
    });
  }
  POFreightTaxExclusive() {
    debugger;
    let Freight = Number(this.PurOrderForm.get('Freight').value);
    let FreightTaxInclusive = Number(this.PurOrderForm.get('FreightTaxInclusive').value);
    let TaxRate = Number(this.PurOrderForm.get('FreightTaxRate').value);
    let TaxID = this.PurOrderForm.get('FreightTaxID').value;
    let TR = Number(TaxRate) / 100;
    TR = 1 + TR;
    let A = Number(FreightTaxInclusive) / Number(TR);
    let taxAmount = Number(FreightTaxInclusive) - A;
    let freightTaxExclusive = FreightTaxInclusive - taxAmount;
    this.PurOrderForm.patchValue({
      Freight: Number(freightTaxExclusive).toFixed(4),
      FreightTaxAmount: Number(taxAmount).toFixed(4)
    });

  }
  OnFreightTaxInclusiveChange() {
    this.POFreightTaxExclusive();
  }
  PODutyTaxInclusive() {
    let Duty = Number(this.PurOrderForm.get('Duty').value);
    let DutyTaxAmount = Number(this.PurOrderForm.get('DutyTaxAmount').value);
    let res = (Number(Duty + DutyTaxAmount)).toFixed(4);
    this.PurOrderForm.patchValue({
      DutyTaxInclusive: res
    });
  }
  OnDutyTaxInclusiveChange() {
    let TaxInclusive = Number(this.PurOrderForm.get('DutyTaxInclusive').value);
    let TaxRate = Number(this.PurOrderForm.get('DutyTaxRate').value);
    let TR = Number(TaxRate) / 100;
    TR = 1 + TR;
    let A = Number(TaxInclusive) / Number(TR);
    let taxAmount = Number(TaxInclusive) - A;
    let TaxExclusive = TaxInclusive - taxAmount;
    this.PurOrderForm.patchValue({
      Duty: Number(TaxExclusive).toFixed(4),
      DutyTaxAmount: Number(taxAmount).toFixed(4)
    });
  }
  POInsuranceTaxInclusive() {
    debugger;
    let Insurance = Number(this.PurOrderForm.get('Insurance').value);
    let InsuranceTaxAmount = Number(this.PurOrderForm.get('InsuranceTaxAmount').value);
    let res = Number(Insurance + InsuranceTaxAmount).toFixed(4);
    this.PurOrderForm.patchValue({
      InsuranceTaxInclusive: res
    });
  }
  OnInsuranceTaxInclusiveChange() {
    debugger;
    let TaxInclusive = Number(this.PurOrderForm.get('InsuranceTaxInclusive').value);
    let TaxRate = Number(this.PurOrderForm.get('InsuranceTaxRate').value);
    let TR = Number(TaxRate) / 100;
    TR = 1 + TR;
    let A = Number(TaxInclusive) / Number(TR);
    let taxAmount = Number(TaxInclusive) - A;
    let TaxExclusive = TaxInclusive - taxAmount;
    this.PurOrderForm.patchValue({
      Insurance: Number(TaxExclusive).toFixed(4),
      InsuranceTaxAmount: Number(taxAmount).toFixed(4)
    });
  }
  PODutyTaxAmount() {
    let Freight = Number(this.PurOrderForm.get('Freight').value);
    let TaxRate = Number(this.PurOrderForm.get('DutyTaxRate').value);
    let TaxID = this.PurOrderForm.get('FreightTaxID').value;
    let index = this.TaxcodeList.findIndex(c => c.id == TaxID);
    let res;
    if (index == "-1") {
      return;
    }
    if (!this.TaxcodeList[index].taxInclusiveExclusiveFlag) {
      res = Number((TaxRate / 100) * Freight).toFixed(4)
    }
    else {
      /* let TR = Number(TaxRate) / 100;
      TR = 1 + TR;
      let A = Number(Freight) / Number(TR);
      res = Number(Freight) - A; */
      res = Number((TaxRate / 100) * Freight).toFixed(4);
    }

    this.PurOrderForm.patchValue({
      DutyTaxAmount: Number(res).toFixed(4)
    });
    this.PODutyTaxInclusive();
  }
  POtotaltax() {
    let POTotalTax = Number(this.PurOrderForm.get('FreightTaxAmount').value) + Number(this.PurOrderForm.get('DutyTaxAmount').value) + Number(this.PurOrderForm.get('InsuranceTaxAmount').value);
    let POTotalTaxnum = Number(POTotalTax).toFixed(4)
    /*  this.PurOrderForm.patchValue({
       POTotalTax: POTotalTaxnum
     }); */
  }
  onVendorChange($event) {
    //Dropdown Value Changed
    if ($event.target.value == '-1') {
      return;
    }
    this.VendorID = $event.target.value;
    this.purchaseOrderService.getPurchaseMainValidityDays(this.VendorID).subscribe((resp: any) => {
      this.PurOrderForm.patchValue({ PurOrderValDays: resp.data.purchaseValidityDays.PurchaseOrderValidityDays });

    });
  }

  BindPurchaseOrder() {
    debugger;
    this.Loading = true;
    this.AgLoad = false;
    this.purchaseOrderService.getPurchaseMain().subscribe((resp: any) => {

      this.purchaseOrder = resp.data.purchaseMain;
      this.RowData = resp.data.purchaseMain;
      if(this.RowData.length <= 50){
        for (var i = 0; i < this.RowData.length; i++) {
          this.taxExclTotal += this.RowData[i].poTaxExclusiveTotal;
          this.totalTax += this.RowData[i].poTotalTax;
          this.taxInclTotal += this.RowData[i].poTaxInclusiveTotal;
        }
      }
      else{
        for (var i = 0; i < 50; i++) {
          this.taxExclTotal += this.RowData[i].poTaxExclusiveTotal;
          this.totalTax += this.RowData[i].poTotalTax;
          this.taxInclTotal += this.RowData[i].poTaxInclusiveTotal;
        }
      }
      console.log(this.RowData);
      if (this.orderAproverouter && this.RowData) {
        this.orderAproverouter = this.orderAproverouter.toLowerCase()
        let data = this.RowData.filter(pur => pur.id == this.orderAproverouter);
        this.AgEdit(data[0]);
      }
      this.RowData.forEach(element => {
        let dateCreated = {'value': element.dateCreated}
        let expectedDeliveryDate = {'value': element.expectedDeliveryDate}
        
        element.dateCreated=this.sharedFormatterService.dateTimeFormatter(dateCreated);
        element.expectedDeliveryDate=this.sharedFormatterService.dateTimeFormatter(expectedDeliveryDate);
      });

      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });

  }

  OnActionClick(event: any) {
    this.colId = event.column.getId();
    if (this.colId == 'Edit') {
      this.AgEdit(event.data)
      //this.Edit(event.data.id);

      this.SelectedPurchaseOrderID = event.data.id;
      this.Mode = 'Edit';
    } else if (this.colId == 'Delete') {
      this.DeletePurchaseOrder(event.data.id)
    }
  }
  //edit operation
  AgEdit(event) {
    debugger;
    //  this.SelectedPurchaseOrderID = event.data.id;
    console.log(event);
    if (event.purchaseOrderWorkflow == '-1' || event.purchaseOrderWorkflow == '00000000-0000-0000-0000-000000000000') {
      this.IsSave = true;
    } else {
      this.IsSave = false;
    }
    this.PurchaseStatus = event.status;
    this.isApprover = false;
    this.IsCreatedBY = false;
    let userid = localStorage.getItem('LoginID');
    /*  if (event.status == "Approval In Progress") {
       this.isApprover = true;
     } */
    if (event.createdBY) {
      if (event.createdBY == userid) {
        this.IsCreatedBY = true;
      }
    }

    if (event.nextApprover) {

      if (event.nextApprover == userid) {
        this.isApprover = true;
      }
    }
    this.Mode = 'Edit';
    this.VendorID = event.vendorID;
    let index = this.Vendors.findIndex(c => c.id == event.vendorID);
    this.SelectedCurrencyID = this.Vendors[index].currencyID;
    this.SelectedPurchaseOrderID = event.id;
    //TwoDigit Number Binding
    var Duty = event.duty.toFixed(Math.max(((event.duty + '').split(".")).length, 4));
    var Insurance = event.insurance.toFixed(Math.max(((event.insurance + '').split(".")).length, 4));
    var Freight = event.freight.toFixed(Math.max(((event.freight + '').split(".")).length, 4));
    //FourDigtNumber Binding
    var FreightTaxRate = event.freightTaxRate.toFixed(Math.max(((event.freightTaxRate + '').split(".")).length, 4));
    var FreightTaxAmount = event.freightTaxAmount.toFixed(Math.max(((event.freightTaxAmount + '').split(".")).length, 4));
    var DutyTaxRate = event.dutyTaxRate.toFixed(Math.max(((event.dutyTaxRate + '').split(".")).length, 4));
    var DutyTaxAmount = event.dutyTaxAmount.toFixed(Math.max(((event.dutyTaxAmount + '').split(".")).length, 4));
    var InsuranceTaxRate = event.insuranceTaxRate.toFixed(Math.max(((event.insuranceTaxRate + '').split(".")).length, 4));
    var InsuranceTaxAmount = event.insuranceTaxAmount.toFixed(Math.max(((event.insuranceTaxAmount + '').split(".")).length, 4));
    var PoTaxInclusiveTotal = event.poTaxInclusiveTotal.toFixed(Math.max(((event.poTaxInclusiveTotal + '').split(".")).length, 4));
    var PoTaxExclusiveTotal = event.poTaxExclusiveTotal.toFixed(Math.max(((event.poTaxExclusiveTotal + '').split(".")).length, 4));
    var PoTotalTax = event.poTotalTax.toFixed(Math.max(((event.poTotalTax + '').split(".")).length, 4));
    let FreightTaxID, DutyTaxID, InsuranceTaxID, PurchaseOrderWorkFlow;
    if (event.freightTaxID == '-1' || !event.freightTaxID) {
      FreightTaxID = '00000000-0000-0000-0000-000000000000'
    } else {
      FreightTaxID = event.freightTaxID
    }
    if (event.dutyTaxID == '-1' || !event.dutyTaxID) {
      DutyTaxID = '00000000-0000-0000-0000-000000000000'
    } else {
      DutyTaxID = event.dutyTaxID
    }
    if (event.insuranceTaxID == '-1' || !event.insuranceTaxID) {
      InsuranceTaxID = '00000000-0000-0000-0000-000000000000'
    }
    else {
      InsuranceTaxID = event.insuranceTaxID
    }
    if (event.purchaseOrderWorkflow == '-1' || event.purchaseOrderWorkflow == '00000000-0000-0000-0000-000000000000')
      PurchaseOrderWorkFlow = '00000000-0000-0000-0000-000000000000'
    else {
      PurchaseOrderWorkFlow = event.purchaseOrderWorkflow
    }
    this.PurOrderForm.patchValue({
      ID: event.id,
      // CompanyID:event.companyID,
      PurOrderVendorID: event.vendorID,
      VendorWareHouseDD: event.vendorWareHouseID == '00000000-0000-0000-0000-000000000000' ? '-1' : event.vendorWareHouseID,
      ShiptoWarehouseDD: event.shiptoWarehouse,
      PurOrderWorkflowDD: PurchaseOrderWorkFlow,
      Attentionto: event.attentionto,
      AttentionPhone: event.attentionPhone,
      PurOrderNumber: event.purchaseOrderNumber,
      ExpDeliveryDate: this.colId == 'Edit' ? this.sharedFormatterService.dateTimeFormatterToDateTime(event.expectedDeliveryDate) : event.expectedDeliveryDate,
      PurOrderValDays: event.purchaseOrderValidityDays,
      Freight: Freight,
      Duty: Duty,
      OrderedDate: event.orderedDate,
      Status: event.status,
      Insurance: Insurance,
      FreightTaxID: FreightTaxID,
      FreightTaxRate: FreightTaxRate,
      FreightTaxAmount: FreightTaxAmount,
      DutyTaxID: DutyTaxID,
      DutyTaxRate: DutyTaxRate,
      DutyTaxAmount: DutyTaxAmount,
      InsuranceTaxID: InsuranceTaxID,
      InsuranceTaxRate: InsuranceTaxRate,
      InsuranceTaxAmount: InsuranceTaxAmount,
      POTaxInclusiveTotal: PoTaxInclusiveTotal,
      POTaxExclusiveTotal: PoTaxExclusiveTotal,
      POTotalTax: PoTotalTax,
    });

    this.Mode = 'Edit';
    if (event.deleteStatus == 'Active') {
      this.PurOrderForm.enable();
      this.IsActive = true;
      if (event.status == "Approved" || event.status == "Rejected") {
        this.PurOrderForm.disable();
      } else {
        this.PurOrderForm.enable();
      }
    } else {
      this.PurOrderForm.disable();
      this.IsActive = false;
    }

    this.PurOrderForm.get('ShiptoWarehouseDD').disable();
  }

  DeletePurchaseOrder(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_PUR_PurchaseMain', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      //this.toastr.success('Purchase order deleted successfully');
      //   this.BindInventoryProductPriceDetails();
      this.BindPurchaseOrder();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindPurchaseOrderByID(ID) {
    this.purchaseOrderService.getPurchaseOrderByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        let purchaseorder: any = new LbsPurPurchaseOrder();

        purchaseorder = resp.data.purchaseMain[0];
        console.log(purchaseorder);
        this.AgEdit(purchaseorder);

        /* this.PurOrderForm.patchValue({
          ID: purchaseorder.id,
          // CompanyID:purchaseorder.companyID,
          PurOrderVendorID: purchaseorder.vendorID,
          VendorWareHouseDD: purchaseorder.vendorWareHouseID,
          ShiptoWarehouseDD: purchaseorder.shiptoWarehouse,
          PurOrderWorkflowDD: purchaseorder.purchaseOrderWorkflow,
          Attentionto: purchaseorder.attentionto,
          AttentionPhone: purchaseorder.attentionPhone,
          PurOrderNumber: purchaseorder.purchaseOrderNumber,
          ExpDeliveryDate: purchaseorder.expectedDeliveryDate,
          PurOrderValDays: purchaseorder.purchaseOrderValidityDays,
          Freight: purchaseorder.freight,
          Duty: purchaseorder.duty,
          OrderedDate: purchaseorder.orderedDate,
          Status: purchaseorder.status,
          Insurance: purchaseorder.insurance,
          FreightTaxID: purchaseorder.freightTaxID,
          FreightTaxRate: purchaseorder.freightTaxAmount,
          FreightTaxAmount: purchaseorder.freightTaxRate,
          DutyTaxID: purchaseorder.dutyTaxID,
          DutyTaxRate: purchaseorder.dutyTaxRate,
          DutyTaxAmount: purchaseorder.dutyTaxAmount,
          InsuranceTaxID: purchaseorder.insuranceTaxID,
          InsuranceTaxRate: purchaseorder.insuranceTaxRate,
          InsuranceTaxAmount: purchaseorder.insuranceTaxAmount,
          POTaxInclusiveTotal: purchaseorder.poTaxInclusiveTotal,
          POTaxExclusiveTotal: purchaseorder.poTaxExclusiveTotal,
          POTotalTax: purchaseorder.poTotalTax,
        }); */
      }
    });
    (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    }
  }


  //To create the States Form Controls.
  ResetForm() {
    this.PurOrderForm.patchValue({
      ID: '',
      PurOrderVendorID: '-1',
      VendorWareHouseDD: '-1',
      ShiptoWarehouseDD: '-1',
      PurOrderWorkflowDD: '00000000-0000-0000-0000-000000000000',
      Attentionto: '',
      PurOrderNumber: '',
      AttentionPhone: '',
      ExpDeliveryDate: '',
      PurOrderValDays: '',
      Freight: 0,
      Duty: 0,
      Insurance: 0,
      FreightTaxID: '00000000-0000-0000-0000-000000000000',
      FreightTaxRate: 0,
      FreightTaxAmount: 0,
      DutyTaxID: '00000000-0000-0000-0000-000000000000',
      DutyTaxRate: 0,
      DutyTaxAmount: 0,
      InsuranceTaxID: '00000000-0000-0000-0000-000000000000',
      InsuranceTaxRate: 0,
      InsuranceTaxAmount: 0,
      POTaxInclusiveTotal: 0,
      POTaxExclusiveTotal: 0,
      POTotalTax: 0,
    });

    this.PurOrderForm.get('ShiptoWarehouseDD').enable();
  }

  //To save the State details to database table by calling the API service
  //onSave() {
  //  this.confirmation.ConfirmationPopup('Are you sure to save record?');
  //}
  onSave(SaveAction) {

    this.submitted = true;
    if (this.PurOrderForm.invalid) {
      return;
    }
    this.Loading = true;
    let purchaseorder = new LbsPurPurchaseOrder();
    purchaseorder.VendorID = this.PurOrderForm.get('PurOrderVendorID').value;
    purchaseorder.CompanyID = this.CompanyID;
    purchaseorder.CreatedBY = localStorage.getItem('LoginID');
    purchaseorder.VendorWareHouseID = this.PurOrderForm.get('VendorWareHouseDD').value;
    purchaseorder.ShiptoWarehouse = this.PurOrderForm.get('ShiptoWarehouseDD').value;

    purchaseorder.Attentionto = this.PurOrderForm.get('Attentionto').value;
    purchaseorder.AttentionPhone = this.PurOrderForm.get('AttentionPhone').value;

    purchaseorder.PurchaseOrderWorkflow = this.PurOrderForm.get('PurOrderWorkflowDD').value;
    purchaseorder.ExpectedDeliveryDate = this.PurOrderForm.get('ExpDeliveryDate').value;
    purchaseorder.PurchaseOrderValidityDays = this.PurOrderForm.get('PurOrderValDays').value;

    purchaseorder.Freight = this.PurOrderForm.get('Freight').value;
    purchaseorder.Duty = this.PurOrderForm.get('Duty').value;
    purchaseorder.Insurance = this.PurOrderForm.get('Insurance').value;

    purchaseorder.FreightTaxID = this.PurOrderForm.get('FreightTaxID').value;
    purchaseorder.FreightTaxAmount = this.PurOrderForm.get('FreightTaxAmount').value;
    purchaseorder.FreightTaxRate = this.PurOrderForm.get('FreightTaxRate').value;
    purchaseorder.FreightTaxInclusive = this.PurOrderForm.get('FreightTaxInclusive').value;

    purchaseorder.OrderedDate = new Date();
    purchaseorder.Status = "1";
    purchaseorder.DutyTaxID = this.PurOrderForm.get('DutyTaxID').value;
    purchaseorder.DutyTaxAmount = this.PurOrderForm.get('DutyTaxAmount').value;
    purchaseorder.DutyTaxRate = this.PurOrderForm.get('DutyTaxRate').value;
    purchaseorder.DutyTaxInclusive = this.PurOrderForm.get('DutyTaxInclusive').value;

    purchaseorder.InsuranceTaxID = this.PurOrderForm.get('InsuranceTaxID').value;
    purchaseorder.InsuranceTaxAmount = this.PurOrderForm.get('InsuranceTaxAmount').value;
    purchaseorder.InsuranceTaxRate = this.PurOrderForm.get('InsuranceTaxRate').value;
    purchaseorder.InsuranceTaxInclusive = this.PurOrderForm.get('InsuranceTaxInclusive').value;

    purchaseorder.POTaxExclusiveTotal = this.PurOrderForm.get('POTaxExclusiveTotal').value;
    purchaseorder.POTotalTax = this.PurOrderForm.get('POTotalTax').value;
    purchaseorder.POTaxInclusiveTotal = this.PurOrderForm.get('POTaxInclusiveTotal').value;
    purchaseorder.CreatedBY = localStorage.getItem('LoginID');
    purchaseorder.DateCreated = new Date();

    console.log(purchaseorder);
    if (this.Mode == 'Add') {
      this.purchaseOrderService.addPurchaseOrder(purchaseorder).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Purchase Order added successfully');

          this.submitted = false;
          if (SaveAction == 'Close') {
            this.Cancel();
            this.ResetForm();
            this.BindPurchaseOrder();
            this.Mode = 'List';
          }
          else {
            // this.ResetForm();
            this.SelectedPurchaseOrderID = resp.data.id;
            this.BindPurchaseOrderByID(this.SelectedPurchaseOrderID);

            //  this.getRequisitionByID();
            // this.BindRequisitions();
            //this.Mode = 'List';
          }
          // this.Loading = false;
        }
        this.Loading = false;
      },
        (error) => {
          this.Loading = false;
          console.error('Problem with the sevice. Please try later : ' + error.message);
        });
    }
    else if (this.Mode == 'Edit') {
      purchaseorder.ID = this.PurOrderForm.get('ID').value;
      this.purchaseOrderService.updatePurchaseOrder(purchaseorder).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.colId = null;
          this.toastr.success('Purchase Order updated successfully');
          /* this.ResetForm();
          this.BindPurchaseOrder();
       
          this.Mode = 'List'; */
          this.submitted = false;
          if (SaveAction == 'Close') {
            this.Cancel();
            this.ResetForm();
            this.BindPurchaseOrder();
            this.Mode = 'List';
          }
          else {
            this.ResetForm();
            this.SelectedPurchaseOrderID = resp.data.id;
            this.BindPurchaseOrderByID(this.SelectedPurchaseOrderID);
            //  this.getRequisitionByID();
            // this.BindRequisitions();
            //this.Mode = 'List';
          }
        }
        // else {
        //   alert(resp.message);
        // }
        this.Loading = false;

      }, (error) => {
        this.Loading = false;
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }

  }
  //When User Clicks on Purchase Order
  PurchaseOrder() {
    let purchaseorder = new LbsPurPurchaseOrder();
    purchaseorder.Status = "ApprovalInProgress";

    this.purchaseOrderService.updatePurchaseOrder(purchaseorder).subscribe((resp: any) => {
      let purchaseorder = new LbsPurPurchaseOrder();
      purchaseorder.Status = "ApprovalInProgress";
      purchaseorder.CreatedBY = localStorage.getItem('LoginID');
      this.purchaseOrderService.approvePurchaseOrder(purchaseorder).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Purchase Order Approved successfully');
          this.ResetForm();
          this.BindPurchaseOrder();
          this.submitted = false;
          this.Mode = 'List';
        }

      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    })
  }
  UpdatePurchaseStatus(status) {

    let purchaseorder = new LbsPurPurchaseOrder();
    purchaseorder.VendorID = this.PurOrderForm.get('PurOrderVendorID').value;
    purchaseorder.CompanyID = this.CompanyID;
    purchaseorder.VendorWareHouseID = this.PurOrderForm.get('VendorWareHouseDD').value;
    purchaseorder.ShiptoWarehouse = this.PurOrderForm.get('ShiptoWarehouseDD').value;
    purchaseorder.CreatedBY = localStorage.getItem('LoginID');
    purchaseorder.Attentionto = this.PurOrderForm.get('Attentionto').value;
    purchaseorder.AttentionPhone = this.PurOrderForm.get('AttentionPhone').value;

    purchaseorder.PurchaseOrderWorkflow = this.PurOrderForm.get('PurOrderWorkflowDD').value;
    purchaseorder.ExpectedDeliveryDate = this.PurOrderForm.get('ExpDeliveryDate').value;
    purchaseorder.PurchaseOrderValidityDays = this.PurOrderForm.get('PurOrderValDays').value;

    purchaseorder.Freight = this.PurOrderForm.get('Freight').value;
    purchaseorder.Duty = this.PurOrderForm.get('Duty').value;
    purchaseorder.Insurance = this.PurOrderForm.get('Insurance').value;
    purchaseorder.FreightTaxID = this.PurOrderForm.get('FreightTaxID').value;
    purchaseorder.FreightTaxAmount = this.PurOrderForm.get('FreightTaxAmount').value;
    purchaseorder.FreightTaxRate = this.PurOrderForm.get('FreightTaxRate').value;
    purchaseorder.OrderedDate = new Date();
    purchaseorder.Status = status;
    purchaseorder.DutyTaxID = this.PurOrderForm.get('DutyTaxID').value;
    purchaseorder.DutyTaxAmount = this.PurOrderForm.get('DutyTaxAmount').value;
    purchaseorder.DutyTaxRate = this.PurOrderForm.get('DutyTaxRate').value;

    purchaseorder.InsuranceTaxID = this.PurOrderForm.get('InsuranceTaxID').value;
    purchaseorder.InsuranceTaxAmount = this.PurOrderForm.get('InsuranceTaxAmount').value;
    purchaseorder.InsuranceTaxRate = this.PurOrderForm.get('InsuranceTaxRate').value;

    purchaseorder.POTaxExclusiveTotal = this.PurOrderForm.get('POTaxExclusiveTotal').value;
    purchaseorder.POTotalTax = this.PurOrderForm.get('POTotalTax').value;
    purchaseorder.POTaxInclusiveTotal = this.PurOrderForm.get('POTaxInclusiveTotal').value;
    purchaseorder.CreatedBY = localStorage.getItem('LoginID');
    purchaseorder.ID = this.PurOrderForm.get('ID').value;
    this.purchaseOrderService.updatePurchaseStatus(purchaseorder).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.toastr.success('Purchase Order updated successfully');
        this.ResetForm();
        this.BindPurchaseOrder();
        this.submitted = false;
        this.Mode = 'List';
      }
      // else {
      //   alert(resp.message);
      // }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    });

  }
  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  AddPOFromTemplete() {
    this.Mode = 'Templete';
  }
  OnBackClick(event) {
    this.AccessTab = "PurchaseOrder";
    this.Mode = "List";
    this.AccessTab = "PurchaseOrder";
    this.BindPurchaseOrder();
  }

  BindGetTaxCode() {
    this.priceservice.getalltaxcode().subscribe((resp: any) => {
      console.log(resp);

      this.TaxcodeList = resp.data.taxcode;
    }, (error) => {

      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindGetTaxCodenew() {
    this.purchaseOrderService.GetAllTaxCodesForPO().subscribe((resp: any) => {
      console.log(resp);

      this.TaxcodeList = resp.data.taxcode;
    }, (error) => {

      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  RefreshMaingrid(event) {
    this.BindPurchaseOrderByID(this.SelectedPurchaseOrderID);
  }
  onlyNumberKey(event) {

    let checkNumberOnly = event.target.value;
    console.log(checkNumberOnly)
    return (event.charCode === 8 || event.charCode == 0) ? null : event.charCode >= 46 && event.charCode <= 57;
  }
  OnTaxChange(value, Controlname) {
    this.purchaseOrderService.GetTaxTotalRateByTaxid(value).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        let taxtotal = 0;
        if (resp.data.taxtotal) {
          taxtotal = resp.data.taxtotal;
        }
        console.log(resp.data.taxtotal);
        if (Controlname == 'FreightTaxID') {
          this.PurOrderForm.patchValue({
            FreightTaxRate: taxtotal
          });
        } else if (Controlname == 'DutyTaxID') {
          this.PurOrderForm.patchValue({
            DutyTaxRate: taxtotal
          });
        } else if (Controlname == 'InsuranceTaxID') {
          this.PurOrderForm.patchValue({
            InsuranceTaxRate: taxtotal
          });
          this.POInsuranceTaxAmount();
        }

      }
      // else {
      //   alert(resp.message);
      // }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  CreateGRN() {
    debugger;
    this.router.navigate(['/pur/goods-received-note/' + this.SelectedPurchaseOrderID + ``]);
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
