import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuotationService } from '../../services/quotation.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ngx-custom-validators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LbsPosQuotationDetailTaxlabel } from 'src/app/models/pos/lbs_pos_quotationDetailTaxLabel';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';

@Component({
  selector: 'app-quotation-detail-tax-labels',
  templateUrl: './quotation-detail-tax-labels.component.html',
  styleUrls: ['./quotation-detail-tax-labels.component.css']
})
export class QuotationDetailTaxLabelsComponent implements OnInit {
  @Input() TaxId;
  @Input() QuotationLineId;
  @Output() OnCancel = new EventEmitter;
  QuotationDetailsTaxlabelForm: FormGroup;
  TaxLabel: any;
  Loading: boolean;
  AgLoad: boolean;
  RowData: any;
  ColumnDefs;
  PageSize: any;
  Currentpage: any;
  LoginId: any = localStorage.getItem('LoginID');

  constructor(
    private quotationServcie: QuotationService,
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
  get f() { return this.QuotationDetailsTaxlabelForm.controls; }
  BindTaxLabel() {
    this.quotationServcie.gettaxLabelBytaxId(this.TaxId, this.LoginId).subscribe((res: any) => {
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
    this.QuotationDetailsTaxlabelForm = this.FB.group({
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
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SOP_QuotationDetailTaxLabels', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindTaxLabel();
      this.GetTaxLabelList();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  GetTaxLabelList() {
    this.Loading = true;
    this.AgLoad = false;
    this.quotationServcie.getQuotationDetailsTaxLabel().subscribe((res: any) => {
      this.RowData = res.data.quotationDetailsTaxLabel;
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
    this.QuotationDetailsTaxlabelForm.patchValue({
      TaxLabel: taxlabelDetails[0].taxLabel,
      TaxID: taxlabelDetails[0].taxID,
      TaxAmount: taxlabelDetails[0].taxAmount
    });
  }

  onSave() {
    if (this.QuotationDetailsTaxlabelForm.invalid) {
      return;
    }

    let submitQuotationDetailTaxLabel: any = new LbsPosQuotationDetailTaxlabel();
    submitQuotationDetailTaxLabel.QuotationLineID = this.QuotationLineId;
    submitQuotationDetailTaxLabel.CompanyID = localStorage.getItem('CompanyID');
    submitQuotationDetailTaxLabel.TaxId = this.QuotationDetailsTaxlabelForm.get('TaxID').value;
    submitQuotationDetailTaxLabel.TaxAmount = this.QuotationDetailsTaxlabelForm.get('TaxAmount').value;
    submitQuotationDetailTaxLabel.TaxLabel = this.QuotationDetailsTaxlabelForm.get('TaxLabel').value;
    submitQuotationDetailTaxLabel.CreatedBy = localStorage.getItem('LoginID');

    this.quotationServcie.addQuotationDetailTaxLabel(submitQuotationDetailTaxLabel).subscribe((res: any) => {
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
