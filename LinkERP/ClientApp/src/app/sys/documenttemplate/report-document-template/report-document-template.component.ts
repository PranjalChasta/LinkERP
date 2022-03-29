import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ReportService } from '../../../reports-base/report.service';
import { ReportDocumentTemplateService } from '../../services/report-document-template.service';
import { CustomValidators } from 'ngx-custom-validators';
import { LBSSYSReportDocumentTemplate } from '../../../models/sys/lbs-sys-report-document-template';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-report-document-template',
  templateUrl: './report-document-template.component.html',
  styleUrls: ['./report-document-template.component.css']
})
export class ReportDocumentTemplateComponent implements OnInit {

  @Input()
  DocumentTemplateID: any;

  // BindReportNames() {
  //   this.reportService.getReports(this.ModuleID).subscribe((resp: any) => {
  //     this.ReportNames = resp.data.reportsMetadata;
  //   });
  // }
  ReportNames: any[] = [];
  ReportDocumentTemplates: any;

  ReportDocumentTemplateForm: FormGroup;
  ReportDocumentTemplateColumns: any;
  Submitted = false;
  Currentpage: string;
  AgLoad: boolean;

  constructor(private FB: FormBuilder,
    private reportService: ReportService,
    private reportDocumentTemplateService: ReportDocumentTemplateService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.ReportDocumentTemplateForm = this.FB.group({
      Report: ['-1', CustomValidators.notEqual('-1')]
    });
    this.Currentpage = "0";

    this.ReportDocumentTemplateColumns = [
      { headerName: 'Report Name', field: 'reportName', sortable: true, filter: true, checkboxSelection: false },
      { headerName: '', field: 'Delete', cellRenderer: this.CustomDeleteIconFunc, type: 'DeleteAction', width: 50 }
    ];
    this.BindReportName();
    this.BindReportDocumentTemplate();
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }


  BindReportName() {
    this.reportDocumentTemplateService.getReportNames(this.DocumentTemplateID).subscribe((resp: any) => {
      this.ReportNames = resp.data.reportNames;
    }, (error: any) => {

    });
  }
  BindReportDocumentTemplate() {
    this.AgLoad = false;
    this.reportDocumentTemplateService.getReportDocumentTemplate(this.DocumentTemplateID).subscribe((resp: any) => {
      this.ReportDocumentTemplates = resp.data.reportDocumentTemplate;
      this.AgLoad = true;
    }, (error: any) => {

    });
  }
  get f() { return this.ReportDocumentTemplateForm.controls; }
  OnAddReportName() {
    debugger;
    this.Submitted = true;

    if (this.ReportDocumentTemplateForm.invalid) {
      return;
    }
    let lBSSYSReportDocumentTemplate: any = new LBSSYSReportDocumentTemplate()
    lBSSYSReportDocumentTemplate.CompanyID = localStorage.getItem('CompanyID');
    lBSSYSReportDocumentTemplate.DocumentTemplateID = this.DocumentTemplateID;
    lBSSYSReportDocumentTemplate.ReportID = this.ReportDocumentTemplateForm.get('Report').value;
    lBSSYSReportDocumentTemplate.CreatedBY = localStorage.getItem('LoginID');
    this.reportDocumentTemplateService.addReportDocumentTemplate(lBSSYSReportDocumentTemplate).subscribe((resp: any) => {
      if (resp.isSuccess) {
        debugger;
        this.toastr.success('Report Name added successfully');
        this.BindReportName();
        this.BindReportDocumentTemplate();
      }
    }, (error: any) => {

    });

  }

  ResetForm() {
    this.ReportDocumentTemplateForm.patchValue({
      Report: '-1'
    });
  }

}
