import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TerminalsService } from '../services/terminals.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { LbsPosTerminal } from 'src/app/models/pos/lbs_pos_terminals';
import { CustomValidators } from 'ngx-custom-validators';

@Component({
  selector: 'app-terminals',
  templateUrl: './terminals.component.html',
  styleUrls: ['./terminals.component.css']
})
export class TerminalsComponent implements OnInit {
  TerminalForm: FormGroup;
  ColumnDefs;
  RowData: any;
  PageSize: any;
  Currentpage: any;
  AgLoad: boolean;
  Loading: any = false;
  Mode: any = 'List';
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  Warehouse: any;
  submitted: boolean;
  TerminalID: any;
  SaveAction: string;
  IsActive: boolean;
  AccessTab: string;
  SelectedTerminalID: any;
  SelectedTerminalGroupID;
  terminalGrpItemActive: boolean=false;
  wareHouseId: any;
  CompanyId = localStorage.getItem('CompanyID');
  constructor(
    private toastr: ToastrService,
    private terminalsServcie: TerminalsService,
    private cryptoAes: CryptoAes,
    public invCommonService: InvCommonService,
    private FB: FormBuilder,
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.AccessTab = "Terminal";
    this.CreateForm();
    this.GetAgColumns();
    this.GetTerminalsList();
    this.SetPermissions();
    this.BindWarehouse();
    this.Currentpage = "0";
    this.PageSize = "50";
  }
  get f() { return this.TerminalForm.controls; }

  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "404");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.TerminalForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.TerminalForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.TerminalForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  GetAgColumns() {
    this.ColumnDefs = [
      { headerName: 'Description', field: 'description', sortable: true, filter: true },
      { headerName: 'Warehouse', field: 'wareHouseName', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 80, },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction',hide: false }
    ];
  }

  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  AddNew(): void {
    this.Mode = 'Add';
    this.TerminalForm.get('Description').enable();
    this.TerminalForm.get('Warehouse').enable();
    this.IsActive = true;
  }
  CreateForm() {
    this.TerminalForm = this.FB.group({
      ID: [''],
      Description: ['', Validators.required],
      Warehouse: ['-1',CustomValidators.notEqual('-1')]
    });
  }

  //Resetting the form after Add/Edit
  ResetForm() {
    this.TerminalForm.patchValue({
      ID: '',
      Description: '',
      Warehouse: '-1'
    });
    this.TerminalForm.markAsUntouched();
    this.TerminalForm.markAsPristine();
    this.submitted = false;
  }

  BindWarehouse() {
    this.invCommonService.getWareHouse().subscribe((resp: any) => {
      this.Warehouse = resp.data.warehouse;
    })
  }
  GetTerminalsList() {
    this.Loading = true;
    this.AgLoad = false;
    this.terminalsServcie.GetTerminalsList().subscribe((res: any) => {
      this.RowData = res.data.terminals;

      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });

  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    debugger;
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.wareHouseId=event.data.warehouse;
      this.AgEdit(event.data)
      this.AccessTab = 'Terminal';
      //this.Workflowname=event.data.workFlowName;
      this.SelectedTerminalID = event.data.id;
    } else if (colId == 'Delete') {
      this.onDeleteTerminal(event.data.id)
    }
  }

  AgEdit(event) {
    this.TerminalForm.patchValue({
      ID: event.id,
      Description: event.description,
      Warehouse: event.warehouse
    });
    this.TerminalID = event.id;
    this.Mode = 'Edit';
    //  this.readonly = true;
    if (event.deleteStatus == 'Active') {
      this.TerminalForm.enable();
      this.IsActive = true;
    } else {
      this.TerminalForm.disable();
      this.IsActive = false;
    }
  }
  //Delete the record
  onDeleteTerminal(ID) {
    this.Loading = true;
    this.terminalsServcie.deleteRecordsBYID(ID,'LBS_SOP_Terminals', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.GetTerminalsList();
      }
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }
  Cancel(): void {
    this.TerminalForm.reset();
    this.ResetForm();
    this.GetTerminalsList();
    this.Mode = "List";
  }
  OnSubmit( ) {
    this.submitted = true;
    if (this.TerminalForm.invalid) {
      return;
    }
   // this.Loading = true;
    let terminal = new LbsPosTerminal();
    terminal.CompanyID = this.CompanyId;
    terminal.Description = this.TerminalForm.get('Description').value;
    terminal.Warehouse = this.TerminalForm.get('Warehouse').value;
    terminal.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      this.terminalsServcie.addTerminals(terminal).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success(resp.message);
          if (this.SaveAction == 'SaveNClose') {
            this.Cancel();
           // this.ResetForm();
            this.GetTerminalsList();
            this.Mode = 'List';
           
          }
          else {
            this.TerminalID = resp.data.id;
           this.wareHouseId=terminal.Warehouse;
            this.SelectedTerminalID=this.TerminalID;
            this.GetTerminalsList();
            // this.readonly = true;
            this.Mode = 'Edit';
          }
         // this.submitted = false;
          this.Loading = false;
        }

      }, (error) => {
        this.Loading = false;
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      terminal.ID = this.TerminalForm.get('ID').value;
      this.terminalsServcie.updateTerminals(terminal).subscribe((resp: any) => {
        this.toastr.success('Terminal details updated successfully');
        // this.BindRoles();
        //this.RoleForm.get('RoleCode').enable();
        if (this.SaveAction == 'SaveNClose') {
          this.Cancel();
         // this.ResetForm();
          this.Mode = 'List';
          this.submitted = false;
          this.GetTerminalsList();
        }
        else {
          this.Mode = 'Edit';
        }
      }, (error) => {
      });
      this.submitted = false;
    }
  }
  OnChangeAccessTab(){
    this.terminalGrpItemActive=true;
  }
  OnEditOfTerminalGrp($event){
    this.SelectedTerminalGroupID=$event;
  }
  onBackBtnClicked(){
    this.terminalGrpItemActive=false;
  }
  OnAddOfTerminalGrp($event){
   
    this.SelectedTerminalGroupID =$event;
  }
}
