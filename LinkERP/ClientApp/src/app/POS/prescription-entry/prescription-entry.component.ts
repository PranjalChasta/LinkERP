import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PrescriptionEntryService } from '../services/prescription-entry.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { LBSSOPPrescriptionEntry } from 'src/app/models/pos/lbs_sop_prescriptionentry';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { PrescriptionDoctorService } from '../services/prescription-doctor.service';
import { WarehouseService } from 'src/app/inv/services/warehouse.service';
import { InventoryService } from 'src/app/inv/services/inventory.service';
import { PatientMaintenanceService } from '../services/patient-maintenance.service';
import { DebtorService } from 'src/app/inv/services/debtor.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { DatePipe } from '@angular/common';
import { CustomValidators } from 'ngx-custom-validators';
import { InventoryDetailService } from 'src/app/inv/services/inventory-detail.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-prescription-entry',
  templateUrl: './prescription-entry.component.html',
  styleUrls: ['./prescription-entry.component.css']
})
export class PrescriptionEntryComponent implements OnInit {
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
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
  DoctorList: any;
  hideDropdown: boolean;
  DocNo: any;
  doctorDetailsForFilter: any;
  WareHouseList: any[] = [];
  InvList: any[] = [];
  //patDetailsForFilter:any;
  PatientList: any[] = [];
  hideDropdownPat: boolean;
  Debtor: any[] = [];
  modalRef: BsModalRef;
  IdForEdit: any;
  IsDeleted: boolean;
  public lineNumber: number = 0;
  public prescriptionNumber: any;
  public prescriptionsCount: any = 0;
  public prescriptionNO: any;
  @Input() Action: any;
  Menuaccess: any = "PrescriptionEntry";
  @Input() copy: any;
  public age: number;
  dob: any = new Date();
  @Output() change = new EventEmitter<any>();
  isEnabled: any = true;
  isSelected: any = false;
  public prescriptionID: any;
  public wareHouseID: any;
  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    private prescriptionEntryService: PrescriptionEntryService,
    private deleteservice: DeleteRecordsService,
    private prescriptionDoctorService: PrescriptionDoctorService,
    private warehouseService: WarehouseService,
    private inventoryService: InventoryService,
    private PatientMaintenanceService: PatientMaintenanceService,
    private debtorservice: DebtorService,
    private modalService: BsModalService,
    public datepipe: DatePipe,
    private inventoryDetailService: InventoryDetailService,
    private router: Router
  ) { }

  ngOnInit() {
    this.Mode = "Add";
    this.hideDropdown = false;
    this.IsActive = true;
    this.IsDeleted = false;
    this.CreateForm();
    this.BindDoctor();
    this.BindWareHouse();
    this.BindInventories();
    this.BindPatient();
    this.BindDebtor();
    this.PrescriptionForm.get('PrescriptionNo').disable();
    this.PrescriptionForm.get('LineNo').disable();
  }

  Cancel(): void {
    this.ResetForm();
    //this.Mode = "List";
    this.Mode = "Add";
  }
  CreateForm() {
    this.PrescriptionForm = this.FB.group({
      ID: [''],
      CompanyID: [''],
      PrescriptionNo: [''],
      LineNo: ['1'],
      WarehouseID: ['-1', CustomValidators.notEqual('-1')],
      //Warehouse: ['-1', CustomValidators.notEqual('-1')],
      DoctorReferenceNo: [''],
      DoctorID: [''],
      DoctorShortCode: [''],
      DoctorName: ['', Validators.required],
      PatientID: ['-1', CustomValidators.notEqual('-1')],
      PatientName: ['-1'],
      PatientAge: [''],
      MedicationID: [null],
      MedicationName: [''],
      Warning: [''],
      SpecialInstructions: [''],
      Instructions: [''],
      CareInstructions: [''],
      DispensedQuantity: 0,
      UnitPriceOverride: false,
      UnitPriceTaxInclusive: 0,
      AdminFeesOverride: false,
      AdminFeesTaxInclusive: 0,
      TotalAmountTaxInclusive: 0,
      Repeats: 0,
      UnitCost: 0,
      TotalCost: 0,
      Status: 0,
      PayByInsurance: false,
      Insurer: [''],
      TransactionSourceReference: [''],
    });
    this.PrescriptionForm.get('PrescriptionNo').disable();
    this.PrescriptionForm.get('LineNo').disable();

  }
  get f() { return this.PrescriptionForm.controls; }

  onSave(saveAction) {
    debugger;
    this.submitted = true;
    if (this.PrescriptionForm.invalid) {
      return;
    }
    this.Loading = true;
    let Prescription = new LBSSOPPrescriptionEntry();
    Prescription.CompanyID = this.CompanyID;
    Prescription.PrescriptionNo = this.PrescriptionForm.get('PrescriptionNo').value;
    Prescription.LineNo = this.PrescriptionForm.get('LineNo').value;
    Prescription.WarehouseID = this.PrescriptionForm.get('WarehouseID').value; //=null; //this.PrescriptionForm.get('WarehouseID').value;
    Prescription.DoctorReferenceNo = this.PrescriptionForm.get('DoctorReferenceNo').value;
    Prescription.DoctorID = this.PrescriptionForm.get('DoctorID').value;
    Prescription.DoctorName = this.PrescriptionForm.get('DoctorName').value;
    Prescription.DoctorShortCode = this.PrescriptionForm.get('DoctorShortCode').value;
    Prescription.PatientID = this.PrescriptionForm.get('PatientID').value;
    Prescription.PatientName = this.PrescriptionForm.get('PatientName').value;
    Prescription.PatientAge = this.PrescriptionForm.get('PatientAge').value;
    Prescription.MedicationID = this.PrescriptionForm.get('MedicationID').value;
    Prescription.MedicationName = this.PrescriptionForm.get('MedicationName').value;
    Prescription.Warning = this.PrescriptionForm.get('Warning').value;
    Prescription.SpecialInstructions = this.PrescriptionForm.get('SpecialInstructions').value;
    Prescription.Instructions = this.PrescriptionForm.get('Instructions').value;
    Prescription.CareInstructions = this.PrescriptionForm.get('CareInstructions').value;
    Prescription.DispensedQuantity = this.PrescriptionForm.get('DispensedQuantity').value;
    Prescription.UnitPriceOverride = this.PrescriptionForm.get('UnitPriceOverride').value;
    Prescription.UnitPriceTaxInclusive = this.PrescriptionForm.get('UnitPriceTaxInclusive').value;
    Prescription.AdminFeesOverride = this.PrescriptionForm.get('AdminFeesOverride').value;
    Prescription.AdminFeesTaxInclusive = this.PrescriptionForm.get('AdminFeesTaxInclusive').value;
    Prescription.TotalAmountTaxInclusive = this.PrescriptionForm.get('TotalAmountTaxInclusive').value;
    Prescription.Repeats = this.PrescriptionForm.get('Repeats').value;
    Prescription.UnitCost = this.PrescriptionForm.get('UnitCost').value;
    Prescription.TotalCost = this.PrescriptionForm.get('TotalCost').value;
    Prescription.Status = this.PrescriptionForm.get('Status').value;
    Prescription.PayByInsurance = this.PrescriptionForm.get('PayByInsurance').value;
    Prescription.Insurer = this.PrescriptionForm.get('Insurer').value;
    Prescription.TransactionSourceReference = this.PrescriptionForm.get('TransactionSourceReference').value;
    Prescription.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      //debugger;
      this.prescriptionEntryService.addPrescription(Prescription).subscribe((resp: any) => {
        //debugger
        if (resp.isSuccess) {
          this.toastr.success('Patient details added successfully');
          //Prescription.PrescriptionNo = resp.data.PrescriptionNo
          this.ResetForm();
          // if (saveAction == 'Close') {
          //   // this.Cancel();
          //   // this.GetAllPatients();
          //   // this.Mode = 'List';
          //   //this.ResetForm();
          // }
          // else {
          //   // debugger
          //   // let ID = resp.data.id;
          //   // this.Edit(ID);
          //   // this.GetAllPatients();
          //   this.Mode = 'Edit';
          // }
          this.Loading = false;
        }
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {

      //debugger;
      Prescription.ID = this.PrescriptionForm.get('ID').value;
      this.prescriptionEntryService.updatePrescription(Prescription).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Patient details updated successfully');
          if (saveAction == 'Close') {
            // this.Cancel();
            // this.Mode = 'List';
            this.ResetForm();
            this.getPrescriptionByID(Prescription.ID);
          }
          else {
            let ID = this.PrescriptionForm.get('ID').value;
            this.ResetForm();
            this.getPrescriptionByID(ID);
            //this.Edit(ID);
          }
        }

      }, (error) => {
        //console.error('Problem with the sevice. Please try later : ' + error.message);
      });
      this.Loading = false;
    }
    // this.Loading = false;
  }
  ResetForm() {
    this.PrescriptionForm.patchValue({
      ID: '',
      CompanyID: '',
      PrescriptionNo: '',
      LineNo: '1',
      WarehouseID: '-1',
      DoctorReferenceNo: '',
      DoctorID: '',
      DoctorName: '',
      DoctorShortCode: '',
      PatientID: '-1',
      PatientName: '',
      PatientAge: '',
      MedicationID: '',
      MedicationName: '',
      Warning: '',
      SpecialInstructions: '',
      Instructions: '',
      CareInstructions: '',
      DispensedQuantity: '',
      UnitPriceOverride: false,
      UnitPriceTaxInclusive: 0,
      AdminFeesOverride: false,
      AdminFeesTaxInclusive: 0,
      TotalAmountTaxInclusive: 0,
      Repeats: 0,
      UnitCost: 0,
      TotalCost: 0,
      Status: 0,
      PayByInsurance: false,
      Insurer: '',
      TransactionSourceReference: '',
    });
    this.PrescriptionForm.markAsUntouched();
    this.PrescriptionForm.markAsPristine();
    this.PrescriptionForm.enable();
    this.PrescriptionForm.get('PrescriptionNo').disable();
    this.PrescriptionForm.get('LineNo').disable();
    // this.PrescriptionForm["controls"].MedicationName.setValue("");

    this.IsDeleted = false;
    this.submitted = false;
  }
  OnActionEdit(param) {
    this.onEdit(param);
  }
  getPrescriptionByID(ID) {
    // this.prescriptionEntryService.getPrescriptionByID(ID).subscribe((resp: any) => {
    //   if (resp.isSuccess == true) {
    //     let prescription: any = new LBSSOPPrescriptionEntry();
    //     prescription = resp.data.prescription;
    //   }
    // });
    this.onEdit(ID);
  }
  onEdit(param) {
    debugger;
    this.prescriptionEntryService.getPrescriptionByID(param).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        //debugger;
        let prescription: any = new LBSSOPPrescriptionEntry();
        // this.prescriptionID = prescription.id;
        // this.wareHouseID = prescription.warehouseID;
        prescription = resp.data.prescription;
        this.PrescriptionForm.patchValue({
          ID: prescription.id,
          PrescriptionNo: prescription.prescriptionNo,
          LineNo: prescription.lineNo,
          WarehouseID: prescription.warehouseID,
          DoctorReferenceNo: prescription.doctorReferenceNo,
          DoctorID: prescription.doctorID,
          DoctorName: prescription.doctorName,
          DoctorShortCode: prescription.doctorShortCode,
          PatientID: prescription.patientID,
          PatientName: prescription.patientName,
          PatientAge: prescription.patientAge,
          MedicationID: prescription.medicationID,
          MedicationName: prescription.medicationName,
          Warning: prescription.warning,
          SpecialInstructions: prescription.specialInstructions,
          Instructions: prescription.instructions,
          CareInstructions: prescription.careInstructions,
          DispensedQuantity: prescription.dispensedQuantity,
          UnitPriceOverride: prescription.unitPriceOverride,
          UnitPriceTaxInclusive: prescription.unitPriceTaxInclusive,
          AdminFeesOverride: prescription.adminFeesOverride,
          AdminFeesTaxInclusive: prescription.adminFeesTaxInclusive,
          TotalAmountTaxInclusive: prescription.totalAmountTaxInclusive,
          Repeats: prescription.repeats,
          UnitCost: prescription.unitCost,
          TotalCost: prescription.totalCost,
          Status: prescription.status,
          PayByInsurance: prescription.payByInsurance,
          Insurer: prescription.insurer,
          TransactionSourceReference: prescription.transactionSourceReference
        });
        if (prescription.deleteStatus == "Active" && prescription.deleteStatus != null) {
          this.PrescriptionForm.enable();
          this.PrescriptionForm.get('PrescriptionNo').disable();
          this.PrescriptionForm.get('LineNo').disable();
          this.PrescriptionForm.get('LineNo').value();
          this.lineNumber = this.PrescriptionForm.get('LineNo').value();
          this.prescriptionNumber = this.PrescriptionForm.get('PrescriptionNo').value();
          //alert(this.prescriptionNumber);
          //this.IsActive = true;
          this.IsDeleted = false;
        } else {
          this.PrescriptionForm.disable();
          //this.IsActive = false;
          this.IsDeleted = true;
        }
      }
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
    this.Mode = "Edit";
    this.Closenote();

  }
  onPatSelect(obj) {
    this.PrescriptionForm["controls"].PatientName.setValue(obj.target.options[obj.target.selectedIndex].text);
    var id = this.PrescriptionForm["controls"].PatientID.value;

    var Object = this.PatientList.filter(s => s.id == id);
    if (Object != null) {
      try {
        var Insurer = Object[0].insurer;
        this.dob = this.datepipe.transform(Object[0].patientDOB, 'yyyy-MM-dd');
        this.calculateAge(this.dob);
        this.PrescriptionForm["controls"].Insurer.setValue(Insurer);
        this.PrescriptionForm["controls"].PatientAge.setValue(this.age);
        if (Insurer != null) {
          this.PrescriptionForm["controls"].PayByInsurance.setValue(true);
        }
        else {
          this.PrescriptionForm["controls"].PayByInsurance.setValue(false);
        }
      }
      catch (ee) {
        console.log(ee)
      }
    }
  }
  CopyPrescriptionByID(ID, PrescriptionNumbers) {
    this.prescriptionNO = this.PrescriptionForm.get("PrescriptionNo").value;
    this.GetPrescriptionsCount(ID.value, this.prescriptionNO, PrescriptionNumbers);
  }
  onMedChange(obj) {
    debugger;
    this.isSelected = true;
    //alert(this.isSelected);
    this.inventoryDetailService.getInventoryDetailByID(obj).subscribe((resp: any) => {
      if (resp.data.inventorydetails.productStatus == 'N') {
        this.isEnabled = false;
      }
      else {
        this.isEnabled = false;
      }
    }, (error) => {
      //this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindInventories() {
    //this.AgLoad = false;
    //this.Mode = "List";
    this.inventoryService.getInventories().subscribe((resp: any) => {
      this.InvList = resp.data.inventory;
      console.log(resp.data.inventory)
      // this.Loading = false;
      // this.AgLoad = true;
    }, (error) => {
      //  this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindDoctor() {
    this.prescriptionDoctorService.getDoctorPrescription().subscribe((resp: any) => {
      console.log(resp);
      this.DoctorList = resp.data.prescription;
      this.doctorDetailsForFilter = this.DoctorList;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindPatient() {
    this.PatientMaintenanceService.getPatient().subscribe((resp: any) => {
      console.log(resp);
      this.PatientList = resp.data.prescription;
      // this.patDetailsForFilter = this.PatientList;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindWareHouse() {
    this.Loading = true;
    this.warehouseService.getWareHouse().subscribe((resp: any) => {
      this.WareHouseList = resp.data.warehouse;
      console.log(this.WareHouseList)
      this.Loading = false;

    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindDebtor() {
    //this.AgLoad = false;
    // this.Mode = "List";
    //debugger;
    this.prescriptionEntryService.getDebtorForPrescription().subscribe((resp: any) => {
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
  onDocChange() {
    var event = this.PrescriptionForm["controls"].DoctorName.value;
    if (event == '') {
      this.hideDropdown = false;
    }
    else {
      this.DocNo = event;
      this.doctorDetailsForFilter = this.DoctorList.filter((res: any) => {
        return (res.doctorShortCode.toLowerCase().includes(event.toLowerCase()) && res.deleted == 0
          || res.doctorName.toLowerCase().includes(event.toLowerCase()) && res.deleted == 0)
      })

      if (this.doctorDetailsForFilter.length != 0) {
        this.hideDropdown = true;
      }
      else {
        this.hideDropdown = false;
        this.PrescriptionForm["controls"].DoctorID.setValue(null);
        this.PrescriptionForm["controls"].DoctorShortCode.setValue('');
      }
    }
  }

  // onPatChange(){
  //   var event = this.PrescriptionForm["controls"].PatientName.value;
  //   if (event == '') {
  //     this.hideDropdownPat = false;
  //   }
  //   else {
  //       this.DocNo = event;
  //       this.patDetailsForFilter = this.PatientList.filter((res: any) => {
  //       return (res.patientName.toLowerCase().includes(event.toLowerCase())
  //       || res.patientName.toLowerCase().includes(event.toLowerCase()))
  //     })

  //       if (this.patDetailsForFilter.length != 0) {
  //         this.hideDropdownPat = true;
  //       }
  //       else {
  //         this.hideDropdownPat = false;
  //         this.PrescriptionForm["controls"].PatientID.setValue('0');
  //         //this.PrescriptionForm["controls"].DoctorShortCode.setValue('');
  //       }
  //     }
  // }
  SerialiseDetail(priscEntery: TemplateRef<any>) {
    //debugger
    //this.SelectedProductID = this.RowData[i].productID;
    // this.SelectedAdjustmentDetail_ID = this.RowData[i].id;
    //this.SelectedQuantity = this.RowData[i].convertedQuantity_text;
    // this.productName = this.RowData[i].productName;
    this.modalRef = this.modalService.show(priscEntery);
  }
  MixtureDetails(mixtureDetail: TemplateRef<any>) {
    debugger;
    this.prescriptionID = this.PrescriptionForm.get('ID').value;
    this.wareHouseID = this.PrescriptionForm.get('WarehouseID').value;
    this.modalRef = this.modalService.show(mixtureDetail);
  }
  PrescriptionNumbersPopup(PrescriptionNumbers: TemplateRef<any>) {
    this.modalRef = this.modalService.show(PrescriptionNumbers);
  }
  Closenote() {

    this.ResetForm();
    this.BindPatient();
    //this.BindInventoryAdjustmentDetail();
    this.modalRef.hide();
  }
  getDoctorDetails(data) {
    this.PrescriptionForm["controls"].DoctorName.setValue(data.doctorName);
    this.PrescriptionForm["controls"].DoctorShortCode.setValue(data.doctorShortCode);
    this.PrescriptionForm["controls"].DoctorID.setValue(data.id);
    this.hideDropdown = false;
  }
  // getPatDetails(data) {
  //   this.PrescriptionForm["controls"].PatientName.setValue(data.patientName);
  //   this.PrescriptionForm["controls"].PatientID.setValue(data.id);
  //   this.hideDropdownPat = false;
  // }
  PatientDetails(detailpopup: TemplateRef<any>) {
    debugger;
    this.modalRef = this.modalService.show(detailpopup);
  }
  OnAccept() {
    this.confirmation.ConfirmationPopup('Are you sure you want to mark the selected record as Inactive?');
  }
  VoidInvoice(ID) {

    this.deleteservice.deleteRecordsBYID(ID, 'LBS_SOP_PrescriptionListing', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.onEdit(ID);
      //this.PrescriptionForm.disable();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  AddMedication(saveMedication) {
    //debugger;
    this.submitted = true;
    if (this.PrescriptionForm.invalid) {
      return;
    }
    this.Loading = true;
    let Prescription = new LBSSOPPrescriptionEntry();
    Prescription.CompanyID = this.CompanyID;
    Prescription.PrescriptionNo = this.PrescriptionForm.get('PrescriptionNo').value;
    this.lineNumber = this.PrescriptionForm.get('LineNo').value;
    Prescription.LineNo = this.lineNumber + 1;
    Prescription.WarehouseID = this.PrescriptionForm.get('WarehouseID').value; //=null; //this.PrescriptionForm.get('WarehouseID').value;
    Prescription.DoctorReferenceNo = this.PrescriptionForm.get('DoctorReferenceNo').value;
    Prescription.DoctorID = this.PrescriptionForm.get('DoctorID').value;
    Prescription.DoctorName = this.PrescriptionForm.get('DoctorName').value;
    Prescription.DoctorShortCode = this.PrescriptionForm.get('DoctorShortCode').value;
    Prescription.PatientID = this.PrescriptionForm.get('PatientID').value;
    Prescription.PatientName = this.PrescriptionForm.get('PatientName').value;
    Prescription.PatientAge = this.PrescriptionForm.get('PatientAge').value;
    Prescription.MedicationID = this.PrescriptionForm.get('MedicationID').value;
    Prescription.MedicationName = this.PrescriptionForm.get('MedicationName').value;
    Prescription.Warning = this.PrescriptionForm.get('Warning').value;
    Prescription.SpecialInstructions = this.PrescriptionForm.get('SpecialInstructions').value;
    Prescription.Instructions = this.PrescriptionForm.get('Instructions').value;
    Prescription.CareInstructions = this.PrescriptionForm.get('CareInstructions').value;
    Prescription.DispensedQuantity = this.PrescriptionForm.get('DispensedQuantity').value;
    Prescription.UnitPriceOverride = this.PrescriptionForm.get('UnitPriceOverride').value;
    Prescription.UnitPriceTaxInclusive = this.PrescriptionForm.get('UnitPriceTaxInclusive').value;
    Prescription.AdminFeesOverride = this.PrescriptionForm.get('AdminFeesOverride').value;
    Prescription.AdminFeesTaxInclusive = this.PrescriptionForm.get('AdminFeesTaxInclusive').value;
    Prescription.TotalAmountTaxInclusive = this.PrescriptionForm.get('TotalAmountTaxInclusive').value;
    Prescription.Repeats = this.PrescriptionForm.get('Repeats').value;
    Prescription.UnitCost = this.PrescriptionForm.get('UnitCost').value;
    Prescription.TotalCost = this.PrescriptionForm.get('TotalCost').value;
    Prescription.Status = this.PrescriptionForm.get('Status').value;
    Prescription.PayByInsurance = this.PrescriptionForm.get('PayByInsurance').value;
    Prescription.Insurer = this.PrescriptionForm.get('Insurer').value;
    Prescription.TransactionSourceReference = this.PrescriptionForm.get('TransactionSourceReference').value;
    Prescription.CreatedBY = localStorage.getItem('LoginID');
    this.prescriptionEntryService.addMedication(Prescription).subscribe((resp: any) => {
      //debugger
      if (resp.isSuccess) {
        this.toastr.success('Medication details added successfully');
        //Prescription.PrescriptionNo = resp.data.PrescriptionNo
        this.ResetForm();
        this.Loading = false;
      }
    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  GetPrescriptionsCount(ID, prescNo, PrescriptionNumbers) {
    debugger;
    this.prescriptionEntryService.PrescriptionNumberCount(prescNo).subscribe((resp: any) => {
      if (resp.isSuccess) {
        var count = resp.data[0].Count;
        this.prescriptionsCount = count;
        if (this.prescriptionsCount > 1) {
          this.modalRef = this.modalService.show(PrescriptionNumbers);
        }
        else {
          this.prescriptionEntryService.copyPrescriptionByID(ID).subscribe((resp: any) => {
            console.log(resp);
            var NewID = resp.data.prescription.id;
            this.toastr.success('Prescription is copied successfully');
            this.onEdit(NewID);
          }, (error) => {
            this.toastr.error(error);
            console.error('Problem with the sevice. Please try later : ' + error);
          });
        }
      }
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  calculateAge(dob) {
    const bdate = new Date(dob);
    const timeDiff = Math.abs(Date.now() - bdate.getTime());
    this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
  }
}

