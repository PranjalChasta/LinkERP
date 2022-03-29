import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { DocumentsService } from '../services/documents.service';
import { LBSDOCDocuments } from 'src/app/models/doc/lbs-doc-documents';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ngx-custom-validators';
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  DocumentForm: FormGroup;

  Loading: any = false;
  Mode: any = 'List';

  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  IsActive: boolean = true;


  Roles: any[] = [];
  Categories: any[] = [];
  SubCategories: any[] = [];
  Documents: any[] = [];
  DocumentAttributes: any[] = [];
  ColumnDefs: any;
  PageSize: any;
  AgLoad: any = true;

  DocumentAttributesCols: any;

  FileID: any = '00000000-0000-0000-0000-000000000000';

  constructor(private cryptoAes: CryptoAes,
    private FB: FormBuilder,
    private documentsService: DocumentsService,
    private deleteRecordsService: DeleteRecordsService,
    private toastr: ToastrService) { }

  Submitted = false;
  ngOnInit() {
    this.PageSize = "50";

    this.DocumentForm = this.FB.group({
      RoleAccessGroup: ['-1', [CustomValidators.notEqual('-1')]],
      FileBinary: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      PhysicalFileName: [''],
      Category: ['-1', [CustomValidators.notEqual('-1')]],
      SubCategory: ['-1', [CustomValidators.notEqual('-1')]]
    });
    this.SetPermissions();
    this.ColumnDefs = [
      { headerName: 'File Name', field: 'fileName', sortable: true, filter: true },
      { headerName: 'Description', field: 'description', sortable: true, filter: true },
      { headerName: 'Category', field: 'category', sortable: true, filter: true },
      { headerName: 'Sub Category', field: 'subCategory', sortable: true, filter: true },
      { headerName: 'Role', field: 'roleName', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Download', cellRenderer: this.CustomdownloadIconFunc, type: 'Action', hide: false },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
    this.BindAllDocuments();
    this.BindRoles();
    this.BindCategories();
  }

  CustomdownloadIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-download"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }

  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Download') {
      // alert(event.data.id);
      if (!event.data.deleted) {
        //this.GetAttachment(event.data)
        this.DownloadFile(event.data.id);
      } else {
        this.toastr.warning('Please active this record to make download');
      }

    } else if (colId == 'Edit') {
      if (event.data.deleteStatus == 'Active') {
        this.DocumentForm.enable();
        this.IsActive = true;
      } else {
        this.DocumentForm.disable();
        this.IsActive = false;
      }
      this.Edit(event.data.id)
    } else if (colId == 'Delete') {
      debugger;
      this.deleteRecordsService.deleteRecordsBYID(event.data.id, 'LBS_DOC_Documents', localStorage.getItem('LoginID')).subscribe((resp: any) => {

        this.Mode = 'List';
        this.BindAllDocuments();
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  DownloadFile(FileID) {
    debugger;
    this.documentsService.downloadFile(FileID).subscribe((resp: any) => {
      debugger;
      let fileData = btoa(resp.data.fileData.fileBinary);
      let fileBinary = fileData.split(",");

      const linkSource = 'data:application/xlsx;base64,' + fileBinary[0];
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = resp.data.fileData.physicalFileName;
      downloadLink.click();
    }, (error: any) => {

    });
  }

  Edit(ID: any) {
    this.FileID = ID;
    this.BindDocumentByID(ID);
    this.Mode = 'Edit';
    this.DocumentForm.get('FileBinary').clearValidators();
    this.DocumentForm.get('FileBinary').updateValueAndValidity();

  }
  BindAllDocuments() {
    this.AgLoad = false;
    this.Loading = true;
    this.documentsService.getAllDocuments().subscribe((resp: any) => {
      this.Documents = resp.data.documents;
      this.AgLoad = true;
      this.Loading = false;
    }, (error: any) => {
      this.Loading = false;
    });
  }
  SearchText: any = '';
  BindDocumentsBySearch() {
    //alert(this.SearchText);
    this.AgLoad = false;
    this.Loading = true;
    this.documentsService.getDocumentsBySearch(this.SearchText).subscribe((resp: any) => {
      this.Documents = resp.data.documents;
      this.AgLoad = true;
      this.Loading = false;
    }, (error: any) => {
      this.Loading = false;
    });
  }
  BindDocumentByID(FileID) {
    let document: any;
    this.Loading = true;
    this.documentsService.getDocumentByID(FileID).subscribe((resp: any) => {
      document = resp.data.document;
      this.BindSubCategories(resp.data.document.categoryID);
      this.DocumentForm.patchValue({
        RoleAccessGroup: resp.data.document.roleAccessGroup,
        Description: resp.data.document.description,
        Category: resp.data.document.categoryID,
        SubCategory: resp.data.document.subCategoryID
      });
      this.DocumentAttributesCols = [
        { headerName: 'Attribute Code', field: 'attributeCode', sortable: true, filter: true, checkboxSelection: false, editable: false },
        { headerName: 'Attribute Name', field: 'attributeName', sortable: true, filter: true, checkboxSelection: false, editable: false },
        { headerName: 'Value ', field: 'attributeValue', sortable: true, filter: true },
      ];
      this.BindDocumentAttributes()

      this.Loading = false;
    }, (error: any) => {
      this.Loading = false;
    });
  }

  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "502");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.DocumentForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.DocumentForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.DocumentForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  transform(size: number, extension: string = 'MB') {
    return (size / (1024 * 1024)).toFixed(2);
  }
  FileName: any = '';
  onSelectFile(evt) {

    const file = evt.target.files[0];
    this.FileName = evt.target.files[0].name;
    // debugger;
    // let reader = new FileReader();
    // let fileBinary: any;
    // reader.readAsDataURL(file);
    // reader.onload = (e) => {
    //   fileBinary = e.target.result;
    // };
    // alert(fileBinary);
    // const fileSize=evt.target.files[0].size;
    const fileSize = evt.target.files[0].size;
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
      //this.CompanyLogoVariable.nativeElement.value = '';
    }
  }
  base64textString: any;
  handleReaderLoaded(e) {
    debugger;

    var binaryString = e.target.result;
    this.base64textString = btoa(binaryString);

    //this.Logo =  this.base64textString;

    // console.log(btoa(binaryString));
    // let imageData = this.convertDataURIToBinary(this.base64textString);
    debugger;
    this.DocumentForm.patchValue({
      FileBinary: this.base64textString,
      PhysicalFileName: this.FileName
    });
  }


  AddNew(): void {
    this.Mode = 'Add';
    //this.AddDocumentAttributesCols();
    this.DocumentAttributesCols = [
      { headerName: 'Attribute Code', field: 'attributeCode', sortable: true, filter: true, checkboxSelection: false, editable: false },
      { headerName: 'Attribute Name', field: 'attributeName', sortable: true, filter: true, checkboxSelection: false, editable: false },
      { headerName: 'Value ', field: 'attributeValue', sortable: true, filter: true },
    ];
    this.BindDocumentAttributes();
    this.DocumentForm.get('FileBinary').setValidators([Validators.required]);
    this.DocumentForm.get('FileBinary').updateValueAndValidity();
  }

  AddDocumentAttributesCols() {
    this.DocumentAttributesCols = [
      { headerName: 'Attribute Code', field: 'attributeCode', sortable: true, filter: true, checkboxSelection: false, editable: false },
      { headerName: 'Attribute Name', field: 'attributeName', sortable: true, filter: true, checkboxSelection: false, editable: false },
      { headerName: 'Value ', field: 'attributeValue', sortable: true, filter: true },
    ];
  }

  Cancel(): void {
    this.Mode = "List";
    // this.SaveActive = true;
    // this.description = '';
    // this.BindAllAttachments();
    this.ResetDocumentForm();
  }
  BindRoles() {
    this.documentsService.getRoles().subscribe((resp: any) => {
      this.Roles = resp.data.roles;
    }, (error: any) => {

    });
  }
  BindCategories() {
    this.documentsService.getCategories().subscribe((resp: any) => {
      this.Categories = resp.data.categories;
    }, (error: any) => {

    });
  }
  onCategoryChange(ID) {
    if (ID == '-1')
      this.SubCategories = [];
    else
      this.BindSubCategories(ID);
  }

  BindSubCategories(CategoryID) {
    this.documentsService.getSubCategories(CategoryID).subscribe((resp: any) => {
      this.SubCategories = resp.data.subCategories;
    }, (error: any) => {

    });
  }
  BindDocumentAttributes() {
    this.AgLoad = false;
    this.documentsService.getDocumentAttributes(this.FileID).subscribe((resp: any) => {
      this.DocumentAttributes = resp.data.documentAttributes;
      console.log(this.DocumentAttributes);
      this.AgLoad = true;
    }, (error: any) => {

    });
  }


  get f() { return this.DocumentForm.controls; }

  onSaveDocument() {
    debugger;
    this.Submitted = true;
    if (this.DocumentForm.invalid) {
      return;
    }

    let lBSDOCDocuments: any = new LBSDOCDocuments()

    lBSDOCDocuments.RoleAccessGroup = this.DocumentForm.get('RoleAccessGroup').value;
    lBSDOCDocuments.FileBinary = this.DocumentForm.get('FileBinary').value;
    lBSDOCDocuments.Description = this.DocumentForm.get('Description').value;
    if (this.DocumentForm.get('PhysicalFileName').value != null)
      lBSDOCDocuments.PhysicalFileName = this.DocumentForm.get('PhysicalFileName').value;
    lBSDOCDocuments.CategoryID = this.DocumentForm.get('Category').value;
    lBSDOCDocuments.SubCategoryID = this.DocumentForm.get('SubCategory').value;

    this.Loading = true;
    // console.log(this.DocumentAttributes);


    if (this.Mode == 'Add') {
      let DocumentDetails = {
        LBS_DOC_Documents: lBSDOCDocuments,
        DocumentAttributes: this.DocumentAttributes
      }
      this.documentsService.addDocument(DocumentDetails).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.FileID = resp.data.id;
          this.toastr.success('Document saved successfully');
          this.BindAllDocuments();
          this.ResetDocumentForm();
        }
        this.Loading = false;
      }, (error: any) => {
        this.Loading = false;

      });
    }
    else if (this.Mode == 'Edit') {
      debugger;
      lBSDOCDocuments.ID = this.FileID;
      let DocumentDetails = {
        LBS_DOC_Documents: lBSDOCDocuments,
        DocumentAttributes: this.DocumentAttributes
      }
      this.documentsService.updateDocument(DocumentDetails).subscribe((resp: any) => {
        if (resp.isSuccess) {
        //  this.FileID = resp.data.id;
          this.toastr.success('Document updated successfully');
          this.BindAllDocuments();
          this.ResetDocumentForm();
        }
        this.Loading = false;
      }, (error: any) => {
        this.Loading = false;

      });
    }
  }

  ResetDocumentForm() {
    this.Mode = 'List';
    this.Submitted = false;
    this.DocumentForm.patchValue({
      RoleAccessGroup: '-1',
      FileBinary: '',
      Description: '',
      PhysicalFileName: '',
      Category: '-1',
      SubCategory: '-1'
    });

    this.FileID = '00000000-0000-0000-0000-000000000000';
  }

}
