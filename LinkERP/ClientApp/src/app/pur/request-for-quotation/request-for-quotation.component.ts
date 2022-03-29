import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ToastrService } from 'ngx-toastr';
import { RequestForQuotationService } from '../services/request-for-quotation.service';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { LbsSubmitRequestForQuotation } from 'src/app/models/pur/lbs-pur-submitRequestForQuotation';

@Component({
  selector: 'app-request-for-quotation',
  templateUrl: './request-for-quotation.component.html',
  styleUrls: ['./request-for-quotation.component.css']
})
export class RequestForQuotationComponent implements OnInit {
  Mode: any = 'List';
  RequestForQuotationForm: FormGroup;
  // ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  Requisitions: any;
  PageSize: any;
  Currentpage: string;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  Loading: boolean;
  vendorList: any;
  vendorOptionShow: boolean[] = [];
  vendorOptionShowAll: boolean;
  AccessTab = 'Quotation';
  RequisitionId: any;
  formInvalid: boolean = true;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private requestForQuotationService: RequestForQuotationService,
    private sharedFormatterService: SharedFormatterService,
    private cryptoAes: CryptoAes,
    private invCommonService: InvCommonService,
    private FB: FormBuilder,) {
  }

  ngOnInit() {

    this.RequestForQuotationForm = this.FB.group({
      ApprovedRequisition: this.FB.array([])
    })
    this.SetPermissions();
    this.BindAllVendor();
    this.GetRequestForQuotationList();

  }
  get f() { return this.RequestForQuotationForm.controls; }

  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "311");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.RequestForQuotationForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.RequestForQuotationForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.RequestForQuotationForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }

  setApprovedRequisition(approvedRequisition: any[]): FormArray {
    debugger
    const approvedRequisitionArray = new FormArray([]);
    approvedRequisition.forEach(a => {
      approvedRequisitionArray.push(this.FB.group({
        RequisitionID: a.requisitionID,
        RequisitionNumber: a.requisitionNumber,
        DateCreated: a.dateCreated,
        ExpectedDeliveryDate: a.expectedDeliveryDate,
        WareHouse: a.wareHouseName,
        Amount: a.amount,
        CreatedBy: a.createdBY,
        RequestedBy: a.requestedBY,

        Vendor: '-1',
        SelectRequisition: false,
        // Vendor: a.vendorID ? a.vendorID : '-1',
        // SelectRequisition: a.vendorID ? true : false,
        VendorName: '',
        EmailAddress: ''
      }));
    })
    return approvedRequisitionArray
  }
  GetRequestForQuotationList() {
    this.Loading = true;
    // this.AgLoad = false;
    this.requestForQuotationService.getApprovedRequisitions().subscribe((response: any) => {
      this.RowData = response.data.approvedRequisition;
      console.log(this.RowData);
      // this.getselectedRequisition();
      this.RequestForQuotationForm.setControl('ApprovedRequisition', this.setApprovedRequisition(response.data.approvedRequisition));
      this.Loading = false;
      // this.AgLoad = true;
    }, (error) => {
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindAllVendor() {
    this.invCommonService.getVendor().subscribe((resp: any) => {
      console.log(resp);
      this.vendorList = resp.data.vendors;
    })
  }
  ResetForm() {
    this.RequestForQuotationForm = this.FB.group({
      ApprovedRequisition: this.FB.array([])
    })
  }
  // checkOne(selected, index, requisitionID) {
  //   if (selected.target.checked) {
  //     this.RequestedArray[index] = requisitionID;
  //   } else {
  //     this.RequestedArray = this.RequestedArray.filter(x => x !== requisitionID);
  //   }

  //   this.vendorOptionShow[index] = !this.vendorOptionShow[index];
  //   let check = this.vendorOptionShow.findIndex(x => x == true);
  //   if (check != -1) {
  //     this.vendorOptionShowAll = true;
  //   } else {
  //     this.vendorOptionShowAll = false;
  //   }
  // }
  checkAll(selected) {

    if (selected.target.checked) {
      this.ApprovedRequisition.controls.forEach(a => {
        a.patchValue({ SelectRequisition: true });
      });
    }
    else {
      this.ApprovedRequisition.controls.forEach(a => {
        a.patchValue({ SelectRequisition: false });
      });
    }

  }
  onEdit(requisitionID) {
    this.RequisitionId = requisitionID;
    this.Mode = "Edit";
    this.AccessTab = "VendorPriceUpdate";
  }
  onSearch($event) {
    let searchedData;
    let filterData = $event.target.value;
    console.log(this.RowData)
    if (filterData == undefined && filterData == undefined) {
      searchedData = this.RowData;
    } else {
      searchedData = this.RowData.filter((res: any) => {
        // return (res.requisitionNumber.toLowerCase().includes(filterData.toLowerCase()));
        return (res.requisitionNumber.toLowerCase().includes(filterData.toLowerCase()) || res.wareHouseName.toLowerCase().includes(filterData.toLowerCase())
          || res.createdBY.toLowerCase().includes(filterData.toLowerCase()) || res.requestedBY.toLowerCase().includes(filterData.toLowerCase()))
      })
    }
    this.RequestForQuotationForm.setControl('ApprovedRequisition', this.setApprovedRequisition(searchedData));
  }
  ChangeTab() {
    this.Mode = 'List';
    this.AccessTab = 'Quotation';
    console.log(this.RequestForQuotationForm)
  }
  //   onDefaultSelected(rowIndex: number) {
  //     this.ApprovedRequisition.at(rowIndex).patchValue({ SelectRequisition: true });
  //  }
  get ApprovedRequisition(): FormArray {
    return this.RequestForQuotationForm.get('ApprovedRequisition') as FormArray;
  }
  // onSelect(index: any) {
  //   this.ApprovedRequisition.at(index).patchValue({
  //   });
  // }
  onVendorChange($event, i) {
    debugger
    let vendor = $event.target.value;
    let vendorData = this.vendorList.filter(x => x.id == vendor)
    this.ApprovedRequisition.at(i).patchValue({ VendorName: vendorData[0].vendorAccountName, EmailAddress: vendorData[0].emailAddress });
  }
  onSave() {
    debugger;
    console.log(this.RequestForQuotationForm);
    let submitRequestForQuotationLst: LbsSubmitRequestForQuotation[] = [];

    this.ApprovedRequisition.controls.forEach(a => {
      if (a.get('SelectRequisition').value) {
        let submitRequestForQuotation: any = new LbsSubmitRequestForQuotation();
        submitRequestForQuotation.RequisitionID = a.get('RequisitionID').value;
        submitRequestForQuotation.VendorID = a.get('Vendor').value;
        submitRequestForQuotation.VendorName = a.get('VendorName').value;
        submitRequestForQuotation.EmailAddress = a.get('EmailAddress').value;
        if (submitRequestForQuotation.VendorID == '-1') {
          this.toastr.warning('Please Select Vendor');
          this.formInvalid = true;
          return;
        } else {
          submitRequestForQuotationLst.push(submitRequestForQuotation);
          this.formInvalid = false;
        }

      }
    });
    console.log(submitRequestForQuotationLst);
    if (!this.formInvalid) {
      this.requestForQuotationService.SubmitRequestForQuoteAnalysis(submitRequestForQuotationLst).subscribe((response) => {
        console.log(response);
        if (response) {
          this.toastr.success("Request has been submitted successfully");
          this.toastr.success("Email has been sent successfully");
          //this.ResetForm();
        } else {
          this.toastr.success("Request has been submitted successfully");
          this.toastr.warning("Email sending failed");
        }
      })
    }

  }
}
