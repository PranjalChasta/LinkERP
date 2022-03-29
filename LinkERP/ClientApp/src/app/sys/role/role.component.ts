import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RoleService } from '../services/role.service';
import { LbsSysRole } from '../../models/sys/lbs-sys-role';
import { SysCommonService } from '../services/sys-common.service';
import { LBSSYSRoleCompanyAccess } from '../../models/sys/lbs-sys-role-company-access';
import { LbsSysRoleModuleAccess } from '../../models/sys/lbs-sys-role-module-access';
import { LBS_SYS_RoleCompanyWarehouseAccess } from '../../models/sys/LBS_SYS_RoleCompanyWarehouseAccess';
import { LbsSysRoleMenuAccess } from '../../models/sys/lbs-sys-role-menu-access';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { CryptoAes } from 'src/app/directives/crypto-aes';

import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  RoleForm: FormGroup;
  Loading: any = false;
  Mode: any = 'List';
  submitted: boolean;
  // deleted: boolean;
  roles: any[] = [];
  Roles: any;
  LbsSysRole: any;
  checkedPReturnDate: boolean[] = [];
  /* FOR Aggird Start */
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;/* FOR Aggird End  */
  // checkedPReturnDate: boolean[] = [];
  selectedOrganisation: any;
  AccessTab: any = 'Organisation';
  modalRef: BsModalRef;
  readonly: boolean;
  IsActive: boolean;
  PageSize: any;
  Currentpage: string;
  DeleteCompanyRole: any = [];
  DeleteModuleID: any = [];
  DeleteWarehouseID: any = [];//"00000000-0000-0000-0000-000000000000";
  Warehouse: any[] = [];
  constructor(
    private Roleservice: RoleService,
    private sysCommonService: SysCommonService,
    private FB: FormBuilder,
    private toastr: ToastrService,
    public modalService: BsModalService,
    private cryptoAes: CryptoAes
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Currentpage = "0";
    this.PageSize = "50";
    this.CreateForm();
    this.SetPermissions();
    this.GridColumns();
    this.BindRoles();

  }
  GridColumns() {
    this.ColumnDefs = [
      { headerName: 'Role Code', field: 'roleCode', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Role Name', field: 'roleName', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 70, },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "102");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.RoleForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.RoleForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.RoleForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  CreateForm() {
    this.RoleForm = this.FB.group({
      ID: [''],
      RoleCode: ['', Validators.required],
      RoleName: ['', Validators.required]
    });
  }
  //Resetting the form after Add/Edit
  ResetForm() {
    this.RoleForm.patchValue({
      ID: '',
      RoleCode: '',
      RoleName: ''
    });
    this.RoleForm.markAsUntouched();
    this.RoleForm.markAsPristine();
    this.submitted = false;
  }

  get f() { return this.RoleForm.controls; }
  AddNew(): void {
    this.Mode = 'Add';
    this.RoleForm.get('RoleCode').enable();
    this.RoleForm.get('RoleName').enable();
    // this.readonly = false;
    this.IsActive = true;
    this.ResetForm();
  }
  Edit(ID): void {
    this.BindRoleByID(ID);
    this.Mode = 'Edit';

    // this.readonly = true;
    //this.RoleForm.get('RoleCode').disable();
  }
  Cancel(): void {
    this.RoleForm.reset();
    this.Mode = "List";
    // this.RoleForm.get('RoleCode').enable();
    this.Organisations = [];
    this.RoleCompanyAccess = [];
    this.TempOrganisations = [];

    this.Modules = [];
    this.Warehouse = [];
    this.RoleModuleAccess = [];
    this.RoleWarehouseAccess = [];
    this.AllModules = [];
    this.AllWarehouse = [];

    this.SelectedRoleMenuAccess = [];
    this.SelectedModule = null;
    this.MenuAccessModules = [];
    this.RoleMenuAccess = [];
    this.DeleteCompanyRole = [];
    this.DeleteModuleID = [];
    this.DeleteWarehouseID = [];
  }
  BindRoles() {
    this.Loading = true;
    this.AgLoad = false;
    this.Roleservice.getAllRoles().subscribe((resp: any) => {
      console.log(resp.data.roles);
      this.RowData = resp.data.roles;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindRoleByID(ID) {
    this.Roleservice.getRoleByID(ID).subscribe((resp: any) => {
      let roles: any = new LbsSysRole();
      roles = resp.data.roles;
      this.RoleForm.patchValue({
        ID: roles.id,
        RoleCode: roles.roleCode,
        RoleName: roles.roleName
      });
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //Delete the record
  onDeleteChecked(ID) {
    this.Loading = true;
    this.Roleservice.deleteRoleByID(ID, localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.BindRoles();
      }
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }
  onSave() {
    this.confirmation.ConfirmationPopup('Are you sure to save record?');
  }
  RoleID: any;
  SaveAction: any = 'Save';
  OnAccept() {
    debugger;
    this.submitted = true;
    if (this.RoleForm.invalid) {
      return;
    }
    this.Loading = true;
    let role = new LbsSysRole();
    role.RoleCode = this.RoleForm.get('RoleCode').value;
    role.RoleName = this.RoleForm.get('RoleName').value;
    role.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      this.Roleservice.addRoles(role).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success(resp.message);
          if (this.SaveAction == 'SaveNClose') {
            this.ResetForm();
            this.BindRoles();
            this.Mode = 'List';
          }
          else {
            this.BindRoles();
            this.RoleID = resp.data.id;
            // this.readonly = true;
            this.Mode = 'Edit';
          }
          this.submitted = false;
          this.Loading = false;
        }
        else {
          this.toastr.warning('Role Code already exists');
          this.Loading = false;
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      role.ID = this.RoleForm.get('ID').value;
      this.Roleservice.updateRoles(role).subscribe((resp: any) => {
        //console.log(resp);

        this.toastr.success('Role details updated successfully');
        // this.BindRoles();
        //this.RoleForm.get('RoleCode').enable();
        if (this.SaveAction == 'SaveNClose') {
          this.BindRoles();
          this.ResetForm();
          this.Mode = 'List';
          this.submitted = false;
        }
        else {
          this.Mode = 'Edit';
        }
      }, (error) => {
      });
      //this.OnDeleteCompany();
      this.SaveRoleCompanyAccess();
      this.SaveRoleModulesAccess();
      this.SaveRoleMenuAccess();
      this.SaveRoleWarehouseAccess();

      this.submitted = false;
    }
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    console.log(event);
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.AgEdit(event.data);
      this.AccessTab = 'Organisation';
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
  //RoleID: any;
  AgEdit(event) {
    this.RoleForm.patchValue({
      ID: event.id,
      RoleCode: event.roleCode,
      RoleName: event.roleName
    });
    debugger;
    this.RoleID = event.id;
    this.Mode = 'Edit';
    //  this.readonly = true;
    if (event.deleteStatus == 'Active') {
      this.RoleForm.enable();
      this.IsActive = true;
    } else {
      this.RoleForm.disable();
      this.IsActive = false;
    }
  }

  Organisations: any[] = [];
  RoleCompanyAccess: any[] = [];
  TempOrganisations: any[] = [];
  DeletedRoleCompanyAccess: any[] = [];
  DeleteCompany(DeleteCompanyRole) {
    //this.DeleteCompanyRole=DeleteCompanyRole
    this.DeleteCompanyRole.push(DeleteCompanyRole);
  }
  OnDeleteModuleId(ModuleID) {
    // this.DeleteModuleID=ModuleID;
    this.DeleteModuleID.push(ModuleID)


  }
  CompaniesChange(organisation: any[]) {
    this.Organisations = organisation;
  }
  RoleCompanyAccessChange(roleCompanyAccess: any[]) {
    debugger;
    this.RoleCompanyAccess = roleCompanyAccess;
  }
  TempCompaniesChange(tempCompanies: any[]) {
    this.TempOrganisations = tempCompanies;
  }
  DeletedRoleCompanyAccessValueChange(deletedRoleCompanyAccess: any[]) {
    debugger;
    this.DeletedRoleCompanyAccess = deletedRoleCompanyAccess;
  }
  SaveRoleCompanyAccess() {
    this.Loading = true;
    debugger;
    console.log(this.RoleCompanyAccess)
    console.log(this.TempOrganisations)
    let lstLBSSYSRoleCompanyAccess: LBSSYSRoleCompanyAccess[] = [];
    this.RoleCompanyAccess.forEach(rca => {
      let lBSSYSRoleCompanyAccess = new LBSSYSRoleCompanyAccess();
      lBSSYSRoleCompanyAccess.RoleID = this.RoleID;
      lBSSYSRoleCompanyAccess.CompanyID = rca.companyID;
      lBSSYSRoleCompanyAccess.CreatedBY = localStorage.getItem('LoginID');
      lstLBSSYSRoleCompanyAccess.push(lBSSYSRoleCompanyAccess)
    });
    this.Roleservice.addRoleCompanyAccess(lstLBSSYSRoleCompanyAccess).subscribe((resp: any) => {
      this.Loading = false;
      //  this.Cancel();
      this.OnDeleteCompany();
    }, (error) => {
      this.Loading = false;
      //console.error('Problem with the sevice. Please try later : ' + error);
    });

  }
  OnDeleteCompany() {
    this.DeleteCompanyRole.forEach(element => {
      this.Roleservice.DeleteRoleCompanyAccess(element, this.RoleID).subscribe((resp: any) => {
        this.Loading = false;
        this.DeleteCompanyRole=[];
        //  this.Cancel();
      }, (error) => {
        this.Loading = false;
        //console.error('Problem with the sevice. Please try later : ' + error);
      });
    });

  }
  //Role Modules Access
  Modules: any[] = [];
  RoleModuleAccess: any[] = [];
  RoleWarehouseAccess: any[] = [];
  AllModules: any[] = [];
  AllWarehouse: any[] = [];

  ModulesValueChange(modules: any[]) {
    this.Modules = modules;
  }
  AllModulesValueChange(allModules: any[]) {
    this.AllModules = allModules;
  }
  RoleWarehouseAccessValueChange(roleModuleAccess: any[]) {
    this.RoleWarehouseAccess = roleModuleAccess;
  }
  WarehouseChange(modules: any[]) {
    this.Warehouse = modules;
  }
  AllWarehouseValueChange(allModules: any[]) {
    this.AllWarehouse = allModules;
  }
  RoleModuleAccessValueChange(roleModuleAccess: any[]) {
    this.RoleModuleAccess = roleModuleAccess;
  }
  OnDeleteWarehouseId(deleteModuleID) {
    // this.DeleteWarehouseID=deleteModuleID;
    this.DeleteWarehouseID.push(deleteModuleID);
  }
  SaveRoleModulesAccess() {
    this.Loading = true;

    let lstLbsSysRoleModuleAccesses: LbsSysRoleModuleAccess[] = [];
    this.RoleModuleAccess.forEach(rca => {

      let lbsSysRoleModuleAccess = new LbsSysRoleModuleAccess();
      lbsSysRoleModuleAccess.RoleId = this.RoleID;
      lbsSysRoleModuleAccess.ModuleID = rca.id;
      lbsSysRoleModuleAccess.CreatedBY = localStorage.getItem('LoginID');
      lstLbsSysRoleModuleAccesses.push(lbsSysRoleModuleAccess);
    });

    this.Roleservice.addRoleModuleAccess(lstLbsSysRoleModuleAccesses).subscribe((resp: any) => {
      this.Loading = false;
      this.DeleteModileAccess();
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });

  }
  SaveRoleWarehouseAccess() {
    debugger;
    this.Loading = true;
    debugger;
    let lstLbsSysRoleWarehouseAccesses: LBS_SYS_RoleCompanyWarehouseAccess[] = [];
    this.RoleWarehouseAccess.forEach(rca => {

      let LBS_SYS_RoleCompanyWarehouseAcces = new LBS_SYS_RoleCompanyWarehouseAccess();
      LBS_SYS_RoleCompanyWarehouseAcces.RoleId = this.RoleID;
      LBS_SYS_RoleCompanyWarehouseAcces.id = rca.id;
      LBS_SYS_RoleCompanyWarehouseAcces.CompanyID = rca.companyID;
      LBS_SYS_RoleCompanyWarehouseAcces.CreatedBY = localStorage.getItem('LoginID');
      lstLbsSysRoleWarehouseAccesses.push(LBS_SYS_RoleCompanyWarehouseAcces);
    });

    this.Roleservice.AddwarehouseAccess(lstLbsSysRoleWarehouseAccesses).subscribe((resp: any) => {
      this.Loading = false;
      this.DeleteWarehouseAccess();
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });

  }
  DeleteModileAccess() {

    this.DeleteModuleID.forEach(element => {
      this.Roleservice.DeleteModuleAccess(this.RoleID, element).subscribe((resp: any) => {

        this.DeleteModuleID = [];
      }, (error) => {
      });

    });

  }
  DeleteWarehouseAccess() {
    debugger;
    var CompanyID = localStorage.getItem('CompanyID');
    this.DeleteWarehouseID.forEach(element => {
      this.Roleservice.DeleteRoleWarehouseAccess(this.RoleID, element, CompanyID).subscribe((resp: any) => {
        this.DeleteWarehouseID = [];
      }, (error) => {
      });
    });
  }
  RoleMenuAccess: any[] = [];
  RoleMenuAccessChange(roleMenuAccess: any[]) {
    // alert(roleMenuAccess.length);
    //alert(roleMenuAccess.length);

    this.RoleMenuAccess = roleMenuAccess;
  }
  MenuAccessModules: any[] = [];
  ModulesChange(modules: any[]) {
    //alert(modules.length);
    this.MenuAccessModules = modules;
  }
  SelectedModule: any;
  SelectedModuleChange(selectedModule: any) {
    //alert(selectedModule);
    this.SelectedModule = selectedModule
  }
  SelectedRoleMenuAccess: any[] = [];
  SelectedRoleMenuAccessChange(selectedRoleMenuAccess: any[]) {
    this.SelectedRoleMenuAccess = selectedRoleMenuAccess;
  }
  SaveRoleMenuAccess() {
    this.Loading = true;

    let lstLbsSysRoleMenuAccess: LbsSysRoleMenuAccess[] = [];
    this.RoleMenuAccess.forEach(rma => {

      let lbsSysRoleMenuAccess = new LbsSysRoleMenuAccess();

      lbsSysRoleMenuAccess.ID = rma.id;
      lbsSysRoleMenuAccess.RoleID = this.RoleID;
      lbsSysRoleMenuAccess.MenuID = rma.lbS_SYS_Menu.menuId;
      lbsSysRoleMenuAccess.ReadAccess = rma.readAccess;
      lbsSysRoleMenuAccess.WriteAccess = rma.writeAccess;
      lbsSysRoleMenuAccess.DeleteAccess = rma.deleteAccess;
      lbsSysRoleMenuAccess.AllAccess = rma.allAccess;
      lbsSysRoleMenuAccess.NoAccess = rma.noAccess;
      lbsSysRoleMenuAccess.CreatedBY = localStorage.getItem('LoginID');
      lstLbsSysRoleMenuAccess.push(lbsSysRoleMenuAccess);
    });

    console.log(JSON.stringify(lstLbsSysRoleMenuAccess));
    this.Roleservice.addUpdateRoleMenuAccess(lstLbsSysRoleMenuAccess).subscribe((resp: any) => {
      this.Loading = false;
      // this.Cancel();
    }, (error) => {
      this.Loading = false;
      //console.error('Problem with the sevice. Please try later : ' + error);
    });

  }
  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;

  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }

  AllOrganisations: any[] = [];

}
