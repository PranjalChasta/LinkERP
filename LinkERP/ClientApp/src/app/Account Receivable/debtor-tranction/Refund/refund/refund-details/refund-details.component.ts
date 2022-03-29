import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { TenderTypesService } from 'src/app/POS/services/tender-types.service';
import { BsModalService, BsModalRef, CollapseModule } from 'ngx-bootstrap';
import { lBS_SOP_RefundDetail, RefundMain, RefundMainRefundDetail } from '../../../Model/refund';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-refund-details',
  templateUrl: './refund-details.component.html',
  styleUrls: ['./refund-details.component.css']
})
export class RefundDetailsComponent implements OnInit {
  @Output() AddNewRefaundDetail= new EventEmitter<{RefundDetails:any, Action:string}>();
  
  @Output() public data = new EventEmitter<{RefundDetails:any[], Action:string}>();
  @Input() AddRefundDetailLineData:any=[];
  @Input() IsCloseRefund:any;
  TenderTypes:any;
RefundDetailsData:any=[];
  modalRef: any;
  RefundDetailID: any;
  RefundMainID: any;
  DebtorID: any;
  constructor( private router: Router, private tenderTypesService: TenderTypesService,private modalService: BsModalService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.GetTenderTypeList();
    this.RefundDetailsData=[];
    this.RefundDetailsData=this.AddRefundDetailLineData;
    console.log(this.AddRefundDetailLineData);
  }
  AddNewRfundDetailLine(){

    let RefundDetails:any =new lBS_SOP_RefundDetail()
    this.RefundDetailsData.push(RefundDetails);

  }
  GetTenderTypeList() {

    this.tenderTypesService.GetTenderTypes().subscribe((res: any) => {
      this.TenderTypes = res.data.tenderTypes;
    }, (error) => {
     // this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onSave(Action){
    
    this.AddNewRefaundDetail.emit({RefundDetails:this.RefundDetailsData, Action:Action});
    //this.data.emit({RefundDetails:this.AddRefundDetailLineData, Action:'Save'});
  }
  Deleteindex(i){
    this.RefundDetailsData.splice(i, 1);
  }

  OpenRefund(Debtor: TemplateRef<any>,id,debtorID,refundMainID,i) {
    this.modalRef = this.modalService.show(Debtor);
  this.DebtorID=debtorID;
    // this.AmountToDisplay=homeAmount;
   
    // this.AllocatedAmountToDisplay=allocatedAmount;
    // this.UnlocatedAmountToDisplay=homeAmount-allocatedAmount;
    this.RefundMainID=refundMainID; 
    this.RefundDetailID=id;
    
   
   // this.GetDebtorTranctionByID(DebtorID);
  }
  closePopUp(){
    debugger;
    this.modalRef.hide();
  }
}
