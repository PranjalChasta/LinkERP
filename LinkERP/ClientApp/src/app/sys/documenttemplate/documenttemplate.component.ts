import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocumenttemplateService } from '../services/documenttemplate.service';
import { SysCommonService } from '../services/sys-common.service';
import { LBSSYSDocumentTemplates } from 'src/app/models/sys/lbs-sys-document-templates';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
@Component({
  selector: 'app-documenttemplate',
  templateUrl: './documenttemplate.component.html',
  styleUrls: ['./documenttemplate.component.css']
})
export class DocumenttemplateComponent implements OnInit {
  Mode: any = 'List';
  AccessTab: string;
  Submitted: boolean;
  BindDocumentTemplate: any;
  Loading: any = false;
  DocumentTemplateForm: FormGroup;
  LBSSYSDocumentTemplates: any;
  Companies: any[] = [];
  LBSSYSCompany: any;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  CompanyId = localStorage.getItem('CompanyID');
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  modalRef: BsModalRef;
  addreadonly: boolean;
  SelectedDocumentTemplate: any;
  HeaderNames: any;
  TemplateName: any;
  IsActive: boolean;
  PageSize: any;
  Currentpage: string;
  constructor(
    private documenttemplateservice: DocumenttemplateService,
    private DocumentTemplateFB: FormBuilder,
    private sysCommonService: SysCommonService,
    private toastrModule: ToastrModule,
    private toastrService: ToastrService,
    private deleteRecordsService: DeleteRecordsService,
    private cryptoAes: CryptoAes,
    public modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.Currentpage = "0";
    this.AccessTab = "DocumentTemplate";
    this.HeaderNames = "DocumentTemplate";
    this.Submitted = false;
    this.AgLoad = false;
    this.Mode = "List";
    this.PageSize = "50";
    this.CreateForm();
    this.SetPermissions();

    this.BindDocumentTemplates();
    //this.BindCompanies();
    this.AgGridColumns();
    this.CKEditorConfig();
  }

  /* CK Editor */

  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  @ViewChild("myckeditor") ckeditor: any;

  CKEditorConfig() {
    this.ckeConfig = {
      allowedContent: false,
      forcePasteAsPlainText: true,
      font_names: 'Arial;Times New Roman;Verdana',
      toolbarGroups: [
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
        { name: 'forms', groups: ['forms'] },
        '/',
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
        { name: 'links', groups: ['links'] },
        { name: 'insert', groups: ['insert'] },
        '/',
        { name: 'styles', groups: ['styles'] },
        { name: 'colors', groups: ['colors'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'others', groups: ['others'] },
        { name: 'about', groups: ['about'] }
      ],
      removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,Outdent,Indent,CreateDiv,Blockquote,BidiLtr,BidiRtl,Language,Unlink,Anchor,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About'
    };
  }

  onChange($event: any): void {
    console.log("onChange", $event);
  }


  get f() { return this.DocumentTemplateForm.controls; }

  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "108");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.DocumentTemplateForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.DocumentTemplateForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.DocumentTemplateForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  CreateForm() {
    this.DocumentTemplateForm = this.DocumentTemplateFB.group({
      ID: [''],
      TemplateName: ['', Validators.required],
      TemplateData: [''],
      //Organisation: ['-1']
    });
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Name', field: 'templateName', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 40, },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, width: 10, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access, width: 10, }
    ];
  }
  //BindCompanies
  BindCompanies() {
    this.Loading = true;
    this.sysCommonService.getCompanies().subscribe((resp: any) => {
      this.Companies = resp.data.companies;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }
  //To Bind the data of all Document Template to the Grid
  BindDocumentTemplates() {
    this.Loading = true;
    this.AgLoad = false;
    this.documenttemplateservice.getAllDocumentTemplates().subscribe((resp: any) => {
      this.BindDocumentTemplate = resp.data.documents;
      this.RowData = resp.data.documents;
      this.AgLoad = true;
      this.Loading = false;

    }, (error) => {
      this.Loading = false;
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To get the data of particular Document Template By ID
  BindDocumentTemplateByID(ID) {
    this.documenttemplateservice.getDocumentTemplateByID(ID).subscribe((resp: any) => {
      let lBSSYSDocumentTemplates: any = resp.data.country;
      this.SelectedDocumentTemplate = lBSSYSDocumentTemplates.id;
      this.TemplateName = lBSSYSDocumentTemplates.templateName;
      this.DocumentTemplateForm.patchValue({
        ID: lBSSYSDocumentTemplates.id,
        //Organisation: lBSSYSDocumentTemplates.companyID,
        TemplateName: lBSSYSDocumentTemplates.templateName,
        TemplateData: lBSSYSDocumentTemplates.templateData
      });
      if (!lBSSYSDocumentTemplates.deleted) {
        this.DocumentTemplateForm.enable();
        this.IsActive = true;
      } else {
        this.DocumentTemplateForm.disable();
        this.IsActive = false;
      }
      //  this.DocumentTemplateForm.get('TemplateName').disable();
      this.Mode = 'Edit';
    }, (error) => {
      this.Loading = false;
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To Bind the data of  Document Template to controls for edit/update.
  Edit(ID): void {
    this.BindDocumentTemplateByID(ID);

    //this.DocumentTemplateForm.get('TemplateName').disable();
    this.addreadonly = true;
  }
  //Delete the record 
  onDeleteChecked(ID) {
    this.Loading = true;
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SYS_DocumentTemplates', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.Mode = 'List';
      this.BindDocumentTemplates();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.Mode = "List";
  }
  //Add New Document Template
  AddNew(): void {
    this.Mode = 'Add';
    this.DocumentTemplateForm.enable();
    this.addreadonly = false;
    this.IsActive = true;
    this.TemplateName = '';
  }
  //To save the Document Template to database table by calling the API service
  /*  onSave() {
     this.confirmation.ConfirmationPopup('Are you sure to save record?');
   } */
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    this.Submitted = true;
    debugger
    if (this.DocumentTemplateForm.invalid) {
      return;
    }

    this.Loading = true;
    let lBSSYSDocumentTemplates = new LBSSYSDocumentTemplates();
    lBSSYSDocumentTemplates.CompanyID = this.CompanyId;
    lBSSYSDocumentTemplates.CreatedBY = localStorage.getItem('LoginID');
    lBSSYSDocumentTemplates.TemplateName = this.DocumentTemplateForm.controls.TemplateName.value;
    lBSSYSDocumentTemplates.TemplateData = this.DocumentTemplateForm.controls.TemplateData.value;
    if (this.Mode == 'Add') {
      this.documenttemplateservice.addDocumentTemplate(lBSSYSDocumentTemplates).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastrService.success('Document Template added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindDocumentTemplates();
            this.Mode = 'List';
          } else {
            this.BindDocumentTemplates();
            this.Edit(resp.data.id);
            this.DocumentTemplateForm.get('TemplateName').disable();
            //this.Mode = 'Edit';
            this.Loading = false;
          }
          //this.ResetForm(); 
        }
        else {
          this.toastrService.warning('Template Name already exists');
          this.Loading = false;
        }
      }, (error) => {
        this.Loading = false;
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      lBSSYSDocumentTemplates.ID = this.DocumentTemplateForm.get('ID').value;
      this.documenttemplateservice.updateDocumentTemplate(lBSSYSDocumentTemplates).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastrService.success('Document Template updated successfully')
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindDocumentTemplates();
            this.Mode = 'List';
          } else {
            this.Edit(this.DocumentTemplateForm.get('ID').value);
            //this.ResetForm();
            this.BindDocumentTemplates();
            //this.Mode = 'Edit';
            this.Loading = false;
          }
        }
        else {
          this.toastrService.warning('Template Name already exists');
          this.Loading = false;
        }
        /* this.toastrService.success('Document Template updated successfully')
        {
          this.Edit(this.DocumentTemplateForm.get('ID').value);
          //this.ResetForm();
          this.BindDocumentTemplates();
         // this.Mode = 'List';
        } */
      }, (error) => {
        this.Loading = false;
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  // To Reset the Form After Add/Edit
  ResetForm() {
    this.TemplateName = '';
    this.DocumentTemplateForm.patchValue({
      ID: '',
      TemplateName: '',
      TemplateData: '',
      Organisation: '-1',
    });
    this.DocumentTemplateForm.markAsTouched();
    this.DocumentTemplateForm.markAsPristine();
    this.Submitted = false;
    this.DocumentTemplateForm.get('TemplateName').enable();
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {

    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.SelectedDocumentTemplate = event.data.id;
      this.TemplateName = event.data.templateName;
      this.Edit(event.data.id)

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
  /* FOR Aggird End  */
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
