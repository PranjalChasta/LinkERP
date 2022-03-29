import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SysCommonService } from '../../services/sys-common.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-role-module-access',
  templateUrl: './role-module-access.component.html',
  styleUrls: ['./role-module-access.component.css']
})
export class RoleModuleAccessComponent implements OnInit {
  @Input() write_Access: boolean;
  @Input() delete_Access: boolean;
  @Input() RoleID: any;
  @Input() Modules: any[] = [];
  @Input() RoleModuleAccess: any[] = [];
  @Input() AllModules: any[] = [];
  @Output() ModulesValueChange = new EventEmitter();
  @Output() AllModulesValueChange = new EventEmitter();
  @Output() RoleModuleAccessValueChange = new EventEmitter();
  @Output() DeleteModuleId= new EventEmitter<string>();
  @Input() IsActive:boolean;
  // Modules: any[] = [];
  // AllModules: any[] = [];

  RoleModuleAccessForm: FormGroup;

  constructor(private FB: FormBuilder,
    private sysCommonService: SysCommonService,
    private roleService: RoleService
  ) { }

  ngOnInit() {
    this.RoleModuleAccessForm = this.FB.group({
      RoleID: [''],
      RoleModuleAccess: this.FB.array([]),
      Modules: ['-1']
    });
    debugger;
    if (this.Modules.length == 0 && this.AllModules.length == 0 && this.RoleModuleAccess.length == 0) {
      this.BindModules();
      this.BindModulesExistsInRoleModuleAccess();
      this.BindModulesNotExistsInRoleModuleAccess();
    }
    if (this.RoleModuleAccess.length > 0) {
     //this.RoleModuleAccessForm.setControl('RoleModuleAccess', this.setRoleModuleAccess(this.RoleModuleAccess));
     this.BindModulesExistsInRoleModuleAccess();
      this.BindModulesNotExistsInRoleModuleAccess();
    }
    this.DeleteModuleId.emit("0");
  }

  BindModules() {
    this.sysCommonService.getModules().subscribe((resp: any) => {
      let modules: any[] = resp.data.modules;

      modules.forEach(m => {
        this.AllModules.push(m);
      });
      this.AllModulesValueChanged();
      this.ModulesValueChanged();
    });
  }

  BindModulesExistsInRoleModuleAccess() {
    
    this.roleService.getModulesExistsInRoleModuleAccess(this.RoleID).subscribe((resp: any) => {
      this.RoleModuleAccess=[];
      this.RoleModuleAccess = resp.data.roleModules;

      // this.Modules.forEach(m => {
      //   this.AllModules.push(m);
      // });
      this.RoleModuleAccessForm.setControl('RoleModuleAccess', this.setRoleModuleAccess(this.RoleModuleAccess));
      this.RoleModuleAccessValueChanged();
    });
  }
  BindModulesNotExistsInRoleModuleAccess() {
    
    this.roleService.getModulesNotExistsInRoleModuleAccess(this.RoleID).subscribe((resp: any) => {
      
      this.Modules = resp.data.roleModules;

      // this.Modules.forEach(m => {
      //   this.AllModules.push(m);
      // });
      // this.RoleModuleAccessForm.setControl('RoleModuleAccess', this.setRoleModuleAccess(this.RoleModuleAccess));
      this.ModulesValueChanged();
    });
  }

  setRoleModuleAccess(roleModuleAccess: any[]): FormArray {
debugger
    const formArray = new FormArray([]);
    roleModuleAccess.forEach(m => {
      formArray.push(this.FB.group({
        ID: '',
        ModuleID: m.id,
        ModuleName: m.moduleName
      }));
    });
    return formArray;
  }


  CreateRoleModuleAccess(): FormGroup {
    debugger;
    let index: number = this.Modules.findIndex(x => x.id == this.RoleModuleAccessForm.get('Modules').value);
    let module: any = this.Modules[index];
    this.RoleModuleAccess.push(module);

    return this.FB.group({
      ID: '',
      ModuleID: [module.id],
      ModuleName: [module.moduleName]
    });
  }
  AddRoleModuleAccess() {
    debugger
    //const control = <FormArray>this.RoleModuleAccessForm.controls['RoleModuleAccess'];
    this.roleModuleAccessArray.push(this.CreateRoleModuleAccess());
    this.deleteModule(this.RoleModuleAccessForm.get('Modules').value);

    this.RoleModuleAccessForm.patchValue({
      Modules: '-1'
    });
    this.ModulesValueChanged();
    this.RoleModuleAccessValueChanged();
  }
  deleteModule(ModuleID: string) {
    const index: number = this.Modules.findIndex(x => x.id == ModuleID);
    if (index !== -1) {
      this.Modules.splice(index, 1);
    }
  }
  get roleModuleAccessArray(): FormArray {
    return this.RoleModuleAccessForm.get('RoleModuleAccess') as FormArray;
  }
  deleteRoleCompanyAccess(ModuleID: string) {
    const index: number = this.RoleModuleAccess.findIndex(x => x.id == ModuleID);
    if (index !== -1) {
      this.RoleModuleAccess.splice(index, 1);
    }
  }
  DeleteRoleModule(rowIndex: number, ModuleID: any) {
    debugger;
    this.DeleteModuleId.emit(ModuleID);
    let index: number = this.AllModules.findIndex(x => x.id == ModuleID);
    this.Modules.push(this.AllModules[index]);
    this.ModulesValueChanged();

    this.deleteRoleCompanyAccess(this.roleModuleAccessArray.at(rowIndex).get('ModuleID').value);
    this.roleModuleAccessArray.removeAt(rowIndex);
    this.RoleModuleAccessValueChanged();
  }

  ModulesValueChanged() {
    debugger;
    this.ModulesValueChange.emit(this.Modules);
  }
  AllModulesValueChanged() {
    this.AllModulesValueChange.emit(this.AllModules);
  }
  RoleModuleAccessValueChanged() {
    debugger;
    this.RoleModuleAccessValueChange.emit(this.RoleModuleAccess);
    
  }

}
