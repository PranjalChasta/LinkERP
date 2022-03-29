import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RequestForQuotationService } from '../services/request-for-quotation.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-convert-requisition-to-po',
  templateUrl: './convert-requisition-to-po.component.html',
  styleUrls: ['./convert-requisition-to-po.component.css']
})
export class ConvertRequisitionToPoComponent implements OnInit {
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  clickedsave:boolean=false;

  ConvertRequisitionForm: FormGroup;
  Loading: boolean;
  RowData: any;
  vendorList: any;
  PurchaseOrderID:any;


  constructor(
    private toastr: ToastrService,
    private router: Router, private route: ActivatedRoute,
    private requestForQuotationService: RequestForQuotationService,
    private cryptoAes: CryptoAes,
    private invCommonService: InvCommonService,
    private FB: FormBuilder
  ) { }

  ngOnInit() {
    this.ConvertRequisitionForm = this.FB.group({
      ApprovedRequisition: this.FB.array([])
    })
    this.SetPermissions();
    this.BindAllVendor();
    this.GetRequestForQuotationList();
  }
  get f() { return this.ConvertRequisitionForm.controls; }

  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "312");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.ConvertRequisitionForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.ConvertRequisitionForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.ConvertRequisitionForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }

  setApprovedRequisition(approvedRequisition: any[]): FormArray {
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
        SelectRequisition: false,
        Vendor: '-1'
      }));
    })
    return approvedRequisitionArray
  }
  GetRequestForQuotationList() {
    this.Loading = true;
    this.requestForQuotationService.getRequisitionConvertToPO().subscribe((response: any) => {
      this.RowData = response.data.approvedRequisition;
      debugger;
      console.log(this.RowData);
      this.ConvertRequisitionForm.setControl('ApprovedRequisition', this.setApprovedRequisition(response.data.approvedRequisition));
      this.Loading = false; 
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
    this.ConvertRequisitionForm = this.FB.group({
      ApprovedRequisition: this.FB.array([])
    })
  }
  /* checkAll(selected) {

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

  } */

  IsAllSelected;
  checkAll(event, Status) {
    let b: boolean;
    if (this.IsAllSelected) {
      b = true;
    } else {
      b = false;
    }
    for (let i = 0; i <= this.RowData.length - 1; i++) {
      // if (this.RowData[i].requisitionLineStatus != 'Approved' || Status == 'New') {
      this.RowData[i].isSelect = b;
      this.RowData[i].createdBY= localStorage.getItem('LoginID');
      //}
    }
  }
  get ApprovedRequisition(): FormArray {
    return this.ConvertRequisitionForm.get('ApprovedRequisition') as FormArray;
  }

  SaveChanges(){
    this.clickedsave=true;
    this.requestForQuotationService.updatePURRequisitionPOList(this.RowData).subscribe((resp: any) => {
      console.log(resp.data.id);
      this.GetRequestForQuotationList();

   
      this.toastr.success('added successfully')
      this.router.navigate(['/pur/purchase-order/' +resp.data.id+ ``]); 
    
    }, (error) => {
      this.toastr.error(error);
      //   console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}
