import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PrescriptionDoctorService } from '../services/prescription-doctor.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { LBSSOPPrescriptionDoctor } from 'src/app/models/pos/lbs_sop_prescriptiondoctor';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';

@Component({
  selector: 'app-prescription-doctor',
  templateUrl: './prescription-doctor.component.html',
  styleUrls: ['./prescription-doctor.component.css']
})
export class PrescriptionDoctorComponent implements OnInit {
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
  PrescriptionForm: FormGroup;
  DoctorPrescription: any;
  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    private prescriptionDoctorService: PrescriptionDoctorService,
    private deleteservice: DeleteRecordsService
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Mode = "List";
    this.HeaderNames = "Prescription";
    this.AccessTab = "Prescription";
    this.PageSize = "50";
    this.Currentpage = "0";
    this.CreateForm();
    this.AgGridColumn();
    this.GetAllDoctorPrescriptions();

  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  CreateForm() {
    this.PrescriptionForm = this.FB.group({
      ID: [''],
      CompanyID: [''],
      DoctorName: ['', Validators.required],
      DoctorShortCode: [''],
      BusinessPhone: [''],
      HomePhone: [''],
      MobileNo: [''],
      EmergencyNo: [''],
      Address:['']
    });
  }
  get f() { return this.PrescriptionForm.controls; }
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
      this.PrescriptionForm.enable();


      if (!this.all_Access) {
        if (!this.write_Access) {
          this.PrescriptionForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.PrescriptionForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  AgGridColumn() {
    this.ColumnDefs = [
      { headerName: 'Doctor Name', field: 'doctorName', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'BusinessPhone', field: 'businessPhone', sortable: true, filter: true },
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
  GetAllDoctorPrescriptions() {
    this.AgLoad = false;
    this.Mode = "List";
    this.prescriptionDoctorService.getDoctorPrescription().subscribe((resp: any) => {
      console.log(resp);
      this.DoctorPrescription = resp.data.prescription;
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
    this.PrescriptionForm.enable();
    this.IsActive = true;
  }
  Cancel(): void {
    this.ResetForm();
    this.Mode = "List";
    this.GetAllDoctorPrescriptions();
  }
  ResetForm() {
    this.PrescriptionForm.patchValue({
      ID: '',
      CompanyID: '',
      DoctorName: '',
      DoctorShortCode: '',
      BusinessPhone: '',
      HomePhone: '',
      MobileNo: '',
      EmergencyNo: '',
      Address: ''
    });
    this.PrescriptionForm.markAsUntouched();
    this.PrescriptionForm.markAsPristine();
    this.submitted = false;
  }
  onSave(saveAction) {
    this.submitted = true;
    if (this.PrescriptionForm.invalid) {
      return;
    }
    this.Loading = true;
    let prescription = new LBSSOPPrescriptionDoctor();
    prescription.CompanyID = this.CompanyID;
    prescription.DoctorName = this.PrescriptionForm.get('DoctorName').value;
    prescription.DoctorShortCode = this.PrescriptionForm.get('DoctorShortCode').value;
    prescription.BusinessPhone = this.PrescriptionForm.get('BusinessPhone').value;
    prescription.HomePhone = this.PrescriptionForm.get('HomePhone').value;
    prescription.MobileNo = this.PrescriptionForm.get('MobileNo').value;
    prescription.EmergencyNo = this.PrescriptionForm.get('EmergencyNo').value;
    prescription.Address = this.PrescriptionForm.get('Address').value;
    prescription.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      debugger;
      this.prescriptionDoctorService.addPrescriptionDector(prescription).subscribe((resp: any) => {
       debugger
        if (resp.isSuccess) {
          this.toastr.success('Doctor Prescription details added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.GetAllDoctorPrescriptions();
            this.Mode = 'List';
            //this.ResetForm();
          }
          else {
            debugger
            let ID = resp.data.id;
            this.Edit(ID);
            this.GetAllDoctorPrescriptions();
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
      prescription.ID = this.PrescriptionForm.get('ID').value;
      this.prescriptionDoctorService.updatePrescriptionDector(prescription).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Doctor Prescription   details updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.GetAllDoctorPrescriptions();
          }
          else {
            let ID = this.PrescriptionForm.get('ID').value;
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
    this.BindDoctorPrescriptionByID(ID);
  }
  BindDoctorPrescriptionByID(ID) {
    this.prescriptionDoctorService.getDoctorPrescriptionByID(ID).subscribe((resp: any) => {
      console.log(resp);
      if (resp.isSuccess == true) {
        debugger;
        let prescription: any = new LBSSOPPrescriptionDoctor();
        prescription = resp.data.prescription;
        this.PrescriptionForm.patchValue({
          ID: prescription.id,
          DoctorName: prescription.doctorName,
          DoctorShortCode: prescription.doctorShortCode,
          BusinessPhone: prescription.businessPhone,
          HomePhone: prescription.homePhone,
          MobileNo: prescription.mobileNo,
          EmergencyNo: prescription.emergencyNo,
          Address: prescription.address,
        });
        if (!prescription.deleted) {
          this.PrescriptionForm.enable();
          this.IsActive = true;
        } else {
          this.PrescriptionForm.disable();
          this.IsActive = false;
        }
      }

    },
      (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
  }
  onDeleteChecked(ID) {
    this.deleteservice.deleteRecordsBYID(ID, 'LBS_SOP_PrescriptionDoctor', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.GetAllDoctorPrescriptions();
      this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}
