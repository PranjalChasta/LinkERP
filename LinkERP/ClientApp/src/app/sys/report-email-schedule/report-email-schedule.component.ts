import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SysCommonService } from '../services/sys-common.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { LBSSYSReportSchedule } from '../../models/sys/lbs-sys-report-schedule';
import { ReportScheduleService } from '../services/report-schedule.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ngx-custom-validators';
import { DocumenttemplateService } from '../services/documenttemplate.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';

@Component({
  selector: 'app-report-email-schedule',
  templateUrl: './report-email-schedule.component.html',
  styleUrls: ['./report-email-schedule.component.css']
})
export class ReportEMailScheduleComponent implements OnInit {

  ReportScheduleForm: FormGroup;

  Mode: any = 'List';
  Frequency: any[] = [];
  ReportNames: any[] = [];
  Users: any[] = [];
  ReportSchedules: any[] = [];
  ReportScheduleColumns: any;

  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;

  AgLoad: boolean = true;
  PageSize: any = "50";
  Currentpage: string = "0";
  IsActive: boolean;
  Submitted: any = false;
  SelectedReportScheduleID: any;
  documentTemplates: any[] = [];
  constructor(private FB: FormBuilder,
    private sysCommonService: SysCommonService,
    private cryptoAes: CryptoAes,
    private reportScheduleService: ReportScheduleService,
    private deleteRecordsService: DeleteRecordsService,
    private toastr: ToastrService, private documenttemplateservice: DocumenttemplateService) { }

  ngOnInit() {
   
   
  this.CreateForm();
    this.SetPermissions();
    this.ReportScheduleColumns = [
      { headerName: 'Description', field: 'description', sortable: true, filter: true, width: 150 },
      { headerName: 'Report', field: 'reportName', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Frequency', field: 'frequencyName', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Subject', field: 'subject', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Email To', field: 'emailTo', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access, width: 20, }
    ];
   
    this.BindFrequency();
    this.BindReportNames();
    this.BindReportSchedule();
    this.BindUsers();
    this.BindDocumentTemplates();
  }

CreateForm()
{
  this.ReportScheduleForm = this.FB.group({
     
    ID: [''],
    Description: ['', Validators.required],
    Subject: ['', Validators.required],
    EmailTo: ['', Validators.required],
    Frequency: ['-1', CustomValidators.notEqual('-1')],
    EmailSendMode: ['A', CustomValidators.notEqual('- 1')],
    NextRunDate: ['', Validators.required],
    EmailReportOption: ['-1', CustomValidators.notEqual('-1')],
    ReportUser: ['-1', CustomValidators.notEqual('-1')],
    Report: ['-1', CustomValidators.notEqual('-1')],
    DocumentTemplate: ['-1', CustomValidators.notEqual('-1')],
    DateFromType: [new Date()],
    DateToType: [new Date()],
    OffSetDateFrom: [0],
    OffSetDateTo: [0]
  });
}
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "117");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.ReportScheduleForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.ReportScheduleForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.ReportScheduleForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }

  get f() { return this.ReportScheduleForm.controls; }
  BindFrequency() {
    this.sysCommonService.getFrequency().subscribe((resp: any) => {
      this.Frequency = resp.data.frequency;
    }, (error: any) => {

    });
  }
  BindReportNames() {
    this.sysCommonService.getReportNames().subscribe((resp: any) => {
      this.ReportNames = resp.data.reportNames;
    }, (error: any) => {

    });
  }
  BindUsers() {
    this.sysCommonService.getUser().subscribe((resp: any) => {
      this.Users = resp.data.users;
    }, (error: any) => {
    });
  }

  BindReportSchedule() {
    this.AgLoad = false;
    this.reportScheduleService.getReportSchedules().subscribe((resp: any) => {

      this.ReportSchedules = resp.data.reportSchedules;
      this.AgLoad = true;
    }, (error: any) => {

    });
  }
  AddNew() {
    this.Mode = 'Add';
    this.IsActive = true;
    this.ReportScheduleForm.enable();
    this.CreateForm();
   
  }
  IsSaveAndClose: boolean = false;
  OnSave() {
    debugger;
    this.Submitted = true;
    if (this.ReportScheduleForm.invalid) {
      return;
    }

    debugger;
    let lBSSYSReportSchedule: any = new LBSSYSReportSchedule();
    lBSSYSReportSchedule.CompanyID = localStorage.getItem('CompanyID');
    lBSSYSReportSchedule.FrequencyID = this.ReportScheduleForm.get('Frequency').value;
    lBSSYSReportSchedule.ReportID = this.ReportScheduleForm.get('Report').value;
    lBSSYSReportSchedule.Subject = this.ReportScheduleForm.get('Subject').value;
    lBSSYSReportSchedule.Description = this.ReportScheduleForm.get('Description').value;
    lBSSYSReportSchedule.EmailTo = this.ReportScheduleForm.get('EmailTo').value;
    lBSSYSReportSchedule.EmailSendMode = this.ReportScheduleForm.get('EmailSendMode').value;
    lBSSYSReportSchedule.NextRunDate = this.ReportScheduleForm.get('NextRunDate').value;
    lBSSYSReportSchedule.ReportUser = this.ReportScheduleForm.get('ReportUser').value;
    lBSSYSReportSchedule.DocumentTemplate = this.ReportScheduleForm.get('DocumentTemplate').value;
    lBSSYSReportSchedule.DateFromType = this.ReportScheduleForm.get('DateFromType').value;
    lBSSYSReportSchedule.DateToType = this.ReportScheduleForm.get('DateToType').value;
    lBSSYSReportSchedule.OffSetDateFrom = this.ReportScheduleForm.get('OffSetDateFrom').value;
    lBSSYSReportSchedule.OffSetDateTo = this.ReportScheduleForm.get('OffSetDateTo').value;
    lBSSYSReportSchedule.CreatedBy = localStorage.getItem('LoginID');
    if (this.ReportScheduleForm.get('EmailReportOption').value != '-1')
      lBSSYSReportSchedule.EmailReportOption = this.ReportScheduleForm.get('EmailReportOption').value;
    if (this.ReportScheduleForm.get('ReportUser').value != '-1')
      lBSSYSReportSchedule.ReportUser = this.ReportScheduleForm.get('ReportUser').value;

    if (this.Mode == 'Add') {
      this.reportScheduleService.addReportSchedule(lBSSYSReportSchedule).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Report Schedule added successfully');
          this.BindReportSchedule();
          if (this.IsSaveAndClose) {
            this.ResetForm();
          }
          else {
            this.ReportScheduleForm.patchValue({ ID: resp.data.id });
            this.Mode = 'Edit';
          }
        }
      });
    }
    else if (this.Mode == 'Edit') {
      lBSSYSReportSchedule.ID = this.ReportScheduleForm.get('ID').value;
      this.reportScheduleService.updateReportSchedule(lBSSYSReportSchedule).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Report Schedule updated successfully');
          this.BindReportSchedule();
          if (this.IsSaveAndClose) {
            this.ResetForm();
          }
          else {
            this.ReportScheduleForm.patchValue({ ID: resp.data.id });
            this.Mode = 'Edit';
          }
        }
      });
    }
  }

  OnSaveAndClose() {
    this.IsSaveAndClose = true;
  }
  Cancel() {
    this.ResetForm();
  }
  ResetForm() {
    this.Submitted = false;
    this.ReportScheduleForm.patchValue({
      ID: '',
      Description: '',
      Subject: '',
      EmailTo: '',
      Frequency: '-1',
      EmailSendMode: 'A',
      NextRunDate: '',
      EmailReportOption: '-1',
      ReportUser: '-1',
      Report: '-1',
      OffSetDateTo: '0',
      OffSetDateFrom: '0',
      DateFrom: new Date(),
      DateTo: new Date(),
      DocumentTemplate:'-1'
    });
    this.Mode = 'List';
  }

  Edit(ID) {
    debugger;
  
    this.reportScheduleService.getReportsSchedulesByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        let reports: any = resp.data.report;
        this.ReportScheduleForm.patchValue({
          ID: reports.id,
          Frequency: reports.frequencyID,
          Report: reports.reportID,
          Subject: reports.subject,
          Description: reports.description,
          EmailTo: reports.emailTo,
          EmailSendMode: reports.emailSendMode,
          NextRunDate: reports.nextRunDate,
          EmailReportOption: reports.emailReportOption,
          ReportUser: reports.reportUser,
          DocumentTemplate: reports.documentTemplate,
          DateFromType: reports.dateFromType,
          DateToType: reports.dateToType,
          OffSetDateFrom: reports.offSetDateFrom,
          OffSetDateTo: reports.offSetDateTo,
        
        });

        if (!reports.deleted) {
          this.ReportScheduleForm.enable();
          this.IsActive = true;
        } else {
          this.ReportScheduleForm.disable();
          this.IsActive = false;
        }
      }
      this.Mode = 'Edit';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //AgEdit(event) {
  // this.ReportScheduleForm.patchValue({
  // ID: event.id,
  // FrequencyID: event.frequencyID,
  // ReportID: event.reportID,
  // Subject: event.subject,
  // Description: event.description,
  // EmailTo: event.emailTo,
  // EmailSendMode: event.emailSendMode,
  // NextRunDate: event.nextRunDate,
  // EmailReportOption: event.emailReportOption,
  // ReportUser: event.reportUser,
  // });
  // this.Mode = 'Edit';
  //}
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Edit(event.data.id);
    }
    if (colId == 'Delete') {
      this.DeletePurchaseOrder(event.data.id);
    }
  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  BindDocumentTemplates() {
    this.documenttemplateservice.getAllDocumentTemplates().subscribe((resp: any) => {
      this.documentTemplates = resp.data.documents;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  DeletePurchaseOrder(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SYS_ReportSchedule', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      //this.toastr.success('Purchase order deleted successfully');
      //   this.BindInventoryProductPriceDetails();
      this.BindReportSchedule();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}
