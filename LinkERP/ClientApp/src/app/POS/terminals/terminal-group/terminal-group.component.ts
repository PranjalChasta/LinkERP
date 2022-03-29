import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { TerminalsService } from '../../services/terminals.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';

@Component({
  selector: 'app-terminal-group',
  templateUrl: './terminal-group.component.html',
  styleUrls: ['./terminal-group.component.css']
})
export class TerminalGroupComponent implements OnInit  {

  TerminalGroupForm: FormGroup;
  @Input() TerminalID: any;
  @Input() TerminalGroupID;
  @Input() WareHouseID;
  @Input() IsActive: boolean;
  @Output() onModeChange = new EventEmitter();
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  @Output() OnChangeAccessTab = new EventEmitter();
  @Output() OnEditOfTerminalGrp = new EventEmitter();
  @Output() OnAddOfTerminalGrp = new EventEmitter();
  Mode: any = 'List';
  submitted: boolean;
  Loading: any = false;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  CompanyId = localStorage.getItem('CompanyID');

  Currentpage: string;
  TerminalGroup: any;
  SelectedTerminalGroupID: any;
  IsActivebutton: boolean;
  @Input() IsTerminalActive: boolean;
  constructor(
    private toastrService: ToastrService,
    private FB: FormBuilder,
    private cryptoAes: CryptoAes,
    private terminalsServcie: TerminalsService,
    private deleteRecordsService: DeleteRecordsService,
  ) { }

  ngOnInit() {
    this.submitted = false;
    this.AgLoad = false;
    this.Currentpage = "0";
    this.Mode = "List";
    this.CreateForm();
    this.SetPermissions();
    this.AgGridColumns();
    this.BindTerminalGroup();
  }
  get f() { return this.TerminalGroupForm.controls; }
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
      this.TerminalGroupForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.TerminalGroupForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.TerminalGroupForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  CreateForm() {
    this.TerminalGroupForm = this.FB.group({
      ID: [''],
      GroupName: ['', Validators.required]
    });
  }
  //To Reset the Form after Add/Edit
  ResetForm() {
    this.TerminalGroupForm.patchValue({
      ID: '',
      GroupName: ''
    });
    this.TerminalGroupForm.markAsUntouched();
    this.TerminalGroupForm.markAsPristine();
    this.submitted = false;
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Group Name', field: 'groupName', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 80, },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction',hide: !this.IsTerminalActive }
    ];
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.SelectedTerminalGroupID = event.data.id;

      this.AgEdit(event.data);
      this.OnEdit();

      this.Mode = 'Edit';

    } else if (colId == 'Delete') {
      this.onDelete(event.data.id)

    } else if (colId == 'Save') {
      this.AgSave(event.data)
    }
  }
  //To Cancel the Page
  Cancel(): void {
    this.ResetForm();
    this.BindTerminalGroup();
    this.Mode = "List";
  }
  OnModeChanged() {
    this.onModeChange.emit('List');
  }
  OnEdit() {
    this.OnChangeAccessTab.emit('List');
    this.OnEditOfTerminalGrp.emit(this.SelectedTerminalGroupID);
  }
  Back() {
    this.OnModeChanged();
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  //To bind the data of all Terminal Group to the Grid.
  BindTerminalGroup() {
    this.AgLoad = false;
    this.terminalsServcie.getTerminalGroupByTerminalID(this.TerminalID).subscribe((resp: any) => {
      this.TerminalGroup = resp.data.terminalGroup;
      this.RowData = resp.data.terminalGroup;
      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //Add New  Terminal Group
  AddNew(): void {
    this.Mode = 'Add';
    this.IsActivebutton = true;
  }

  OnSubmit(saveAction) {
    this.submitted = true;
    if (this.TerminalGroupForm.invalid) {
      return;
    }
    let terminalGrp = {
      'ID': '',
      'GroupName': this.TerminalGroupForm.controls.GroupName.value,
      'TerminalID': this.TerminalID,
      'CompanyID': localStorage.getItem('CompanyID'),
      'CreatedBY':localStorage.getItem('LoginID')
    }

    //If the mode is Add then it will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.terminalsServcie.addTerminalGroup(terminalGrp).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastrService.success('Terminal Group added successfully')
         // this.submitted = false;
        //  this.Loading = false;
        
          if (saveAction == 'SaveNClose') {
            this.Cancel();
            //this.ResetForm();
            this.BindTerminalGroup();
            this.Mode = 'List';
          }
          else {
            this.Mode = 'Edit';
            // guru
   
            this.TerminalGroupID = resp.data.id;
            this.SelectedTerminalGroupID = this.TerminalGroupID;
            this.OnChangeAccessTab.emit('List');
           this.OnAddOfTerminalGrp.emit(this.SelectedTerminalGroupID);

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
      terminalGrp.ID = this.TerminalGroupForm.get('ID').value;
      this.terminalsServcie.updateTerminalGroup(terminalGrp).subscribe((resp: any) => {

        if (resp.isSuccess) {
          this.toastrService.success('Terminal Group updated successfully')
     
         // this.Loading = false;
         // this.submitted = false;
          if (saveAction == 'SaveNClose') {
            this.Cancel();
            //this.ResetForm();
            this.BindTerminalGroup();
            this.Mode = 'List';
          }
        }
        else {
          this.Mode = 'Edit';
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  AgEdit(event) {
    this.TerminalGroupForm.patchValue({
      ID: event.id,
      GroupName: event.groupName
    });
    this.Mode = 'Edit';
    if (event.deleteStatus == 'Active') {
      this.TerminalGroupForm.enable();
      this.IsActivebutton = true;
    } else {
      this.TerminalGroupForm.disable();
      this.IsActivebutton = false;
    }
    if (!this.IsTerminalActive) {
      this.TerminalGroupForm.disable();
    }
  }
  AgSave(event) {
    let terminalGrp = {
      'ID': 0,
      'GroupName': this.TerminalGroupForm.controls.GroupName.value,
      'TerminalID': this.TerminalID,
      //'CompanyID': localStorage.getItem('CompanyID')
    }
    this.terminalsServcie.updateTerminalGroup(terminalGrp).subscribe((resp: any) => {
      this.toastrService.success('Terminal Group updated successfully')
      {
        this.ResetForm();
        this.BindTerminalGroup();
        this.Mode = 'List';
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To delete a particular Workflow Approvers details
  onDelete(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SOP_TerminalGroups', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindTerminalGroup();
      this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

}
