import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SysCommonService } from '../../services/sys-common.service';
import { RoleService } from '../../services/role.service';
import { LBSSYSCompany } from '../../../models/sys/lbs-sys-company';

@Component({
  selector: 'app-role-company-access',
  templateUrl: './role-company-access.component.html',
  styleUrls: ['./role-company-access.component.css']
})
export class RoleCompanyAccessComponent implements OnInit {

  @Input() write_Access: boolean;
  @Input() delete_Access: boolean;
  @Input() RoleID: any;
  @Input() Companies: any[] = [];
  @Input() RoleCompanyAccess: any[] = [];
  @Input() tempCompanies: any[] = [];
  @Input() DeletedRoleCompanyAccess: any[] = [];
  @Output() DeleteCompanyrole= new EventEmitter<string>();
  @Output() CompaniesValueChange = new EventEmitter();
  @Output() TempCompaniesValueChange = new EventEmitter();
  @Output() RoleCompanyAccessValueChange = new EventEmitter();
  @Output() DeletedRoleCompanyAccessValueChange = new EventEmitter();
  //DeleteRoleId:any;
  @Input() IsActive:boolean;
  RoleCompanyAccessForm: FormGroup;
  constructor(private FB: FormBuilder,
    private sysCommonService: SysCommonService,
    private roleService: RoleService) { }

  ngOnInit() {
    this.RoleCompanyAccessForm = this.FB.group({
      RoleID: [''],
      RoleCompanyAccess: this.FB.array([]),
      Organisation: ['-1']
    });
    if (this.Companies.length == 0 && this.RoleCompanyAccess.length == 0) {
      this.BindCompanies();
    }
    debugger;
    //alert(this.RoleCompanyAccess.length);
    if (this.RoleCompanyAccess.length > 0) {
      //this.RoleCompanyAccessForm.setControl('RoleCompanyAccess', this.setRoleCompanyAccess(this.RoleCompanyAccess));
      this.BindRoleCompanyAccess();
    }
    else {
      this.BindRoleCompanyAccess();
    }
    this.DeleteCompanyrole.emit("00000000-0000-0000-0000-000000000000");
  }
  setRoleCompanyAccess(roleCompanyAccess: any[]): FormArray {
    const formArray = new FormArray([]);
    roleCompanyAccess.forEach(o => {
      formArray.push(this.FB.group({
        ID: o.id,
        CompanyID: o.companyID,
        CompanyCode: o.companyCode,
        Name: o.name
      }));
    });
    return formArray;
  }

  BindCompanies() {
    this.roleService.getCompaniesNotExistsInRoleCompanyAccess(this.RoleID).subscribe((resp: any) => {
      debugger;
      this.Companies = resp.data.companies;
      this.OrganisationValueChanged();
    });
  }
  BindRoleCompanyAccess() {
    this.roleService.getRoleCompanyAccessByRoleID(this.RoleID).subscribe((resp: any) => {
      debugger;
      this.RoleCompanyAccess = resp.data.roleCompanyAccess;
      this.RoleCompanyAccessForm.setControl('RoleCompanyAccess', this.setRoleCompanyAccess(this.RoleCompanyAccess));
    });
  }

  CreateCompanyAccess(): FormGroup {
    debugger;
    let roleCompanyAccess: any;
    let company: any;
    roleCompanyAccess = this.DeletedRoleCompanyAccess.find(r => r.companyID == this.RoleCompanyAccessForm.get('Organisation').value);

    if (roleCompanyAccess != null) {
      let deletedRowIndex = this.DeletedRoleCompanyAccess.findIndex(r => r.id == roleCompanyAccess.id);
      if (deletedRowIndex !== -1) {
        this.DeletedRoleCompanyAccess.splice(deletedRowIndex, 1);
      }
      return this.FB.group({
        ID: [roleCompanyAccess.id],
        CompanyID: [roleCompanyAccess.companyID],
        CompanyCode: [roleCompanyAccess.companyCode],
        Name: [roleCompanyAccess.name]
      });
    }
    else {
      let index: number = this.Companies.findIndex(x => x.id == this.RoleCompanyAccessForm.get('Organisation').value);
      company = this.Companies[index];
      this.tempCompanies.push(company);
      this.RoleCompanyAccess.push({
        id: null,
        roleID: this.RoleID,
        companyID: company.id,
        companyCode: company.companyCode,
        name: company.name,
        deleted: false
      });
      return this.FB.group({
        ID: null,
        CompanyID: [company.id],
        CompanyCode: [company.companyCode],
        Name: [company.name]
      });
    }


  }
  AddRoleCompanyAccess() {

    const control = <FormArray>this.RoleCompanyAccessForm.controls['RoleCompanyAccess'];
    control.push(this.CreateCompanyAccess());
    this.deleteCompany(this.RoleCompanyAccessForm.get('Organisation').value);
    this.RoleCompanyAccessForm.patchValue({
      Organisation: '-1'
    });
    this.OrganisationValueChanged();
    this.RoleOrganisationAccessValueChanged();

  }

  deleteCompany(CompanyID: string) {
    const index: number = this.Companies.findIndex(x => x.id == CompanyID);
    if (index !== -1) {
      this.Companies.splice(index, 1);
    }
  }
  deleteRoleCompanyAccess(CompanyID: string) {
    const index: number = this.RoleCompanyAccess.findIndex(x => x.id == CompanyID);
    if (index !== -1) {
      this.RoleCompanyAccess.splice(index, 1);
    }
  }
  get roleOrganisationAccessArray(): FormArray {
    return this.RoleCompanyAccessForm.get('RoleCompanyAccess') as FormArray;
  }
  //DeletedRoleCompanyAccess: any[] = [];
  DeleteRoleOrganisations(rowIndex: number, CompanyID: any,ID:any) {
debugger;
    this.DeleteCompanyrole.emit(CompanyID);
console.log(ID);
    let index: number = this.tempCompanies.findIndex(x => x.id == CompanyID);
    let company: any = {
      id: this.roleOrganisationAccessArray.at(rowIndex).get('CompanyID').value,
      companyCode: this.roleOrganisationAccessArray.at(rowIndex).get('CompanyCode').value,
      name: this.roleOrganisationAccessArray.at(rowIndex).get('Name').value
    };
    debugger;
    if (this.roleOrganisationAccessArray.at(rowIndex).get('ID').value != null) {
      console.log(this.RoleCompanyAccess.find(r => r.id == this.roleOrganisationAccessArray.at(rowIndex).get('ID').value));
      this.DeletedRoleCompanyAccess.push(this.RoleCompanyAccess.find(r => r.id == this.roleOrganisationAccessArray.at(rowIndex).get('ID').value));
    }

    this.Companies.push(company);
    this.OrganisationValueChanged();

    this.deleteRoleCompanyAccess(this.roleOrganisationAccessArray.at(rowIndex).get('CompanyID').value);
    this.roleOrganisationAccessArray.removeAt(rowIndex);
    this.RoleOrganisationAccessValueChanged();
    this.DeletedRoleCompanyAccessValueChanged();
  }
  OrganisationValueChanged() {
    this.CompaniesValueChange.emit(this.Companies);
  }
  TempOrganisationValueChanged() {
    this.TempCompaniesValueChange.emit(this.tempCompanies);
  }
  RoleOrganisationAccessValueChanged() {
    this.RoleCompanyAccessValueChange.emit(this.RoleCompanyAccess);
  }
  DeletedRoleCompanyAccessValueChanged() {
    this.DeletedRoleCompanyAccessValueChange.emit(this.RoleCompanyAccess);
  }

}
