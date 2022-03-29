import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PatientMaintenanceService } from '../services/patient-maintenance.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { LBSSOPPatientMaintenance } from 'src/app/models/pos/lbs_sop_patientmaintenance';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { DebtorService } from 'src/app/inv/services/debtor.service';
import { PrescriptionDoctorService } from '../services/prescription-doctor.service';
@Component({
  selector: 'app-patient-maintenance',
  templateUrl: './patient-maintenance.component.html',
  styleUrls: ['./patient-maintenance.component.css']
})
export class PatientMaintenanceComponent implements OnInit {

  Loading: any = false;
  Mode: any = 'List';
  submitted: boolean;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  PageSize: any;
  CompanyID = localStorage.getItem('CompanyID');
  ColumnDefs;
  RowData: any;
  AccessTab: any;
  IsActive: boolean;
  HeaderNames: any;
  AgLoad: boolean = false;
  Currentpage: string;
  PatientForm: FormGroup;
  Patient: any;
  GenderList:any;
  Debtor: any;
  DoctorList: any;
  MinEffectiveDate: any = new Date('1950-01-01');
  MaxEffectiveDate: Date = new Date(Date.now());
  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    private PatientMaintenanceService: PatientMaintenanceService,
    private deleteservice: DeleteRecordsService,
    private sysCommonService: SysCommonService,
    private debtorservice: DebtorService,
    private prescriptionDoctorService:PrescriptionDoctorService
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Mode = "List";
    this.HeaderNames = "Patient";
    this.AccessTab = "Patient";
    this.PageSize = "50";
    this.Currentpage = "0";
    this.CreateForm();
    this.AgGridColumn();
    this.GetAllPatients();
    this.BindGender();
    this.BindDebtor();
    this.BindDoctor();
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  CreateForm() {
    this.PatientForm = this.FB.group({
      ID: [''],
      CompanyID: [''],
      HomePhone: [''],
      MobileNo: [''],
      Address:[''],
      PatientName: ['',Validators.required],
      EmailAddress:['',Validators.pattern(/^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/)],
      GenderType:['00000000-0000-0000-0000-000000000000'],
      EmergencyContactNumber:[''],
      EmergencyContactName:['',Validators.required],
      PatientDOB:[''],
      Weight:0,
      Family:[''],
      Insurer:['00000000-0000-0000-0000-000000000000'],
      UsualDoctor:['00000000-0000-0000-0000-000000000000'],
      PatientAllergies:[''],
      PromptWarningNotes:false,
      WarningNotes:[''],
      Deceased:false
    });
  }
  get f() { return this.PatientForm.controls; }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.PatientForm.enable();


      if (!this.all_Access) {
        if (!this.write_Access) {
          this.PatientForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.PatientForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  AgGridColumn() {
    this.ColumnDefs = [
      { headerName: 'Patient Name', field: 'patientName', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Mobile No', field: 'mobileNo', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false, }
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
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Edit(event.data.id);
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
  }
  GetAllPatients() {
    this.AgLoad = false;
    this.Mode = "List";
    this.PatientMaintenanceService.getPatient().subscribe((resp: any) => {
      console.log(resp);
      this.Patient = resp.data.prescription;
      this.RowData = resp.data.prescription;
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  AddNew(): void {
    this.Mode = 'Add';
    this.PatientForm.enable();
    this.IsActive = true;
  }
  Cancel(): void {
    this.ResetForm();
    this.Mode = "List";
    this.GetAllPatients();
  }
  ResetForm() {
    this.PatientForm.patchValue({
      ID: '',
      CompanyID: '',
      HomePhone: '',
      MobileNo: '',
      Address:'',
      PatientName: '',
      EmailAddress:'',
      GenderType:'00000000-0000-0000-0000-000000000000',
      EmergencyContactNumber:'',
      EmergencyContactName:'',
      PatientDOB:'',
      Weight:0,
      Family:'',
      Insurer:'00000000-0000-0000-0000-000000000000',
      UsualDoctor:'00000000-0000-0000-0000-000000000000',
      PatientAllergies:'',
      PromptWarningNotes:false,
      WarningNotes:'',
      Deceased:false
    });
    this.PatientForm.markAsUntouched();
    this.PatientForm.markAsPristine();
    this.submitted = false;
  }
  onSave(saveAction) {
    debugger;
    this.submitted = true;
    if (this.PatientForm.invalid) {
      return;
    }
    this.Loading = true;
    let Patient = new LBSSOPPatientMaintenance();
    Patient.CompanyID = this.CompanyID;
    Patient.PatientName = this.PatientForm.get('PatientName').value;
    Patient.PatientDOB = this.PatientForm.get('PatientDOB').value;
    Patient.PatientAllergies = this.PatientForm.get('PatientAllergies').value;
    Patient.EmailAddress = this.PatientForm.get('EmailAddress').value;
    Patient.MobileNo = this.PatientForm.get('MobileNo').value;
    Patient.EmergencyContactName = this.PatientForm.get('EmergencyContactName').value;
    Patient.EmergencyContactNumber = this.PatientForm.get('EmergencyContactNumber').value;
    Patient.Family = this.PatientForm.get('Family').value;
    Patient.GenderType = this.PatientForm.get('GenderType').value;
    Patient.HomePhone = this.PatientForm.get('HomePhone').value;
    Patient.Insurer = this.PatientForm.get('Insurer').value;
    Patient.PromptWarningNotes = this.PatientForm.get('PromptWarningNotes').value;
    Patient.WarningNotes = this.PatientForm.get('WarningNotes').value;
    Patient.Deceased = this.PatientForm.get('Deceased').value;
    Patient.UsualDoctor = this.PatientForm.get('UsualDoctor').value;
    Patient.Weight = this.PatientForm.get('Weight').value;
    Patient.Address = this.PatientForm.get('Address').value;
    Patient.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      debugger;
      this.PatientMaintenanceService.addPatient(Patient).subscribe((resp: any) => {
       debugger
        if (resp.isSuccess) {
          this.toastr.success('Patient details added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.GetAllPatients();
            this.Mode = 'List';
            //this.ResetForm();
          }
          else {
            debugger
            let ID = resp.data.id;
            this.Edit(ID);
            this.GetAllPatients();
            this.Mode = 'Edit';
          }
          this.Loading = false;
        }
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      debugger;
      Patient.ID = this.PatientForm.get('ID').value;
      this.PatientMaintenanceService.updatePatient(Patient).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Patient details updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.GetAllPatients();
          }
          else {
            let ID = this.PatientForm.get('ID').value;
            this.ResetForm();
            this.Edit(ID);
          }
        }

      }, (error) => {
        //console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    this.Loading = false;
  }
  Edit(ID): void {
    this.Mode = 'Edit';
    this.BindPatientByID(ID);
  }
  BindGender() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_SOP_GenderType).subscribe((resp: any) => {
      console.log(resp);
      this.GenderList = resp.data.tabledata;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindDoctor() {
    this.prescriptionDoctorService.getDoctorPrescription().subscribe((resp: any) => {
      console.log(resp);
      this.DoctorList  = resp.data.prescription;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindDebtor() {
    //this.AgLoad = false;
   // this.Mode = "List";
    this.debtorservice.getDebtor().subscribe((resp: any) => {
      console.log(resp);
      this.Debtor = resp.data.debtor;
      //this.RowData = resp.data.debtor;
     // this.Loading = false;
      //this.AgLoad = true;
    }, (error) => {
     // this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindPatientByID(ID) {
    this.PatientMaintenanceService.getPatientByID(ID).subscribe((resp: any) => {
      console.log(resp);
      if (resp.isSuccess == true) {
        debugger;
        let Patient: any = new LBSSOPPatientMaintenance();
        Patient = resp.data.prescription;
        this.PatientForm.patchValue({
          ID: Patient.id,
          PatientName : Patient.patientName,
          PatientDOB : Patient.patientDOB,
          PatientAllergies : Patient.patientAllergies,
          EmailAddress : Patient.emailAddress != null ? Patient.emailAddress : "",
          MobileNo : Patient.mobileNo,
          EmergencyContactName : Patient.emergencyContactName,
          EmergencyContactNumber : Patient.emergencyContactNumber,
          Family : Patient.family,
          GenderType : Patient.genderType,
          HomePhone : Patient.homePhone,
          Insurer : Patient.insurer != null ? Patient.insurer : '00000000-0000-0000-0000-000000000000',
          PromptWarningNotes : Patient.promptWarningNotes,
          WarningNotes : Patient.warningNotes,
          Deceased : Patient.deceased,
          UsualDoctor : Patient.usualDoctor != null ? Patient.usualDoctor : '00000000-0000-0000-0000-000000000000',
          Weight : Patient.weight,
          Address : Patient.address
        });
        if (!Patient.deleted) {
          this.PatientForm.enable();
          this.IsActive = true;
        } else {
          this.PatientForm.disable();
          this.IsActive = false;
        }
      }

    },
      (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
  }
  onDeleteChecked(ID) {
    this.deleteservice.deleteRecordsBYID(ID, 'LBS_SOP_PrescriptionPatient', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.GetAllPatients();
      this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}
