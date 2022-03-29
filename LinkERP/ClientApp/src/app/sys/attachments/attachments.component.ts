import { Component, OnInit } from '@angular/core';
import { LBS_SYS_Attachments } from 'src/app/shared/LBS_SYS_Attachments';
import { LBS_SYS_AttachmentFiles } from 'src/app/shared/LBS_SYS_AttachmentFiles';
import { AttachmentsService } from 'src/app/shared/services/attachments.service';
import { FormGroup, FormControl, FormBuilder,Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.css']
})
export class AttachmentsComponent implements OnInit {
  mytime1:any;
  timepickerVisible = false;
  mytime: Date;
 /* HeaderNames:any;
  TableName:any;
  constructor(private attachmentsService: AttachmentsService) { }
  ngOnInit() {
     this.Mode = 'List'; 
    this.ColumnDefs = [
      { headerName: 'File Name', field: 'physicalFileName', sortable: true, filter: true},
      { headerName: 'Description', field: 'description', sortable: true, filter: true },
      { headerName: 'File Type', field: 'fileType', sortable: true, filter: true },
      { headerName: 'Created Date', field: 'dateCreated', sortable: true, filter: true },
       { headerName: 'Status', field: 'deleted', type: 'DeleteStatus'},
      
      { headerName: '', field: 'Delete', cellRenderer: this.CustomDeleteIconFunc, type: 'Action', hide: false }
    ];
    //this.BindAllAttachments(); 
    this.HeaderNames="ATTACHMENTS"; 
    this.TableName="LBS_SYS_Company"
  } */
  form: FormGroup;
  submitted:boolean;
  OrganisationMaintenanceForm:any;
  constructor( public datepipe: DatePipe,private FB: FormBuilder) {
      
  }
  ngOnInit() {
    this.submitted=false;
    this.OrganisationMaintenanceForm = this.FB.group({
      ID: [''],
      timepick: [Date.now()],
      CompanyCode: ['',Validators.required], 
      Phone: ['',CustomValidators.email] 
    });
    //this.timepick=""
  }

  get f() { return this.OrganisationMaintenanceForm.controls; }

  onSave() { 
    this.submitted=true;
  if( this.OrganisationMaintenanceForm.valid){
  let c=  this.OrganisationMaintenanceForm.get('timepick').value;
  }
  }

  timeChange1($event) {
    this.mytime1 = $event;
    let hours = this.mytime1.getHours();
    hours = hours.toFixed();

    let minutes = this.mytime1.getMinutes();
    minutes = minutes.toFixed();
    if (hours.length == 1) {
      hours = 0 + hours;
    }
    if (minutes.length == 1) {
      minutes = 0 + minutes;
    }
    this.mytime1 = hours + ':' + minutes;
  }
}
