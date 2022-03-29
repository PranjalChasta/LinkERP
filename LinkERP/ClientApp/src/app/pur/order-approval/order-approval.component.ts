import { Component, OnInit } from '@angular/core';
import { CustomValidators } from 'ngx-custom-validators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RequisitionService } from 'src/app/inv/services/requisition.service';
import * as moment from 'moment';
import { SharedFormatterService } from '../../shared/services/shared-formatter.service';
import * as config from 'src/assets/config.json';

@Component({
  selector: 'app-order-approval',
  templateUrl: './order-approval.component.html',
  styleUrls: ['./order-approval.component.css']
})
export class OrderApprovalComponent implements OnInit {
  Mode: any = 'List';
  OrderApprovalForm: FormGroup;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  Requisitions: any;
  PageSize: any;
  Currentpage: string;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private Requisitionservice: RequisitionService,
    private FB: FormBuilder,
    private sharedFormatterService: SharedFormatterService  ) { }

  ngOnInit() {
    this.getOrderApprovalByLoginID();
    this.AgLoad = false;
    this.Mode = "List";
    this.Currentpage = "0";
    this.PageSize = "50";
    this.ColumnDefs = [
      { headerName: 'Purchase Order Number', field: 'purchaseOrderNumber', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Date Created', field: 'dateCreated', sortable: true, filter: true },
      { headerName: 'Expected Delivery Date', field: 'expectedDeliveryDate', sortable: true, filter: true },
      { headerName: 'WareHouse Description', field: 'wareHouseName', sortable: true, filter: true },
      { headerName: 'Amount', field: 'amount', sortable: true, filter: true },
      { headerName: 'Delivery Date', field: 'expectedDeliveryDate', sortable: true, filter: true },
      { headerName: 'createdBY', field: 'createdBY', sortable: true, filter: true },
       { headerName: 'Awaiting Approval From', field: 'nextApprover', sortable: true, filter: true},
      // { headerName: 'Date Created', field: 'dateCreated', sortable: true, filter: true},
      // { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus'},
      // { headerName: 'Amount', field: 'amount', type: 'gender'  },
      // { headerName: '', field: 'Delete', cellRenderer: this.CustomDeleteIconFunc, type: 'Action', hide: false }
     // { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false }
     { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false }
    ];

    this.OrderApprovalForm = this.FB.group({
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
    return moment(params.value,'DD-MM-yyyy HH:mm:ss').format('DD/MM/yyyy'); //hh:mm:ss
  }
  getOrderApprovalByLoginID() {
    debugger;
    this.AgLoad = false;
    this.Mode = "List";
    this.Requisitionservice.getOrderApproval(localStorage.getItem('LoginID')).subscribe((resp: any) => {
      debugger;
      this.Requisitions = resp.data.requisitiondetail;
      this.RowData = resp.data.requisitiondetail;
      this.RowData.forEach(element => {
        let dateCreated = { 'value': element.dateCreated }
        let expectedDeliveryDate = { 'value': element.expectedDeliveryDate }
        element.dateCreated = this.DateChangeFormate(dateCreated.value);
        element.expectedDeliveryDate = this.DateChangeFormate(expectedDeliveryDate.value);;
      });


      this.AgLoad = true;
    });
  }

  DateChangeFormate(expectedDeliveryDate) {
    let t = expectedDeliveryDate.split(/[- :]/).map(x => parseInt(x));
    let d = new Date(t[2],(t[1]-1),t[0],t[3],t[4],t[5]);
    let result = moment(d).format(config.DateTimeFormat.GridDate).toString() + ' ' + moment(d).format(config.DateTimeFormat.GridTime).toString();
    return result;
  }

  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-align-justify" aria-hidden="true"></i></i></div>';
    return cellContent
  }
  OnActionClick(event){
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
      this.router.navigate(['/pur/purchase-order/' + event.id+ ``]);
    }
    }



}
