import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SysCommonService } from '../../services/sys-common.service';
import { LBS_SYS_UserRoles } from 'src/app/models/sys/lbs-sys-user-roles';
import { UserService } from '../../services/user.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CustomValidators } from 'ngx-custom-validators';
@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css']
})
export class UserRoleComponent implements OnInit {

  UserRolesForm: FormGroup;
  userRolesList: any;
  ColumnDefs: any;
  RowData: any;
  AgLoad: boolean;
  submitted: boolean;
  @Input() SelectedUserID: any;
  @Input() write_Access: boolean;
  @Input() delete_Access: boolean;
  @Input()  DefaultCompanyID: any;
  @Input() IsActive: boolean;
  Currentpage: string;
  constructor(private sysCommonService: SysCommonService, private deleteRecordsService: DeleteRecordsService, private userService: UserService,
    private FB: FormBuilder) { }

  ngOnInit() {
    this.CreateUserRolesForm();
    this.Currentpage = "0";
    this.ColumnDefs = [
      { headerName: 'Role Code', field: 'roleCode', sortable: true, filter: true, checkboxSelection: false, width: 200 },
      { headerName: 'Role Name', field: 'roleName', sortable: true, filter: true, width: 200 },
      // { headerName: 'Email Address', field: 'emailAddress', sortable: true, filter: true },
      // { headerName: 'Phone Number', field: 'mobileNumber', sortable: true, filter: true }, 
      { headerName: '', field: 'Delete', cellRenderer: this.CustomDeleteIconFunc, type: 'DeleteAction', hide: !this.delete_Access, width: 50 }
    ];

    this.BindRoles();
    this.GetUserRolesByID();

  }
  CreateUserRolesForm() {
    this.UserRolesForm = this.FB.group({
      Roles: ['-1', CustomValidators.notEqual('-1')]
    });
  }
  Roles: any[] = [];
  BindRoles() {
    this.userService.getRolesByCompanyID(this.SelectedUserID,this.DefaultCompanyID).subscribe((resp: any) => {
      this.Roles = resp.data.roles;
      console.log(this.Roles)
    });
  }

  AddRoleModuleAccess() {
    console.log(this.UserRolesForm.get('Roles').value);
    let userRoles = new LBS_SYS_UserRoles();
    userRoles.LoginID = this.SelectedUserID;
    userRoles.RoleId = this.UserRolesForm.get('Roles').value;
    userRoles.CreatedBY = localStorage.getItem('LoginID');
    console.log(userRoles);
    this.userService.addUserRole(userRoles).subscribe((resp: any) => {
      //this.Roles = resp.data.roles;
      this.BindRoles();
      this.GetUserRolesByID()
    });
  }
  GetUserRolesByID() {
    /* this.ColumnDefs=[];
    this.RowData=[]; */
    this.AgLoad = false;
    this.userService.getUserRolesByID(this.SelectedUserID).subscribe((resp: any) => {
      console.log(resp.data.userRoles);
      this.RowData = resp.data.userRoles;
      this.AgLoad = true;
      this.userRolesList = resp.data.userRoles;

    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }

  OnActionClick(event: any) {
    console.log(event);
    var colId = event.column.getId();
    if (colId == 'Delete') {
      this.onDelete(event.data.id)
    }
  }

  onDelete(ID) {
    debugger;
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SYS_UserRoles', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.toastr.success('Currency  details deleted successfully');
      this.BindRoles();
      this.GetUserRolesByID();

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
}
