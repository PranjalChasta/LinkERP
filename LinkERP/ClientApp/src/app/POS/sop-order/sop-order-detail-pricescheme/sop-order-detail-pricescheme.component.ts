import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SopOrderService } from '../../services/sop-order.service';
import { LbsSopOrderDetailPriceScheme } from 'src/app/models/pos/lbs_pos_OrderDetailPriceScheme';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';

@Component({
  selector: 'app-sop-order-detail-pricescheme',
  templateUrl: './sop-order-detail-pricescheme.component.html',
  styleUrls: ['./sop-order-detail-pricescheme.component.css']
})
export class SopOrderDetailPriceschemeComponent implements OnInit {
  @Input() LineNum: any;
  @Input() SalesOrderDetailID: any;
  @Input() InventoryId: any;
  @Input() PriceGroupID: any;

  @Output() Cancel = new EventEmitter();

  AgLoad: boolean;
  ColumnDefs;
  Currentpage: string;
  PageSize: string;
  OrderDetailPriceGroupForm: FormGroup;
  Mode = 'List';
  OrderDetailKit: any;
  submitted: boolean;
  SopOrderPriceGroupID: any;
  IsActive: boolean;
  RowData: any;

  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private sopOrderService: SopOrderService,
    private deleteRecordsService: DeleteRecordsService
  ) { }

  ngOnInit() {

    this.AgLoad = false;
    this.ColumnDefs = [
      { headerName: 'UnitPrice', field: 'unitPrice', sortable: true, filter: true, type: 'numericColumn' },
      { headerName: 'Sales Quantity', field: 'salesQuantity', sortable: true, filter: true, type: 'numericColumn' },
      { headerName: 'Return Quantity', field: 'returnsQuantity', sortable: true, filter: true, type: 'numericColumn' },
      { headerName: 'Unit Cost', field: 'unitCost', sortable: true, filter: true, type: 'numericColumn' },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    ];
    this.BindOrderDetailPriceGroupData();
    this.Currentpage = "0";
    this.PageSize = "50";
    this.CreateForm();

  }
  BindOrderDetailPriceGroupData() {
    this.AgLoad = false;
    this.sopOrderService.GetAllOrderDetailPriceGroup(this.SalesOrderDetailID).subscribe((res: any) => {
      this.OrderDetailKit = res.data.pricegroup;
      console.log(res.data.pricegroup);

      this.RowData = res.data.pricegroup;
      this.AgLoad = true;
    })
  }
  AddOrderDetailPriceGroup() {
    this.Mode = 'Add';
  }
  Close() {
    this.OrderDetailPriceGroupForm.reset();
    this.ResetForm();
    this.BindOrderDetailPriceGroupData();
    this.Mode = "List";
  }

  BackToDetails() {
    this.Cancel.emit();
  }

  get f() { return this.OrderDetailPriceGroupForm.controls; }

  CreateForm() {
    this.OrderDetailPriceGroupForm = this.FB.group({
      ID: [''],
      UnitPrice: ['0.0000', Validators.required],
      SalesQuantity: ['0.00', Validators.required],
      ReturnQuantity: ['0.00', Validators.required],
      UnitCost: ['0.0000', Validators.required]
    })
  }

  ResetForm() {
    this.OrderDetailPriceGroupForm.patchValue({
      ID: '',
      UnitPrice: '0.0000',
      SalesQuantity: '0.00',
      ReturnQuantity: '0.00',
      UnitCost: '0.0000'
    })
  }

  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.AgEdit(event.data)
    } else if (colId == 'Delete') {
      this.onDeletePriceGroup(event.data.id)
    }
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }

  AgEdit(event) {
    console.log(event);
    this.OrderDetailPriceGroupForm.patchValue({
      ID: event.id,
      UnitPrice: event.unitPrice.toString().indexOf(".") !== -1 ? event.unitPrice:event.unitPrice +".0000",
      SalesQuantity: event.salesQuantity.toString().indexOf(".") !== -1 ? event.salesQuantity:event.salesQuantity +".00",
      ReturnQuantity: event.returnsQuantity.toString().indexOf(".") !== -1 ? event.returnsQuantity:event.returnsQuantity +".00",
      UnitCost: event.unitCost.toString().indexOf(".") !== -1 ? event.unitCost:event.unitCost +".0000",
    });
    this.Mode = 'Edit';
    if (event.deleteStatus == 'Active') {
      this.OrderDetailPriceGroupForm.enable();
      this.IsActive = true;
    } else {
      this.OrderDetailPriceGroupForm.disable();
      this.IsActive = false;
    }
  }

  onDeletePriceGroup(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SOP_OrderDetailPriceGroup', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.BindOrderDetailPriceGroupData();
      }
    }, (error) => {
    });
  }

  onSave(SaveAction) {
    this.submitted = true;
    if (this.OrderDetailPriceGroupForm.invalid) {
      return;
    }

    let submitOrderDetailPriceGroup: any = new LbsSopOrderDetailPriceScheme();

    submitOrderDetailPriceGroup.SalesOrderDetailID = this.SalesOrderDetailID;
    submitOrderDetailPriceGroup.CompanyID = localStorage.getItem('CompanyID');
    // submitOrderDetailPriceGroup.OrderDetailLineNum = +this.LineNum;

    submitOrderDetailPriceGroup.UnitPrice = +this.OrderDetailPriceGroupForm.get('UnitPrice').value;
    submitOrderDetailPriceGroup.SalesQuantity = +this.OrderDetailPriceGroupForm.get('SalesQuantity').value;
    submitOrderDetailPriceGroup.ReturnsQuantity = +this.OrderDetailPriceGroupForm.get('ReturnQuantity').value;
    submitOrderDetailPriceGroup.UnitCost = +this.OrderDetailPriceGroupForm.get('UnitCost').value;
    submitOrderDetailPriceGroup.ProductID = this.InventoryId;
    submitOrderDetailPriceGroup.PriceGroupID = this.PriceGroupID;

    submitOrderDetailPriceGroup.CreatedBy = localStorage.getItem('LoginID');
    console.log(submitOrderDetailPriceGroup);

    if (this.Mode == 'Add') {
      this.sopOrderService.AddOrderDetailPriceGroup(submitOrderDetailPriceGroup).subscribe((response) => {
        if (response) {
          this.toastr.success("Order detail Price Group has been added successfully");
          this.ResetForm();
          this.BindOrderDetailPriceGroupData();
          this.submitted = false;
          if (SaveAction == 'Close') {
            this.Mode = 'List';
          }
        }
      })
    }
    else if (this.Mode == 'Edit') {
      submitOrderDetailPriceGroup.ID = this.OrderDetailPriceGroupForm.get('ID').value;
      this.sopOrderService.UpdateOrderDetailPriceGroup(submitOrderDetailPriceGroup).subscribe((response) => {
        if (response) {
          this.toastr.success("Order detail Price Group has been updated successfully");
          this.submitted = false;
          this.ResetForm();
          this.BindOrderDetailPriceGroupData();
          this.Mode = 'Add';
         // this.submitName = "Add Order Detail Kit";
          if (SaveAction == 'Close') {
            this.Mode = 'List';
          }

        }
      })
    }
  }
}
