import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from "rxjs/Subject";
import { DebtorService } from 'src/app/inv/services/debtor.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { AddUpdateAdjustment, Adjustment, AdjustmentDetail } from '../../Model/adjustment';
import { ARServicesService } from '../../Services/arservices.service';

@Component({
  selector: 'app-debtor-adjustment',
  templateUrl: './debtor-adjustment.component.html',
  styleUrls: ['./debtor-adjustment.component.css']
})
export class DebtorAdjustmentComponent implements OnInit {
  AdjustmentForm: FormGroup;
  AgLoad: boolean = false;
  Mode: any = 'List';
  RowData: any[] = [];
  Action: any;
  ColumnDefs: any;
  Status: boolean = false;
  IsCloseAdjustment: boolean = false;
  AddAdjustmentDetailsData: any[] = [];
  DBAdjustmentMainID: any = '00000000-0000-0000-0000-000000000000';
  constructor(private aRServicesService: ARServicesService,
    private toastr: ToastrService, private FB: FormBuilder,
    private deleteRecordsService: DeleteRecordsService,
    private debtorservice: DebtorService) { }

  ngOnInit() {

    this.AgLoad = false;
    this.ColumnDefs = [
      { headerName: 'Adjustment Batch No.', field: 'batchNo', sortable: true, filter: true, checkboxSelection: false, editable: false },
      { headerName: 'Adjustment Date', field: 'batchDate', sortable: true, filter: true, checkboxSelection: false, editable: false },
      { headerName: 'Status', field: 'status_Text', sortable: true, filter: true, checkboxSelection: false, editable: false },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    ];
    this.Mode = 'List';
    this.GetAllAdjustment();
    this.AdjustmentForm = this.FB.group({
      ID: [''],
      AdjustmentBatchNumber: [''],
      Description: ['']
    })
  }
  GetAllAdjustment() {
    this.AgLoad = false;
    this.RowData = [];
    this.aRServicesService.getAllAdjustment().subscribe((resp: any) => {
      this.RowData = resp.data.adjustment;
      console.log(resp)
      this.Mode = 'List';
      this.AgLoad = true;
    }, (error) => {

      console.error('Problem with the sevice. Please try later : ' + error);
    });

  }
  AddNewAdjustment() {
    this.Mode = 'Add';
    this.DBAdjustmentMainID = '00000000-0000-0000-0000-000000000000';
    this.IsCloseAdjustment = false;
    this.AddAdjustmentDetailsData = [];
    this.ResetForm();
    let AdjDetail = new AdjustmentDetail();
    this.AddAdjustmentDetailsData.push(AdjDetail);
  }
  ResetForm() {
    this.AdjustmentForm.patchValue({
      AdjustmentBatchNumber: '',
      Description: ''
    })
  }
  OnActionClick(event) {

    var colId = event.column.getId();
    if (colId == 'Edit') {

      this.DBAdjustmentMainID = event.data.id;
      this.GetAdjustmentMainbyID(event.data.id);
      this.GetAdjustmenttDetailByID(event.data.id);

      // this.Edit(event.data.id);

      // this.SelectedDebtorid = event.data.id;
    } else if (colId == 'Delete') {
      debugger;
      this.onDeleteChecked(event.data.id);;

    }
  }
  GetAdjustmentMainbyID(DBAdjustmentMainID) {
    debugger;
    this.aRServicesService.getAdjustmentMainid(DBAdjustmentMainID).subscribe((resp: any) => {
      console.log(resp)
      this.AdjustmentForm.patchValue({
        AdjustmentBatchNumber: resp.data.adjustment.batchNo,
        Description: resp.data.adjustment.description,
      })
      this.DBAdjustmentMainID = resp.data.adjustment.id;
      if (resp.data.adjustment.status) {
        this.IsCloseAdjustment = true;
        this.AdjustmentForm.disable();

      }
      else {
        this.IsCloseAdjustment = false;
        this.AdjustmentForm.enable();
      }
      //  if(resp.data.receipt[0].status){
      //    this.IsCloseShift=true;
      //    this.ReceiptForm.disable();

      //  }
      //  else{
      //   this.IsCloseShift=false;
      //   this.ReceiptForm.enable();
      //  }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  GetAdjustmenttDetailByID(DBAdjustmentMainID) {
    this.AddAdjustmentDetailsData = [];
    this.aRServicesService.getAdjustmentDetailbyid(DBAdjustmentMainID).subscribe((resp: any) => {


      this.AddAdjustmentDetailsData = resp.data.adjustment;
      this.Mode = 'Edit';
      if (this.Action == 'Save & Close') {
        this.Mode = 'List';
        this.Action = ''
      }
      console.log(this.AddAdjustmentDetailsData)



      //console.log(this.DebtorTranctionData);
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  AddUpdateAdjustment() {
    let Adjustments = new Adjustment();
    debugger;
    Adjustments.Description = this.AdjustmentForm.get('Description').value;
    Adjustments.Status = this.Status;
    Adjustments.ID = this.DBAdjustmentMainID;
    let AddUpdateAdjustments = new AddUpdateAdjustment();
    AddUpdateAdjustments.lBS_SOP_Adjustment = Adjustments;
    AddUpdateAdjustments.lBS_SOP_AdjustmentDetail = this.getdetails();
    console.log(AddUpdateAdjustments);

    this.aRServicesService.AddUpdateAdjustment(AddUpdateAdjustments).subscribe((resp: any) => {
      console.log(resp)
      this.Status = false;
      if (resp.isSuccess) {
        this.Mode = 'List';
        this.toastr.success(resp.message);
        this.GetAdjustmentMainbyID(resp.data.id);
        this.GetAdjustmenttDetailByID(resp.data.id);
      }
      else {
        this.toastr.warning(resp.message);
      }
      //this.AllDebtores=resp.data.debtor;
    }, (error) => {

      console.error('Problem with the sevice. Please try later : ' + error);
    });

  }
  OnSave(data) {
    this.AddAdjustmentDetailsData = data.AdjustmentDetails;
    console.log(this.AddAdjustmentDetailsData);
    this.Action = data.Action;
    if (data.Action == 'Save') {

      this.AddUpdateAdjustment()

    }
    if (data.Action == 'Save & Close') {
      this.AddUpdateAdjustment()
      //this.GetAllRefaundMain();
      console.log(this.Mode)
      console.log(this.Mode)
    }
    if (data.Action == 'Close') {
      this.Mode = 'List'
      this.GetAllAdjustment();
    }
  }
  getdetails() {
    debugger;
    let AdjustmentDetails: AdjustmentDetail[] = [];
    let LineNo = 0;
    this.AddAdjustmentDetailsData.forEach(ba => {
      let Details: any;
      LineNo = LineNo + 1;
      debugger
      Details = new AdjustmentDetail();
      Details.iD = ba.id;
      Details.companyID = ba.companyID
      Details.createdBY = ba.createdBY
      Details.adjustmentReferenceNo = ba.adjustmentReferenceNo
      Details.adjustmentDate = ba.adjustmentDate
      Details.debtorID = ba.debtorID
      Details.taxID = ba.taxID
      Details.taxRate = ba.taxRate
      Details.taxAmount = ba.taxAmount
      Details.writeOnOff = ba.writeOnOff
      Details.transactionAmount = ba.transactionAmount
      Details.createdBY = ba.createdBY
      //Details.refundMainID=ba.refundMainID;
      Details.lineNoo = LineNo;

      AdjustmentDetails.push(Details)
    });

    // lBS_SOP_RefundDetails=[];
    return AdjustmentDetails;
  }
  onDeleteChecked(ID) {

    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_ACR_DebtorAdjustmentMain', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.toastr.success('Inventory deleted successfully')
      this.Mode = 'List';
      this.GetAllAdjustment();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  CloseAdjustment() {
    this.Status = true;
    this.AddUpdateAdjustment();
  }

  
}
