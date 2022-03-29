import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { ServerRelationshipService } from '../services/server-relationship.service';
import { ServerRelationship } from 'src/app/models/pos/server-relationship';
import { CustomValidators } from 'ngx-custom-validators';
@Component({
  selector: 'app-server-relationship',
  templateUrl: './server-relationship.component.html',
  styleUrls: ['./server-relationship.component.css']
})
export class ServerRelationshipComponent implements OnInit {
  Loading: any = false;
  Mode: any = 'List';
  submitted: boolean;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  PageSize: any;
  CompanyID = localStorage.getItem('CompanyID');
  ColumnDefs;
  RowData: any;
  AccessTab: any;
  IsActive: boolean;
  HeaderNames: any;
  AgLoad: boolean = false;
  Currentpage: string;
  ServerForm: FormGroup;
  ServerRelationship: any;
  Servers: any;
  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    private deleteservice: DeleteRecordsService,
    private serverRelationshipService: ServerRelationshipService
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Mode = "List";
    this.HeaderNames = "Server";
    this.AccessTab = "Server";
    this.PageSize = "50";
    this.Currentpage = "0";
    this.CreateForm();
    this.AgGridColumn();
    this.BindServerRelationShips();
    this.BindServers();
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.ServerForm.enable();


      if (!this.all_Access) {
        if (!this.write_Access) {
          this.ServerForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.ServerForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  AgGridColumn() {
    this.ColumnDefs = [     
      { headerName: 'Host Server', field: 'server', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Destination Server', field: 'serverName', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'RelationShip Status', field: 'relationshipTypeStatus', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false, }
    ];
  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Edit(event.data.id);
    } else if (colId == 'Delete') {
      this.onDelete(event.data.id)
    }
  }
  CreateForm() {
    this.ServerForm = this.FB.group({
      ID: [''],
      CompanyID: [''],
      HostServer: ['-1', CustomValidators.notEqual('-1')],
      DestinationServer: ['-1', CustomValidators.notEqual('-1')],
      RelationshipType: [true],
      Status: [true]
    });
  }
  get f() { return this.ServerForm.controls; }

  BindServerRelationShips() {
    this.AgLoad = false;
    this.Mode = "List";
    this.serverRelationshipService.getServerRelationShips().subscribe((resp: any) => {
      console.log(resp);
      this.ServerRelationship = resp.data.server;
      this.RowData = resp.data.server;
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
 onDelete(ID) {
   this.deleteservice.deleteRecordsBYID(ID, 'LBS_REPL_ServerRelationship', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindServerRelationShips();
      this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  AddNew(): void {
    this.Mode = 'Add';
    this.ServerForm.enable();
    this.IsActive = true;
  }
  Cancel(): void {
    this.ResetForm();
    this.Mode = "List";
    this.BindServerRelationShips();
  }

  BindServers() {
    this.serverRelationshipService.getServers().subscribe((resp: any) => {
      this.Servers = resp.data.server;
     // this.ServerFrom = resp.data.server;
     // this.ServerTo = resp.data.server;
    }, (error) => {
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
 
  onSave(saveAction) {
    debugger
    this.submitted = true;
    if (this.ServerForm.invalid) {
      return;
    }
    this.Loading = true;
    let servers = new ServerRelationship();
    servers.CompanyID = this.CompanyID;
    servers.HostServer = this.ServerForm.get('HostServer').value;
    servers.DestinationServer = this.ServerForm.get('DestinationServer').value;
    servers.RelationshipType = this.ServerForm.get('RelationshipType').value;
    servers.Status = this.ServerForm.get('Status').value;   
    servers.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      debugger;
      this.serverRelationshipService.addServerRelationShip(servers).subscribe((resp: any) => {
        debugger
        if (resp.isSuccess) {
          this.toastr.success('Server Relationship added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindServerRelationShips();
            this.Mode = 'List';
            this.ResetForm();
          }
          else {
            debugger
            let ID = resp.data.id;
             this.Edit(ID);
            this.BindServerRelationShips();
            this.Mode = 'Edit';
          }
          this.Loading = false;
        }
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      debugger;
      servers.ID = this.ServerForm.get('ID').value;
      this.serverRelationshipService.updateServerRelationShip(servers).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Server Relationship updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindServerRelationShips();
          }
          else {
            let ID = this.ServerForm.get('ID').value;
            this.ResetForm();
            this.Edit(ID);
          }
        }

      }, (error) => {
        //console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    this.Loading = false;
  }
  Edit(ID): void {
    this.Mode = 'Edit';
    this.BindServerRelationShipByID(ID);
  }
  BindServerRelationShipByID(ID) {
    this.serverRelationshipService.getServerRelationShipByID(ID).subscribe((resp: any) => {
      console.log(resp);
      if (resp.isSuccess == true) {
        debugger;
        let servers: any = new ServerRelationship();
        servers = resp.data.server;
        this.ServerForm.patchValue({
          ID: servers.id,
          HostServer: servers.hostServer,
          DestinationServer: servers.destinationServer,
          RelationshipType: servers.relationshipType,
          Status: servers.status,
        });
        if (!servers.deleted) {
          this.ServerForm.enable();
          this.IsActive = true;
        } else {
          this.ServerForm.disable();
          this.IsActive = false;
        }
      }

    },
      (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
  }
  ResetForm() {
    this.ServerForm.patchValue({
      ID: '',
      CompanyID: '',
      HostServer: '-1',
      DestinationServer: '-1',
      RelationshipType: true,
      Status: true
    });
    this.ServerForm.markAsUntouched();
    this.ServerForm.markAsPristine();
    this.submitted = false;
  }

 
}
