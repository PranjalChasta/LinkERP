import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JobsService } from '../services/jobs.service';
import { SysCommonService } from '../services/sys-common.service';
import { LbsSysJob } from 'src/app/models/sys/lbs-sys-job';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { BsModalRef, BsModalService, BsDatepickerConfig } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { SharedFormatterService } from '../../shared/services/shared-formatter.service';
@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  Jobsform: FormGroup;
  Mode: any = 'List';
  submitted: boolean;
  Loading: any = false;
  addreadonly: boolean;
  modalRef: BsModalRef;
  SelectedJob: any;
  JobName: any;
  HeaderNames: any;
  JobCode: any;
  jobs: any[] = [];  //Array variable of job data to bind grid
  Company: any[] = [];  //Array variable of company data to bind grid
  Document: any[] = [];  //Array variable of document data to bind grid
  Frequency: any[] = [];  //Array variable of frequency data to bind grid
  Modules: any[] = [];    //Array variable of module data to bind grid 
  Job: any[] = [];       //Array variable of job data to bind grid
  //Permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  AccessTab: string;
  /* FOR Aggird Start */
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  /* FOR Aggird End  */
  today = new Date();
  CompanyID = localStorage.getItem('CompanyID');
  IsActive: boolean;
  minDate: any;
  PageSize: any;

  datePickerConfig: Partial<BsDatepickerConfig>
  Currentpage: string;

  constructor(
    private JobService: JobsService,
    private CommonService: SysCommonService,
    private JobFB: FormBuilder,
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    public modalService: BsModalService,
    private sharedFormatterService: SharedFormatterService
  ) {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.datePickerConfig = Object.assign({}, { dateInputFormat: 'YYYY-MM-DD HH:MM:SS', showWeekNumbers: false });
  }

  ngOnInit() {
    this.Currentpage = "0";
    this.AgLoad = false;
    this.AccessTab = 'Job';
    this.HeaderNames = 'Job';
    this.Mode = 'List';
    this.PageSize = "50";
    this.CreateForm();
    this.SetPermissions();

    this.BindJobs();
    this.BindCompany();
    this.BindModules();
    let CompanyID = this.CompanyID;
    this.BindDocumentbyCompanyID(CompanyID);
    this.BindFrequencybyCompanyID(CompanyID);
    this.AgGridColumns();
  }

  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "109");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.Jobsform.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          this.Jobsform.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.Jobsform.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  //To create the jobsform Form Controls.
  CreateForm() {
    this.Jobsform = this.JobFB.group({
      ID: [''],
      Company: ['-1'],
      JobCode: ['', Validators.required],
      JobName: [''],
      JobScript: [''],

      EmailAddress: ['', [Validators.pattern(/^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/)]],
      CopyAddress: ['', [Validators.pattern(/^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/)]],
      BccAddress: ['', [Validators.pattern(/^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/)]],
      Last: [null],
      Next: [null, Validators.required],
      Document: ['-1', CustomValidators.notEqual('-1')],
      Module: ['-1', CustomValidators.notEqual('-1')],
      Frequency: ['-1', CustomValidators.notEqual('-1')],
      // Status:['']
    });
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Job Code', field: 'jobCode', sortable: true, filter: true, checkboxSelection: false, },
      { headerName: 'Job Name', field: 'jobName', sortable: true, filter: true },
      { headerName: 'Email ', field: 'emailAddress', sortable: true, filter: true },
      { headerName: 'Copy Email', field: 'copyEmailAddress', sortable: true, filter: true },
      { headerName: 'BCC Email', field: 'bccEmailAddress', sortable: true, filter: true },
      { headerName: 'Last Executed Date', field: 'lastExecuteDateTime', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 80, }, { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
  get f() { return this.Jobsform.controls; }
  //Add new job
  AddNew(): void {
    this.Mode = 'Add';
    this.IsActive = true;
    this.Jobsform.enable();
    this.Jobsform.get('Document').enable();
    this.Jobsform.get('Module').enable();
    this.Jobsform.get('Frequency').enable();
    this.Jobsform.get('Next').enable();
    this.Jobsform.get('Last').enable();
    this.Jobsform.get('JobName').enable();
    this.ResetForm();
    this.JobCode = '';
    this.JobName = '';
  }
  //To bind the data of job to the controls to edit/update.
  Edit(ID): void {
    this.Mode = 'Edit';
    this.BindJobById(ID);

  }
  //Cancel the Add/Edit
  Cancel() {
    this.ResetForm();
    this.Jobsform.get('Next').enable();
    this.Jobsform.get('Last').enable();
    this.submitted = false;
    this.Mode = 'List';
  }

  //To bind the data of all job to the Grid.
  BindJobs() {
    this.Loading = true;
    debugger;

    this.AgLoad = false;
    this.JobService.getjobs().subscribe((resp: any) => {
      this.jobs = resp.data.jobs;
      this.RowData = resp.data.jobs;
      this.RowData .forEach(element => {
        let lastExecuteDateTime = {'value': element.lastExecuteDateTime}
        element.lastExecuteDateTime=this.sharedFormatterService.dateTimeFormatter(lastExecuteDateTime);
      });
      
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To bind the data of all company to the Grid.
  BindCompany() {
    this.CommonService.getCompanies().subscribe((resp: any) => {
      this.Company = resp.data.companies;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Mode = 'Edit'
      this.SelectedJob = event.data.id;
      this.JobCode = event.data.jobCode;
      this.JobName = event.data.jobName;
      this.Edit(event.data.id)
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  /* FOR Aggird End  */

  //Bind Document by  CompanyID
  BindDocumentbyCompanyID(CompanyID) {
    this.Loading = true;
    this.JobService.getDocumentByCompanyID(CompanyID).subscribe((resp: any) => {
      this.Document = resp.data.document;
      this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //Bind Frequency by  CompanyID
  BindFrequencybyCompanyID(CompanyID) {
    this.Loading = true;
    this.JobService.getFrequencyByCompanyID(CompanyID).subscribe((resp: any) => {
      this.Frequency = resp.data.frequency;
      this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To bind the data of all module to the Grid.
  BindModules() {
    this.Loading = true;
    this.JobService.getModules().subscribe((resp: any) => {
      console.log(resp);
      this.Modules = resp.data.modules;
      this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To save the State details to database table by calling the API service
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    debugger;

    this.submitted = true;
    if (this.Jobsform.invalid) {
      return;
    }
    //this.Loading = true;
    let job = new LbsSysJob();
    //job.CompanyID = this.Jobsform.get('Company').value;
    job.CompanyID = this.CompanyID;
    job.JobCode = this.Jobsform.get('JobCode').value;
    job.JobName = this.Jobsform.get('JobName').value;
    job.JobScript = this.Jobsform.get('JobScript').value;
    job.EmailAddress = this.Jobsform.get('EmailAddress').value;
    job.CopyEmailAddress = this.Jobsform.get('CopyAddress').value;
    job.BCCEmailAddress = this.Jobsform.get('BccAddress').value;
    job.LastExecuteDateTime = this.Jobsform.get('Last').value;
    job.NextExecuteDateTime = this.Jobsform.get('Next').value;
    job.DocumentTemplateID = this.Jobsform.get('Document').value;
    job.ModuleID = this.Jobsform.get('Module').value;
    job.FrequencyID = this.Jobsform.get('Frequency').value;
    job.CreatedBY = localStorage.getItem('LoginID');
    //If the mode Add will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.JobService.addJob(job).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Job  details added successfully');
          this.submitted = false;
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindJobs();
            this.Mode = 'List';
          } else {
            let ID = resp.data.id;
            this.ResetForm();
            this.Edit(ID);
            this.BindJobs();
            this.Mode = 'Edit';
          }
          this.Loading = false;
        }
        else {
          this.toastr.warning('Job Code already exists');
          this.Loading = false;
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      job.ID = this.Jobsform.get('ID').value;
      this.JobService.updateJob(job).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.submitted = false;
          this.toastr.success('job  details updated successfully');

          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindJobs();
          }
          else {
            let ID = this.Jobsform.get('ID').value;
            this.ResetForm();
            this.Edit(ID);
          }
        }
        else {
          this.Loading = false;
          this.toastr.warning(resp.message);
        }
      }, (error) => {
        //console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    this.Loading = false;
  }
  OnCancel() {

  }
  //Delete the record
  onDeleteChecked(ID) {
    this.Loading = true;
    this.JobService.deleteJobByID(ID, localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        // this.toastr.success('job deleted successfully')
        this.BindJobs();
      }
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }

  //Bind Job by  ID
  BindJobById(ID) {
    this.JobService.getJobByID(ID).subscribe((resp: any) => {
      console.log(resp);
      if (resp.isSuccess == true) {
        let jobs: any = new LbsSysJob();
        jobs = resp.data.job;
        this.SelectedJob = jobs.id;
        this.JobCode = jobs.jobCode;
        this.JobName = jobs.jobName;
        this.Jobsform.patchValue({
          ID: jobs.id,
          Company: jobs.companyID,
          JobCode: jobs.jobCode,
          JobName: jobs.jobName,
          JobScript: jobs.jobScript,
          EmailAddress: jobs.emailAddress,
          CopyAddress: jobs.copyEmailAddress,
          BccAddress: jobs.bccEmailAddress,
          Last: jobs.lastExecuteDateTime,
          Next: jobs.nextExecuteDateTime,
          Document: jobs.documentTemplateID,
          Module: jobs.moduleID,
          Frequency: jobs.frequencyID,
          //Status:jobs.status
        });
        if (!jobs.deleted) {
          this.Jobsform.enable();
          this.IsActive = true;
        } else {
          this.Jobsform.disable();
          this.IsActive = false;
        }
        this.Jobsform.get('Document').disable();
        this.Jobsform.get('Frequency').disable();
        this.Jobsform.get('EmailAddress').disable();
        this.Jobsform.get('CopyAddress').disable();
        this.Jobsform.get('BccAddress').disable();
        this.Jobsform.get('Next').disable();
        this.Jobsform.get('JobName').disable();
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To create the States Form Controls.
  ResetForm() {
    this.JobCode = '';
    this.JobName = '';
    this.Jobsform.patchValue({
      ID: '',
      Company: '',
      JobCode: '',
      JobName: '',
      JobScript: '',
      EmailAddress: '',
      CopyAddress: '',
      BccAddress: '',
      Last: '',
      Next: '',
      Document: '-1',
      Module: '-1',
      Frequency: '-1',
      Status: ''
    });
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}

