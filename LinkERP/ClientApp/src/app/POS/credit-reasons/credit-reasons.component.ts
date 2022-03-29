import { Component, OnInit, ViewChild } from '@angular/core';
import { CreditReasonsService } from '../services/credit-reasons.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-credit-reasons',
  templateUrl: './credit-reasons.component.html',
  styleUrls: ['./credit-reasons.component.css']
})
export class CreditReasonsComponent implements OnInit {
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
  Loading: any = false;
  CompanyID = localStorage.getItem('CompanyID');
  CreatedBY = localStorage.getItem('LoginID');
  RowData: any = [];
  creditReasonsData: any = [];
  DeleteID: any;
  searchValue: any = "";
  deleteStatus: any;
  activeStatus: any;
  isDeleted: number;
  Action: any;
  constructor(private creditReasonsService: CreditReasonsService, private toastr: ToastrService, private deleteRecordsService: DeleteRecordsService) { }

  ngOnInit() {
    this.getCreditReasons();
    //this.fetchCreditReasons();
  }
  addnew() {

    let object = {
      'id': "",
      'companyID': this.CompanyID,
      'creditReasonDescription': "",
      'creditIntoStock': false,
      'dafault': false,
      'createdBY': this.CreatedBY
    }
    this.RowData.push(object);
  }
  getCreditReasons() {
    debugger;
    this.creditReasonsService.GetCreditReasonsByCompanyID(this.CompanyID).subscribe((resp: any) => {
      if (resp.isSuccess)
        this.RowData = resp.data.creditReasons;
      // for (let i = 0; i < this.RowData.length; i++) {
      //   this.deleteStatus = this.RowData[i].deleteStatus;
      // }
      // alert(this.deleteStatus);
    }, (error) => {
      this.toastr.error('Problem with the sevice. Please try later: ' + error);
    });
  }

  // fetchCreditReasons() {
  //   this.creditReasonsService.FetchCreditReasons(this.CompanyID).subscribe((resp: any) => {
  //     if (resp.isSuccess)
  //       this.creditReasonsData = resp.data.creditReasons;
  //     for (let i = 0; i < this.creditReasonsData.length; i++) {
  //       this.activeStatus = this.creditReasonsData[i].deleteStatus;
  //     }
  //   }, (error) => {
  //     this.toastr.error('Problem with the sevice. Please try later: ' + error);
  //   });
  // }

  saveCreditReasons(action) {
    debugger;
    for (let i = 0; i < this.RowData.length; i++) {
      if (this.RowData[i].creditReasonDescription == '' || this.RowData[i].creditReasonDescription == null || this.RowData[i].creditReasonDescription == undefined) {
        this.toastr.error('Please Enter Description!');
        return;
      }
    }
    this.creditReasonsService.SaveCreditReasons(this.RowData).subscribe((resp: any) => {
      if (resp.isSuccess) {
        this.toastr.success(resp.message);
        this.getCreditReasons();
      }
      else
        this.toastr.error(resp.message);
    }, (error) => {
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Cancel(): void {
    this.getCreditReasons();
  }
  Deleteindex(i) {
    this.RowData.splice(i, 1);
  }
  DeleteCreditReason(ID) {
    debugger;
    for (let i = 0; i < this.RowData.length; i++) {
      this.deleteStatus = this.RowData[i].deleteStatus;
    }
    if (this.deleteStatus == 'Active') {
      this.confirmation.ConfirmationPopup('Are you sure you want to mark the selected record as Inactive?');
    } else {
      this.confirmation.ConfirmationPopup('Are you sure you want to mark the selected record as Active?');
    }
    //this.confirmation.ConfirmationPopup('Are you sure, you want to delete this Credit Reason?');
    this.DeleteID = ID
    // if (window.confirm("Are you sure, you want to delete this Credit Reason?")) {
    //   this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SOP_CreditReasons', this.CreatedBY).subscribe((resp: any) => {
    //     this.toastr.success('Credit Reason deleted successfully');
    //     this.getCreditReasons();
    //   }, (error) => {
    //     console.error('Problem with the sevice. Please try later : ' + error);
    //   });
    // }
  }
  OnAccept($event) {
    debugger;
    //this.fetchCreditReasons();
    if (this.deleteStatus == 'Active') {
      this.isDeleted = 1;
    }
    else {
      this.isDeleted = 0;
    }
    this.creditReasonsService.FetchCreditReasons(this.CompanyID, this.DeleteID, this.isDeleted).subscribe((resp: any) => {
      if (resp.isSuccess)
        this.getCreditReasons();
      //this.creditReasonsData = resp.data.creditReasons;
      // if (this.creditReasonsData.length > 0) {
      //   for (let i = 0; i < this.creditReasonsData.length; i++) {
      //     this.activeStatus = this.creditReasonsData[i].deleteStatus;
      //     if (this.activeStatus == 'Active') {
      //       this.creditReasonsService.DeleteCreditReason(this.DeleteID, 'Update', 1).subscribe((resp: any) => {
      //         if (resp.isSuccess) {
      //           // this.toastr.success(resp.message);
      //           this.getCreditReasons();
      //         }
      //       }, (error) => {
      //         console.error('Problem with the sevice. Please try later : ' + error);
      //       });
      //     }
      //     else{
      //       this.creditReasonsService.DeleteCreditReason(this.DeleteID, 'Update', 0).subscribe((resp: any) => {
      //         if (resp.isSuccess) {
      //           // this.toastr.success(resp.message);
      //           this.getCreditReasons();
      //         }
      //       }, (error) => {
      //         console.error('Problem with the sevice. Please try later : ' + error);
      //       });
      //     }
      //   }
      // }
      // else {
      //   this.creditReasonsService.DeleteCreditReason(this.DeleteID, 'Delete', 0).subscribe((resp: any) => {
      //     if (resp.isSuccess) {
      //       // this.toastr.success(resp.message);
      //       this.getCreditReasons();
      //     }
      //   }, (error) => {
      //     console.error('Problem with the sevice. Please try later : ' + error);
      //   });
      // }

    }, (error) => {
      this.toastr.error('Problem with the sevice. Please try later: ' + error);
    });
  }
  onDefaultSelected(rowIndex: number) {
    for (let i = 0; i < this.RowData.length; i++) {
      this.RowData[i].default = false;
    }
    this.RowData[rowIndex].default = true;
  }
  Search() {
    debugger;
    if (this.searchValue != "") {
      this.RowData = this.RowData.filter(res => { return res.creditReasonDescription.toLocaleLowerCase().match(this.searchValue.toLocaleLowerCase()) });
    }
    else if (this.searchValue == "") {
      this.ngOnInit();
    }
  }
}