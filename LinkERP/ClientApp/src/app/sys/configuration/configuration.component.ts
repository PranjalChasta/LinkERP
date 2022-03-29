import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfigurationService } from '../services/configuration.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { SysCommonService } from '../services/sys-common.service';
import { LBSSYSConfiguration } from 'src/app/models/sys/lbs-sys-configuration';
import { Router } from '@angular/router';
import { CryptoAes } from 'src/app/directives/crypto-aes';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {
  Mode: any = 'CLose';
  CompanyId = localStorage.getItem('CompanyID');
  ColumnDefs;
  RowData: any[] = [];
  AgLoad: boolean = false;
  Submitted: any = false;
  ConfigurationForm: FormGroup;
  Modules: any[] = [];
  BindConfigurationModule: any[] = [];
  Loading: any = false;
  Module: any;
  Congigurationvalue: any[] = [];
  BindConfiguration: any[] = [];
  //permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  constructor(
    private FB: FormBuilder,
    private configurationService: ConfigurationService,
    private toastr: ToastrService,
    private deleteRecordsService: DeleteRecordsService,
    private sysCommonService: SysCommonService,
    private router: Router,
    private cryptoAes: CryptoAes,
  ) { }

  ngOnInit() {
    debugger;
    this.AgLoad = false;
    this.Mode = "List";
    this.CreateForm();
    this.SetPermissions();
    this.ColumnDefs = [
      { headerName: 'Configuration', field: 'flagName', sortable: true, filter: true, checkboxSelection: false, editable: false },
      { headerName: 'Value ', field: 'value', sortable: true, filter: true },
      { headerName: 'Module', field: 'moduleId', sortable: true, filter: true, checkboxSelection: false, editable: false },
    ];

    //this.BindAllConfiguration();
    this.BindAllModules();
  
  }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "116");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      if (!this.all_Access) {
        if (!this.write_Access) {
          
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
     
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  CreateForm() {
    this.ConfigurationForm = this.FB.group({
      Module: ['-1'],
      Company: [this.CompanyId]
    });
  }
  BindAllModules() {
    debugger;
    this.sysCommonService.getModules().subscribe((resp: any) => {
      this.Modules = resp.data.modules;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  onConfigurationChange(event) {
    debugger;
    if (event == "-1") {
      //this.BindAllConfiguration();
      this.AgLoad = false;
      this.RowData = [];
    } else {
      this.Congigurationvalue = this.BindConfiguration.filter(c => c.moduleId == event);
      this.BindConfigurationByModuleID(event)
    }
  }
  BindConfigurationByModuleID(ModuleId) {
    debugger;
    this.AgLoad = false;
    this.configurationService.getAllConfigurationByModuleID(ModuleId).subscribe((resp: any) => {
      this.BindConfigurationModule = resp.data.configurationbyIds;
      this.RowData = resp.data.configurationbyIds;
      this.Loading = false;
      this.AgLoad = true;
    }, (error: any) => {
      this.Loading = false;
      this.toastr.error(error.message);
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


  OnSaveConfigurations() {
    debugger;
    // console.log(this.RowData);
    this.configurationService.updateConfigurations(this.RowData).subscribe((resp: any) => {
      this.toastr.success('Configuration updated successfully');
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Cancel() {
   // this.router.navigate(['/home']);
    
    this.ConfigurationForm.patchValue({
      Module: '-1'
    });
    this.RowData = [];
     this.Mode = 'List';
     this.AgLoad = false;
    // this.AgLoad = false;
  }
}
