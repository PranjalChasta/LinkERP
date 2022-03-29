import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SysCommonService } from '../../services/sys-common.service';
import { RoleService } from '../../services/role.service';
import { RoleMenuAccessService } from '../../services/role-menu-access.service';
import { LbsSysRoleMenuAccess } from 'src/app/models/sys/lbs-sys-role-menu-access';


@Component({
  selector: 'app-role-menu-access',
  templateUrl: './role-menu-access.component.html',
  styleUrls: ['./role-menu-access.component.css']
})
export class RoleMenuAccessComponent implements OnInit {

  @Input() RoleID: any;
  @Input() Modules: any[] = [];
  @Input() SelectedModule: any;
  @Input() RoleMenuAccess: any[] = new Array();
  @Input() SelectedRoleMenuAccess: any[] = [];

  @Output() RoleMenuAccessChange = new EventEmitter();
  @Output() ModulesChange = new EventEmitter();
  @Output() SelectedModuleChange = new EventEmitter();
  @Output() SelectedRoleMenuAccessChange = new EventEmitter();

  RoleMenusAccessForm: FormGroup;

  constructor(private FB: FormBuilder,
    private sysCommonService: SysCommonService,
    private roleMenuAccessService: RoleMenuAccessService,
    private roleService: RoleService) { }

  ngOnInit() {
    this.Modules=[];
    this.RoleMenusAccessForm = this.FB.group({
      RoleID: [''],
      RoleMenuAccess: this.FB.array([]),
      Modules: ['-1']
    });
debugger;
    if (this.Modules.length == 0) {
      this.BindModulesByRoleID();
      this.onModuleSelected("-1");
    }
    else {
      this.RoleMenusAccessForm.patchValue({ Modules: this.SelectedModule });
    }

    if (this.RoleMenuAccess.length == 0) {
      this.BindRoleMenuAccessByRole();
    }
    else {
      this.RoleMenusAccessForm.setControl('RoleMenuAccess', this.setRoleMenuAccess(this.SelectedRoleMenuAccess));
      this.checkAndSelectAllHeaderCheckbox();
    }

    if (this.SelectedRoleMenuAccess.length > 0) {
      this.RoleMenusAccessForm.setControl('RoleMenuAccess', this.setRoleMenuAccess(this.SelectedRoleMenuAccess));
      this.checkAndSelectAllHeaderCheckbox();
    }

  }

  BindModulesByRoleID() {
    this.sysCommonService.getModulesByRoleID(this.RoleID).subscribe((resp: any) => {
      debugger;
      this.Modules = resp.data.modules;
      this.ModulesChanged();
    });
  }

  onModuleSelected(ModuleID) {
    // //this.RoleMenuAccess.find(r=>r.)
    // //this.BindRoleMenuAccessByRoleAndModule(ModuleID);
    // 
    this.SelectedRoleMenuAccess=[];
    this.SelectedRoleMenuAccess = this.RoleMenuAccess.filter(r => r.lbS_SYS_Menu.moduleID == ModuleID);
    this.RoleMenusAccessForm.setControl('RoleMenuAccess', this.setRoleMenuAccess(this.SelectedRoleMenuAccess));
    this.checkAndSelectAllHeaderCheckbox();
    this.SelectedModuleChanged();
    this.SelectedRoleMenuAccessChanged();
  }
  BindRoleMenuAccessByRole() {

    this.roleMenuAccessService.getRoleMenuAccessByRole(this.RoleID).subscribe((resp: any) => {
debugger;
      this.RoleMenuAccess = resp.data.roleMenuAccess;
      // this.RoleMenuAccess.forEach(r => {
      //   this.SelectedRoleMenuAccess.push(r);
      // });
      this.RoleMenuAccessChanged();
      //this.RoleMenusAccessForm.setControl('RoleMenuAccess', this.setRoleMenuAccess(this.RoleMenuAccess));
    });
  }

  setRoleMenuAccess(roleMenuAccess: any[]): FormArray {
    const formArray = new FormArray([]);
    roleMenuAccess.forEach(m => {
      formArray.push(this.FB.group({
        ID: m.id,
        RoleID: m.roleID,
        MenuId: m.lbS_SYS_Menu.menuId,
        MenuName: m.lbS_SYS_Menu.menuName,
        ReadAccess: m.readAccess,
        WriteAccess: m.writeAccess,
        DeleteAccess: m.deleteAccess,
        AllAccess: m.allAccess,
        NoAccess: m.noAccess
      }));
    });
    return formArray;
  }
  get RoleMenuAccessArray(): FormArray { return this.RoleMenusAccessForm.get('RoleMenuAccess') as FormArray; }
  checkAll(selected, ctrl) {
    debugger;
    for (let i = 0; i < this.RoleMenuAccessArray.length; i++) {
      if (ctrl == 'ReadAccess') {
        if (selected.target.checked == false) {
          this.RoleMenuAccessArray.at(i).patchValue({
            ReadAccess: false,
            WriteAccess: false,
            DeleteAccess: false
          });
        }
        //this.OnReadSelected(i, selected.target.checked);
        this.RoleMenuAccessArray.at(i).patchValue({ ReadAccess: selected.target.checked });
        this.onOptionSelected(this.RoleMenuAccessArray.at(i).get('MenuId').value, selected, ctrl, true);

      }
      else if (ctrl == 'WriteAccess') {
        if (selected.target.checked == true) {
          this.RoleMenuAccessArray.at(i).patchValue({
            ReadAccess: true
          });
        }
        // this.OnWriteSelected(i, selected.target.checked);
        this.RoleMenuAccessArray.at(i).patchValue({ WriteAccess: selected.target.checked });
        this.onOptionSelected(this.RoleMenuAccessArray.at(i).get('MenuId').value, selected, ctrl, true);
      }
      else if (ctrl == 'DeleteAccess') {
        if (selected.target.checked == true) {
          this.RoleMenuAccessArray.at(i).patchValue({
            ReadAccess: true
          });
        }
        //this.OnDeleteSelected(i, selected.target.checked);
        this.RoleMenuAccessArray.at(i).patchValue({ DeleteAccess: selected.target.checked });
        this.onOptionSelected(this.RoleMenuAccessArray.at(i).get('MenuId').value, selected, ctrl, true);
      }
      else if (ctrl == 'AllAccess') {
        this.RoleMenuAccessArray.at(i).patchValue({
          ReadAccess: selected.target.checked,
          WriteAccess: selected.target.checked,
          DeleteAccess: selected.target.checked,
          AllAccess: selected.target.checked
        });
        this.onOptionSelected(this.RoleMenuAccessArray.at(i).get('MenuId').value, selected, ctrl, true);
        // this.onAllAccessSelected(i, selected);
      }
      else if (ctrl == 'NoAccess') {
        this.RoleMenuAccessArray.at(i).patchValue({ NoAccess: selected.target.checked });
        this.onOptionSelected(this.RoleMenuAccessArray.at(i).get('MenuId').value, selected, ctrl, true);
      }
      this.SelectAllOnAllOptionSelected(i);
    }
    this.checkAndSelectAllHeaderCheckbox();
    this.RoleMenuAccessChanged();
    this.SelectedRoleMenuAccessChanged();
  }
  SelectAllOnAllOptionSelected(i: number) {

    let roleMenuAccess = this.RoleMenuAccessArray.at(i);

    // let roleMenuAccessObj: any = new LbsSysRoleMenuAccess();
    // let rmaIndex = this.RoleMenuAccess.findIndex(r => r.lbS_SYS_Menu.menuId == roleMenuAccess.get('MenuId').value);
    // let srmaIndex = this.SelectedRoleMenuAccess.findIndex(r => r.lbS_SYS_Menu.menuId == roleMenuAccess.get('MenuId').value);
    // roleMenuAccessObj = this.RoleMenuAccess[rmaIndex];


    if (roleMenuAccess.get('ReadAccess').value == true &&
      roleMenuAccess.get('WriteAccess').value == true &&
      roleMenuAccess.get('DeleteAccess').value == true) {
      this.RoleMenuAccessArray.at(i).patchValue({ AllAccess: true });
    } else {
      this.RoleMenuAccessArray.at(i).patchValue({ AllAccess: false });
    }

    // this.RoleMenuAccess[rmaIndex] = roleMenuAccess;
    // this.SelectedRoleMenuAccess[srmaIndex] = roleMenuAccess;

    // this.RoleMenuAccessChanged();
    // this.SelectedRoleMenuAccessChanged();

    //  ReadAccess: m.readAccess,
    //  WriteAccess: m.writeAccess,
    //  DeleteAccess: m.deleteAccess,
    //  AllAccess: m.allAccess,
  }
  onAllAccessSelected(i: number, selected: any) {

    //  alert(selected.target.checked);
    this.RoleMenuAccessArray.at(i).patchValue({
      ReadAccess: selected.target.checked,
      WriteAccess: selected.target.checked,
      DeleteAccess: selected.target.checked
    });
  }

  OnReadSelected(i: number, selected: any) {
    if (selected.target.checked == false) {
      this.RoleMenuAccessArray.at(i).patchValue({
        ReadAccess: false,
        WriteAccess: false,
        DeleteAccess: false
      });
    }
  }
  OnWriteSelected(i: number, selected: any) {
    if (selected.target.checked == true) {
      this.RoleMenuAccessArray.at(i).patchValue({
        ReadAccess: true
      });
    }
  }
  OnDeleteSelected(i: number, selected: any) {
    if (selected.target.checked == true) {
      this.RoleMenuAccessArray.at(i).patchValue({
        ReadAccess: true
      });
    }
  }
  onOptionSelected(menuID, selected, ctrl, allSelect: boolean) {

    let roleMenuAccess: any = new LbsSysRoleMenuAccess();
    let rmaIndex = this.RoleMenuAccess.findIndex(r => r.lbS_SYS_Menu.menuId == menuID);
    let srmaIndex = this.SelectedRoleMenuAccess.findIndex(r => r.lbS_SYS_Menu.menuId == menuID);
    roleMenuAccess = this.RoleMenuAccess[rmaIndex];
    if (ctrl == 'ReadAccess')
      roleMenuAccess.readAccess = selected.target.checked;
    else if (ctrl == 'WriteAccess')
      roleMenuAccess.writeAccess = selected.target.checked;
    else if (ctrl == 'DeleteAccess')
      roleMenuAccess.deleteAccess = selected.target.checked;
    else if (ctrl == 'AllAccess') {
      roleMenuAccess.allAccess = selected.target.checked;
      roleMenuAccess.readAccess = selected.target.checked;
      roleMenuAccess.writeAccess = selected.target.checked;
      roleMenuAccess.deleteAccess = selected.target.checked;
    }
    else if (ctrl == 'NoAccess') {
      roleMenuAccess.noAccess = selected.target.checked;
    }

    if (roleMenuAccess.readAccess == true && roleMenuAccess.writeAccess == true && roleMenuAccess.deleteAccess) {
      roleMenuAccess.allAccess = true;
    }
    else {
      roleMenuAccess.allAccess = false;
    }

    this.RoleMenuAccess[rmaIndex] = roleMenuAccess;
    this.SelectedRoleMenuAccess[srmaIndex] = roleMenuAccess;
    this.checkAndSelectAllHeaderCheckbox();

    if (allSelect == false) {
      this.RoleMenuAccessChanged();
      this.SelectedRoleMenuAccessChanged();
    }

  }
  ReadAccess: any = false;
  WriteAccess: any = false;
  DeleteAccess: any = false;
  AllAccess: any = false;
  checkAndSelectAllHeaderCheckbox() {
    let count = this.RoleMenuAccessArray.controls.length;
    let ReadAccessCount: number = 0, WriteAccessCount: number = 0, DeleteAccessCount: number = 0, AllAccessCount: number = 0;
    //   ReadAccess: selected.target.checked,
    //   WriteAccess: selected.target.checked,
    //   DeleteAccess: selected.target.checked 
    //   AllAccess

    this.RoleMenuAccessArray.controls.forEach(c => {
      if (c.get('ReadAccess').value == true) {
        ReadAccessCount++;
      }
      if (c.get('WriteAccess').value == true) {
        WriteAccessCount++;
      }
      if (c.get('DeleteAccess').value == true) {
        DeleteAccessCount++;
      }
      if (c.get('AllAccess').value == true) {
        AllAccessCount++;
      }
    });

    //alert(ReadAccessCount + ' ' + WriteAccessCount + ' ' + DeleteAccessCount + ' ' + AllAccessCount);

    if (ReadAccessCount == count) {
      this.ReadAccess = true;
    } else {
      this.ReadAccess = false;
    }

    if (WriteAccessCount == count) {
      this.WriteAccess = true;
    } else {
      this.WriteAccess = false;
    }

    if (DeleteAccessCount == count) {
      this.DeleteAccess = true;
    } else {
      this.DeleteAccess = false;
    }

    if (AllAccessCount == count) {
      this.AllAccess = true;
    } else {
      this.AllAccess = false;
    }

  }
  RoleMenuAccessChanged() {
    this.RoleMenuAccessChange.emit(this.RoleMenuAccess);
  }
  SelectedModuleChanged() {
    this.SelectedModuleChange.emit(this.RoleMenusAccessForm.get('Modules').value);
  }
  ModulesChanged() {
    this.ModulesChange.emit(this.Modules);
  }
  SelectedRoleMenuAccessChanged() {
    this.SelectedRoleMenuAccessChange.emit(this.SelectedRoleMenuAccess);
  }
}
