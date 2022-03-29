import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SysCommonService } from '../services/sys-common.service';
import { CountrystatecityService } from '../services/countrystatecity.service';
import { LbsSysCountrystatecity } from 'src/app/models/sys/lbs-sys-countrystatecity';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
@Component({
  selector: 'app-countrystatecity',
  templateUrl: './countrystatecity.component.html',
  styleUrls: ['./countrystatecity.component.css']
})
export class CountrystatecityComponent implements OnInit {
  @Input() StateID: any;
  @Input() CountryID: any;
  @Input() SelectedCountryName: any;
  @Input() SelectedStateName: any;
  CountryStatecityForm: FormGroup;
  Loading: any = false;
  Mode: any = 'List';
  submitted: boolean;
  cities: any[] = [];//Array variable of cities data to bind grid
  country: any[] = [];//Array variable of country data to bind grid
  states: any[] = [];//Array variable of states data to bind grid
  Cities: [] = [];//Array variable of cities data to bind grid
  /* FOR Aggird Start */
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;/* FOR Aggird End  */
  CountrystatePermissions;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  modalRef: BsModalRef;
  IsActive: boolean;
  AccessTab: string;
  HeaderNames: any;
  PageSize: any;
  SelectedCity: any;
  Currentpage: string;
  @Output() OnBackToStateClick = new EventEmitter<any>();
  constructor(
    private commonservice: SysCommonService,
    private Cityservice: CountrystatecityService,
    private cityFB: FormBuilder,
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    public modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Currentpage = "0";
    this.AccessTab = 'City';
    this.HeaderNames = 'City';
    this.PageSize = "50";
    this.CreateForm();
    this.GetCityByStateID();
    this.BindCountry();
    this.SetPermissions();
    this.AgGridColumns();
  }

  //To create the Cities Form Controls.
  CreateForm() {
    this.CountryStatecityForm = this.cityFB.group({
      ID: [''],
      CityID: [''],
      Country: [this.CountryID],
      State: [this.StateID],
      CityCode: ['', Validators.required],
      Name: ['', Validators.required]
    });
  }

  AgGridColumns() {
    this.ColumnDefs = [
      // { headerName: 'Countries', field: 'countryName', sortable: true, filter: true, checkboxSelection: false },
      // { headerName: 'States', field: 'states', sortable: true, filter: true },
      { headerName: 'City ', field: 'cityCode', sortable: true, filter: true },
      { headerName: 'City Name', field: 'name', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 70, },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }

  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "106");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.CountryStatecityForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.CountryStatecityForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.CountryStatecityForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }

  get f() { return this.CountryStatecityForm.controls; }

  //Add new city
  AddNew(): void {
    this.Mode = 'Add';
    this.IsActive = true;
    this.CountryStatecityForm.get('Country').enable();
    this.CountryStatecityForm.get('State').enable();
    this.CountryStatecityForm.enable();
  }
  //To bind the data of city to controls for edit/update.
  Edit(cityID): void {
    this.BindCityByID(cityID);

  }
  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.GetCityByStateID();
    // this.submitted = false;
    this.Mode = "List";
  }
  //Resetting the form after Add/Edit
  ResetForm() {
    this.states = [];
    this.CountryStatecityForm.patchValue({
      ID: '',
      CityID: '',
      Country: this.CountryID,
      State: this.StateID,
      CityCode: '',
      Name: ''
    });
    this.CountryStatecityForm.markAsUntouched();
    this.CountryStatecityForm.markAsPristine();
    //this.CountryStatecityForm.get('Country').enable();
    //this.CountryStatecityForm.get('State').enable();
    this.submitted = false;
  }
  GetCityByStateID() {
    this.Loading = true;
    this.Mode = 'List';
    this.AgLoad = false;
    this.Cityservice.getCityByStateID(this.StateID).subscribe((resp: any) => {
      this.Cities = resp.data.citydetails;
      this.RowData = resp.data.citydetails;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the data of all Cities to the Grid.
  BindGetcities() {
    this.Loading = true;
    this.Mode = 'List';
    this.AgLoad = false;
    this.commonservice.getCountryStateCity().subscribe((resp: any) => {
      this.Cities = resp.data.cities;
      this.RowData = resp.data.cities;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the data of all Country to the Grid.
  BindCountry() {
    this.Loading = true;
    this.commonservice.getActiveCountries().subscribe((resp: any) => {
      this.country = resp.data.countries;
      this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  // country id based on state name available
  oncountrystateChange($event) {
    let CountryID = $event;
    if ($event != "-1") {
      this.BindCountrybystate(CountryID);
    }
  }
  //based on countryid state is binding
  BindCountrybystate(CountryID) {
    this.Loading = true;
    this.commonservice.getStatesBYCountryID(CountryID).subscribe((resp: any) => {
      this.states = resp.data.states;
      this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  //To save the Cities details to database table by calling the API service
  onSave(saveAction) {
    this.submitted = true;
    if (this.CountryStatecityForm.invalid) {
      return;
    }
    // this.Loading = true;
    let city = new LbsSysCountrystatecity();
    city.CountryID = this.CountryStatecityForm.get('Country').value;
    city.StateID = this.CountryStatecityForm.get('State').value;
    city.CityCode = this.CountryStatecityForm.get('CityCode').value;
    city.Name = this.CountryStatecityForm.get('Name').value;
    city.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      this.Cityservice.addCity(city).subscribe((resp: any) => {
        console.log(resp);
        if (resp.isSuccess) {
          this.toastr.success('City Code added successfully');
          // this.ResetForm();
          // this.GetCityByStateID();
          //this.Mode = 'List';
          // this.Loading = false;
          if (saveAction == 'Close') {
            this.Cancel();
            this.GetCityByStateID();
            this.Mode = 'List';
          }
          else {
            this.Edit(resp.data.id);
            this.GetCityByStateID();
            this.Mode = 'Edit';
          }
          this.Loading = false;
        }
        else {
          this.toastr.warning('City Code already exists');
          this.Loading = false;
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      city.CityID = this.CountryStatecityForm.get('CityID').value;
      this.Cityservice.updateCity(city).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('City updated successfully')
          // this.GetCityByStateID();
          //   this.ResetForm();
          // this.Mode = 'List';

          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.GetCityByStateID();

          } else {
            this.Edit(this.CountryStatecityForm.get('CityID').value);
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
  //Bind City by  ID
  BindCityByID(CityID) {
    this.Cityservice.getCityByID(CityID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        let cities: any = new LbsSysCountrystatecity();
        cities = resp.data.citydetails;
        this.SelectedCity = cities.cityID;
        this.CountryStatecityForm.patchValue({
          CityID: cities.cityID,
          Country: cities.countryID,
          State: cities.stateID,
          CityCode: cities.cityCode,
          Name: cities.name
        });
        if (!cities.deleted) {
          this.CountryStatecityForm.enable();
          this.IsActive = true;
        } else {
          this.CountryStatecityForm.disable();
          this.IsActive = false;
        }

        this.Mode = 'Edit';
      }
    });
    // this.Mode = 'Edit';

  }


  //To Delete the record
  onDeleteChecked(ID) {
    this.Loading = true;
    this.Cityservice.deleteCityByID(ID, localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.GetCityByStateID();
      }
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      // console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }

  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }

  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.SelectedCity = event.data.cityID;
      this.Edit(event.data.cityID);
      this.oncountrystateChange(event.data.countryID);
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.cityID)
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
  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  OnCancel() {

  }
  Backtostate() {
    console.log(this.StateID)
    this.OnBackToStateClick.emit(this.StateID);
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  //@ViewChild('confirmation') confirmation: TemplateRef<any>;
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}


