import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { NonPrescriptionLabelsService } from '../services/non-prescription-labels.service';
import { LBSSOPNonPrescriptionLabels } from 'src/app/models/pos/LBS_SOP_NonPrescriptionLabels';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-non-prescription-labels',
  templateUrl: './non-prescription-labels.component.html',
  styleUrls: ['./non-prescription-labels.component.css']
})
export class NonPrescriptionLabelsComponent implements OnInit {

  NonPrescriptionForm: FormGroup;
  Product: any;
  CompanyId = localStorage.getItem('CompanyID');
  Submitted: boolean
  Mode: any = 'List';
  Loading: any = false;
  Prescription: any;
  constructor(
    private FB: FormBuilder,
    private commonService: InvCommonService,
    private nonPrescriptionLabelsService: NonPrescriptionLabelsService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.CreateForm();
    this.BindProducts();
    //this.BindNonPrescriptionLabelsPrice(this.SelectedID);
  }
  CreateForm() {
    this.NonPrescriptionForm = this.FB.group({
      ID: [''],
      MedicationName: ['-1'],
      Instructions: [''],
      ExpiryDate: [''],
      Price: [0],
      NumberOfCopies: ['']
    });
  }
  BindProducts() {
    this.commonService.getInventory().subscribe((resp: any) => {
      this.Product = resp.data.productkits;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onTableChange(event) {
    console.log(event);
    if (event == "-1") {
     // this.AgLoad = false;
      this.SelectedID = null;
      this.RowData = [];
    } else {
      // this.InstructionForm.get('InstructionGroup').enable();
      this.BindNonPrescriptionLabelsPrice(event)

    }

  }
  SelectedID;
  RowData: any;
  BindNonPrescriptionLabelsPrice(ProductID) {
    debugger;
    this.SelectedID = ProductID;
    this.nonPrescriptionLabelsService.getNonPrescriptionLabelsPrice(ProductID).subscribe((resp: any) => {
      console.log(resp.data);
      this.Prescription = resp.data.prescription;
      this.RowData = resp.data.prescription;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
 
  Cancel() {

  }
  onSave(saveAction) {
    debugger;
    this.Submitted = true;
    if (this.NonPrescriptionForm.invalid) {
      return;
    }
    // // this.Loading = true;
    let nonPrescription = new LBSSOPNonPrescriptionLabels();
    nonPrescription.CompanyID = this.CompanyId;
    nonPrescription.MedicationName = this.NonPrescriptionForm.get('MedicationName').value;
    nonPrescription.Instructions = this.NonPrescriptionForm.get('Instructions').value;
    nonPrescription.ExpiryDate = this.NonPrescriptionForm.get('ExpiryDate').value;
    nonPrescription.Price = this.NonPrescriptionForm.get('Price').value;
    nonPrescription.NumberOfCopies = this.NonPrescriptionForm.get('NumberOfCopies').value;
    nonPrescription.CreatedBY = localStorage.getItem('LoginID');
    this.Submitted = false; {
      this.nonPrescriptionLabelsService.addNonPrescriptionLabels(nonPrescription).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastrService.success('Inventory Prescription Details updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
          }
          else {
            this.Cancel();
          }
          this.Loading = false;
        } else {
          // alert(resp);
        }


      }, (error) => {
        //   console.error('Problem with the sevice. Please try later : ' + error);
      });
    }

  }
}
