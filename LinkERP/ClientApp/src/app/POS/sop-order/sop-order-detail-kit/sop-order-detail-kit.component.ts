import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { ToastrService } from 'ngx-toastr';
import { SopOrderService } from '../../services/sop-order.service';
import { LbsSopOrderDetailKit } from 'src/app/models/pos/lbs_pos_orderDetailKit';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';

@Component({
  selector: 'app-sop-order-detail-kit',
  templateUrl: './sop-order-detail-kit.component.html',
  styleUrls: ['./sop-order-detail-kit.component.css']
})
export class SopOrderDetailKitComponent implements OnInit {
  @Input() LineNum: any;
  @Input() SalesOrderDetailID: any;
  @Input() InventoryId: any;
  @Input() WarehouseID:any;

  @Output() Cancel = new EventEmitter();

  AgLoad: boolean;
  ColumnDefs;
  Currentpage: string;
  PageSize: string;
  OrderDetailKitForm: FormGroup;
  Mode = 'List';
  OrderDetailKit: any;
  submitted: boolean;
  submitName: string;
  IsActive:boolean;
  KitItem:any[]=[];
  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private sopOrderService: SopOrderService,
    private deleteRecordsService: DeleteRecordsService
  ) { }

  ngOnInit() {
this.BindOrderDetailKitData();
    // this.AgLoad = false;
    // this.ColumnDefs = [
    //   { headerName: 'UnitPrice', field: 'unitPrice', sortable: true, filter: true, checkboxSelection: false },
    //   { headerName: 'Sales Quantity', field: 'salesQuantity', sortable: true, filter: true, type: 'numericColumn' },
    //   { headerName: 'Return Quantity', field: 'returnQuantity', sortable: true, filter: true, type: 'numericColumn' },
    //   { headerName: 'Conversion Ratio', field: 'conversionRatio', sortable: true, filter: true, type: 'numericColumn' },
    //   { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
    //   { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
    //   { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    // ];
    // this.BindOrderDetailKitData();
    // this.Currentpage = "0";
    // this.PageSize = "50";
    // this.CreateForm();

  }
  BindOrderDetailKitData() {
    debugger;
   
    this.sopOrderService.getKitItemByID(this.InventoryId).subscribe((res: any) => {
      this.KitItem = res.data.kit;
console.log(res);
    })
  }
  // AddOrderDetailKit() {
  //   this.Mode = 'Add';
  // }
  // Close() {
  //   this.OrderDetailKitForm.reset();
  //   this.ResetForm();
  //   this.submitted=false;
  //   this.BindOrderDetailKitData();
  //   this.Mode = 'List';
  // }

  // BackToDetails() {
  //   this.Cancel.emit();
  // }

  // get f() { return this.OrderDetailKitForm.controls; }

  // CreateForm() {
  //   this.OrderDetailKitForm = this.FB.group({
  //     ID: [''],
  //     UnitPrice: ['0.0000', Validators.required],
  //     UnitCost:['0.0000', Validators.required],
  //     SalesQuantity: ['0.00', Validators.required],
  //     ReturnQuantity: ['0.00', Validators.required],
  //     ConversionRatio: ['0.00', Validators.required]
  //   })
  // }

  // ResetForm() {
  //   this.OrderDetailKitForm.patchValue({
  //     ID: '',
  //     UnitPrice: '0.0000',
  //     UnitCost:'0.0000',
  //     SalesQuantity: '0.00',
  //     ReturnQuantity: '0.00',
  //     ConversionRatio: '0.00'
  //   })
  // }

  // onSave(SaveAction) {
  //   debugger;
  //   this.submitted = true;
  //   if (this.OrderDetailKitForm.invalid) {
  //     return;
  //   }

  //   let submitOrderDetailKit: any = new LbsSopOrderDetailKit();

  //   submitOrderDetailKit.SalesOrderDetailID = this.SalesOrderDetailID;
  //   submitOrderDetailKit.CompanyID = localStorage.getItem('CompanyID');
  //  // submitOrderDetailKit.OrderDetailLineNum = +this.OrderDetailKitForm.get('OrderDetailLineNum').value;

  //   submitOrderDetailKit.UnitPrice = +this.OrderDetailKitForm.get('UnitPrice').value;
  //   submitOrderDetailKit.UnitCost = +this.OrderDetailKitForm.get('UnitCost').value;
  //   submitOrderDetailKit.SalesQuantity = +this.OrderDetailKitForm.get('SalesQuantity').value;
  //   submitOrderDetailKit.ReturnsQuantity = +this.OrderDetailKitForm.get('ReturnQuantity').value;
  //   submitOrderDetailKit.ConversionRatio = +this.OrderDetailKitForm.get('ConversionRatio').value;
  //   submitOrderDetailKit.KITID = this.InventoryId;
  //   submitOrderDetailKit.ParentID = this.InventoryId;

  //   submitOrderDetailKit.CreatedBy = localStorage.getItem('LoginID');

  //   if (this.Mode == 'Add') {
  //     this.sopOrderService.AddOrderDetailKit(submitOrderDetailKit).subscribe((response) => {
  //       if (response) {
  //         this.toastr.success("Order detail Kit has been submitted successfully");
  //         this.ResetForm();
  //         this.BindOrderDetailKitData();
  //         this.submitted = false;
  //         if (SaveAction == 'Close') {
  //           this.Mode = 'List';
  //         }

  //       }
  //     })
  //   }
  //   else if (this.Mode == 'Edit') {
  //     submitOrderDetailKit.ID = this.OrderDetailKitForm.get('ID').value;
  //     this.sopOrderService.UpdateOrderDetailKit(submitOrderDetailKit).subscribe((response) => {
  //       if (response) {
  //         this.toastr.success("Order detail Kit has been updated successfully");
  //         this.BindOrderDetailKitData();
  //         this.Mode = 'Add';
  //         this.submitName = "Add Order Detail Kit";
  //         if (SaveAction == 'Close') {
  //           this.Mode = 'List';
  //         }
  //       }
  //     })
  //   }
  // }


  // OnActionClick(event: any) {
  //   var colId = event.column.getId();
  //   if (colId == 'Edit') {
  //     this.AgEdit(event.data)
  //   } else if (colId == 'Delete') {
  //     this.OndeleteSOPdetailKit(event.data.id)
  //   }
  // }
  // OnPageSizeChange($event: any) {
  //   this.PageSize = $event.target.value;
  // }
  // OnchangeCurrentpage(page) {
  //   this.Currentpage = page;
  // }

  // AgEdit(event) {
  //   console.log(event);
  //   this.OrderDetailKitForm.patchValue({
  //     ID: event.id,
  //     UnitPrice: event.unitPrice.toString().indexOf(".") !== -1 ? event.unitPrice:event.unitPrice +".0000",
  //     SalesQuantity: event.salesQuantity.toString().indexOf(".") !== -1 ? event.salesQuantity:event.salesQuantity +".00",
  //     ReturnQuantity: event.returnsQuantity.toString().indexOf(".") !== -1 ? event.returnsQuantity:event.returnsQuantity +".00",
  //     UnitCost: event.unitCost.toString().indexOf(".") !== -1 ? event.unitCost:event.unitCost +".0000",
  //     ConversionRatio:event.conversionRatio.toString().indexOf(".") !== -1 ? event.conversionRatio:event.conversionRatio +".00",

  //   });
  //   this.Mode = 'Edit';
  //   if (event.deleteStatus == 'Active') {
  //     this.OrderDetailKitForm.enable();
  //     this.IsActive = true;
  //   } else {
  //     this.OrderDetailKitForm.disable();
  //     this.IsActive = false;
  //   }
  // }

  // OndeleteSOPdetailKit(ID) {
  //   debugger;
  //   this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SOP_OrderDetailKIT', localStorage.getItem('LoginID')).subscribe((resp: any) => {
  //     if (resp.isSuccess == true) {
  //       this.BindOrderDetailKitData();
  //     }
  //   }, (error) => {
  //   });
  // }

}
