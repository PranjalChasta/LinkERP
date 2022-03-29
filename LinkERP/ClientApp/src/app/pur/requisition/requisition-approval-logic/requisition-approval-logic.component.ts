import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { ToastrService } from 'ngx-toastr';
import { RequisitionApprovalLogicService } from '../../services/requisition-approval-logic.service';

@Component({
  selector: 'app-requisition-approval-logic',
  templateUrl: './requisition-approval-logic.component.html',
  styleUrls: ['./requisition-approval-logic.component.css']
})
export class RequisitionApprovalLogicComponent implements OnInit {
  @Input() RequisitionID: any;
  Requisitionsapproval: any[] = [];
  Mode: any = 'List';
  RequisitionApprovalLogicForm: FormGroup;
  AccessTab: string;
  Loading: any = false;
  submitted: boolean;

  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  CompanyID = localStorage.getItem('CompanyID');
  constructor(private FB: FormBuilder, private Approvalservice: RequisitionApprovalLogicService,
    private deleteRecordsService: DeleteRecordsService, private toastr: ToastrService) { }

  ngOnInit() {
    console.log(this.RequisitionID);
    this.AgLoad = false; 
    this.Createform();  
    this.GetAgColumns();
    this.BindRequisitionApprovalDetails();

  }
  GetAgColumns() {
    this.ColumnDefs = [
      { headerName: 'Requisition Number', field: 'requisitionID', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Approval Status', field: 'approvalStatus', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Next Approver', field: 'nextApprover', type: 'DeleteStatus' },
      { headerName: 'Requested By', field: 'requestedBy', type: 'DeleteStatus' },
      { headerName: 'Created BY', field: 'createdBY', type: 'DeleteStatus' }
    ];
  }
  Createform() {
    this.RequisitionApprovalLogicForm = this.FB.group({
      ID: [''],
      CompanyID: ['-1'],
      RequisitionID: [''],
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
  BindRequisitionApprovalDetails() {
    debugger;
    //this.Loading=true;
    this.AgLoad = false;
    this.Mode = "List";
    this.Approvalservice.getRequisitionApprovalLogicDetailsByRequisitionID(this.RequisitionID).subscribe((resp: any) => {
      this.Requisitionsapproval = resp.data.requisitionsapproval;
      this.RowData = resp.data.requisitionsapproval;
      console.log(this.Requisitionsapproval);
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      //   console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}
