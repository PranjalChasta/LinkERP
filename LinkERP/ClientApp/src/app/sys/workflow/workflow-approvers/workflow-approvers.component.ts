import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowApproversService } from '../../services/workflow-approvers.service';
import { ToastrService } from 'ngx-toastr';
import { WorkflowService } from '../../services/workflow.service';
import { LBSSYSWorkFlowApprovers } from 'src/app/models/sys/lbs-sys-work-flow-approvers';
import { UserService } from '../../services/user.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-workflow-approvers',
  templateUrl: './workflow-approvers.component.html',
  styleUrls: ['./workflow-approvers.component.css']
})
export class WorkflowApproversComponent implements OnInit {
  Mode: any = 'List';
  Submitted: boolean;
  Loading: any = false;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  CompanyId = localStorage.getItem('CompanyID');
  BindWorkFlow: any;
  WorkFlows: any;
  Users: any;
  UsersList: any;
  Login: any;
  BindLoginUsersforWorkflowApprover: any;
  IsActiveApproves:boolean;
  BindWorkflowApprover: any;
  WorkflowApproverForm: FormGroup;
  @Input() WorkflowID: any;
  @Input() Workflowname: string;
  SelectedWorkflowID: any;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  @Output() onModeChange = new EventEmitter();
  modalRef: BsModalRef;
  @Input() IsActive: boolean;
  Currentpage: string;
  constructor(
    private workflowApproversService: WorkflowApproversService,
    private toastrService: ToastrService,
    private FB: FormBuilder,
    private workflowservice: WorkflowService,
    private userService: UserService,
    private deleteRecordsService: DeleteRecordsService,
    private cryptoAes: CryptoAes,
    public modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.Submitted = false;
    this.AgLoad = false;
    this.Currentpage = "0";
    this.Mode = "List";
    this.CreateForm();
    this.SetPermissions();
    if(!this.IsActive)
    {
      this.delete_Access=false;
    }
    this.AgGridColumns();
    this.BindWorkflowApprovers();
   
    //this.getUsers(); 
  }
  get f() { return this.WorkflowApproverForm.controls; }
  SetPermissions() {
    debugger
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "107");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.WorkflowApproverForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.WorkflowApproverForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.WorkflowApproverForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  CreateForm() {
    this.WorkflowApproverForm = this.FB.group({
      ID: [''],
      // WorkFlowName: ['-1'],
      LoginID: ['-1', CustomValidators.notEqual('-1')],
      ApproverSequence: ['', Validators.required],
      ApproverLimit: ['']
    });
  }
  AgGridColumns() {
    this.ColumnDefs = [
      // { headerName: 'Workflow', field: 'workFlowName', sortable: true, filter: true, checkboxSelection: false,editable:false },
      { headerName: 'Approver', field: 'loginName', sortable: true, filter: true, checkboxSelection: false,   },
      { headerName: 'Approver Sequence', field: 'approverSequence', sortable: true, filter: true, checkboxSelection: false,cellStyle: { textAlign: 'left' },  },
      { headerName: 'Approver Limit ($)',field: 'approverLimittext', sortable: true, filter: true, checkboxSelection: false, cellStyle: { textAlign: 'left' },},
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 80, },
      { headerName: '', field: 'Edit', type: 'EditAction', hide:  !this.IsActive },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }

  //To Cancel the Page
  Cancel(): void {
    this.ResetForm();
    this.Mode = "List";
  }
  //Add New  Workflow Approvers  
  AddNew(): void {
    this.Mode = 'Add';
    this.IsActiveApproves=true;
    this.BindLoginUsersforWorkflowApprovers(this.WorkflowID, "LoginID");
    this.WorkflowApproverForm.enable();
    this.ResetForm();
  }
  //Bind Users
  getUsers() {
    this.userService.getUsers().subscribe((resp: any) => {
      this.Users = resp.data.users;
      this.Login = resp.data.users;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  /*  BindWorkFlows() {
     this.Loading = true;
     this.AgLoad = false;
     this.workflowservice.getAllWorkFlows().subscribe((resp: any) => {
       this.BindWorkFlow = resp.data.workFlow;
       this.WorkFlows = resp.data.workFlow;
       this.RowData = resp.data.workFlow;
       this.AgLoad = true;
       this.Loading = false;
     }, (error) => {
       console.error('Problem with the sevice. Please try later : ' + error);
     });
   } */

  //To bind the data of all Workflow Approvers to the Grid.
  BindWorkflowApprovers() { 
    debugger;
    this.AgLoad = false;
    this.workflowApproversService.getWorkflowApproversByWorkflowID(this.WorkflowID).subscribe((resp: any) => {
      this.BindWorkflowApprover = resp.data.workflowapprovers;
      this.RowData = resp.data.workflowapprovers;
      this.AgLoad = true;


    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //This method is for not getting the repeated Users in dropdown
  BindLoginUsersforWorkflowApprovers(ID, LoginID) {
    this.workflowApproversService.getLoginUsersforworkflowApprovers(ID, LoginID).subscribe((resp: any) => {
      debugger;
      this.UsersList = resp.data.workflowapprovers;

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To Save the Workflow Approvers to database table by calling the API service
  onSaveold() {
    this.confirmation.ConfirmationPopup('Are you sure to save record?');
  }
  onSave() {
    debugger;
    this.Submitted = true;
    if (this.WorkflowApproverForm.invalid) {
      return;
    }
    let workflowApprovers = new LBSSYSWorkFlowApprovers();
    workflowApprovers.WorkflowID = this.WorkflowID;
    workflowApprovers.CreatedBY = localStorage.getItem('LoginID');
    workflowApprovers.LoginID = this.WorkflowApproverForm.controls.LoginID.value;
    workflowApprovers.ApproverSequence = this.WorkflowApproverForm.controls.ApproverSequence.value;
    workflowApprovers.ApproverLimit = this.WorkflowApproverForm.controls.ApproverLimit.value;
    //If the mode is Add then it will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.workflowApproversService.addWorkflowApprovers(workflowApprovers).subscribe((resp: any) => {
        /* this.toastrService.success('Workflow Approvers  added successfully')
        {
          this.ResetForm();
          this.BindWorkflowApprovers();
          this.BindLoginUsersforWorkflowApprovers(this.WorkflowID,"LoginID");
          this.Mode = 'List';
          this.Loading = false;

          
        } */
        if (resp.isSuccess) {
          this.toastrService.success('Workflow Approvers  added successfully')
          {
            this.ResetForm();
            this.BindWorkflowApprovers();
            this.BindLoginUsersforWorkflowApprovers(this.WorkflowID, "LoginID");
            this.Mode = 'List';
            this.Loading = false;
          }
        }
        else if (!resp.isSuccess) {
          this.toastrService.warning(resp.message)
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    else if (this.Mode == 'Edit') {
      workflowApprovers.ID = this.WorkflowApproverForm.get('ID').value;
      this.workflowApproversService.updateWorkflowApprovers(workflowApprovers).subscribe((resp: any) => {
        /* this.toastrService.success('Workflow Approvers updated successfully')
        {
          this.ResetForm();
          this.BindWorkflowApprovers();
          this.Mode = 'List';
        } */
        if (resp.isSuccess) {
          this.toastrService.success('Workflow Approvers updated successfully')
          {
            this.ResetForm();
            this.BindWorkflowApprovers();
            this.BindLoginUsersforWorkflowApprovers(this.WorkflowID, "LoginID");
            this.Mode = 'List';
            this.Loading = false;
          }
        }
        else if (!resp.isSuccess) {
          this.toastrService.warning(resp.message)
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  //To delete a particular Workflow Approvers details
  onDelete(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SYS_WorkFlowApprovers', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindWorkflowApprovers();
      this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  SelectedApproverName: any;
  AgEdit(event) {
    this.SelectedApproverName = event.loginName;
    this.BindLoginUsersforWorkflowApprovers(this.WorkflowID, event.loginID);
    var ApproverLimit = event.approverLimit.toFixed(Math.max(((event.approverLimit + '').split(".")).length, 4));
    this.WorkflowApproverForm.patchValue({
      ID: event.id,
      WorkFlowName: event.workflowID,
      LoginID: event.loginID,
      ApproverSequence: event.approverSequence,
      ApproverLimit: ApproverLimit
    });
    this.Mode = 'Edit';
    debugger;
    if(!event.deleted){
      this.WorkflowApproverForm.enable();
      this.IsActiveApproves=true
    }else{
      this.WorkflowApproverForm.disable();
      this.IsActiveApproves=false;
    }
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
debugger;
    if (colId == 'Edit') {
      this.SelectedWorkflowID = event.data.id;
      this.AgEdit(event.data);
      this.Mode = 'Edit';

    } else if (colId == 'Delete') {
      this.onDelete(event.data.id)

    } else if (colId == 'Save') {
      this.AgSave(event.data)
    }
  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  CustomSaveIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-save"></i></div>';
    return cellContent
  }
  /* FOR Aggird End  */

  //To Reset the Form after Add/Edit
  ResetForm() {
    this.WorkflowApproverForm.patchValue({
      ID: '',
      WorkFlowName: '-1',
      LoginID: '-1',
      ApproverSequence: '',
      ApproverLimit: ''
    });
    this.WorkflowApproverForm.markAsUntouched();
    this.WorkflowApproverForm.markAsPristine();
    this.Submitted = false;
  }
  AgSave(event) {
    let workflowApprovers = new LBSSYSWorkFlowApprovers();
    workflowApprovers.ID = event.id;
    workflowApprovers.WorkflowID = event.workflowID;
    workflowApprovers.LoginID = event.loginID;
    workflowApprovers.ApproverSequence = event.approverSequence;
    workflowApprovers.ApproverLimit = event.approverLimit;
    this.workflowApproversService.updateWorkflowApprovers(workflowApprovers).subscribe((resp: any) => {
      this.toastrService.success('Workflow Approvers updated successfully')
      {
        this.ResetForm();
        this.BindWorkflowApprovers();
        this.Mode = 'List';
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  OnModeChanged() {
    this.onModeChange.emit('List');
  }
  Back() {
    this.OnModeChanged();
  }
  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  OnchangeApprover(val) {
    let x = this.numberWithCommas(val)
    this.WorkflowApproverForm.patchValue({
      ApproverLimit: x
    });
  }
  numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
