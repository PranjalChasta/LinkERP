import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import { LbsInvProductstylematrixdetail } from 'src/app/models/inv/lbs-inv-productstylematrixdetail';
import { ToastrService } from 'ngx-toastr';
import { ProductStyleMatrixDetailService } from '../../services/product-style-matrix-detail.service';
import { LbsInvProductStyleMatrixDetail } from 'src/app/models/inv/lbs-inv-product-style-matrix-detail';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { ProductStyleMatrixService } from '../../services/product-style-matrix.service';
@Component({
  selector: 'app-product-style-matrix-detail',
  templateUrl: './product-style-matrix-detail.component.html',
  styleUrls: ['./product-style-matrix-detail.component.css']
})
export class ProductStyleMatrixDetailComponent implements OnInit {
  @Output() OnMatrixClose = new EventEmitter();
  ProductStyleMatrixDetailForm: FormGroup;
  Loading: any = false;
  Mode: any = 'List';
  submitted: boolean;
  @Input() Write_Access: boolean;
  //Permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  ProductDetails: any[] = [];//Array variable of ProductDetails data to bind grid
  RowData: any;
  AgLoad: boolean = false
  Addbuttonenable: boolean;
  Isvalid: boolean;
  @Input() StyleMatrixID: any;//Array variable of StyleMatrixID data to bind grid
  IsActive: boolean;
  ProductMatrices: any[] = [];//Array variable of matrix data to bind grid

  CompanyId = localStorage.getItem('CompanyID');
  TotalRow: any;
  isstylematrixcode: boolean;
  @Input() isActive: boolean;
  constructor(private matrixService: ProductStyleMatrixDetailService,
    private deleteservice: DeleteRecordsService,
    private toastr: ToastrService, private FB: FormBuilder, private productStyleMatrixService: ProductStyleMatrixService) { }

  ngOnInit() {
    //To create the ProductStyleMatrixDetailForm Form Controls.
    this.AgLoad = false;
    this.CreateForm();
    this.BindProductMatrixStleDetailByStyleID();
  }
  CreateForm() {
    this.ProductStyleMatrixDetailForm = this.FB.group({
      ID: [''],
      // StyleMatrixID: [this.StyleMatrixID],
      StyleMatrixDetailCode: [''],
      StyleMatrixDetailName: [''],
    })
  }
  get f() { return this.ProductStyleMatrixDetailForm.controls; }



  //Bind ProductmatrixDetailBy StyleMatrixID
  BindProductMatrixStleDetailByStyleID() {
    //this.IsActive=false;
    this.Loading = true;
    this.AgLoad = false;
    this.isstylematrixcode = false;
    this.ProductDetails = [];
    this.matrixService.getMatrixExistsInProductMatrixAccess(this.StyleMatrixID).subscribe((resp: any) => {
      this.ProductDetails = resp.data.matrixDetailsbyId;
      this.RowData = resp.data.matrixDetailsbyId;
      if (this.RowData.length == 0) {
        this.addnew();
      }
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      //    console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Deleteindex(i) {
    this.RowData.splice(i, 1);
  }

  //Reset the form
  ResetForm() {
    this.ProductStyleMatrixDetailForm.patchValue({
      ID: '',
      StyleMatrixDetailCode: '',
      StyleMatrixDetailName: ''
    });
  }

  onDelete(ID, detailCode, detailName) {
    this.productStyleMatrixService.checkProductStyleMatrixDetail(this.StyleMatrixID, detailCode).subscribe((resp: any) => {
      if (resp.isSuccess && resp.data.exists != 1) {
        this.deleteservice.deleteRecordsBYID(ID, 'LBS_INV_ProductStyleMatrixDetail', localStorage.getItem('LoginID')).subscribe((resp: any) => {
          if (resp.isSuccess == true) {
            this.BindProductMatrixStleDetailByStyleID();
          }
        }, (error) => {

        });
      }
      else {
        this.toastr.warning('This Product Style Matrix is in Use! Cant Delete!');
        this.Loading = false;
        return;
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });

  }

  addnew() {
    //   this.IsActive=false;
    this.AgLoad = false;
    let object = {
      'companyID': this.CompanyId,
      'styleMatrixID': this.StyleMatrixID,
      'StyleMatrixDetailCode': '',
      'StyleMatrixDetailName': '',
      "id": '',
      'deleteStatus': "Active"
    }
    this.RowData.push(object);
    this.AgLoad = true;
  }

  Cancel(): void {
    this.BindProductMatrixStleDetailByStyleID();
    this.submitted = false;
    this.OnMatrixClose.emit();
  }
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  UpdateChanges(saveAction) {
    //console.log(this.RowData);
    this.matrixService.updateproductmatrixdetailList(this.RowData).subscribe((resp: any) => {
      if (!resp.isSuccess) {
        this.toastr.warning('ProductMatrix Detail details code is already exist');
        // this.BindProductMatrixStleDetailByStyleID();
        this.Mode = 'List';
      } else {
        this.toastr.success('ProductMatrix Detail details Saved successfully');
        if (saveAction == 'Close') {
          this.Cancel();
          //this.BindProductMatrixStleDetailByStyleID();
          this.Mode = 'List';
        }
        else {
          this.BindProductMatrixStleDetailByStyleID();
          //  this.Mode = 'List';
          this.Loading = false
        }
      }
      // this.BindProductMatrixStleDetailByStyleID();
      this.AgLoad = true;
    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}



