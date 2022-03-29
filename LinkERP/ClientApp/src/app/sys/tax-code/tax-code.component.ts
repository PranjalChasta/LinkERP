import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TaxCodeService } from '../services/tax-code.service';
import { LBSSYSTaxCode } from 'src/app/models/sys/lbs-sys-tax-code';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-tax-code',
  templateUrl: './tax-code.component.html',
  styleUrls: ['./tax-code.component.css']
})
export class TaxCodeComponent implements OnInit {
  Mode: any = 'List';
  Submitted: boolean;
  Loading: any = false;
  TaxCodeForm: FormGroup;
  BindTaxCode: any;
  Tables: any;
  HeaderNames: any;
  // TaxCodeID: any;
  TableID = localStorage.getItem('TableID');
  SelectedID;
  /* FOR Aggird Start */
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  SelectedTaxcodeID: any;
  AccessTab: string;
  /* FOR Aggird End  */
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  modalRef: BsModalRef;
  addreadonly: boolean;
  IsActive: boolean;
  SelectedTaxcode: any;
  PageSize: any;
  CompanyID = localStorage.getItem('CompanyID');
  Currentpage: string;
  constructor(
    private toastrService: ToastrService,
    private FB: FormBuilder,
    private taxCodeService: TaxCodeService,
    private deleteRecordsService: DeleteRecordsService,
    private cryptoAes: CryptoAes,
    public modalService: BsModalService
  ) { }

  ngOnInit() {
    this.Currentpage = "0";
    this.AccessTab = "taxcode";
    this.HeaderNames = "Taxcode";
    this.CreateForm();
    this.SetPermissions();
    this.Submitted = false;
    // this.TaxCodeID = 'D7FB2FB5-1E2D-4DB4-ADE2-0A031AD5E56D';
    this.AgLoad = false;
    this.BindTaxCodes();
    this.AgGridColumns();
    this.PageSize = "10";
  }
  CreateForm() {
    this.TaxCodeForm = this.FB.group({
      ID: [''],
      TaxCode: ['', Validators.required],
      TaxCodeName: [''],
      TaxInclusiveExclusiveFlag: [true],
      PercentageFlag: [true]
    })
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Tax Code', field: 'taxCode', sortable: true, filter: true, checkboxSelection: false, width: 100 },
      { headerName: 'Description', field: 'taxCodeName', sortable: true, filter: true },
      { headerName: 'Inclusive Flag', field: 'taxInclusiveExclusiveFlagStatus', sortable: true, filter: true, },
      { headerName: 'Percentage Flag', field: 'percentageFlagStatus', sortable: true, filter: true, },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 85, },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
  get f() { return this.TaxCodeForm.controls; }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "112");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.TaxCodeForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.TaxCodeForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.TaxCodeForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }

  //To bind the data of all TaxCode to the Grid.
  BindTaxCodes() {
    this.AgLoad = false;
    this.taxCodeService.getAllTaxCode().subscribe((resp: any) => {
      this.BindTaxCode = resp.data.taxCode;
      this.RowData = resp.data.taxCode;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //Add new TaxCode
  AddNew() {
    this.ResetForm();
    this.Mode = 'Add';
    this.TaxCodeForm.enable();
    this.IsActive = true;
    this.addreadonly = false;
  }
  //Delete the record
  onDelete(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SYS_TaxCode', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindTaxCodes();
      this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the data of TaxCode to controls for edit/update.
  Edit(ID) {
    this.taxCodeService.getTaxCodeByID(ID).subscribe((resp: any) => {
      let taxCode: any = resp.data.taxCode;
      this.TaxCodeForm.patchValue({
        ID: taxCode.id,
        TaxCode: taxCode.taxCode,
        TaxCodeName: taxCode.taxCodeName,
        TaxInclusiveExclusiveFlag: taxCode.taxInclusiveExclusiveFlag,
        PercentageFlag: taxCode.percentageFlag,
      });
      this.SelectedTaxcodeID = taxCode.id;
      this.SelectedTaxcode = taxCode.taxCode;
      if (!taxCode.deleted) {
        this.TaxCodeForm.enable();
        this.IsActive = true;
      } else {
        this.TaxCodeForm.disable();
        this.IsActive = false;
      }
      // this.TaxCodeForm.get('TaxCode').disable();
      this.Mode = 'Edit';
      this.addreadonly = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To save the TaxCode to database table by calling the API service
  /*   onSave() {
      this.confirmation.ConfirmationPopup('Are you sure to save record?');
    } */
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    debugger;
    this.Submitted = true;
    if (this.TaxCodeForm.invalid) {
      return;
    }
    let taxCode = new LBSSYSTaxCode();
    taxCode.CompanyID = this.CompanyID;
    taxCode.TaxCode = this.TaxCodeForm.get('TaxCode').value;
    taxCode.TaxCodeName = this.TaxCodeForm.get('TaxCodeName').value;
    taxCode.TaxInclusiveExclusiveFlag = this.TaxCodeForm.get('TaxInclusiveExclusiveFlag').value;
    taxCode.PercentageFlag = this.TaxCodeForm.get('PercentageFlag').value;
    taxCode.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      this.taxCodeService.addTaxCode(taxCode).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastrService.success('TaxCode  added successfully');

          if (saveAction == 'Close') {
            this.Cancel();
            this.BindTaxCodes();
            this.Mode = 'List';
          } else {
            this.BindTaxCodes();
            this.Edit(resp.data.id);
            this.Mode = 'Edit';
            this.Loading = false;
            this.Loading = false;
          }
          this.Loading = false;
        }
        else {
          this.toastrService.warning('TaxCode already exists');
          this.Loading = false;
        }
        /* if (resp.isSuccess) {
          this.toastrService.success('TaxCode  added successfully')
          this.ResetForm();
          this.BindTaxCodes();
          this.Mode = 'List';
          this.Loading = false;
        }
        else {
          this.toastrService.warning(' TaxCode already exists');
          this.Loading = false;
        } */
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      taxCode.ID = this.TaxCodeForm.get('ID').value;
      this.taxCodeService.updateTaxCode(taxCode).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastrService.success('TaxCode  updated successfully')
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindTaxCodes();
            this.Mode = 'List';
          } else {
            this.BindTaxCodes();
            this.Edit(this.TaxCodeForm.get('ID').value);
            this.ResetForm();
            this.Mode = 'Edit';
          }

          this.Loading = false;
        }
        else {
          this.toastrService.warning('TaxCode already exists');
          this.Loading = false;
        }
        /*  this.toastrService.success('TaxCode  updated successfully')
           { 
            
           
            // this.Mode = 'List';
           } */
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }

  //To Cancel the Page
  Cancel() {
    this.ResetForm();
    this.Submitted = false;
    this.Mode = 'List';
  }

  /* FOR Aggird Start */
  OnActionClick(event: any) {
    debugger;
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.SelectedTaxcodeID = event.data.id;
      this.SelectedTaxcode = event.data.taxCode;
      this.Edit(event.data.id);

    } else if (colId == 'Delete') {
      debugger;
      this.onDelete(event.data.id)
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

  AgEdit(event) {
    this.TaxCodeForm.patchValue({
      ID: event.id,
      TaxCode: event.taxCode,
      TaxCodeName: event.taxCodeName,
      TaxInclusiveExclusiveFlag: event.taxInclusiveExclusiveFlag,
      PercentageFlag: event.percentageFlag,
    });
    this.Mode = 'Edit';
  }
  //Resetting the form after Add/Edit
  ResetForm() {
    this.TaxCodeForm.patchValue({
      ID: '',
      TaxCode: '',
      TaxCodeName: '',
      TaxInclusiveExclusiveFlag: true,
      PercentageFlag: true
    });
    this.TaxCodeForm.markAsTouched();
    this.TaxCodeForm.markAsPristine();
    this.Submitted = false;
  }
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
