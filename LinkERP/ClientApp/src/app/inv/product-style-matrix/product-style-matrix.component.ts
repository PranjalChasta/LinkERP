import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ProductStyleMatrixService } from '../services/product-style-matrix.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { LBS_INV_ProductStyleMatrix } from 'src/app/models/inv/LBS_INV_ProductStyleMatrix';
import { LbsInvProductStyleMatrixDetail } from '../../models/inv/lbs-inv-product-style-matrix-detail';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { ProductStyleMatrixDetailService } from '../services/product-style-matrix-detail.service';
import { ConditionalExpr } from '@angular/compiler';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
@Component({
  selector: 'app-product-style-matrix',
  templateUrl: './product-style-matrix.component.html',
  styleUrls: ['./product-style-matrix.component.css']
})
export class ProductStyleMatrixComponent implements OnInit {
  MatrixDetailInformationDetails: any;
  Mode: any = 'List';
  Submitted: boolean
  Loading: any = false;
  //Permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  StyleMatrixID: any;
  matrixDetailsInformation: any;
  PageSize: any;
  Companies: any[] = [];//Array variable of Companies data to bind grid
  ProductStyleMatrixAccess: LbsInvProductStyleMatrixDetail[] = [];//Array variable of ProductStyleMatrixAccess data to bind grid
  ProductMatrixDetails: LbsInvProductStyleMatrixDetail[] = [];//Array variable of ProductMatrixDetails data to bind grid

  ProductStyleMatrixForm: FormGroup;
  ProductStyleMatrixDetailForm: FormGroup;

  BindProductStyleMatrix: any;
  LBSSYSCompany: any;
  /* FOR Aggird Start */
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  /* FOR Aggird End  */
  CompanyId = localStorage.getItem('CompanyID');
  LbsInvProductstylematrixdetail = new LbsInvProductStyleMatrixDetail();
  lbsInvProductStyleMatrixDetails: LbsInvProductStyleMatrixDetail[] = [];
  AccessTab: string;
  // AccessTab: any = 'ProductsMatrix';
  IsActive: boolean;
  Currentpage: string;
  constructor(
    private matrixService: ProductStyleMatrixDetailService,
    private sysCommonService: SysCommonService,
    private productStyleMatrixService: ProductStyleMatrixService,
    private MareixService: ProductStyleMatrixDetailService,
    private ProductStyleMatrixFB: FormBuilder,
    private toastrModule: ToastrModule,
    private toastrService: ToastrService,
    private deleteRecordsService: DeleteRecordsService, private cryptoAes: CryptoAes
  ) { }

  ngOnInit() {
    this.Submitted = false;
    this.AgLoad = false;
    this.Mode = "List";
    this.Currentpage = "0";
    this.AccessTab = 'ProductsMatrix';
    this.PageSize = "50";
    //To create the ProductStyleMatrixForm Form Controls.
    this.CreateForm();
    // this.BindCompanies();
    this.BindProductStyleMatrixes();
    this.SetPermissions();
    this.ColumnDefs = [
      { headerName: 'Code', field: 'styleMatrixCode', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Name', field: 'styleMatrixName', sortable: true, filter: true, checkboxSelection: false },
      //{ headerName: 'Organisation', field: 'companyName', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
  CreateForm() {
    this.ProductStyleMatrixForm = this.ProductStyleMatrixFB.group({
      ID: [''],
      StyleMatrixCode: ['', Validators.required],
      StyleMatrixName: ['']
    });
  }

  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "204");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.ProductStyleMatrixForm.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          this.ProductStyleMatrixForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.ProductStyleMatrixForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  get f() { return this.ProductStyleMatrixForm.controls; }

  //BindCompanies
  BindCompanies() {
    this.sysCommonService.getCompanies().subscribe((resp: any) => {
      this.Companies = resp.data.companies;
      this.Loading = false;
    }, (error) => {
    });
  }
  //To bind the data of all Product Style Matrixes to the Grid
  BindProductStyleMatrixes() {
    this.Loading = true;
    this.AgLoad = false;
    this.productStyleMatrixService.getAllProductStyleMatrix().subscribe((resp: any) => {
      this.BindProductStyleMatrix = resp.data.productstylematrix;
      this.RowData = resp.data.productstylematrix;
      this.AgLoad = true;
      this.Loading = false;

    }, (error) => {

      this.Loading = false;
      this.toastrService.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the data of all ProductMatrix to the Grid.
  BindProductStyleMatrixByID(ID) {
    this.productStyleMatrixService.getProductStyleMatrixByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess) {
        this.BindProductDetails(resp.data.productstylematrix);
      }
    });
  }
  BindProductDetails(event) {

    this.StyleMatrixID = event.id;
    this.Mode = 'Edit';
    this.ProductStyleMatrixForm.patchValue({
      ID: event.id,
      StyleMatrixCode: event.styleMatrixCode,
      StyleMatrixName: event.styleMatrixName,
    });
    if (!event.deleted) {
      this.ProductStyleMatrixForm.enable();
      this.IsActive = true;
    } else {
      this.ProductStyleMatrixForm.disable();
      this.IsActive = false;
    }
    this.AccessTab = "ProductsMatrix";
  }


  Cancel() {
    this.Mode = "List";
    this.Submitted = false;
    this.ResetForm();
    this.BindProductStyleMatrixes();
  }
  //Add New Product Style Matrix
  AddNew(): void {
    this.Mode = 'Add';
    this.IsActive = true;
    this.ProductStyleMatrixForm.enable();
  }
  OnCancel() {
    this.ResetForm();
    this.Mode = 'Add';
  }
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  //To save the Product Style Matrix to database table by calling the API service
  onSave(saveAction) {

    this.Submitted = true;
    if (this.ProductStyleMatrixForm.invalid) {
      return;
    }
    // this.Loading = true;
    let lBSINVProductStyleMatrix = new LBS_INV_ProductStyleMatrix();
    lBSINVProductStyleMatrix.CompanyID = this.CompanyId;
    lBSINVProductStyleMatrix.StyleMatrixCode = this.ProductStyleMatrixForm.controls.StyleMatrixCode.value;
    lBSINVProductStyleMatrix.StyleMatrixName = this.ProductStyleMatrixForm.controls.StyleMatrixName.value;
    lBSINVProductStyleMatrix.CreatedBY = localStorage.getItem('LoginID');
    //If the Mode is Add then it will insert data to DB else update the row by ID
    if (this.Mode == 'Add') {
      this.productStyleMatrixService.addProductStyleMatrix(lBSINVProductStyleMatrix).subscribe((resp: any) => {

        if (resp.isSuccess) {
          this.toastrService.success('Product Style Matrix added Successfully')
          //this.ResetForm();
          // this.BindProductStyleMatrixes();
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindProductStyleMatrixes();
            this.Mode = 'List';
          }
          else {
            this.BindProductStyleMatrixByID(resp.data.id);
            this.BindProductStyleMatrixes();
          }
          //  this.ResetForm();
          // this.BindProductStyleMatrixByID(resp.data.id);
          this.Loading = false;
        }
        else {

          this.toastrService.warning('Style Matrix Code already exists');
          this.Loading = false;
        }
      }, (error) => {
        // console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }

    else if (this.Mode == 'Edit') {
      lBSINVProductStyleMatrix.ID = this.ProductStyleMatrixForm.get('ID').value;
      this.productStyleMatrixService.updateProductStyleMatrix(lBSINVProductStyleMatrix).subscribe((resp: any) => {

        if (resp.isSuccess) {
          this.toastrService.success('Product Style Matrix updated Successfully')
          //  this.Mode = 'Edit';
          //  this.BindProductStyleMatrixByID(this.ProductStyleMatrixDetailForm.get('ID').value);
          //   this.ResetForm();

          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.BindProductStyleMatrixes();
          }
          else {
            this.Mode = 'Edit';
            this.BindProductStyleMatrixByID(this.ProductStyleMatrixForm.get('ID').value);
          }

        }
        else {
          this.toastrService.warning('Style Matrix Code already exists');
          this.Loading = false;
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    this.Loading = false;
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {

    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Mode = 'Edit';
      this.BindProductDetails(event.data);
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

  //Delete the record 
  onDeleteChecked(ID) {
      debugger;
      this.Loading = true;
      this.productStyleMatrixService.checkProductStyleMatrix(ID).subscribe((resp: any) => {
        if (resp.isSuccess && resp.data.exists != 1) {
          this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_ProductStyleMatrix', localStorage.getItem('LoginID')).subscribe((resp: any) => {
            this.Mode = 'List';
            this.BindProductStyleMatrixes();
          }, (error) => {
            console.error('Problem with the sevice. Please try later : ' + error);
          });
        }
        else {
          this.toastrService.warning('This Product Style Matrix is in Use! Cant Delete!');
          this.Loading = false;
          return;
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  //Resetting the form after Add/Edit
  ResetForm() {
    this.ProductStyleMatrixForm.patchValue({
      ID: '',
      StyleMatrixCode: '',
      StyleMatrixName: ''

    });
    //this.ProductStyleMatrixDetailForm.markAsTouched();
    //this.ProductStyleMatrixDetailForm.markAsPristine();
    this.Submitted = false;
  }

  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}


