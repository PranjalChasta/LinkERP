import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { InventoryImageService } from '../../services/inventory-image.service';
import { InventoryService } from '../../services/inventory.service';
import { LBSINVInventoryImage } from 'src/app/models/inv/lbs-inv-inventory-image';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';

@Component({
  selector: 'app-inventory-image',
  templateUrl: './inventory-image.component.html',
  styleUrls: ['./inventory-image.component.css']
})
export class InventoryImageComponent implements OnInit {
  @Input() InventryID: any;
  @Input() IsInventoryActive: boolean;
  Mode: any = 'List';
  Submitted: any = false;
  HeaderNames: any;
  CompanyId = localStorage.getItem('CompanyID');
  InventoryImageForm: FormGroup
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  AccessTab: string;
  SelectedInventryID: any;
  Loading: any = false;
  BindInventoryImage: any;
  ProductName: any;
  fileToUpload: any;
  FileName: any;
  FileType: any;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  PageSize: any;
  Currentpage: string;
  constructor(
    private toastr: ToastrService,
    private FB: FormBuilder,
    private cryptoAes: CryptoAes,
    private deleteRecordsService: DeleteRecordsService,
    private inventoryImageService: InventoryImageService,
    private inventoryService: InventoryService,
    private sharedFormatterService: SharedFormatterService
  ) { }

  ngOnInit() {
    this.CreateForm();
    this.SetPermissions();
    this.AgLoad = false;
    this.ColumnDefs = [
      { headerName: ' Name', field: 'fileName', sortable: true, filter: true, checkboxSelection: false, },
      { headerName: 'Creation Date', field: 'dateCreated', sortable: true, filter: true,  },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access || !this.IsInventoryActive }
    ];
    this.Currentpage = "0";
    this.PageSize = "50";
    this.BindInventoryImages();
  }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "201");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.InventoryImageForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryImageForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryImageForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  CreateForm() {
    this.InventoryImageForm = this.FB.group({
      ID: [''],
      ProductID: ['-1'],
      Image: ['']
    });
  }
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Delete') {
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
  BindInventoryImages() {
    this.Mode = "List";
    this.AgLoad = false;
    this.inventoryImageService.getInventoryImageByInventoryID(this.InventryID).subscribe((resp: any) => {
      this.BindInventoryImage = resp.data.inventoryimage;
      this.RowData = resp.data.inventoryimage;
      this.RowData .forEach(element => {
        let dateCreated = {'value': element.dateCreated}
        element.dateCreated=this.sharedFormatterService.dateTimeFormatter(dateCreated);
       
      });
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onSelectFile(event) {
    this.FileName = event.target.files[0].name;
    this.FileType = event.target.files[0].type;
    // To display the selected image before deciding to upload it.
    let reader = new FileReader();

    // Gets a 'base64' representation of an image.
    console.log(event.target.files[0].name)
    console.log(event.target.files[0].type)
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event2) => {
      // Sets the html <img> tag to the image.
      this.fileToUpload = reader.result;

    };

    // Call the service to use the web api to add the image to the database.
    console.log(this.fileToUpload);


  }
  OnCancel() {
    this.Cancel();
    this.Mode = 'Add';
  }
  onSaveold(saveAction) {
    debugger;
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }

  onSave(saveAction) {
    debugger;
    this.Submitted = true;
    if (this.InventoryImageForm.invalid || this.fileToUpload == null) {
      this.toastr.warning('Please select image to upload.');
      return;
    }
    let inventoryimage = new LBSINVInventoryImage();
    inventoryimage.CompanyID = this.CompanyId;
    inventoryimage.ProductID = this.InventryID;
    inventoryimage.Image = this.fileToUpload;
    inventoryimage.FileName = this.FileName;
    inventoryimage.FileType = this.FileType;
    inventoryimage.CreatedBY = localStorage.getItem('LoginID');
    // inventoryimage.DateCreated = this.InventoryImageForm.get('DateCreated').value;
    //If the mode is Add then it will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.inventoryImageService.addInventoryImage(inventoryimage).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success(' Inventory Image added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindInventoryImages();
            this.Mode = 'List';

          }
          else {
            this.BindInventoryImages();
            this.Mode = 'List';
            this.Loading = false;
            this.fileToUpload = null;
          }
          // this.BindInventoryImages();
          // this.Mode = 'List';
          // this.Loading = false;
        }
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }
  Cancel() {
    this.Mode = 'List';
    this.fileToUpload = null;
  }
  AddNew() {
    this.Mode = 'Add';
  }
  //Delete the record
  onDeleteChecked(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryImage', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindInventoryImages();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
