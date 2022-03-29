import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SysCommonService } from '../../services/sys-common.service';

@Component({
  selector: 'app-role-warehouse-access',
  templateUrl: './role-warehouse-access.component.html',
  styleUrls: ['./role-warehouse-access.component.css']
})
export class RoleWarehouseAccessComponent implements OnInit {
  //Warehouse:any;
  @Input() Warehouse: any[] = [];
  @Input() RoleID: any;
  @Input() RoleWarehouseAccess: any[] = [];
  @Input() WarehouseName: any[] = [];
  @Input() AllWarehouse: any[] = [];
  @Output() WarehouseValueChange = new EventEmitter();
  @Output() AllWarehouseValueChange = new EventEmitter();
  @Output() RoleWarehouseAccessValueChange = new EventEmitter();
  @Output() DeleteWarehouseId = new EventEmitter<string>();
  @Input() IsActive: boolean;
  @Input() delete_Access: boolean;
  RoleWarehouseAccessForm: FormGroup;
  CompanyID: any;
  RoleCompanyAccess: any;
  constructor(
    private FB: FormBuilder,
    private sysCommonService: SysCommonService, private roleService: RoleService) { }

  ngOnInit() {
    this.DeleteWarehouseId.emit("00000000-0000-0000-0000-000000000000");
    this.RoleWarehouseAccessForm = this.FB.group({
      ID: [''],
      RoleWarehouseAccess: this.FB.array([]),
      Warehouse: ['-1'],
      Organisation: ['-1']
    });
    debugger;
    console.log(this.RoleWarehouseAccess)

    this.CompanyID = localStorage.getItem("CompanyID");
    if (this.Warehouse.length == 0 && this.AllWarehouse.length == 0 && this.RoleWarehouseAccess.length == 0) {
      //this.BindNotExistWarehouse();
      this.BindExistWarehouse();
      this.Allwarehouse();
    }
    if (this.RoleWarehouseAccess.length > 0) {
      //this.RoleWarehouseAccessForm.setControl('RoleModuleAccess', this.setRoleWarehouseAccess(this.RoleWarehouseAccess));
      this.RoleWarehouseAccessForm.setControl('RoleWarehouseAccess', this.setRoleWarehouseAccess(this.RoleWarehouseAccess));
      //this.BindNotExistWarehouse();
      this.BindExistWarehouse();
    }
    this.BindExistWarehouse();
    this.BindRoleCompanyAccess();
  }
  BindNotExistWarehouse(CompanyID) {
    this.roleService.getWareHousesNotExistsInRoleWarehouseyAccess(this.RoleID, CompanyID).subscribe((resp: any) => {
      debugger;

      this.Warehouse = resp.data.warehouse;
      this.ModulesValueChanged();
    });
  }

  BindExistWarehouse() {
    this.roleService.getWareHousesExistsInRoleWarehouseyAccess(this.RoleID, this.CompanyID).subscribe((resp: any) => {
      debugger;
      console.log(resp);
      this.RoleWarehouseAccess = resp.data.warehouse;
      this.RoleWarehouseAccessForm.setControl('RoleWarehouseAccess', this.setRoleWarehouseAccess(this.RoleWarehouseAccess));
      // this.Warehouse = resp.data.warehouse;
      this.RoleModuleAccessValueChanged();

    });
  }
  // BindRoleCompanyAccess() {
  //   this.roleService.getRoleCompanyAccessByRoleID(this.RoleID).subscribe((resp: any) => {
  //     debugger;
  //     this.RoleCompanyAccess = resp.data.roleCompanyAccess;
  //     console.log( this.RoleCompanyAccess)
  //   });
  // }
  setRoleWarehouseAccess(roleWarehouseAccess: any[]): FormArray {
    debugger;
    const formArray = new FormArray([]);
    roleWarehouseAccess.forEach(m => {
      formArray.push(this.FB.group({
        ID: '',
        warehouse: m.id,
        WarehouseName: m.wareHouseName,
        WarehouseCode: m.wareHouseCode,
        OrganisationID: m.companyID,
        OrganisationName: m.name,
        OrganisationCode: m.companyCode
      }));
    });
    return formArray;
  }


  AddWarehouseAccess() {
    //const control = <FormArray>this.RoleModuleAccessForm.controls['RoleModuleAccess'];
    //this.RoleWarehouseAccess.push(this.CreateWarehouseAccess());
    debugger;
    this.roleWarehouseeAccessArray.push(this.CreateWarehouseAccess());
    this.deleteWarehouse(this.RoleWarehouseAccessForm.get('Warehouse').value);

    this.RoleWarehouseAccessForm.patchValue({
      warehouse: '-1'
    });
    this.ModulesValueChanged();
    this.RoleModuleAccessValueChanged();

    // this.ModulesValueChanged();
    // this.RoleModuleAccessValueChanged();

  }
  get roleWarehouseeAccessArray(): FormArray {
    return this.RoleWarehouseAccessForm.get('RoleWarehouseAccess') as FormArray;
  }
  deleteWarehouse(warehouse: string) {
    debugger;
    const index: number = this.Warehouse.findIndex(x => x.id == warehouse);
    if (index !== -1) {
      this.Warehouse.splice(index, 1);
    }
  }
  CreateWarehouseAccess(): FormGroup {
    debugger;
    let index: number = this.Warehouse.findIndex(x => x.id == this.RoleWarehouseAccessForm.get('Warehouse').value);
    let module: any = this.Warehouse[index];
    this.RoleWarehouseAccess.push(module);

    return this.FB.group({
      ID: '',
      warehouse: [module.id],
      WarehouseName: [module.wareHouseName],
      WarehouseCode: [module.wareHouseCode],
      OrganisationID: module.companyID,
      OrganisationName: module.name,
      OrganisationCode: module.companyCode
    });
  }
  Allwarehouse() {
    this.roleService.getallwarehouse(this.CompanyID).subscribe((resp: any) => {
      debugger;
      let warehosess: any[] = resp.data.allwarehouse;

      warehosess.forEach(m => {
        this.AllWarehouse.push(m);
      });
      this.AllModulesValueChanged();
      this.ModulesValueChanged();
      //this.AllWarehouse=resp.data.allwarehouse;

      // this.RoleWarehouseAccess = resp.data.warehouse;
      // this.RoleWarehouseAccessForm.setControl('RoleWarehouseAccess', this.setRoleWarehouseAccess(this.RoleWarehouseAccess));
      // this.Warehouse = resp.data.warehouse;

    });
  }
  deleteRoleCompanyAccess(ModuleID: string) {
    debugger;
    const index: number = this.RoleWarehouseAccess.findIndex(x => x.id == ModuleID);
    if (index !== -1) {
      this.RoleWarehouseAccess.splice(index, 1);
    }

  }
  DeleteRoleWarehouse(rowIndex: number, warehouse: any) {
    //this.DeleteModuleId.emit(warehouse);
    this.DeleteWarehouseId.emit(warehouse);
    debugger
    let index: number = this.AllWarehouse.findIndex(x => x.id == warehouse);
    this.Warehouse.push(this.AllWarehouse[index]);
    this.ModulesValueChanged();

    this.deleteRoleCompanyAccess(this.roleWarehouseeAccessArray.at(rowIndex).get('warehouse').value);
    this.roleWarehouseeAccessArray.removeAt(rowIndex);
    this.RoleModuleAccessValueChanged();
  }
  ModulesValueChanged() {
    debugger;
    this.WarehouseValueChange.emit(this.Warehouse);
  }
  AllModulesValueChanged() {
    debugger;
    this.AllWarehouseValueChange.emit(this.AllWarehouse);
  }
  RoleModuleAccessValueChanged() {
    debugger;
    this.RoleWarehouseAccessValueChange.emit(this.RoleWarehouseAccess);

  }
  BindRoleCompanyAccess() {
    this.Warehouse = []
    this.RoleCompanyAccess = []
    this.roleService.getRoleCompanyAccessByRoleID(this.RoleID).subscribe((resp: any) => {
      debugger;
      this.RoleCompanyAccess = resp.data.roleCompanyAccess;
    });
  }
  onChangeCompany(CompanyID) {
    this.BindNotExistWarehouse(CompanyID);
  }
}
