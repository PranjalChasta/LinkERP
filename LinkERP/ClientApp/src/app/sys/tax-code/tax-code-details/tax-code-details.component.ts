import { Component, OnInit, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TaxCodeDetailsService } from '../../services/tax-code-details.service';
import { LBSSYSTaxCodeDetails } from 'src/app/models/sys/lbs-sys-tax-code-details';
import { TaxCodeService } from '../../services/tax-code.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-tax-code-details',
  templateUrl: './tax-code-details.component.html',
  styleUrls: ['./tax-code-details.component.css']
})
export class TaxCodeDetailsComponent implements OnInit {
  Mode: any = 'List';
  Submitted: any = false;
  Loading: any = false;
  TaxCodeDetailsForm: FormGroup;
  BindTaxCodeDetail: any;
  TaxCodeDetails: any;
  BindTaxCode: any;
  SelectedTaxCodeID: any;
  @Input() TaxCodeID: any;
  @Input() SelectedTaxcode: any;
  @Input() IsTaxcodeActive: boolean;
  /* FOR Aggird Start */
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  /* FOR Aggird End  */
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  LineEditField: string;
   ///IsActive: boolean;
  Currentpage: string;
  @Input() isActive: boolean;
  CompanyID = localStorage.getItem('CompanyID');
  constructor(
    private toastrService: ToastrService,
    private FB: FormBuilder,
    private taxCodeDetailsService: TaxCodeDetailsService,
    private taxCodeService: TaxCodeService,
    private deleteRecordsService: DeleteRecordsService,
    private cryptoAes: CryptoAes
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Currentpage = "0";
    this.RowData = [];
    this.LineEditField = "taxLabel";
    this.Createform();
    this.SetPermissions();
    this.BindTaxCodeDetails();
    this.BindTaxCodes();
    this.ColumnDefs = [
      //{ headerName: 'Tax Code', field: 'taxCode', sortable: true, filter: true, checkboxSelection: false, editable: false },
      { headerName: 'Tax Label', field: 'taxLabel', sortable: true, filter: true, checkboxSelection: false,editable:!this.write_Access },
      { headerName: 'Tax Rate', field: 'taxAmounttext', sortable: true, filter: true, cellStyle: { textAlign: 'left' },  },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 80, },
      { headerName: '', field: 'Save', cellRenderer: this.CustomSaveIconFunc, type: 'Action', hide: !this.write_Access },
      //{ headerName: '', field: 'Edit', type: 'EditAction', hide: false, width: 20, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }

    ];
    var ok=this.RowData.every(o=>o.deleteStatus=='Inactive')
    console.log(ok);
    console.log( this.ColumnDefs)
  }
  get f() { return this.TaxCodeDetailsForm.controls; }
  Createform() {
    this.TaxCodeDetailsForm = this.FB.group({
      ID: [''],
      // TaxCode:['-1'],
      TaxLabel: ['', Validators.required],
      TaxAmount: ['', Validators.required]
    })
  }
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
      this.TaxCodeDetailsForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.TaxCodeDetailsForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.TaxCodeDetailsForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  getg() { this.TaxCodeDetailsForm.controls; }
  //To bind the data of all TaxCodeDetails to the Grid.
  BindTaxCodeDetails() {
    this.AgLoad = false;
    this.taxCodeDetailsService.getTaxCodeDetailsByTaxCodeID(this.TaxCodeID).subscribe((resp: any) => {
      this.BindTaxCodeDetail = resp.data.taxcodedetails;
      console.log(resp.data);
      //this.TaxCodeDetails = resp.data.taxcodedetails;
      this.RowData = resp.data.taxcodedetails;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the data of all TaxCode to the Grid.
  BindTaxCodes() {
    this.taxCodeService.getAllTaxCode().subscribe((resp: any) => {
      this.BindTaxCode = resp.data.taxCode;
      this.TaxCodeDetails = resp.data.taxCode;
      this.Loading = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  Cancelnew() {
    this.BindTaxCodeDetails();
    this.Mode = 'List';
  }
  OnSaveall() {
    this.taxCodeDetailsService.AddupdateWorkFlowDetails(this.RowData).subscribe((resp: any) => {
      console.log(resp);
      this.toastrService.success('taxcode details added successfully');
      this.BindTaxCodeDetails();
      this.Mode = 'List';
    }, (error) => {
      //    console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  //To save the TaxCode  to database table by calling the API service
  onSave(saveAction) {

    this.Submitted = true;
    if (this.TaxCodeDetailsForm.invalid) {
      return;
    }
    let taxCodeDetails = new LBSSYSTaxCodeDetails();
    taxCodeDetails.TaxCodeID = this.TaxCodeID;
    taxCodeDetails.CompanyID = this.CompanyID;
    taxCodeDetails.TaxLabel = this.TaxCodeDetailsForm.get('TaxLabel').value;
    taxCodeDetails.TaxAmount = this.TaxCodeDetailsForm.get('TaxAmount').value;
    taxCodeDetails.CreatedBY = localStorage.getItem('LoginID');
    //If the mode is Add then it will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.taxCodeDetailsService.addTaxCodeDetails(taxCodeDetails).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastrService.success('TaxCode Details added successfully');

          if (saveAction == 'Close') {
            this.Cancel();

            this.Mode = 'List';
          } else {
            this.Edit(resp.data.id);
            this.BindTaxCodeDetails();
            this.Mode = 'Edit';
          }
          this.Loading = false;
        }
        else {
          this.toastrService.warning('tax label already exists');
          this.Loading = false;
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    else if (this.Mode == 'Edit') {
      taxCodeDetails.ID = this.TaxCodeDetailsForm.get('ID').value;
      this.taxCodeDetailsService.updateTaxCodeDetails(taxCodeDetails).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastrService.success('TaxCode Details updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindTaxCodeDetails();
          }
          else {
            this.Edit(this.TaxCodeDetailsForm.get('ID').value);
          }
        }
        else {
          this.Loading = false;
          this.toastrService.warning('tax label already exists');
        }



      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    this.Loading = false;
  }

  AddNew() {
    this.ResetForm();
    this.Mode = 'Add';
    this.TaxCodeDetailsForm.enable();
    //this.IsActive = true;

  }
  //Add new TaxCode Details
  // AddNew() {
  //   this.TaxCodeDetailsForm.patchValue({
  //     ID: null,
  //     //Organisation: lBSSYSDocumentTemplates.companyID,
  //     TaxLabel: '',
  //     TaxAmount: ''
  //   });
  //   this.Mode = 'Add';
  // }
  //Cancel the Add/Edit
  Cancel() {
    this.ResetForm();
    this.Submitted = false;
    this.Mode = 'List';
    this.BindTaxCodeDetails();
  }
  //Delete the record
  onDelete(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SYS_TaxCodeDetails', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindTaxCodeDetails();
      this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the data of TaxCode Details to controls for edit/update.
  BindTaxcodeDetailsbyId(ID) {
    this.taxCodeDetailsService.getTaxCodeDetailsByID(ID).subscribe((resp: any) => {
      console.log(resp);
      let taxCodeDetails: any = resp.data.taxcodedetails;
      this.TaxCodeDetailsForm.patchValue({
        ID: taxCodeDetails.id,
        TaxCode: taxCodeDetails.taxCodeID,
        TaxLabel: taxCodeDetails.taxLabel,
        TaxAmount: taxCodeDetails.taxAmounttext,

      });
      if (!taxCodeDetails.deleted) {
        this.TaxCodeDetailsForm.enable();
        // this.IsActive = true;
      } else {
        this.TaxCodeDetailsForm.disable();
        // this.IsActive = false;
      }
      this.Mode = 'Edit';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Edit(ID): void {
    debugger;
    this.Mode = 'Edit';
    this.BindTaxcodeDetailsbyId(ID);

  }
  /* FOR Aggird Start  */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      debugger;
      this.SelectedTaxCodeID = event.data.id;
      this.Edit(event.data.id);
      this.Mode = "Edit"
    } else if (colId == 'Delete') {
      if(!this.isActive)
      {
        this.toastrService.warning('Please change the status of this record to Active to make changes');
        return;
      }
      this.onDelete(event.data.id)
    } else if (colId == 'Save') {
      this.AgSave(event.data)
    }
  }
  CustomSaveIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="bi fa fa-save"></i></div>';
    return cellContent
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
  AgSave(event) {
if(event.deleted)
{
  this.toastrService.warning('Please change the status of this record to Active to make changes');
  return;
}
if(!this.isActive)
{
  this.toastrService.warning('Please change the status of this record to Active to make changes');
  return;
}
    let taxCodeDetails = new LBSSYSTaxCodeDetails();
    taxCodeDetails.ID = event.id;
    taxCodeDetails.TaxCodeID = event.taxCodeID;
    taxCodeDetails.TaxLabel = event.taxLabel;
    taxCodeDetails.TaxAmount = event.taxAmounttext;
    debugger;
    if (event.id != "") {
      this.taxCodeDetailsService.updateTaxCodeDetails(taxCodeDetails).subscribe((resp: any) => {

        this.toastrService.success('TaxCode Details updated successfully')
        {
          this.ResetForm();
          this.BindTaxCodeDetails();
          this.Mode = 'List';
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    } else {
      taxCodeDetails.TaxCodeID = this.TaxCodeID;
      this.taxCodeDetailsService.addTaxCodeDetails(taxCodeDetails).subscribe((resp: any) => {
        this.toastrService.success('TaxCode Details added successfully')
        {
          this.ResetForm();
          this.BindTaxCodeDetails();
          this.Mode = 'List';
          this.Loading = false;
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });

    }

  }
  AgEdit(event) {
    this.TaxCodeDetailsForm.patchValue({
      ID: event.id,
      TaxCode: event.taxCodeID,
      TaxLabel: event.taxLabel,
      TaxAmount: event.taxAmount,
    });
    this.Mode = 'Edit';
  }
  //Resetting the form after Add/Edit
  ResetForm() {
    this.TaxCodeDetailsForm.patchValue({
      ID: '',
      TaxCodeID: '-1',
      TaxLabel: '',
      TaxAmount: ''
    });
    this.TaxCodeDetailsForm.markAsTouched();
    this.TaxCodeDetailsForm.markAsPristine();
    this.Submitted = false;
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }

  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
