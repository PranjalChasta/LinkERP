import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountryService } from '../services/country.service';
import { SysCommonService } from '../services/sys-common.service';
import { LBSSYSCountry } from 'src/app/models/sys/lbs-sys-country';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  Mode: any = 'List';
  Submitted: boolean
  LBSSYSCountry: any[] = [];
  Loading: any = false;
  CountryForm: FormGroup;
  BindCountry: any;
  modalRef: BsModalRef;
  /* FOR Aggird Start */
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  /* FOR Aggird End  */
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;

  IsActive: boolean;
  AccessTab: string;
  HeaderNames: any;
  SelectedCountryID: any;
  SelectedCountryName: any;
  PageSize: any;
  Currentpage: string;
  constructor(
    private countryService: CountryService,
    private commonService: SysCommonService,
    private toastrModule: ToastrModule,
    private toastrService: ToastrService,
    private CountryFB: FormBuilder,
    private cryptoAes: CryptoAes,
    public modalService: BsModalService
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Currentpage = "0";
    this.AccessTab = 'Country';
    this.HeaderNames = 'Country';
    this.PageSize = "50";
    this.CreateForm();
    this.SetPermissions();
    this.AgGridColumns();
    this.BindCountries();


  }
  get f() { return this.CountryForm.controls; }

  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "105");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.CountryForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.CountryForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.CountryForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  CreateForm() {
    this.CountryForm = this.CountryFB.group({
      CountryID: [''],
      CountryCode: ['', Validators.required],
      Name: ['', Validators.required]
    });
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Code', field: 'countryCode', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Name', field: 'name', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 70, },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Detail', cellRenderer: this.CustomDetailIconFunc, type: 'Action', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
  CustomDetailIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-align-justify"></i></div>';
    return cellContent
  }
  //Add new Countries
  AddNew() {
    this.ResetForm();
    this.Mode = 'Add';
    this.CountryForm.enable();
    this.IsActive = true;
  }

  //To Cancel the Page
  Cancel() {
    this.ResetForm();
    this.BindCountries();
    this.Mode = 'List';
  }

  //To Bind the data of all Countries to the Grid
  BindCountries() {
    debugger
    this.Loading = true;
    this.AgLoad = false;
    this.commonService.getCountries().subscribe((resp: any) => {
      this.BindCountry = resp.data.countries;
      this.RowData = resp.data.countries;
      this.AgLoad = true;
      this.Loading = false;
     
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
    
   
  }

  //To Get a Particular Country details By ID
  Edit(CountryID) {
    this.countryService.getCountryByID(CountryID).subscribe((resp: any) => {
      // let lBSSYSCountry: any = resp.data.country;
      this.AgEdit(resp.data.country)
      /*  this.CountryForm.patchValue({
         CountryID: lBSSYSCountry.countryID,
         CountryCode: lBSSYSCountry.countryCode,
         Name: lBSSYSCountry.name
       });
       this.Mode = 'Edit'; */
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To Save the Country details
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    this.Submitted = true;
    if (this.CountryForm.invalid) {
      return;
    }
    //this.Loading = true;
    let lBSSYSCountry = new LBSSYSCountry();
    lBSSYSCountry.CountryCode = this.CountryForm.controls.CountryCode.value;
    lBSSYSCountry.Name = this.CountryForm.controls.Name.value;
    lBSSYSCountry.CreatedBY = localStorage.getItem('LoginID');
    //If the mode is Add then it will insert data to DB table else update the row by ID
    debugger
    if (this.Mode == 'Add') {
      this.countryService.addCountry(lBSSYSCountry).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          console.log(resp)
          this.toastrService.success('Country added successfully')
          //  this.ResetForm();
          // this.BindCountries();
          //  this.Edit(resp.data.id);
          // this.Mode = 'List';
          //  this.Loading = false;
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindCountries();
            this.Mode = 'List';
          }
          else {
            this.Edit(resp.data.id);
            this.BindCountries();
            this.Mode = 'Edit';
          }
          this.Loading = false;
        }
        else {
          this.toastrService.warning('Country code  already exists')
          this.Loading = false;
        }
      });
    }
    //To Edit a particular Country details By ID
    else if (this.Mode == 'Edit') {
      lBSSYSCountry.CountryID = this.CountryForm.get('CountryID').value;
      this.countryService.updateCountry(lBSSYSCountry).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastrService.success(' Country updated successfully')
          // this.Edit(this.CountryForm.get('CountryID').value);
          // this.ResetForm();
          // this.Mode = 'List';
          // this.BindCountries();

          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindCountries();

          } else {
            this.Edit(this.CountryForm.get('CountryID').value);
          }
        }
        else {
          this.Loading = false;
          this.toastrService.warning(resp.message);
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    this.Loading = false;
  }

  //To delete a particular Country details
  Delete(CountryID) {
    this.Loading = true;
    this.countryService.deleteCountryByID(CountryID, localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindCountries();
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }
  OnCancel() {

  }
  //To Reset the Form after Add/Edit
  ResetForm() {
    this.CountryForm.patchValue({
      CountryID: '',
      CountryCode: '',
      Name: ''
    });
    this.CountryForm.markAsUntouched();
    this.CountryForm.markAsPristine();
    this.Submitted = false;
  }
  onRowClicked(event: any) {
    console.log('row', event.data);
  }

  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.SelectedCountryID = event.data.countryID;
      this.AgEdit(event.data)
    } else if (colId == 'Delete') {
      this.Delete(event.data.countryID)
    } else if (colId == 'Detail') {
      if (event.data.deleteStatus == 'Active') {
        this.SelectedCountryID = event.data.countryID;
        this.SelectedCountryName = event.data.name;
        this.Mode = 'State'
      } else {
        this.toastrService.warning("Please change the status of this record to Active to make changes");
      }

    }
  }
  OnBacktoCountryClick(event) {
    this.BindCountries();
    this.Mode = 'List';
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
    this.SelectedCountryID = event.countryID;
    this.CountryForm.patchValue({
      CountryID: event.countryID,
      CountryCode: event.countryCode,
      Name: event.name
    })
    this.Mode = 'Edit';
    if (event.deleteStatus == 'Active') {
      this.CountryForm.enable();
      this.IsActive = true;
    } else {
      this.CountryForm.disable();
      this.IsActive = false;
    }
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
