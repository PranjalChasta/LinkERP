import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrganisationMaintenanceService } from '../services/organisation-maintenance.service';
import { FrequencyService } from '../services/frequency.service';
import { LbsSysFrequency } from 'src/app/models/sys/lbs-sys-frequency';
import { DatepickerDateCustomClasses, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { date } from 'ngx-custom-validators/src/app/date/validator';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';

@Component({
  selector: 'app-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.css']
})
export class FrequencyComponent implements OnInit {
  FrequencyForm: FormGroup;
  Mode: any = 'List';
  organisations: any;
  Frequencies: any;
  Loading: any = false;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  submitted: boolean;
  AccessTab: any;
  HeaderNames: any; //OrganisationsPermissions;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  IsActive: boolean;
  SelectedFrequencyId: any;
  FrequencyNamedata: any;
  CompanyId = localStorage.getItem('CompanyID');
  dateCustomClasses: DatepickerDateCustomClasses[];
  modalRef: BsModalRef;
  addreadonly: boolean;
  PageSize: any;
  Currentpage: string;
  Frequencydetail =
    [
      { id: 'Second', name: 'Second' },
      { id: 'Minute', name: 'Minute' },
      { id: 'Hour', name: 'Hour' },
      { id: 'Day', name: 'Day' },
      { id: 'Week', name: 'Week' },
      { id: 'Month', name: 'Month' },
      { id: 'Year', name: 'Year' }
      // { id: 'Specific Date', name: 'Specific Date' },
      // { id: 'Working Day', name: 'Working Day' }
    ];
  datePickerConfig: Partial<BsDatepickerConfig>
  constructor(
    private FrequencyTypeFB: FormBuilder,
    private organisationMaintenanceService: OrganisationMaintenanceService,
    private frequencyService: FrequencyService,
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    public modalService: BsModalService,
    private sharedFormatterService: SharedFormatterService
  ) {

   // this.datePickerConfig = Object.assign({}, { dateInputFormat: 'DD-MM-YYYY, h:mm:ss a', showWeekNumbers: false })
  }

  ngOnInit() {
    this.AgLoad = false;
    this.Currentpage = "0";
    this.AccessTab = 'Frequency';
    this.HeaderNames = 'Frequency';
    this.PageSize = "50";
    this.CreateForm();
    this.SetPermissions();
    this.AgGridColumns();
    this.getFrequency();
  }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "110");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.FrequencyForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.FrequencyForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.FrequencyForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  CreateForm() {
    this.FrequencyForm = this.FrequencyTypeFB.group({
      ID: [''],
      Name: ['', Validators.required],
      Frequency: ['', Validators.required],
      StartDate: [''],
      EndDate: [''],
      FrequencyType: ['-1', CustomValidators.notEqual('-1')],
    });
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Name', field: 'frequencyName', sortable: true, filter: true, checkboxSelection: false, },
      { headerName: 'Type', field: 'frequencyType', sortable: true, filter: true, width: 95 },
      { headerName: 'Frequency', field: 'frequencytext', sortable: true, filter: true, width: 115, cellStyle: { textAlign: 'left' },  },
      { headerName: 'Start Date ', field: 'dateTimeStart', sortable: true, filter: true,  },
      { headerName: 'End Date ', field: 'dateTimeEnd', sortable: true, filter: true,  },
      //{ headerName: 'End Date ', field: 'dateTimeEnd', sortable: true, filter: true, valueFormatter: this.sharedFormatterService.dateTimeFormatter },
      { headerName: 'Execute DateTime', field: 'executeDateTime', sortable: true, filter: true, },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 85 },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
  get f() { return this.FrequencyForm.controls; }

  //To bind the data of Frequency to the controls to edit/update.
  getFrequency() {
    this.Loading = true;
    this.AgLoad = false;
    this.frequencyService.getFrequencies().subscribe((resp: any) => {
      this.Frequencies = resp.data.frequency;
      this.RowData = resp.data.frequency;
      this.RowData .forEach(element => {
        let dateTimeStart = {'value': element.dateTimeStart}
        let dateTimeEnd = {'value': element.dateTimeEnd}
        let executeDateTime = {'value': element.executeDateTime}
        element.dateTimeStart=this.sharedFormatterService.dateTimeFormatter(dateTimeStart);
        element.dateTimeEnd=this.sharedFormatterService.dateTimeFormatter(dateTimeEnd);
        element.executeDateTime=this.sharedFormatterService.dateTimeFormatter(executeDateTime);
      });
      this.AgLoad = true;
  
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  AddNew(): void {
    this.ResetForm();
    this.Mode = 'Add';
    this.FrequencyForm.enable();
    this.IsActive = true;
    this.addreadonly = false;
    this.FrequencyNamedata = '';
    // this.FrequencyForm.get('FrequencyType').enable();
  }

  BindFrequencyeByID(ID) {

    this.frequencyService.getFrequencyByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        let frequencies: any = new LbsSysFrequency();
        frequencies = resp.data.frequencystatus;
        this.SelectedFrequencyId = frequencies.id;
        this.FrequencyNamedata = frequencies.frequencyName;
        var Frequency = frequencies.frequency.toFixed(Math.max(((frequencies.frequency + '').split(".")).length, 2));
        this.FrequencyForm.patchValue({
          ID: frequencies.id,
          Name: frequencies.frequencyName,
          Frequency:Frequency,
          FrequencyType: frequencies.frequencyType,
          // DefaultCompanyID: frequencies.companyID,
          StartDate: frequencies.dateTimeStart,
          EndDate: frequencies.dateTimeEnd,
        });
        if (!frequencies.deleted) {
          this.FrequencyForm.enable();
          this.IsActive = true;
        } else {
          this.FrequencyForm.disable();
          this.IsActive = false;
        }
        //this.FrequencyForm.get('FrequencyType').disable();
        this.Mode = 'Edit';
      }

    },
      (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
  }
  Edit(ID): void {
    this.BindFrequencyeByID(ID);
    this.addreadonly = true;
    //  this.Mode = 'Edit';

  }

  Cancel(): void {
    this.ResetForm();
    this.getFrequency();
    this.submitted = false;
    this.Mode = "List";
  }
  //To save the Frequency details to database table by calling the API service
  onSaveold(saveAction) {

    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    debugger;
    this.submitted = true;
    if (this.FrequencyForm.invalid) {
      return;
    }
    this.Loading = true;
    let frequency = new LbsSysFrequency();
    frequency.FrequencyName = this.FrequencyForm.get('Name').value;
    frequency.FrequencyType = this.FrequencyForm.get('FrequencyType').value;
    frequency.Frequency = this.FrequencyForm.get('Frequency').value;
    frequency.CompanyID = this.CompanyId;
    frequency.DateTimeStart = this.FrequencyForm.get('StartDate').value;
    frequency.DateTimeEnd = this.FrequencyForm.get('EndDate').value;
    frequency.CreatedBY = localStorage.getItem('LoginID');
    this.submitted = false;
    if (this.Mode == 'Add') {
      this.frequencyService.addFrequency(frequency).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Frequency details added successfully');

          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
          }
          else {
            this.ResetForm();
            this.Edit(resp.data.id);
            this.getFrequency();
            this.Mode = 'Edit';
          }
          this.Loading = false;
        }
        else {
          this.toastr.warning('Frequency Name already exists');
          this.Loading = false;
        }
      },
        (error) => {
          console.error('Problem with the sevice. Please try later : ' + error.message);
        });
    }
    else if (this.Mode == 'Edit') {
      frequency.ID = this.FrequencyForm.get('ID').value;
      this.frequencyService.updateFrequency(frequency).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Frequency details updated successfully');


          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.getFrequency();
          }
          else {
            let id = this.FrequencyForm.get('ID').value
            this.ResetForm();
            this.Edit(id);
          }
        }
        else {
          this.Loading = false;
          this.toastr.warning(resp.message);
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    this.Loading = false;
  }

  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.SelectedFrequencyId = event.data.id;
      this.FrequencyNamedata = event.data.frequencyName;
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

  //Delete the record
  onDeleteChecked(ID) {
    this.Loading = true;
    this.frequencyService.deleteFrequencyByID(ID, localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.getFrequency();
      }
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }
  //To Reset the Frequency Form Controls.
  ResetForm() {
    this.FrequencyNamedata = '';
    this.FrequencyForm.patchValue({
      ID: '',
      Frequency: '',
      FrequencyType: '-1',
      Name: '',
      StartDate: null,
      EndDate: null,
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

