import { Component, OnInit, TemplateRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrganisationMaintenanceService } from '../services/organisation-maintenance.service';
import { LBSSYSCompany } from '../../models/sys/lbs-sys-company';
import { SysCommonService } from '../services/sys-common.service';
import { ToastrService } from 'ngx-toastr';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { CustomValidators } from 'ngx-custom-validators';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
@Component({
  selector: 'app-organisation-maintenance',
  templateUrl: './organisation-maintenance.component.html',
  styleUrls: ['./organisation-maintenance.component.css']
})
export class OrganisationMaintenanceComponent implements OnInit {

  Mode: any = 'List';
  Submitted: any = false;

  Loading: any = false;
  OrganisationCode: any;
  OrganisationName: any;
  modalRef: BsModalRef;
  IsActive: boolean;
  organisations: any[] = [];//Array variable of organisations data to bind grid
  countries: any[] = [];//Array variable of countries data to bind dropdownlist
  states: any[] = [];//Array variable of states data to bind dropdownlist
  cities: any[] = [];//Array variable of cities data to bind dropdownlist

  OrganisationMaintenanceForm: FormGroup;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  AccessTab: string;
  RecID = '';
  HeaderNames: any; //OrganisationsPermissions;
  read_Access;
  write_Access;
  delete_Access;
  all_Access;
  readonly: boolean;
  PageSize: any;
  Currentpage: string;
  RowIndex:any;
 
  constructor(private organisationMaintenanceService: OrganisationMaintenanceService,
    private sysCommonService: SysCommonService,
    private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    public modalService: BsModalService,
    private FB: FormBuilder) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Currentpage = "0";
    this.AccessTab = "Organisation";
    this.RowIndex=null;
    //this.RecID='F1164F06-2DEB-49B8-B249-6B239B2CBF5F'; 
    this.HeaderNames = "Organisation";
    this.PageSize = "10";
    this.CreateForm();
    this.SetPermissions();
    
    this.ColumnDefs = [
      { headerName: ' Code', field: 'companyCode', sortable: true, filter: true, checkboxSelection: false, width: 115, },
      { headerName: 'Name', field: 'name', sortable: true, filter: true },
      { headerName: 'Trading Name', field: 'tradingName', sortable: true, filter: true },
      { headerName: 'Phone Number', field: 'phone', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 70, },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
    this.BindOrganisations();
    this.BindCountries();
    this.BindCurrency();
    //console.log(this.OrganisationsPermissions)
  }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "101");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.OrganisationMaintenanceForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.OrganisationMaintenanceForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.OrganisationMaintenanceForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  get f() { return this.OrganisationMaintenanceForm.controls; }

  //To create the Organisation Form Controls.
  CreateForm() {
    this.OrganisationMaintenanceForm = this.FB.group({
      ID: [''],
      CompanyCode: ['', Validators.required],
      Name: ['', Validators.required],
      TradingName: ['', Validators.required],
      Laddr1: [''],
      Laddr2: [''],
      Laddr3: [''],
      Paddr1: [''],
      Paddr2: [''],
      Paddr3: [''],
      Country: ['-1', CustomValidators.notEqual('-1')],
      State: ['-1', CustomValidators.notEqual('-1')],
      City: ['-1', CustomValidators.notEqual('-1')],
      ZipCode: [''],
      TaxNumber: [''],
      SuperannuationID: [''],
      DefaultPayrollRounding: ['-1', CustomValidators.notEqual('-1')],
      DefaultCurrency: ['-1', CustomValidators.notEqual('-1')],
      Logo: [null],
      Phone: [''],//, [Validators.pattern(/^([+]?\d{1,20}?,)*([+]?\d{1,20})$/)]//^([1-9]\d{6}?,)*([1-9]\d{6})$
      Fax: [''],//, [Validators.pattern(/^([+]?\d{1,20}?,)*([+]?\d{1,20})$/)]
      EmailAddress: ['', [Validators.pattern(/^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/)]]

    });
  }


  //To bind the data of all Organisations to the Grid.
  BindOrganisations() {
    this.Mode = "List";
    this.AgLoad = false;
    this.Loading = true;
    this.organisationMaintenanceService.getAllCompanies().subscribe((resp: any) => {
      this.organisations = resp.data.companies;
      this.RowData = resp.data.companies;
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


  //Add new organisations
  AddNew() {
    this.OrganisationMaintenanceForm.enable();
    this.IsActive = true;
    this.Mode = 'Add';
    this.readonly = false;
    this.OrganisationCode = '';
    this.OrganisationName = '';
  }
  //To bind the data of Organisation to controls for edit/update.
  Edit(ID) {
    debugger;
    this.organisationMaintenanceService.getCompanyByID(ID).subscribe((resp: any) => {
      let company: any = resp.data.company;
      this.OrganisationMaintenanceForm.patchValue({
        ID: company.id,
        CompanyCode: company.companyCode,
        Name: company.name,
        TradingName: company.tradingName,
        Laddr1: company.laddr1,
        Laddr2: company.laddr2,
        Laddr3: company.laddr3,
        Paddr1: company.paddr1,
        Paddr2: company.paddr2,
        Paddr3: company.paddr3,
        Country: company.country,
        State: company.state,
        City: company.city,
        ZipCode: company.zipCode,
        TaxNumber: company.taxNumber,
        SuperannuationID: company.superannuationID,
        DefaultPayrollRounding: company.defaultPayrollRounding,
        DefaultCurrency: company.defaultCurrency,
        Logo: company.logo,
        Phone: company.phone,
        Fax: company.fax,
        EmailAddress: company.emailAddress
      });

      if (company.logo != null) {
        this.Logo = 'data:image/jpeg;base64,' + company.logo;
      }
      else {
        this.Logo = 'assets/images/blank-company-logo.jpg';
      }

      this.Mode = 'Edit';
    }, (error) => {
      this.Loading = false;
      console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }

  //Cancel the Add/Edit
  Cancel() {
    this.ResetForm();
    this.Mode = 'List';
  }

  //To save the Organisation details to database table by calling the API service
  /* onSave() {
    debugger; 
    this.confirmation.ConfirmationPopup('Are you sure to save record?');
  } */
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    this.Submitted = true;
    if (this.OrganisationMaintenanceForm.invalid) {
      return;
    }
    //this.Loading = true;
    let lBSSYSCompany: any = new LBSSYSCompany();
    lBSSYSCompany.CompanyCode = this.OrganisationMaintenanceForm.get('CompanyCode').value;
    lBSSYSCompany.Name = this.OrganisationMaintenanceForm.get('Name').value;
    lBSSYSCompany.TradingName = this.OrganisationMaintenanceForm.get('TradingName').value;
    lBSSYSCompany.Laddr1 = this.OrganisationMaintenanceForm.get('Laddr1').value;
    lBSSYSCompany.Laddr2 = this.OrganisationMaintenanceForm.get('Laddr2').value;
    lBSSYSCompany.Laddr3 = this.OrganisationMaintenanceForm.get('Laddr3').value;
    lBSSYSCompany.Paddr1 = this.OrganisationMaintenanceForm.get('Paddr1').value;
    lBSSYSCompany.Paddr2 = this.OrganisationMaintenanceForm.get('Paddr2').value;
    lBSSYSCompany.Paddr3 = this.OrganisationMaintenanceForm.get('Paddr3').value;
    lBSSYSCompany.Country = this.OrganisationMaintenanceForm.get('Country').value;
    lBSSYSCompany.State = this.OrganisationMaintenanceForm.get('State').value;
    lBSSYSCompany.City = this.OrganisationMaintenanceForm.get('City').value;
    lBSSYSCompany.ZipCode = this.OrganisationMaintenanceForm.get('ZipCode').value;
    lBSSYSCompany.TaxNumber = this.OrganisationMaintenanceForm.get('TaxNumber').value;
    lBSSYSCompany.SuperannuationID = this.OrganisationMaintenanceForm.get('SuperannuationID').value;
    lBSSYSCompany.DefaultPayrollRounding = this.OrganisationMaintenanceForm.get('DefaultPayrollRounding').value;
    lBSSYSCompany.DefaultCurrency = this.OrganisationMaintenanceForm.get('DefaultCurrency').value;
    lBSSYSCompany.Phone = this.OrganisationMaintenanceForm.get('Phone').value;
    lBSSYSCompany.Fax = this.OrganisationMaintenanceForm.get('Fax').value;
    lBSSYSCompany.EmailAddress = this.OrganisationMaintenanceForm.get('EmailAddress').value;
    lBSSYSCompany.Logo = this.OrganisationMaintenanceForm.get('Logo').value;
    lBSSYSCompany.CreatedBY = localStorage.getItem('LoginID');
    debugger;
    if (this.Mode == 'Add') {
      this.organisationMaintenanceService.addCompany(lBSSYSCompany).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success(resp.message);
          //this.ResetForm();
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindOrganisations();
            this.Mode = 'List';
          } else {
            /* this.OrganisationMaintenanceForm.patchValue({
              ID: resp.data.id
            }); */
            this.AgEdit(resp.data.id);
            this.BindOrganisations();
            this.Mode = 'Edit';
          }

          this.Loading = false;
          // this.OrganisationMaintenanceForm.get('CompanyCode').disable();
        }
        else {
          this.toastr.warning(resp.message);
          this.Loading = false;
        }
      }, (error) => {
        this.Loading = false;
        //   console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      lBSSYSCompany.ID = this.OrganisationMaintenanceForm.get('ID').value;
      this.organisationMaintenanceService.updateCompany(lBSSYSCompany).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success(resp.message);

          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindOrganisations();

          } else {
            this.AgEdit(this.OrganisationMaintenanceForm.get('ID').value);
          }
        }
        else {
          this.Loading = false;
          this.toastr.warning(resp.message);
        }
      }, (error) => {
        this.Loading = false;
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    this.Loading = false;
  }

  OnCancel() {
    /* this.ResetForm();
   this.Mode = 'List'; */
  }

  //Delete the record
  onDeleteChecked(ID) {
    this.Loading = true;
    this.organisationMaintenanceService.deleteCompanyByID(ID, localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.BindOrganisations();
      }
      this.Loading = false;
    }, (error) => {
      this.Loading = false;

      // console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  //Resetting the form after Add/Edit
  ResetForm() {
    this.OrganisationCode = '';
    this.OrganisationName = '';
    this.states = [];
    this.cities = [];
    this.OrganisationMaintenanceForm.patchValue({
      ID: '',
      CompanyCode: '',
      Name: '',
      TradingName: '',
      Laddr1: '',
      Laddr2: '',
      Laddr3: '',
      Paddr1: '',
      Paddr2: '',
      Paddr3: '',
      Country: '-1',
      State: '-1',
      City: '-1',
      ZipCode: '',
      TaxNumber: '',
      SuperannuationID: '',
      DefaultPayrollRounding: '-1',
      DefaultCurrency: '-1',
      Logo: null,
      Phone: '',
      Fax: '',
      EmailAddress: ''
    });
    this.OrganisationMaintenanceForm.markAsUntouched();
    this.OrganisationMaintenanceForm.markAsPristine();
    this.Submitted = false;
    this.Logo = 'assets/images/blank-company-logo.jpg';
    this.OrganisationMaintenanceForm.get('CompanyCode').enable();
  }
  //Bind Countries
  BindCountries() {
    this.Loading = true;
    this.sysCommonService.getActiveCountries().subscribe((resp: any) => {
      this.countries = resp.data.countries;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }
  //Bind Currencies
  Currencies: any[] = [];
  BindCurrency() {
    this.Loading = true;
    this.sysCommonService.getCurrency().subscribe((resp: any) => {
      this.Currencies = resp.data.cuurency;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }
  //The method executes when country dropdownlist CHANGE event by passing the Country ID
  onCountrySelected(ID) {
    this.states = [];
    this.cities = [];
    if(ID!='-1'){
    this.BindStates(ID);
    }
    this.OrganisationMaintenanceForm.patchValue({
      State: '-1',
      City: '-1'
    });
  }
  //Bind States by country ID
  BindStates(countryID) {
    //  this.Loading = true;
    this.sysCommonService.getStatesBYCountryID(countryID).subscribe((resp: any) => {
      this.states = resp.data.states;
      // this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }

  //The method executes when country dropdownlist CHANGE event by passing the Country ID
  onStatesSelected(ID) {
    this.cities = [];
    if(ID!='-1'){
   
    this.BindCities(ID); 
  }
  this.OrganisationMaintenanceForm.patchValue({
    City: '-1'
  });
  }
  //Bind States by country ID
  BindCities(stateID) {
    // this.Loading = true;
    this.sysCommonService.getCitiesByStateID(stateID).subscribe((resp: any) => {
      this.cities = resp.data.cities;
      // this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }

  OnActionClick(event: any) {
    var colId = event.column.getId();
    this.RowIndex=event.rowIndex;
    if (colId == 'Edit') {
      this.RowIndex=event.rowIndex;
      this.RecID = event.data.id;
      this.OrganisationCode = event.data.companyCode;
      this.OrganisationName = event.data.name;
      this.AgEdit(event.data.id);
      if (event.deleteStatus == 'Active') {
        this.OrganisationMaintenanceForm.enable();
        this.IsActive = true;
      } else {
        this.OrganisationMaintenanceForm.disable();
        this.IsActive = false;
      }
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    debugger;
    console.log(params);
    console.log(params.data.deleteStatus);
    /* let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent */
    if (params.data.deleteStatus == 'Active') {
      let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
      return cellContent
    } else {
      let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-usd"></i></div>';
      return cellContent
    }
  }
  AgEdit(id) {
    console.log(event);
    debugger;
    console.log(localStorage.getItem('Token'));
    this.organisationMaintenanceService.getCompanyByID(id).subscribe((resp: any) => {
      let company = resp.data.company;
      this.BindStates(company.country);
      this.BindCities(company.state);
      this.RecID = company.id;
      this.OrganisationCode = company.companyCode;
      this.OrganisationName = company.name;
      this.OrganisationMaintenanceForm.patchValue({
        ID: company.id,
        CompanyCode: company.companyCode,
        Name: company.name,
        TradingName: company.tradingName,
        Laddr1: company.laddr1,
        Laddr2: company.laddr2,
        Laddr3: company.laddr3,
        Paddr1: company.paddr1,
        Paddr2: company.paddr2,
        Paddr3: company.paddr3,
        Country: company.country,
        State: company.state,
        City: company.city,
        ZipCode: company.zipCode,
        TaxNumber: company.taxNumber,
        SuperannuationID: company.superannuationID,
        DefaultPayrollRounding: company.defaultPayrollRounding,
        DefaultCurrency: company.defaultCurrency,
        Logo: company.logo,
        Phone: company.phone,
        Fax: company.fax,
        EmailAddress: company.emailAddress
      });
      console.log(company.logo);
      if (company.logo != null) {
        this.Logo = 'data:image/jpeg;base64,' + company.logo;
      }
      else {
        this.Logo = 'assets/images/blank-company-logo.jpg';
        console.log(this.Logo);
      }
      if (!company.deleted) {
        this.OrganisationMaintenanceForm.enable();
        this.IsActive = true;
      } else {
        this.OrganisationMaintenanceForm.disable();
        this.IsActive = false;
      }
    }, (error) => {
      this.Loading = false;
    });

    this.Mode = 'Edit';
    this.readonly = true;
    //this.OrganisationMaintenanceForm.get('CompanyCode').disable();

  }
  // OnSaveConfirm() {
  //   this.confirmation.ConfirmationPopup('Are you sure to save record?');
  // }

  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  //@ViewChild('confirmation') confirmation: TemplateRef<any>;
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
  //@ViewChild('confirmationTest') confirmationTest: ConfirmationDialogPopupComponent;

  Logo: any;
  @ViewChild('CompanyLogo') CompanyLogoVariable: ElementRef;
  onSelectFile(evt) {

    const file = evt.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
      this.CompanyLogoVariable.nativeElement.value = '';
    }
  }
  base64textString: any;
  handleReaderLoaded(e) {
    var binaryString = e.target.result;
    this.base64textString = btoa(binaryString);

    this.Logo = 'data:image/jpeg;base64,' + this.base64textString;
    console.log(this.Logo);
    console.log(btoa(binaryString));
    // let imageData = this.convertDataURIToBinary(this.base64textString);
    this.OrganisationMaintenanceForm.patchValue({
      Logo: this.base64textString
    });
  }

  DeleteCompanyLogo() {
    this.OrganisationMaintenanceForm.patchValue({
      Logo: null
    });
    this.Logo = 'assets/images/blank-company-logo.jpg';
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
}
