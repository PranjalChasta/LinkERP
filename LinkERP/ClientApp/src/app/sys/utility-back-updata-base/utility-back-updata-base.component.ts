import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SYSUtility } from 'src/app/models/sys/SalesPersom';
import { ConfigurationService } from '../services/configuration.service';
import { ReportScheduleService } from '../services/report-schedule.service';

@Component({
  selector: 'app-utility-back-updata-base',
  templateUrl: './utility-back-updata-base.component.html',
  styleUrls: ['./utility-back-updata-base.component.css']
})
export class UtilityBackUPDataBaseComponent implements OnInit {
  UtilityBackUp: FormGroup;
  Submitted: boolean;

  SystemdatabasebackupPath :any
  Systemdatabasebackupretentiondays  :any
  Backuptheotherdatabase  :any
  constructor( private FB: FormBuilder,private toastrService: ToastrService,
    private reportScheduleService :ReportScheduleService,
    private configuration: ConfigurationService) { }

  ngOnInit() {
    console.log(localStorage)
    this.AllConfigurationByModuleID();
    this.Createform();
  }
  get f() { return this.UtilityBackUp.controls; }

  Createform() {
    this.Submitted = false;
    this.UtilityBackUp = this.FB.group({
      
      FilePath: ['']
    })
  }

  onSave(){
    let FilePath=
    {'Path': this.UtilityBackUp.get('FilePath').value}
    let sYSUtility=new SYSUtility()
    sYSUtility.Path=this.UtilityBackUp.get('FilePath').value
  debugger;
    this.reportScheduleService.BackupDB(sYSUtility).subscribe((resp: any) => {
      console.log(resp)
      debugger;
    
      if (resp.isSuccess) {
        this.toastrService.success('DataBase Backup successfull');
      }
      else{
        this.toastrService.error(resp.message);
      }
     
    }, (error) => {
      this.toastrService.error(error);
    });
  }

  AllConfigurationByModuleID() {
    this.configuration.getAllConfigurationByModuleID("SYS").subscribe((resp: any) => {
      debugger;
      var systemdatabasebackupretentiondays = resp.data.configurationbyIds.filter(o => o.flag == "Flag35");
      var systemdatabasebackupPath = resp.data.configurationbyIds.filter(o => o.flag == "Flag36");
      var backuptheotherdatabase = resp.data.configurationbyIds.filter(o => o.flag == "Flag37");
      this.SystemdatabasebackupPath = systemdatabasebackupPath[0].value;
      this.Systemdatabasebackupretentiondays = systemdatabasebackupretentiondays[0].value;
      this.Backuptheotherdatabase = backuptheotherdatabase[0].value;
     
      this.UtilityBackUp.patchValue({
        FilePath: this.SystemdatabasebackupPath
      })
    }, (error) => {
    
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

}
