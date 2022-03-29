// import { Component, OnInit, Input, Output, EventEmitter,ViewChild,TemplateRef } from '@angular/core';
// import { FormGroup, FormBuilder } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-debter-tranctions',
//   templateUrl: './debter-tranctions.component.html',
//   styleUrls: ['./debter-tranctions.component.css']
// })
// export class DebterTranctionsComponent implements OnInit {

//   @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
//   DebtorTranction: FormGroup;
//   ColumnDefs: any;
//   ColumnForMoldal: any;
//   constructor(private debtorservice: DebtorService,
//     private toastr: ToastrService,private modalService: BsModalService) { }
//   AllDebtores:any;
//   AgLoad: boolean = false;
//   AgMoDalLoad:boolean=false;
//    @Input() DebtorID: any;
//   Loading: any = false;
//   RowData: any[] = [];
//   modalRef: BsModalRef;
//   ngOnInit() {
  
//     this.AgLoad = false;
  

//     this.ColumnDefs = [
//       { headerName: 'Invoice No.', field: '', sortable: true, filter: true, checkboxSelection: false, editable: false },
//       { headerName: 'Date', field: 'transactionDate', sortable: true, filter: true, checkboxSelection: false, editable: false },
//       { headerName: 'Period ', field: '', sortable: true, filter: true },
//       { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false },
//       { headerName: 'Due Date', field: 'dueDate', sortable: true, filter: true, checkboxSelection: false, editable: false },
//       { headerName: 'Amount ', field: 'transactionAmountHome', sortable: true, filter: true, checkboxSelection: false, editable: false },
//       { headerName: 'Allocated Amount', field: 'allocatedAmountHome', sortable: true, filter: true, checkboxSelection: false, editable: false },
//       { headerName: 'UnAllocated Amount', field: 'unAllocatedAmountHome', sortable: true, filter: true, checkboxSelection: false, editable: false },
     
//       { headerName: 'Reference', field: 'transactionReferenceNumber', sortable: true, filter: true, checkboxSelection: false, editable: false },
//     ];
//     this.BindDebterByID();
//   }
//   BindDebtor() {

//     this.debtorservice.getDebtor().subscribe((resp: any) => {
//       console.log(resp);
//      this.AllDebtores=resp.data.debtor;
//     }, (error) => {
      
//       console.error('Problem with the sevice. Please try later : ' + error);
//     });
//   }

//   BindDebterByID() {
 
//    this.AgLoad = false;
//    this.AgMoDalLoad=false;
//    this.RowData = [];
//     this.debtorservice.getDebtorTranctionByID(this.DebtorID).subscribe((resp: any) => {
//       console.log(resp);
//       debugger;
//       this.RowData = resp.data.debtorTranctionbyId;
//       resp.data.debtorTranctionbyId.forEach(element => {
//         // element.allocatedAmountHome="1212";
//         element.unAllocatedAmountHome=element.transactionAmountHome- element.allocatedAmountHome
//       });
//       this.RowData=resp.data.debtorTranctionbyId;
//       this.Loading = false;
//       this.AgLoad = true;
//       this.AgMoDalLoad=true;
//     }, (error) => {
      
//       console.error('Problem with the sevice. Please try later : ' + error);
//     });
    
//   }
//   CustomEditIconFunc(params): string {
//     let cellContent: string = '<div style="cursor: pointer;"  ><i class="glyphicon glyphicon-eject" aria-hidden="true"></i></i></div>';
//     return cellContent
//   }
//   OnActionClick(email: TemplateRef<any>,$event)
//   {
//     this.modalRef = this.modalService.show(email)
//     this.CreateGridForModal()
//     this.BindDebterByID();
//   }
//   AutomaticAllocation(){
//     this.confirmation.ConfirmationPopup('Are you sure, Do you want Automatically Allocate All Credit to Invoice ?');
//   }
//   OnAccept($event){
//     this.AgLoad = false;
//     this.debtorservice.getDebtorTranctionByID(this.DebtorID).subscribe((resp: any) => {
//       console.log(this.RowData)
//       debugger;
//       this.RowData.forEach(element => {
//         element.allocatedAmountHome=element.unAllocatedAmountHome+ element.allocatedAmountHome;
//         element.unAllocatedAmountHome=element.transactionAmountHome- element.allocatedAmountHome
//        });
//       this.RowData = this.RowData;
//       this.Loading = false;
//       this.AgLoad = true;
//     }, (error) => {
      
//       console.error('Problem with the sevice. Please try later : ' + error);
//     });
  
// }


// CreateGridForModal(){
//   this.AgMoDalLoad = false;
  

//     this.ColumnForMoldal = [
//       { headerName: 'Invoice No.', field: 'transactionReferenceNumber', sortable: true, filter: true, checkboxSelection: false, editable: false },
//       { headerName: 'Date', field: 'transactionDate', sortable: true, filter: true, checkboxSelection: false, editable: false },
//       { headerName: 'Period ', field: '',  sortable: true, filter: true, checkboxSelection: false, editable: false},
     
//       { headerName: 'Due Date', field: 'dueDate', sortable: true, filter: true, checkboxSelection: false, editable: false },
//       { headerName: 'Amount ', field: 'transactionAmountHome', sortable: true, filter: true, checkboxSelection: false, editable: false },
//       { headerName: 'Allocated Amount', field: 'allocatedAmountHome', sortable: true, filter: true, checkboxSelection: false, editable: false },
//       { headerName: 'UnAllocated Amount', field: 'unAllocatedAmountHome', sortable: true, filter: true, checkboxSelection: false, editable: true ,cellClassRules: {'bold-and-red': 'x>1'}},
     
//       { headerName: 'Reference', field: '', sortable: true, filter: true, checkboxSelection: false, editable: false },
//     ];
// }
// Email(email: TemplateRef<any>) {
//   //Send Email
//   this.modalRef = this.modalService.show(email);

// } 
// closePopUp(){
//   this.modalRef.hide();
// }
// OnEditMoldaStoped($event)
// {
//   //alert("wwe");
//   //console.log($event)
// }
// SaveDebtorTransactionAllocations(){
//   this.RowData.forEach(element => {
//     debugger;
//     element.allocatedAmountHome=Number(element.unAllocatedAmountHome)+ Number(element.allocatedAmountHome);
//    // element.unAllocatedAmountHome=element.transactionAmountHome- element.allocatedAmountHome
//    });
// debugger;
//   this.debtorservice.debtorTransactionAllocations(this.RowData).subscribe((resp: any) => {
//     debugger;
//     if (resp.IsSuccess) {
//       this.toastr.success('Debtor Tranction Update successfully');
     
//     }
//     this.toastr.success('Debtor Tranction Update successfully');
//     this.BindDebterByID();
//     this.closePopUp();
//     });
// }
// }
