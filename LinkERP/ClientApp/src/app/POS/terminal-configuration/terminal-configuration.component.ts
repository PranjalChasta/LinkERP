import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TerminalsService } from 'src/app/POS/services/terminals.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { LbsSopConfigurationdetails } from 'src/app/models/pos/lbs-sop-configurationdetails';
import { Router } from '@angular/router';
import { faClosedCaptioning } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-terminal-configuration',
  templateUrl: './terminal-configuration.component.html',
  styleUrls: ['./terminal-configuration.component.css']
})
export class TerminalConfigurationComponent implements OnInit {

  Mode: any = 'List';
  CompanyId = localStorage.getItem('CompanyID');
  ColumnDefs;
  RowData: any[] = [];
  AgLoad: boolean = false;
  Submitted: any = false;
  TerminalConfigurationForm: FormGroup;
  Machines: any[] = [];
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
  cryptoAes: any;
  constructor(
    private FB: FormBuilder,
    private terminalService: TerminalsService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    debugger;
    this.AgLoad = false;
    this.Mode = "List";
    this.CreateForm();

    this.ColumnDefs = [
      { headerName: 'Configuration', field: 'configuration', sortable: true, filter: true, editable: false },
      { headerName: 'Value ', field: 'configurationValue', sortable: true, filter: true, editable: true },
    ];

    this.BindAllMachines();
    //this.SetPermissions();
  }
  BindAllMachines() {
    debugger;
    this.terminalService.GetMachinesConfigurataions().subscribe((resp: any) => {
      this.Machines = resp.data.configurations;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
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
      this.TerminalConfigurationForm.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          this.TerminalConfigurationForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.TerminalConfigurationForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  CreateForm() {
    this.TerminalConfigurationForm = this.FB.group({
      Machine: ['-1'],
      Company: [this.CompanyId]
    });
  }

  onMachineChange(event) {
    debugger;
    if (event == "-1") {
      this.AgLoad = false;
      this.RowData = [];
    } else {
      //this.Congigurationvalue = this.BindConfiguration.filter(c => c.moduleId == event);
      this.BindConfigurationByID();
    }
  }

  OnSaveTerminalConfigurations() {
    debugger;
    console.log(this.RowData);
    this.terminalService.UpdateTerminalConfigurations(this.RowData).subscribe((resp: any) => {
      this.toastr.success('Terminal Configurations Updated Successfully');
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Cancel() {
    this.router.navigate(['/home']);
  }
  BindConfigurationByID() {
    debugger;
    this.AgLoad = false;
    this.terminalService.GetMachinesConfigurataionsByID(this.CompanyId).subscribe((resp: any) => {
      this.RowData = resp.data.configurationsbyID;
      this.Loading = false;
      this.AgLoad = true;
    }, (error: any) => {
      this.Loading = false;
      this.toastr.error(error.message);
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}
