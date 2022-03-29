import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReportControlBase } from '../report-control-base';
import { ReportControlService } from '../report-control.service';
import { ReportService } from '../report.service';
import { delay } from 'rxjs/operators';
@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.css']
})
export class ViewReportComponent implements OnInit {
  @Input() ModuleID;

  HeaderName: any = '';
  ReportControls: ReportControlBase<any>[] = [];
  form: FormGroup;
  reportParameters: any = null;

  selectedReportID: any;
  selectedReportName: any;

  constructor(private rcs: ReportControlService,
    private reportService: ReportService) { }

  testForm: FormGroup;
  ngOnInit() {
    this.BindReportNames();
    this.form = this.rcs.toFormGroup(this.ReportControls);
    if (this.ModuleID == 'INV') {
      this.HeaderName = 'Inventory';
    } else if (this.ModuleID == 'PUR') {
      this.HeaderName = 'Purchase';
    }
  }

  ReportName: any = '-1';
  ReportID: any;
  onReportNameSelected(reportId: any) {
    this.ReportControls = [];
    if (reportId != '-1') {
      this.ReportName = reportId;
      this.ReportPath = (this.ReportNames.find(r => r.id == reportId)).reportPath;
      this.ReportID = reportId;
      this.BindReportParameters(reportId);
    }
    else {
      this.ReportID = null;
      this.form = this.rcs.toFormGroup(this.ReportControls);
    }
  }
  cancel() {
    this.displayReport = false;
  }
  strReportParameters: any;
  Product: any;

  async onSubmit() {
    debugger;
    this.reportParameters = this.form.value;
    this.reportParameters.CompanyID = localStorage.getItem('CompanyID');
    this.reportParameters.LoginID = localStorage.getItem('LoginID');
    this.strReportParameters = JSON.stringify(this.reportParameters);
    this.reportUrl = this.ReportPath;
    //reportUrl: string = 'ReportLinkERP/InvMasterListing';
    this.showParameters = "false"; //true, false, collapsed
    // this.parameters = {
    //   'CID': 'f1164f06-2deb-49b8-b249-6b239b2cbf5f',
    //   'ItemFrom': 'S',
    //   'ItemTo': 'D'
    // };
    this.parameters = this.reportParameters;
    // alert(this.parameters + '' + this.payLoad)
    this.language = "en-us";
    this.width = 50;
    this.height = 50;
    this.toolbar = "true";
    await delay(0);
    this.displayReport = true;
  }
  // reportServer: string = 'http://122.166.215.8:8001/reportserver';
  // reportUrl: string = 'LinkERP/INV/InvMasterListing';
  // //reportUrl: string = 'ReportLinkERP/InvMasterListing';
  // showParameters: string = "false"; //true, false, collapsed
  // parameters: any = {
  //   'CID': 'f1164f06-2deb-49b8-b249-6b239b2cbf5f',
  //   'ItemFrom': 'S',
  //   'ItemTo': 'D'
  // };
  // language: string = "en-us";
  // width: number = 50;
  // height: number = 50;
  // toolbar: string = "true";
  displayReport: boolean = false;
  reportServer: string = '';
  reportUrl: string = '';
  showParameters: string = "false"; //true, false, collapsed
  parameters: any = {};
  language: string = "en-us";
  width: number = 50;
  height: number = 50;
  toolbar: string = "true";

  ReportNames: any[] = [];
  ReportPath: any = '';
  BindReportNames() {
    this.reportService.getReports(this.ModuleID).subscribe((resp: any) => {
      this.ReportNames = resp.data.reportsMetadata;
    });
  }

  ReportParameters: any[] = [];
  BindReportParameters(reportId) {
    this.reportService.getReportParameters(reportId).subscribe((resp: any) => {
      this.ReportParameters = resp.data.reportParameters;
      this.ReportControls = this.reportService.getReportControls(this.ReportParameters);
      this.form = this.rcs.toFormGroup(this.ReportControls);
    });
  }

}
