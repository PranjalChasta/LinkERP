import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CustomValidators } from 'ngx-custom-validators';
import { SopOrderService } from '../../services/sop-order.service';
import { LbsSopOrderDetailTaxLabel } from 'src/app/models/pos/lbs_pos_orderDetailTaxLabel';

@Component({
  selector: 'app-sop-order-detail-tax-label',
  templateUrl: './sop-order-detail-tax-label.component.html',
  styleUrls: ['./sop-order-detail-tax-label.component.css']
})
export class SopOrderDetailTaxLabelComponent implements OnInit {
  @Input() TaxId;
  @Input() SalesOrderDetailID;
  @Output() OnCancel = new EventEmitter;
  OrderDetailTaxlabelForm: FormGroup;
  TaxLabel: any;
  Loading: boolean;
  AgLoad: boolean;
  RowData: any;
  ColumnDefs;
  PageSize: any;
  Currentpage: any;
  LoginId: any = localStorage.getItem('LoginID');

  constructor(
    private soporderService: SopOrderService,
    private toastr: ToastrService,
    private FB: FormBuilder,
    private deleteRecordsService: DeleteRecordsService
  ) { }

  ngOnInit() {
    this.CreateForm();
    this.GetAgColumns();
    this.GetTaxLabelList();
    setTimeout(() => {
      this.BindTaxLabel();
    }, 1000);
    this.Currentpage = "0";
    this.PageSize = "50";
  }
  get f() { return this.OrderDetailTaxlabelForm.controls; }

  BindTaxLabel() {
    this.soporderService.gettaxLabelByTaxId(this.TaxId, this.LoginId).subscribe((res: any) => {
      console.log(res);
      this.TaxLabel = res.data.taxLabel;
    })
  }

  GetAgColumns() {
    this.ColumnDefs = [
      { headerName: 'Tax Amount', field: 'taxAmount', sortable: true, filter: true },
      { headerName: 'Tax Label', field: 'taxLabel', sortable: true, filter: true },
      // { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 80, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    ];
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  CreateForm() {
    this.OrderDetailTaxlabelForm = this.FB.group({
      TaxID: [''],
      TaxAmount: ['-1'],
      TaxLabel: [''],
      TaxLabelDropDown: ['-1', CustomValidators.notEqual('-1')],
    });
  }
  Cancel() {
    this.OnCancel.emit();
  }
  OnActionClick(event: any) {
    console.log(event);
    var colId = event.column.getId();
    if (colId == 'Delete') {
      this.onDelete(event.data.id)
    }
  }
  onDelete(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SOP_OrderDetailTaxLabel', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindTaxLabel();
      this.GetTaxLabelList();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  GetTaxLabelList() {
    this.Loading = true;
    this.AgLoad = false;
    this.soporderService.getOrderDetailTaxLabel().subscribe((res: any) => {
      this.RowData = res.data.order;
      console.log(this.RowData)
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    })
  }

  taxLabelChange(e) {
    let taxlabelDetails = this.TaxLabel.filter(x => x.id == e);
    this.OrderDetailTaxlabelForm.patchValue({
      TaxLabel: taxlabelDetails[0].taxLabel,
      TaxID: taxlabelDetails[0].taxID,
      TaxAmount: taxlabelDetails[0].taxAmount
    });
  }

  onSave() {
    if (this.OrderDetailTaxlabelForm.invalid) {
      return;
    }
    let submitOrderDetailTaxLabel: any = new LbsSopOrderDetailTaxLabel();
    submitOrderDetailTaxLabel.SalesOrderDetailID = this.SalesOrderDetailID;
    submitOrderDetailTaxLabel.CompanyID = localStorage.getItem('CompanyID');
    submitOrderDetailTaxLabel.TaxId = this.OrderDetailTaxlabelForm.get('TaxID').value;
    submitOrderDetailTaxLabel.TaxAmount = this.OrderDetailTaxlabelForm.get('TaxAmount').value;
    submitOrderDetailTaxLabel.TaxLabel = this.OrderDetailTaxlabelForm.get('TaxLabel').value;
    submitOrderDetailTaxLabel.CreatedBy = localStorage.getItem('LoginID');

    this.soporderService.AddOrderDetailTaxLabel(submitOrderDetailTaxLabel).subscribe((res: any) => {
      if (res) {
        this.toastr.success("Tax Label has been added successfully");
        this.BindTaxLabel();
        this.GetTaxLabelList();
      }
    }, (error) => {
      this.Loading = false;
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    })
  }

}
