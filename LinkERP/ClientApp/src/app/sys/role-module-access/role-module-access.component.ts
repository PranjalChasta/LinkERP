import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RoleModuleAccessService } from '../services/role-module-access.service';
import { LbsSysRoleModuleAccess } from 'src/app/models/sys/lbs-sys-role-module-access';

@Component({
  selector: 'app-role-module-access',
  templateUrl: './role-module-access.component.html',
  styleUrls: ['./role-module-access.component.css']
})
export class RoleModuleAccessComponent implements OnInit {
  RoleModuleAccessForm: FormGroup;
  Mode: any = 'List';
  submitted: boolean;
  RowData: any;
  Roles:any[]=[];
  ColumnDefs;
  AgLoad: boolean = false
  constructor(private RoleModuleAccessService:RoleModuleAccessService,
    private RoleFB: FormBuilder) { }

  ngOnInit() {
    this.AgLoad = false;
    this.ColumnDefs = [
      { headerName: 'Role Name', field: 'roleName', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Module Name', field: 'moduleID', sortable: true, filter: true },
     { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false },
      { headerName: '', field: 'Delete', cellRenderer: this.CustomDeleteIconFunc, type: 'Action', hide: false }
    ];
   this.BindRoleModuleAccess();
    this.RoleModuleAccessForm = this.RoleFB.group({
      ID: [''],
      RoleName:[''],
      ModuleName:['']
    });
   
  }
  AddNew(): void {
    this.Mode = 'Add';
  }
  Edit(ID): void {
    
    this.Mode = 'Edit';
    this.BindRoleModuleAccessById(ID);
  }
  Cancel(){
    //this.ResetForm();
    this.Mode = 'List';
  }
  BindRoleModuleAccess(){
    
    this.Mode = 'List';
    this.AgLoad=false;
    
    this.RoleModuleAccessService.getRoleModuleaccess().subscribe((resp: any) => {
      console.log(resp.data.roles);
      this.Roles = resp.data.roles;
      this.RowData = resp.data.roles;
      this.AgLoad = true;
   //  this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  
 /* FOR Aggird Start */
 OnActionClick(event: any) {
  var colId = event.column.getId();
  if (colId == 'Edit') {
    this.Mode='Edit'
   this.Edit(event.data.id)
  } else if (colId == 'Delete') {
    this.onDeleteChecked(event.data.id)
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
/* FOR Aggird End  */

//To save the State details to database table by calling the API service
onSave() {
  
this.submitted = true;
if (this.RoleModuleAccessForm.invalid) {
  return;
}
//this.Loading = true;
let role = new LbsSysRoleModuleAccess();
role.RoleId = this.RoleModuleAccessForm.get('RoleName').value;
role.ModuleID = this.RoleModuleAccessForm.get('ModuleName').value;

// job.Status =this.Jobsform.get('Status').value;
if (this.Mode == 'Add') {
  this.RoleModuleAccessService.addRoleModuleAccess(role).subscribe((resp: any) => {
    if (resp.isSuccess) {
      alert('Job details saved successfully');
      //this.ResetForm();
      this.BindRoleModuleAccess();
      this.Mode = 'List';
   // this.Loading = false;
    }
  }
  );
}
else if (this.Mode == 'Edit') {
  role.ID = this.RoleModuleAccessForm.get('ID').value;
  this.RoleModuleAccessService.updateRoleModuleAccess(role).subscribe((resp: any) => {
    if (resp.isSuccess) {
      alert('Job  details updated successfully');
     //this.ResetForm();
      this.BindRoleModuleAccess();
      this.Mode = 'List';
    }
  }, (error) => {
  //  console.error('Problem with the sevice. Please try later : ' + error);
  });
}
}
//Delete the record
onDeleteChecked(ID) {
 // this.Loading = true;
  this.RoleModuleAccessService.deleteRoleModuleAccessByID(ID, localStorage.getItem('LoginID')).subscribe((resp: any) => {
    if (resp.isSuccess == true) {
      this.BindRoleModuleAccess();
    }
  //  this.Loading = false;
  }, (error) => {
  //  this.Loading = false;

    // console.error('Problem with the sevice. Please try later : ' + error.message);
  });
}

BindRoleModuleAccessById(ID) {
  

  this.RoleModuleAccessService.getRoleModuleAccessByID(ID).subscribe((resp: any) => {
    console.log(resp.data.job);
    // if (resp.isSuccess == true) {
    let roles: any = new LbsSysRoleModuleAccess();
    roles = resp.data.rolemodule;
    this.RoleModuleAccessForm.patchValue({
      ID: roles.id,
      RoleName:roles.companyID,
      ModuleName: roles.jobCode,
     
    });
    // }
  }, (error) => {
    console.error('Problem with the sevice. Please try later : ' + error);
  });
}

}
