import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PurchaseApprovalLogicService } from '../../services/purchase-approval-logic.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { ToastrService } from 'ngx-toastr';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';
@Component({
  selector: 'app-purchase-approval-logic',
  templateUrl: './purchase-approval-logic.component.html',
  styleUrls: ['./purchase-approval-logic.component.css']
})
export class PurchaseApprovalLogicComponent implements OnInit {
  @Input() PurchaseOrderID: any;
  @Input() IsParentIsactive : boolean;
  PurchaseApprovalLogicForm:FormGroup;
  Purchaseapproval:any[]=[];
    Mode: any = 'List';
  AccessTab: string;
  Loading: any = false;
  submitted: boolean;

  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  CompanyID = localStorage.getItem('CompanyID');
  constructor( private FB: FormBuilder,
   private Approvalservice: PurchaseApprovalLogicService,
    private deleteRecordsService: DeleteRecordsService, private toastr: ToastrService,private sharedFormatterService: SharedFormatterService) { }

  ngOnInit() {
     console.log(this.PurchaseOrderID);
    this.AgLoad = false; 
    this.Createform();  
    this.GetAgColumns();
    this.BindPurchaseApprovalLogicDetails();
  }
 GetAgColumns() {
    this.ColumnDefs = [
      { headerName: 'Purchase Order', field: 'purchaseOrderNumber', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Approval ', field: 'statusName', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Next Approver', field: 'nextApprover', type: 'DeleteStatus' },
   //   { headerName: 'Next Approver', field: 'nextApprover', type: 'DeleteStatus' },
   //   { headerName: 'Requested By', field: 'requestedBy', type: 'DeleteStatus' },
      { headerName: 'Created BY', field: 'createdBY', type: 'DeleteStatus' },
      { headerName: 'Approval Date', field: 'approvalDate', sortable: true, filter: true, valueFormatter: this.sharedFormatterService.dateFormatter },
    ];
  }
  Createform() {
    this.PurchaseApprovalLogicForm = this.FB.group({
      ID: [''],
      CompanyID: ['-1'],
      PurchaseOrderID : [''],
      ApprovalStatus: ['']
    });
  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  

    BindPurchaseApprovalLogicDetails() {
    debugger;
    //this.Loading=true;
    this.AgLoad = false;
    this.Mode = "List";
    this.Approvalservice.getPurchaseApprovalLogic(this.PurchaseOrderID).subscribe((resp: any) => {
      this.Purchaseapproval = resp.data.purchaseapprovallogic;
      this.RowData = resp.data.purchaseapprovallogic;
      console.log(this.Purchaseapproval);
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      //   console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}
