import { Component, OnInit } from '@angular/core';
import { RequisitionService } from 'src/app/inv/services/requisition.service';
import { CustomValidators } from 'ngx-custom-validators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LBSPURRequisitionApprovalLogs } from 'src/app/models/pur/lbs-pur-requisition-approval-logs';
import * as moment from 'moment';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';
@Component({
  selector: 'app-request-approval',
  templateUrl: './request-approval.component.html',
  styleUrls: ['./request-approval.component.css']
})
export class RequestApprovalComponent implements OnInit {
  Mode: any = 'List';
  RequestApprovalForm: FormGroup;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  Requisitions: any;
  PageSize: any;
  Currentpage: string;
  RequisitionApprovalLogic = new LBSPURRequisitionApprovalLogs();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private Requisitionservice: RequisitionService,
    private FB: FormBuilder, private sharedFormatterService: SharedFormatterService) {
  }

  ngOnInit() {
    console.log(this.RequisitionApprovalLogic.RequisitionNumber);
    this.AgLoad = false;
    this.Mode = "List";
    this.Currentpage = "0";
    this.PageSize = "50";
    this.ColumnDefs = [
      { headerName: 'Req No', field: 'requisitionNumber', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Date Created', field: 'dateCreated', sortable: true,  filter: true},
      { headerName: 'Expected Delivery Date', field: 'receiveBy', sortable: true, filter: true ,},
      { headerName: 'WareHouse Name', field: 'wareHouseName', sortable: true, filter: true },
      // { headerName: 'Amount', field: 'amount', sortable: true, filter: true },
      { headerName: 'Delivery Date', field: 'receiveBy', sortable: true, filter: true,},
      { headerName: 'Approver', field: 'nextApprover', sortable: true, filter: true },
      // { headerName: 'Created By', field: 'createdBY', sortable: true, filter: true},
      // { headerName: 'Date Created', field: 'dateCreated', sortable: true, filter: true},
      // { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus'},
      // { headerName: 'Amount', field: 'amount', type: 'gender'  },
      // { headerName: '', field: 'Delete', cellRenderer: this.CustomDeleteIconFunc, type: 'Action', hide: false }
      { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false }
    ];
    //this.BindRequisitions();
    this.BindRequisitionDetailsByLoginID();
    this.RequestApprovalForm = this.FB.group({
      ID: [''],
      CompanyID: ['-1'],
      RequisitionNumber: [''],
      WarehouseID: ['-1', CustomValidators.notEqual('-1')],
      RequisitionStatus: ['-1'],
      ReceiveBy: ['-1'],
      RequestedBy: ['-1'],
      VendorID: ['-1'],
      NextApprover: ['-1']
    });
  }
  dateFormatter(params) {
    return moment(params.value).format('DD/MM/yyyy'); //hh:mm:ss
  }
  cellEditorSelector(params) {

    if (params.data.type === 'gender') return {
      component: 'agRichSelectCellEditor',
      params: { values: ['0', '1'] }
    };

    return null;
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  BindRequisitionDetailsByLoginID() {
    debugger;
    this.AgLoad = false;
    this.Mode = "List";
    this.Requisitionservice.getRequestApproval(localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.Requisitionservice.getRequisitionDetailsByLoginID(LoginID).subscribe((resp: any) => {
      debugger;
      console.log(resp.data.nextApprover);
      this.Requisitions = resp.data.requisitiondetail;
      this.RowData = resp.data.requisitiondetail;
      console.log(this.RowData)
      this.RowData.forEach(element => {
        let dateCreated = {'value': element.dateCreated}
        element.dateCreated = this.sharedFormatterService.dateTimeFormatter(dateCreated);
        element.receiveBy = moment(element.receiveBy, ["MMM DD yyyy hh:mm A"]).format("DD/MM/yyyy hh:mm A").toString();
      });
      this.AgLoad = true;
    });
  }


  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-align-justify" aria-hidden="true"></i></i></div>';
    return cellContent
  }

  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }

  OnActionClick(event: any) {
    debugger;
    var colId = event.column.getId();
    if (colId == 'Edit') {
      debugger;
      this.Edit(event.data)
    }
  }
  Edit(event) {
    console.log(event);
    debugger;
    if (event.nextApprover == localStorage.getItem('LoginID')) {
      this.router.navigate(['/pur/requisition/' + event.requisitionNumber + ``]);
    }
    else {
      // this.router.navigate(['/pur/requestApproval/']);
    }
    // this.router.navigate(['/pur/requisition/'+ event + ``]);

  }
}
