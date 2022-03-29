import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PrescriptionDoctorService } from 'src/app/POS/services/prescription-doctor.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { LBSSOPPrescriptionEntry } from 'src/app/models/pos/lbs_sop_prescriptionentry';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { PrescriptionEntryService } from 'src/app/POS/services/prescription-entry.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-prescription-view-copies',
  templateUrl: './prescription-view-copies.component.html',
  styleUrls: ['./prescription-view-copies.component.css']
})
export class PrescriptionViewCopiesComponent implements OnInit {
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
  modalRef: BsModalRef;
  @Output() OnActionEdit = new EventEmitter<any>();
  @Input() IDs:any;
  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    private prescriptionDoctorService: PrescriptionDoctorService,
    private deleteservice: DeleteRecordsService,
    private prescriptionEntryService: PrescriptionEntryService,
    private modalService: BsModalService,
  ) { }
  ngOnInit() {
    this.AgLoad = false;
    this.Mode = "List";
    this.HeaderNames = "Prescription";
    this.AccessTab = "Prescription";
    this.PageSize = "50";
    this.Currentpage = "0";
    this.AgGridColumn();
    this.ViewCopiesById(this.IDs.value);
  }
  get f() { return this.PrescriptionForm.controls; }
  AgGridColumn() {
    this.ColumnDefs = [
      { headerName: 'Prescription', field: 'prescriptionNo', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Issue Date', field: 'dateCreated', sortable: true, filter: true,valueFormatter: this.dateFormatter },
      { headerName: 'Patient Name', field: 'patientName',sortable: true, filter: true},
      { headerName: 'Doctor Name', field: 'doctorName',sortable: true, filter: true},
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false, }
    ];
  }
  dateFormatter(params) {
    return moment(params.value).format('DD/MM/yyyy'); //hh:mm:ss
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
       this.OnActionEdit.emit(event.data.id);

      //this.Edit(event.data.id);
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
  }

  ViewCopiesById(ID) {
    debugger;
    this.AgLoad = false;
    this.Mode = "List";
    this.prescriptionEntryService.viewCopiesById(ID).subscribe((resp: any) => {
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

  GetAllPrescriptions() {
    this.AgLoad = false;
    this.Mode = "List";
    this.prescriptionEntryService.getAllPrescription().subscribe((resp: any) => {
      console.log(resp);
      this.DoctorPrescription = resp.data.debtor;
      this.RowData = resp.data.debtor;
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


  onDeleteChecked(ID) {
    this.deleteservice.deleteRecordsBYID(ID, 'LBS_SOP_PrescriptionListing', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.GetAllPrescriptions();
      //this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Closenote() {
    //this.BindInventoryAdjustmentDetail();
    this.modalRef.hide();
  }
}
