import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LBS_SYS_Attachments } from 'src/app/shared/LBS_SYS_Attachments';
import { AttachmentsService } from 'src/app/shared/services/attachments.service';
import { LBS_SYS_AttachmentFiles } from 'src/app/shared/LBS_SYS_AttachmentFiles';
import { ToastrService } from 'ngx-toastr';
import { ɵNullViewportScroller } from '@angular/common';
import * as moment from 'moment';
import { ConfigurationService } from 'src/app/sys/services/configuration.service';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { CryptoAes } from '../crypto-aes';

@Component({
  selector: 'app-attachment-files',
  templateUrl: './attachment-files.component.html',
  styleUrls: ['./attachment-files.component.css']
})
export class AttachmentFilesComponent implements OnInit {
  /*  @Input() ColumnDefss:any;
   @Input() RowDatas:any;
   @Input() IsSearch:boolean;
   @Input() IsExport:boolean;  */
  @Input() RecID: any;
  @Input() HeaderNames: any;
  @Input() write_Access: boolean;
  @Input() delete_Access: boolean;
  @Input() IsActive: boolean;
  FileuploadEvent: any;
  _attachments: any = new LBS_SYS_Attachments();
  description: any;
  Mode: string;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  SaveActive: boolean = true;
  AllConfiguration:any=[];
  PageSize: any;
  DefaultFileSize:Number;
  physicalFileName: string;
  id:any;
  file : any;
  fileSize : any;
  fileType : any;
  imgURL = '';
  read_Access: boolean;
  all_Access: boolean;
  constructor(private attachmentsService: AttachmentsService,
     private toastr: ToastrService,
    private configuration:ConfigurationService, private cryptoAes: CryptoAes) { }
  ngOnInit() {
    this.Mode = 'List';
    this.PageSize="50";
    //this.SetPermissions();
    this.ColumnDefs = [
      { headerName: 'File Name', field: 'physicalFileName', sortable: true, filter: true },
      { headerName: 'Description', field: 'description', sortable: true, filter: true },
      { headerName: 'File Type', field: 'fileType', sortable: true, filter: true },
      { headerName: 'Created Date', field: 'dateCreated', sortable: true, filter: true },
      // { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false },
      // { headerName: '', field: 'Price', cellRenderer: this.CustomDetailIconFunc, type: 'Action', hide: false },
      //{ headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access}
      { headerName: '', field: 'Delete', hide: !this.delete_Access,type: 'DeleteAction' ,width:50},
      { headerName: '', field: 'Download', cellRenderer: this.CustomdownloadIconFunc, type: 'Action', hide: false },

      
    ];
    this.BindAllAttachments();
    this.AllConfigurationByModuleID();
   
  }
  transform(size: number, extension: string = 'MB') {
    return (size / (1024 * 1024)).toFixed(2);
  }
  onSelectFile(event) {
    this.FileuploadEvent=null;
    console.log(event);
    this.SaveActive = true;
    this.FileuploadEvent = event;
    if (event.target.files.length>0) {
      for (let i = 0; i <= event.target.files.length-1; i++) {
       let filesize= this.transform(event.target.files[i].size,event.target.files[i].type)
        if (parseInt(filesize,0) > this.DefaultFileSize){
          this.SaveActive = false;
        }
      }
      if(!this.SaveActive){
        this.toastr.warning('please upload file less than '+this.DefaultFileSize+' mb ');
      }
    }


  }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "117");
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
  dateFormatter(params) {
    return moment(params.value).format('DD/MM/yyyy'); //hh:mm:ss
  }
  AllConfigurationByModuleID() {
    this.configuration.getAllConfigurationByModuleID('SYS').subscribe((resp: any) => {
      console.log(resp);
      this.AllConfiguration=resp.data.configurationbyIds;
      let Index=this.AllConfiguration.findIndex(oc=>oc.flag=="Flag29");
      this.DefaultFileSize=Number(this.AllConfiguration[Index].value);
    
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindAllAttachments() {
    this.AgLoad = false;
    this.attachmentsService.getAllAttachmentsByRecID(this.RecID).subscribe((resp: any) => {
      console.log(resp);
      this.RowData = resp.data.attachments;
      this.RowData .forEach(element => {
        element.dateCreated=this.dateFormatter(element.dateCreated);
      });
      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onSave() {
    debugger
    if(this.Mode == "Add" ||this.Mode=="Edit")
    {
      this.SaveActive = false;
      if (this.FileuploadEvent  && this.FileuploadEvent.target.files && this.FileuploadEvent.target.files[0]) {
        var filesAmount = this.FileuploadEvent.target.files.length;
        let load: boolean;
        load = false;
  
        let lstlBS_SYS_Attachments: LBS_SYS_Attachments[] = [];
        /*  this.RoleCompanyAccess.forEach(rca => {
           let lBSSYSRoleCompanyAccess = new LBSSYSRoleCompanyAccess();
           lBSSYSRoleCompanyAccess.RoleID = this.RoleID;
           lBSSYSRoleCompanyAccess.CompanyID = rca.id;
           lBSSYSRoleCompanyAccess.CreatedBY = localStorage.getItem('LoginID');
           lstLBSSYSRoleCompanyAccess.push(lBSSYSRoleCompanyAccess)
         }); */
        for (let i = 0; i < filesAmount; i++) {
          let _lBS_SYS_Attachments = new LBS_SYS_Attachments();
          var reader = new FileReader();
          reader.onload = (event: any) => {
            _lBS_SYS_Attachments.FileBinary = event.target.result;
            lstlBS_SYS_Attachments.push(_lBS_SYS_Attachments);
            if (lstlBS_SYS_Attachments.length == filesAmount) {
              this.attachmentsService.addattachments(lstlBS_SYS_Attachments).subscribe((resp: any) => {
                console.log(resp);
                this.Cancel();
                this.SaveActive = true;
                if(this.Mode=='Add')
                {
                  this.toastr.success('Documents saved successfully');
                }
                else{
                  this.toastr.success('Documents Updated successfully');
                }
                
                this.Cancel();
              }, (error) => {
                this.toastr.error('Problem with the sevice. Please try later : ' + error);
                this.SaveActive = true;
              });
            }
            load = true;
          }
          reader.readAsDataURL(this.FileuploadEvent.target.files[i]);
          _lBS_SYS_Attachments.ID = this.id;
          _lBS_SYS_Attachments.PhysicalFileName = this.FileuploadEvent.target.files[i].name;
          _lBS_SYS_Attachments.CreatedBY = localStorage.getItem('LoginID');
          _lBS_SYS_Attachments.Size = this.FileuploadEvent.target.files[i].size;
          _lBS_SYS_Attachments.RecID = this.RecID;//'';
          _lBS_SYS_Attachments.FileType = this.FileuploadEvent.target.files[i].name.split('.').pop();
          _lBS_SYS_Attachments.Description = this.description;
  
          //this._attachments.AttachmentFiles.push(_attachmentFiles);
        }
        console.log(this._attachments);
      }else{
        this.SaveActive = true;
        this.toastr.warning('Please upload file');
      }
    }
    // else if(this.Mode == "Edit")
    // {
    //   debugger
    //   this.SaveActive = false;
    //   let lstlBS_SYS_Attachments: LBS_SYS_Attachments[] = [];
    //   if (this.FileuploadEvent  && this.FileuploadEvent.target.files && this.FileuploadEvent.target.files[0]) {
    //     var filesAmount = this.FileuploadEvent.target.files.length; 
    //     for (let i = 0; i < filesAmount; i++) {
    //       let _lBS_SYS_Attachments = new LBS_SYS_Attachments();
    //       var reader = new FileReader();
    //       reader.onload = (event: any) => {
    //         _lBS_SYS_Attachments.FileBinary = event.target.result;
    //       _lBS_SYS_Attachments.ID = this.id;
    //       _lBS_SYS_Attachments.PhysicalFileName = this.FileuploadEvent.target.files[i].name;
    //       // _lBS_SYS_Attachments.CreatedBY = localStorage.getItem('LoginID');
    //       _lBS_SYS_Attachments.Size = this.FileuploadEvent.target.files[i].size;
    //        _lBS_SYS_Attachments.RecID = this.RecID;//'';
    //       _lBS_SYS_Attachments.FileType = this.FileuploadEvent.target.files[i].name.split('.').pop();
    //       _lBS_SYS_Attachments.Description = this.description;
    //       lstlBS_SYS_Attachments.push(_lBS_SYS_Attachments);
    //       if (lstlBS_SYS_Attachments.length == filesAmount) {
    //         this.saveAttachment(lstlBS_SYS_Attachments);
    //       }
    //     }
    //       reader.readAsDataURL(this.FileuploadEvent.target.files[i]);
    //     }
    //     console.log(this._attachments);
    //   }
    //   else{
    //     debugger
    //     let _lBS_SYS_Attachments = new LBS_SYS_Attachments();
    //     _lBS_SYS_Attachments.ID = this.id;
    //     _lBS_SYS_Attachments.PhysicalFileName = this.physicalFileName;
    //     _lBS_SYS_Attachments.RecID = this.RecID;
    //       _lBS_SYS_Attachments.FileBinary = this.file;
    //       _lBS_SYS_Attachments.FileType = this.fileType;
    //       _lBS_SYS_Attachments.Size = this.fileSize;
    //       _lBS_SYS_Attachments.Description = this.description;
    //       lstlBS_SYS_Attachments.push(_lBS_SYS_Attachments);
    //       this.saveAttachment(lstlBS_SYS_Attachments)
    //     }
    //     console.log(this._attachments);
    //   }
  }

  AddNew(): void {
    this.Mode = 'Add';
    this.id=null;
  }

  Cancel(): void {
    this.Mode = "List";
    this.SaveActive = true;
    this.description = '';
    this.FileuploadEvent=null;
    this.BindAllAttachments();
  }

  Edit(ID): void { 
    this.Mode = 'Edit';
    this.BindAttachmentById(ID); 
  }
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Download') {
      if(!event.data.deleted){
        this.GetAttachment(event.data)
      }else{
        this.toastr.warning('Only Active records can be downloaded');
      }

    }
    else if (colId == 'Edit') {
      this.Edit(event.data.id);
      this.id=event.data.id;
    }
    else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
    else if (colId == 'Price') {
      // this.RecID = event.data.RecID;
      // this.description = event.data.Description;
      // this.physicalFileName = event.data.physicalFileName;
      // this.file = event.data.FileBinary;
      // this.PreviewAttachment(event.data.id);
      // this.Mode = 'Price';
  }
}
  CustomdownloadIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-download"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDetailIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-align-justify"></i></div>';
    return cellContent
  }
  onDeleteChecked(ID) {

    this.attachmentsService.deleteAttachmentsBYID(ID, localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.BindAllAttachments();
      }

    }, (error) => {
      // console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  GetAttachment(data) {
    this.attachmentsService.getAttachmentByID(data.id).subscribe((resp: any) => {
      console.log(resp);
      resp.data.attachments;
      let fileBinary = resp.data.attachments.fileBinary.split(",");
debugger;
      const linkSource = 'data:application/xlsx;base64,' + fileBinary[1];
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = resp.data.attachments.physicalFileName;
      downloadLink.click();

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  onModeChange(mode: any) {
        this.Mode = mode;	
      }
  PreviewAttachment(id) {
    this.attachmentsService.getAttachmentByID(id).subscribe((resp: any) => {
      console.log(resp);
      resp.data.attachments;
      let fileBinary = resp.data.attachments.fileBinary.split(",");

      const linkSource = 'data:application/xlsx;base64,' + fileBinary[1];
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      const preview = document.querySelector('img');
      //const preview = document.querySelector('#test123');
      const reader = new FileReader();
      preview.src = linkSource;
//       reader.readAsDataURL(resp.data.attachments.fileBinary);
this.imgURL = linkSource;
      reader.readAsDataURL(resp.data.attachments.fileBinary); // read file as data url
      
      reader.onload = (event) => { // called once readAsDataURL is completed
      this.imgURL = linkSource;
      }

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindAttachmentById(ID) {
    this.id=ID;
     this.attachmentsService.getAttachmentByID(ID).subscribe((resp: any) => {
       console.log(resp);
       if (resp.isSuccess == true) {
        this.RecID = resp.data.attachments.recID;
        this.description = resp.data.attachments.description;
        this.physicalFileName = resp.data.attachments.physicalFileName;
        this.file = resp.data.attachments.fileBinary;
        this.fileSize = resp.data.attachments.size;
        this.fileType = resp.data.attachments.fileType;
       }
     },
       (error) => {
         console.error('Problem with the sevice. Please try later : ' + error);
       });
   }
  //  saveAttachment(lstlBS_SYS_Attachments)
  // {
  //   this.attachmentsService.addattachments(lstlBS_SYS_Attachments).subscribe((resp: any) => {
  //     console.log(resp);
  //     this.SaveActive = true;
  //     this.toastr.success('Documents Updated successfully');
  //     this.Cancel();
  //   }, (error) => {
  //     this.toastr.error('Problem with the sevice. Please try later : ' + error);
  //     this.SaveActive = true;
  //   });  
  // }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
