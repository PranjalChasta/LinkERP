import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { CountrystateService } from '../services/countrystate.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LbsSysCountrystate } from 'src/app/models/sys/lbs-sys-countrystate';
import { SysCommonService } from '../services/sys-common.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
@Component({
  selector: 'app-countrystate',
  templateUrl: './countrystate.component.html',
  styleUrls: ['./countrystate.component.css']
})
export class CountrystateComponent implements OnInit {
  @Input() CountryID: any;
  @Input() SelectedCountryName: any;
  @Output() OnBacktoCountryClick = new EventEmitter<any>();
  Countries: any;
  CountryStateForm: FormGroup;
  Mode: any = 'List';
  submitted: boolean;
  AccessTab: string;
  CountryStates: any;
  HeaderNames: any;
  Loading: any = false;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  modalRef: BsModalRef;
  addreadonly: boolean;
  SelectedState: any;
  PageSize: any;
  IsActive: boolean;
  SelectedStateName: any;
  Currentpage: string;
  constructor(
    private countrystateservice: CountrystateService,
    private FB: FormBuilder,
    private CountryStateTypeFB: FormBuilder,
    private sysCommonService: SysCommonService,
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    public modalService: BsModalService
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Currentpage = "0";
    this.Mode = "List";
    this.AccessTab = 'State';
    this.HeaderNames = 'State';
    this.PageSize = "50";
    this.CreateForm();
    this.SetPermissions();
    this.AgGridColumns();
    this.GetStateByCountryID();
    // this.BindCountry(); 
  }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "104");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.CountryStateForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.CountryStateForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.CountryStateForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  CreateForm() {
    this.CountryStateForm = this.CountryStateTypeFB.group({
      ID: [''],
      Name: ['', Validators.required],
      Code: ['', Validators.required],
      Country: [this.CountryID],
    });
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Code', field: 'stateCode', sortable: true, filter: true, checkboxSelection: false, width: 75, },
      { headerName: 'Name', field: 'name', sortable: true, filter: true, },
      // { headerName: 'Country', field: 'countryName', sortable: true, filter: true },
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
  get f() { return this.CountryStateForm.controls; }

  //To bind the data of all Country to the Grid.
  BindCountry() {
    this.Loading = true;
    this.sysCommonService.getActiveCountries().subscribe((resp: any) => {
      this.Countries = resp.data.countries;
      this.Loading = false;

    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the data of all Country to the Grid.
  BindCountryState() {
    this.Loading = true;
    this.AgLoad = false;
    this.countrystateservice.getCountryState().subscribe((resp: any) => {
      this.CountryStates = resp.data.states;
      this.RowData = resp.data.states;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  GetStateByCountryID() {
    this.Loading = true;
    this.AgLoad = false;
    this.countrystateservice.getStateByCountryID(this.CountryID).subscribe((resp: any) => {
      this.CountryStates = resp.data.countrystates;
      this.RowData = resp.data.countrystates;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.GetStateByCountryID();
    this.submitted = false;
    this.Mode = "List";
  }
  //Add new users
  AddNew(): void {
    this.Mode = 'Add';
    this.ResetForm();
    this.CountryStateForm.enable();
    this.IsActive = true;
  }
  //To bind the data of States to the controls to edit/update.
  Edit(ID): void {
    this.BindCountryStateByID(ID);


  }
  BindCountryStateByID(ID) {
    this.countrystateservice.getCountryStateByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        let countrystats: any = new LbsSysCountrystate();
        countrystats = resp.data.countrystates;
        this.SelectedState = countrystats.stateID;
        this.CountryStateForm.patchValue({
          ID: countrystats.stateID,
          Name: countrystats.name,
          Code: countrystats.stateCode,
          Country: countrystats.countryID,
        });
        if (!countrystats.deleted) {
          this.CountryStateForm.enable();
          this.IsActive = true;
        } else {
          this.CountryStateForm.disable();
          this.IsActive = false;
        }
        // this.CountryStateForm.get('Country').disable();
        this.Mode = 'Edit';
      }
    });
    (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    }
  }

  //To save the State details to database table by calling the API service
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }

  onSave(saveAction) {
    this.submitted = true;
    if (this.CountryStateForm.invalid) {
      return;
    }
    this.Loading = true;
    let countrystate = new LbsSysCountrystate();
    countrystate.Name = this.CountryStateForm.get('Name').value;
    countrystate.StateCode = this.CountryStateForm.get('Code').value;
    countrystate.CountryID = this.CountryStateForm.get('Country').value;
    countrystate.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      this.countrystateservice.AddCountryState(countrystate).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('State details added successfully');
          // this.ResetForm();
          //this.GetStateByCountryID();
          // this.Mode = 'List';
          //  this.Loading = false;
          if (saveAction == 'Close') {
            this.Cancel();
            this.GetStateByCountryID();
            this.Mode = 'List';
          }
          else {
            this.Edit(resp.data.id);
            this.GetStateByCountryID();

          }
          this.Loading = false;
        }
        else {
          this.toastr.warning('State code  already exists');
          this.Loading = false;
        }
      },
        (error) => {
          console.error('Problem with the sevice. Please try later : ' + error.message);
        });
    }
    else if (this.Mode == 'Edit') {
      countrystate.ID = this.CountryStateForm.get('ID').value;
      this.countrystateservice.UpdateCountryState(countrystate).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('State details updated successfully');
          //  this.ResetForm();
          // this.GetStateByCountryID();
          //  this.Mode = 'List';
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.GetStateByCountryID();
          } else {
            this.Edit(this.CountryStateForm.get('ID').value);

          }

        }
        else {
          this.Loading = false;
          this.toastr.warning(resp.message);
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    this.Loading = false;
  }

  //To create the States Form Controls.
  ResetForm() {
    this.CountryStateForm.markAsUntouched();
    this.CountryStateForm.markAsPristine();
    this.CountryStateForm.patchValue({
      ID: '',
      Code: '',
      Name: '',
      Country: this.CountryID,
    });
  }


  //Delete the record
  onDeleteChecked(ID) {
    this.Loading = true;
    this.countrystateservice.deleteCountryStateByID(ID, localStorage.getItem('LoginID')).subscribe((resp: any) => {

      if (resp.isSuccess == true) {
        this.GetStateByCountryID();
      }
      this.Loading = false;
    }, (error) => {
      this.Loading = false;

      // console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }


  /* FOR Aggird Start */
  OnActionClick(event: any) {

    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.SelectedState = event.data.stateID;
      this.Edit(event.data.stateID)
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.stateID)
    } else if (colId == 'Detail') {
      if (event.data.deleteStatus == 'Active') {
        this.SelectedState = event.data.stateID;
        this.SelectedStateName = event.data.name;
        this.Mode = 'City'
      } else {
        this.toastr.warning("Please change the status of this record to Active to make changes");
      }

    }
  }
  OnBackToStateClick(event) {
    console.log(event);
    this.GetStateByCountryID();
    this.Mode = 'List'
  }

  BacktoCountry() {
    this.OnBacktoCountryClick.emit(this.CountryID);
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
  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
}
