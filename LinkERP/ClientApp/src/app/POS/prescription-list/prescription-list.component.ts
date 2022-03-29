import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-prescription-list',
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.css']
})
export class PrescriptionListComponent implements OnInit {
  prescriptionsList: any = [];
  selectedprescriptionData: any = [];
  @Input() prescriptionNO: any;
  @Input() close: any;
  isChecked: Boolean = false;
  public checkedList: any = [];
  NewID: any;
  prescIds: any;
  modalRef: BsModalRef;
  Menuaccess: any = "";
  @Input() hidePopUp: any;
  display = 'none';
  public selectedIds: any = [];
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  @Output() OnCancel = new EventEmitter();
  @Input() Edit: any;
  private element: any;
  @Output() OnActionEdit = new EventEmitter<any>();
  constructor(private FB: FormBuilder,
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
    private router: Router,
    private el: ElementRef) {
    //this.element = el.nativeElement;
  }

  ngOnInit() {
    this.getPrescriptions();
  }
  getPrescriptions() {
    debugger;
    this.prescriptionEntryService.GetPrescriptions(this.prescriptionNO).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.prescriptionsList = resp.data.prescription;
      }
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  copyPrescriptionByID() {
    debugger;
    //alert(this.checkedList[0]);
    if (this.selectedIds.length == 1) {
      this.prescriptionEntryService.copyPrescriptionByID(this.selectedIds[0]).subscribe((resp: any) => {
        console.log(resp);
        this.NewID = resp.data.prescription.id;
        this.OnCancel.emit();
        this.toastr.success('Selected Prescription is copied successfully');
        this.selectedIds = [];
        this.OnActionEdit.emit(this.NewID);
      }, (error) => {
        this.toastr.error(error);
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    else if (this.selectedIds.length > 1) {
      this.prescriptionEntryService.copyPrescriptionsByIDs(this.selectedIds.toString()).subscribe((resp: any) => {
        console.log(resp);
        this.NewID = resp.data.prescription[0].id;
        this.OnCancel.emit();
        this.toastr.success('Selected Prescriptions are copied successfully');
        this.selectedIds = [];
        this.OnActionEdit.emit(this.NewID);
      }, (error) => {
        this.toastr.error(error);
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    else {
      this.toastr.error('Please select any of the Prescriptions to Copy');
    }
  }
  onCheckbxChange(option, event) {
    debugger;
    this.checkedList = [];
    this.isChecked = event.target.checked;
    if (this.isChecked) {
      this.checkedList.push(option.id);
      for (var i = 0; i < this.prescriptionsList.length; i++) {
        if (this.prescriptionsList[i].id != this.checkedList[0]) {
          event.target.checked = false;
        }
        else {
          event.target.checked = true;
        }
      }
    } else {
      for (var i = 0; i < this.prescriptionsList.length; i++) {
        if (this.checkedList[i] == option.id) {
          this.checkedList.splice(i, 1);
        }
      }
    }
  }
  onChange($event) {
    debugger;
    var values = $event.target.value;
    this.checkedList = values.split('/');
    if ($event.target.checked) {
      for (var i = 0; i < this.prescriptionsList.length; i++) {
        if (this.prescriptionsList[i].id == this.checkedList[0]) {
          $event.target.checked = true;
        }
        else {
          $event.target.checked = false;
        }
      }
      // $event.target.checked = false;
      // this.issuesIds.push(this.checkedList[0]);
      // $event.target.checked = true;
    } else {
      const index: number = this.selectedIds.indexOf(this.checkedList[0]);
      if (index == -1) {
        this.selectedIds.splice(index, 1);
      }
      {
        this.selectedIds = [];
      }
    }
  }
  onChangeNew(event) {
    debugger;
    var tblprescList = document.getElementById("tblprescList");
    var chks = tblprescList.getElementsByTagName("INPUT");
    for (var i = 0; i < chks.length; i++) {
      for (var i = 0; i < chks.length; i++) {
        if (chks[i] != event.checked) {
          //chks[i].checked = false;
        }
      }
    };
  }
  onlyOneValue(e) {
    debugger;
    this.checkedList[0] = e.target.value;
    for (var i = 0; i < this.prescriptionsList.length; i++) {
      if (e.target.value == this.prescriptionsList[i].id) {
        this.prescriptionsList[i].selected = true;
      }
      else {
        this.prescriptionsList[i].selected = false;
      }
    }
  }
  Cancel() {
    this.OnCancel.emit();
  }
  onchkbxChange(event) {
    debugger;
    var values = event.target.value;
    this.checkedList = values.split('/');
    if (event.target.checked) {
      this.selectedIds.push(this.checkedList[0]);
    } else {
      const index: number = this.selectedIds.indexOf(this.checkedList[0]);
      if (index == -1) {
        this.selectedIds.splice(index, 1);
      }
      {
        this.selectedIds = [];
      }
    }
  }
}
