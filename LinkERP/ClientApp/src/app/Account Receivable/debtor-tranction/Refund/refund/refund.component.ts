import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReceiptDetails } from '../../Model/receipt';
import { lBS_SOP_RefundDetail, RefundMain, RefundMainRefundDetail } from '../../Model/refund';
import { ARServicesService } from '../../Services/arservices.service';
import { EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.css']
})
export class RefundComponent implements OnInit {
  RefundMainID: any;
 
  constructor(private aRServicesService:ARServicesService,
    private toastr: ToastrService, private FB: FormBuilder) { }

  RefundMainForm: FormGroup;
AgLoad: boolean = false;
Mode:any='List';
RowData: any[] = [];
RefundDetailsData:any[]=[];
Action:any;
ColumnDefs:any;
Status:boolean=false;
IsCloseRefund:boolean=false;
  ngOnInit() {
   this.GetAllRefaundMain();

    this.AgLoad = false;
    this.ColumnDefs = [
      { headerName: 'Refund Batch No.', field: 'refundBatchNo', sortable: true, filter: true, checkboxSelection: false, editable: false },
      { headerName: 'Refund Date', field: 'refundBatchDate', sortable: true, filter: true, checkboxSelection: false, editable: false },
      { headerName: 'Status', field: 'status_Text', sortable: true, filter: true, checkboxSelection: false, editable: false },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
    ];
    this.Mode='List';

    this.RefundMainForm = this.FB.group({
      ID: [''],
      RefundBatchNumber: [''],
      Description: ['']
    })
  }

  GetAllRefaundMain(){
    this.AgLoad = false;
     this.RowData = [];
    this.aRServicesService.getAllRefaund().subscribe((resp: any) => {
      this.RowData=resp.data.refund;
      this.Mode='List';
      this.AgLoad = true;
     //this.AllDebtores=resp.data.debtor;
    }, (error) => {
      
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  
  AddNewRefaund(){
  this.Mode='Add';
  this.RefundDetailsData=[];
  this.IsCloseRefund=false;
  this.RefundMainForm.enable();
  this.ResetForm();
  this.RefundMainID='00000000-0000-0000-0000-000000000000';
  let RefundDetails:any =new lBS_SOP_RefundDetail()
    this.RefundDetailsData.push(RefundDetails);
  }
  ResetForm(){
    this.RefundMainForm.patchValue({
      RefundBatchNumber:'',
      Description:''
    })
  }
  AddOrUpdateMainDetail(){
    console.log(this.RefundDetailsData)
    let RefundMains=new RefundMain();
    debugger;
    RefundMains.Description= this.RefundMainForm.get('Description').value;
    RefundMains.Status=this.Status;
    RefundMains.ID= this.RefundMainID;
    let RefundMainRefundDetails = new RefundMainRefundDetail();
    RefundMainRefundDetails.lBS_SOP_RefundMain =RefundMains ;
    RefundMainRefundDetails.lBS_SOP_RefundDetail = this.getdetails();
   // console.log(RefundMainRefundDetails);
    this.aRServicesService.AddRefundMainDetail(RefundMainRefundDetails).subscribe((resp: any) => {
      console.log(resp)
      this.Status=false;
      if (resp.isSuccess) {
        this.Mode='List';
        
      
        this.toastr.success(resp.message);
        this.GetRefundMainbyID(resp.data.id);
        this.GetRefundtDetailByID(resp.data.id);
       
        }
        else{
        this.toastr.warning(resp.message);
        }
     //this.AllDebtores=resp.data.debtor;
    }, (error) => {
      
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  AddDetailAndMain(data)
  {
    this.RefundDetailsData=data.RefundDetails;
    this.Action=data.Action;
   
    if(data.Action=='Close'){
    this.Mode='List'
    this.GetAllRefaundMain();
    return;
    }
    console.log(this.RefundDetailsData);
  
    let indexx = this.RefundDetailsData.findIndex(c => c.debtorID == '00000000-0000-0000-0000-000000000000');
    if (indexx >= 0) {
      this.toastr.warning('Please select debtor');
      return;
    }
    if(data.Action=='Save')
    {
     
     this.AddOrUpdateMainDetail()
    
    }
    if(data.Action=='Save & Close'){
      this.AddOrUpdateMainDetail()
      this.GetAllRefaundMain();
      console.log(this.Mode)
      console.log(this.Mode)
    }
    
  }

  getdetails() {
    let lBS_SOP_RefundDetails: lBS_SOP_RefundDetail[] = [];
    let LineNo=0;
    this.RefundDetailsData.forEach(ba => {
      let Details: any;
      LineNo=LineNo+1;
      Details = new lBS_SOP_RefundDetail();
      Details.id=ba.id;
      Details.companyID=ba.companyID
      Details.createdBY=ba.createdBY
      debugger;
      //Details.refundMainID=ba.refundMainID;
      Details.refundLineNo=LineNo;
      Details.refundNumber=ba.refundNumber
      Details.debtorID=ba.debtorID 
      Details.homeRefundAmount=ba.homeRefundAmount
      Details.refundMainID=ba.refundMainID
      Details.paymentType=ba.paymentType
      lBS_SOP_RefundDetails.push(Details)
    });
    console.log(lBS_SOP_RefundDetails)
   // lBS_SOP_RefundDetails=[];
    return lBS_SOP_RefundDetails;
  }
  OnActionClick(event){
    debugger;
    var colId = event.column.getId();
    if (colId == 'Edit') {
      debugger;
      this.RefundMainID=event.data.id;
      this.GetRefundMainbyID(event.data.id);
      this.GetRefundtDetailByID(event.data.id);
     
      // this.Edit(event.data.id);
    }
     // this.SelectedDebtorid = event.data.id;
    // } else if (colId == 'Delete') {
    //   debugger;
    //   this.onDeleteChecked(event.data.id)
    // }
  }

  GetRefundMainbyID(RefundMainID)
  {
    debugger;
   this.aRServicesService.getRefundMainByid(RefundMainID).subscribe((resp: any) => {
   console.log(resp)
   this.RefundMainForm.patchValue({
    RefundBatchNumber:resp.data.refund.refundBatchNo,
    Description: resp.data.refund.description,
   })
   this.RefundMainID= resp.data.refund.id;
   if(resp.data.refund.status){
    this.IsCloseRefund=true;
    this.RefundMainForm.disable();
 
  }
  else{
   this.IsCloseRefund=false;
   this.RefundMainForm.enable();
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
  GetRefundtDetailByID(RefundMainID)
  {
   this.RefundDetailsData=[];
    this.aRServicesService.getRefundDetailbyid(RefundMainID).subscribe((resp: any) => {
 
     
   this.RefundDetailsData=resp.data.refund;
   this.Mode='Edit';
   if(this.Action=='Save & Close')
        {
          this.Mode='List';
          this.Action=''
        }
   console.log(this.RefundDetailsData)
 
   
   
   //console.log(this.DebtorTranctionData);
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  CloseRefund(){
   this.Status=true;
    this.AddOrUpdateMainDetail();
  }
}
