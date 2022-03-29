import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, MaxLengthValidator } from '@angular/forms';
import { WorkflowService } from '../services/workflow.service';
import { LBSSYSWorkFlow } from 'src/app/models/sys/lbs-sys-work-flow';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit {
  Loading: any = false;
  Mode = 'List';
  submitted: boolean;
  WorkFlowForm: FormGroup;
  BindWorkFlow: any;
  LBSSYSWorkFlow: any[] = [];
  WorkflowID: any;
  AccessTab: any;
  SelectedWorkflowID: any;
  Workflow: any;
  HeaderNames: any;
  /* FOR Aggird Start */
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  /* FOR Aggird End  */
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  modalRef: BsModalRef;
  addreadonly: boolean;
  LineEditField: string;
  Workflowname:string;
  IsActive: boolean;
  PageSize: any;
  CompanyID = localStorage.getItem('CompanyID');
  Currentpage: string;
  constructor(private workflowservice: WorkflowService,
    private WorkFlowFB: FormBuilder,
    private toastrModule: ToastrModule,
    private toastrService: ToastrService,
    private deleteRecordsService: DeleteRecordsService,
    private cryptoAes: CryptoAes,
    public modalService: BsModalService
  ) { }

  ngOnInit() {
    this.submitted = false;
    this.AgLoad = false;
    this.Currentpage = "0";
    this.PageSize="50";
    this.AccessTab = "Workflow";
    this.HeaderNames = "Workflow";
    this.LineEditField="workFlowCode";
    this.CreateForm();
    this.SetPermissions();
    this.AgGridColumns();
    this.BindWorkFlows();  
  }
  get f() { return this.WorkFlowForm.controls; }
  SetPermissions() {
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
      this.WorkFlowForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.WorkFlowForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.WorkFlowForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  CreateForm() {
    this.WorkFlowForm = this.WorkFlowFB.group({
      ID: [''],
      WorkflowCode: ['', Validators.required],
      WorkFlowName: ['', Validators.required]
    });
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Code',field: 'workFlowCode', sortable: true, filter: true, checkboxSelection: false, },
      { headerName: 'Name', field: 'workFlowName', sortable: true, filter: true,  },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' , width: 85, },
      //  { headerName: '', field: 'Save', cellRenderer: this.CustomSaveIconFunc, type: 'Action', hide: false, width: 20, },
     // { headerName: '', field: 'Detail', cellRenderer: this.CustomDetailIconFunc, type: 'Action', hide: false },
       { headerName: '', field: 'Edit', type: 'EditAction', hide: false,  },
      { headerName: '', field: 'Delete', type: 'DeleteAction',  hide: !this.delete_Access}
    ];
  }

   //Add new Countries
   AddNew() {
    this.ResetForm();
    this.Mode = 'Add';
    this.IsActive=true;
    this.WorkFlowForm.enable();
   // this.addreadonly = false;
  }
  //To Cancel the Page
  Cancel() {
    this.ResetForm();
    this.submitted = false;
    this.BindWorkFlows();
    this.Mode = 'List';
  }
  CustomDetailIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-align-justify"></i></div>';
    return cellContent
  }
  CustomPriceIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-usd"></i></div>';
    return cellContent
  }
  //To Bind the data of all Workflow to the Grid
  BindWorkFlows() {
    this.Loading = true;
    this.AgLoad = false;
    this.workflowservice.getAllWorkFlows().subscribe((resp: any) => {
      this.BindWorkFlow = resp.data.workFlow;
      this.RowData = resp.data.workFlow;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  OnSaveall() {
    debugger;
    this.workflowservice.updateWorkFlowDetails(this.RowData).subscribe((resp: any) => {
      console.log(resp);
      if (!resp.isSuccess) {
        this.toastrService.warning(resp.message);
      //  this.BindWorkFlows();
      } else {
      this.toastrService.success('workflow added successfully');
     this.BindWorkFlows();
    // this.AgSave(this.SelectedWorkflowID);
      this.Mode = 'List';
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }



  //To save the State details to database table by calling the API service
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?',saveAction);
  }
  onSave(saveAction) {
    this.submitted = true;
    if (this.WorkFlowForm.invalid) {
      return;
    }
    this.Loading = true;
    let lBSSYSWorkFlow = new LBSSYSWorkFlow();
    lBSSYSWorkFlow.CompanyID = this.CompanyID;
    lBSSYSWorkFlow.CreatedBY = localStorage.getItem('LoginID');
    lBSSYSWorkFlow.WorkflowCode = this.WorkFlowForm.controls.WorkflowCode.value;
    lBSSYSWorkFlow.WorkFlowName = this.WorkFlowForm.controls.WorkFlowName.value;
    if (this.Mode == 'Add') {
      this.workflowservice.addWorkFlow(lBSSYSWorkFlow).subscribe((resp: any) => {
       if (resp.isSuccess) {
           this.toastrService.success('Workflow  added successfully')
        //   this.ResetForm();
        //   this.BindWorkFlows();
        //   this.Mode = 'List';
        //   this.Loading = false;
        if(saveAction=='Close'){
          this.Cancel();
          this.BindWorkFlows();
          this.Mode = 'List';
        }else{
          this.Edit(resp.data.id);
          this.BindWorkFlows();
          this.Mode = 'Edit';
        }
        this.Loading = false;
         } else {
          this.toastrService.warning('Workflow code  already exists')
          this.Loading = false;
        }
   
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    //To Edit a particular Workflow details By ID
    else if (this.Mode == 'Edit') {
      lBSSYSWorkFlow.ID = this.WorkFlowForm.get('ID').value;
      this.workflowservice.updateWorkFlow(lBSSYSWorkFlow).subscribe((resp: any) => {
        if (resp.isSuccess) {
        
          this.toastrService.success('Workflow  updated successfully');
          if(saveAction=='Close'){
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
          this.BindWorkFlows();
          }
          else{
            this.Edit(this.WorkFlowForm.get('ID').value)
          }
        }else {
          this.toastrService.warning('Workflow code already exists')
          this.Loading = false;
        }
    
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    this.Loading = false;
  }
 
  AgEdit(event) {

    this.WorkFlowForm.patchValue({
      ID: event.id,
      WorkflowCode: event.workFlowCode,
      WorkFlowName: event.workFlowName
    })
   
    this.Mode = 'Edit';
    //this.addreadonly = true;
  }
  //To delete a particular Workflow details
  onDeleteChecked(ID) {
    this.Loading = true;
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SYS_WorkFlow', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.Mode = 'List';
      this.BindWorkFlows();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To Reset the Form after Add/Edit
  ResetForm() {
    this.WorkFlowForm.patchValue({
      ID: '',
      WorkflowCode: '',
      WorkFlowName: ''
    });
    this.WorkFlowForm.markAsTouched();
    this.WorkFlowForm.markAsPristine();
    this.submitted = false;
  }
  onRowClicked(event: any) {
    console.log('row', event.data);
  }

  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.AccessTab = 'Workflow';
      this.Workflowname=event.data.workFlowName;
     // this.AgEdit(event.data);
     this.Edit(event.data.id);
      this.SelectedWorkflowID = event.data.id;
      this.Mode = 'Edit';
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    } else if (colId == 'Save') {
      this.AgSave(event.data)
    }
  }

  Edit(ID): void {
    this.BindWorkflowByID(ID);
    this.SelectedWorkflowID = ID;
    this.Mode = 'Edit';
    this.addreadonly = true;
  }
  BindWorkflowByID(ID) {
    this.workflowservice.getWorkFlowByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        let work: any = new LBSSYSWorkFlow();
        work = resp.data.workflow;
        this.SelectedWorkflowID = work.id;
        this.WorkFlowForm.patchValue({
          ID: work.id,
      WorkflowCode: work.workFlowCode,
      WorkFlowName: work.workFlowName
        });
       
       if(!work.deleted){
        this.WorkFlowForm.enable();
        this.IsActive=true;
      }else{
        this.WorkFlowForm.disable();
        this.IsActive=false;
      }
      }
    }, 
      (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
  }
  AgSave(event) {
    let lBSSYSWorkFlow = new LBSSYSWorkFlow();
    lBSSYSWorkFlow.ID = event.id;
    lBSSYSWorkFlow.WorkflowCode = event.workFlowCode;
    lBSSYSWorkFlow.WorkFlowName = event.workFlowName;
    this.workflowservice.updateWorkFlow(lBSSYSWorkFlow).subscribe((resp: any) => {
      this.toastrService.success('Workflow  updated successfully')
      {
        this.ResetForm();
        this.Mode = 'List';
        this.BindWorkFlows();
        this.Loading = false;
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  
  Cancelnew() {
    this.BindWorkFlows();
    this.Mode = 'List';
  }
  onModeChange(mode: any) {
    this.Mode = mode;
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }

  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-align-justify" aria-hidden="true"></i></i></div>';
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
  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  OnchangeCurrentpage(page){
    this.Currentpage=page;
      }
      OnEditStoped(event){
        console.log(event.data)
      }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
