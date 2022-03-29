// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule, Routes } from '@angular/router';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// //Module
// import { SHAREModule } from '../shared/share.module';

// //Services
// import { OrganisationMaintenanceService } from './services/organisation-maintenance.service';
// import { WorkflowService } from './services/workflow.service';
// import { UserService } from './services/user.service';
// import { RoleService } from './services/role.service';
// import { CountryService } from './services/country.service';
// import { JobsService } from './services/jobs.service';

// //Components
// import { OrganisationMaintenanceComponent } from './organisation-maintenance/organisation-maintenance.component';
// import { RoleComponent } from './role/role.component';
// import { WorkflowComponent } from './workflow/workflow.component';
// import { UserComponent } from './user/user.component';
// import { CountryComponent } from './country/country.component';
// import { CountrystateComponent } from './countrystate/countrystate.component';
// import { CountrystatecityComponent } from './countrystatecity/countrystatecity.component';
// import { FrequencyComponent } from './frequency/frequency.component';
// import { BankComponent } from './bank/bank.component';
// import { DocumenttemplateComponent } from './documenttemplate/documenttemplate.component';
// import { RoleCompanyAccessComponent } from './role/role-company-access/role-company-access.component';
// import { JobsComponent } from './jobs/jobs.component';
// import { AttachmentsComponent } from './attachments/attachments.component';
// //import { TableGenericComponent } from './table-generic/table-generic.component';
// import { GenericTableComponent } from './generic-table/generic-table.component';

// //R & D 
// //import { AggridOrganisationComponent } from '../sys/aggrid-organisation/aggrid-organisation.component';
// import { DemoaggridComponent } from './demoaggrid/demoaggrid.component';
// import { AgGridModule } from 'ag-grid-angular';
// // import { AggridOrganisationComponent } from './aggrid-organisation/aggrid-organisation.component';
// import { AggridOrganisationComponent } from './aggrid-organisation/aggrid-organisation.component';
// import { RoleModuleAccessComponent } from './role/role-module-access/role-module-access.component';
//  import { GeneralNotesComponent } from '../directives/general-notes/general-notes.component';
// import { BsDatepickerModule } from 'ngx-bootstrap';
// //import { CustomFormsModule } from 'ngx-custom-validators';
// import { OnlyNumber } from '../directives/onlynumber';
// import { TableGenericComponent } from './table-generic/table-generic.component';
// import { TaxCodeComponent } from './tax-code/tax-code.component';
// import { BankAccountComponent } from './bank/bank-account/bank-account.component';
// import { CurrencyRatesComponent } from './currency-rates/currency-rates.component';
// import { BankAccountMappingComponent } from './bank/bank-account-mapping/bank-account-mapping.component';
// import { TaxCodeDetailsComponent } from './tax-code/tax-code-details/tax-code-details.component';
// import { WorkflowApproversComponent } from './workflow/workflow-approvers/workflow-approvers.component';
// import { CurrencyComponent } from './currency/currency.component';
// import { CustomFormsModule } from 'ngx-custom-validators';


// const appRoute: Routes = [
//   { path: 'sys/organisation-maintenance', component: OrganisationMaintenanceComponent },
//   { path: 'sys/ag-demo', component: DemoaggridComponent },
//   { path: 'sys/role', component: RoleComponent },
//   { path: 'sys/user', component: UserComponent },
//   { path: 'sys/work-flow', component: WorkflowComponent },
//   { path: 'sys/country', component: CountryComponent },
//   { path: 'sys/counttrystatecity', component: CountrystatecityComponent },
//   { path: 'sys/countrystate', component: CountrystateComponent },
//   { path: 'sys/jobs', component: JobsComponent },
//   { path: 'sys/bank', component: BankComponent },
//   { path: 'sys/frequency', component: FrequencyComponent },
//   { path: 'sys/document-template', component: DocumenttemplateComponent },
//  { path: 'sys/attachments', component: AttachmentsComponent },
//  { path: 'sys/generic-table', component: TableGenericComponent },
//  { path: 'sys/ag-grid', component: AggridOrganisationComponent },
//  { path: 'sys/tax-code', component: TaxCodeComponent },
//  { path: 'sys/currency-rate', component: CurrencyRatesComponent },
//  { path: 'sys/currency', component: CurrencyComponent }
// ];

// @NgModule({
//   imports: [
//     CommonModule,
//     RouterModule.forRoot(appRoute),
//     FormsModule,
//     ReactiveFormsModule,
//     BsDatepickerModule.forRoot(),
//     CustomFormsModule,
//     SHAREModule    
//   ],
//  // declarations: [OrganisationMaintenanceComponent, UserComponent,
//   declarations: [OnlyNumber,OrganisationMaintenanceComponent, UserComponent,CurrencyComponent,
//     AggridOrganisationComponent, RoleComponent, DemoaggridComponent,
//     WorkflowComponent, CountrystatecityComponent,
//     CountrystateComponent, CountryComponent, JobsComponent,
//     FrequencyComponent, BankComponent, RoleCompanyAccessComponent, DocumenttemplateComponent, AttachmentsComponent, RoleModuleAccessComponent,TableGenericComponent,TaxCodeComponent,BankAccountComponent,CurrencyRatesComponent ,BankAccountMappingComponent,TaxCodeDetailsComponent,WorkflowApproversComponent],
//   providers: [OrganisationMaintenanceService, WorkflowService, UserService, RoleService, CountryService, JobsService]
// })
// export class SYSModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//Module
import { SHAREModule } from '../shared/share.module';
import { CKEditorModule } from 'ng2-ckeditor';
import { CurrencyMaskModule } from 'ng2-currency-mask';
//Auth Guard
import { AuthGuard } from '../auth.guard';

//Services
import { OrganisationMaintenanceService } from './services/organisation-maintenance.service';
import { WorkflowService } from './services/workflow.service';
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { CountryService } from './services/country.service';
import { JobsService } from './services/jobs.service';
import { FrequencyService } from './services/frequency.service';
//Components
import { OrganisationMaintenanceComponent } from './organisation-maintenance/organisation-maintenance.component';
//import { RoleComponent } from './role/role.component';
import { WorkflowComponent } from './workflow/workflow.component';
//import { WorkflowApproversComponent } from './workflow/workflow-approvers/workflow-approvers.component';
import { UserComponent } from './user/user.component';
import { CountryComponent } from './country/country.component';
import { CountrystateComponent } from './countrystate/countrystate.component';
import { CountrystatecityComponent } from './countrystatecity/countrystatecity.component';
import { FrequencyComponent } from './frequency/frequency.component';
import { BankComponent } from './bank/bank.component';
import { DocumenttemplateComponent } from './documenttemplate/documenttemplate.component';
//import { RoleCompanyAccessComponent } from './role/role-company-access/role-company-access.component';
import { JobsComponent } from './jobs/jobs.component';
import { AttachmentsComponent } from './attachments/attachments.component';


//R & D 
//import { AggridOrganisationComponent } from '../sys/aggrid-organisation/aggrid-organisation.component';
import { DemoaggridComponent } from './demoaggrid/demoaggrid.component';
import { AgGridModule } from 'ag-grid-angular';
// import { AggridOrganisationComponent } from './aggrid-organisation/aggrid-organisation.component';
import { AggridOrganisationComponent } from './aggrid-organisation/aggrid-organisation.component';
import { RoleModuleAccessComponent } from './role/role-module-access/role-module-access.component';
import { RoleMenuAccessComponent } from './role/role-menu-access/role-menu-access.component';

import { BsDatepickerModule } from 'ngx-bootstrap';
//import { CustomFormsModule } from 'ngx-custom-validators';
import { OnlyNumber } from '../directives/onlynumber';
import { TaxCodeComponent } from './tax-code/tax-code.component';
import { CurrencyRatesComponent } from './currency-rates/currency-rates.component';
//import { TaxCodeDetailsComponent } from './tax-code/tax-code-details/tax-code-details.component';
import { RoleCompanyAccessComponent } from './role/role-company-access/role-company-access.component';
import { BankAccountComponent } from './bank/bank-account/bank-account.component';
import { TableGenericComponent } from './table-generic/table-generic.component';
import { BankAccountMappingComponent } from './bank/bank-account-mapping/bank-account-mapping.component';
import { TaxCodeDetailsComponent } from './tax-code/tax-code-details/tax-code-details.component';
import { WorkflowApproversComponent } from './workflow/workflow-approvers/workflow-approvers.component';
import { CurrencyComponent } from './currency/currency.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { RoleComponent } from './role/role.component';



import { UserRoleComponent } from './user/user-role/user-role.component';
import { CryptoAes } from '../directives/crypto-aes';
import { CustomFormsModule } from 'ngx-custom-validators';
import { ConfigurationComponent } from './configuration/configuration.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TwoDigitDecimaNumberDirective } from '../directives/TwoDigitDecimaNumberDirective';
import { FourDigitDecimaNumberDirective } from '../directives/FourDigitDecimaNumberDirective';
import { ReportDocumentTemplateComponent } from './documenttemplate/report-document-template/report-document-template.component';
import { ReportEMailScheduleComponent } from './report-email-schedule/report-email-schedule.component';
import { RoleWarehouseAccessComponent } from './role/role-warehouse-access/role-warehouse-access.component';
import { SalesPersonComponent } from './user/SalesPerson/sales-person/sales-person.component';
import { SysReportsComponent } from './sys-reports/sys-reports.component';
import { UtilityBackUPDataBaseComponent } from './utility-back-updata-base/utility-back-updata-base.component';
import { ProfileComponent } from './Profile/profile.component';


const appRoute: Routes = [
  { path: 'sys/organisation-maintenance', component: OrganisationMaintenanceComponent, canActivate: [AuthGuard] },
  { path: 'sys/ag-demo', component: DemoaggridComponent, canActivate: [AuthGuard] },
  { path: 'sys/role', component: RoleComponent, canActivate: [AuthGuard] },
  { path: 'sys/user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'sys/work-flow', component: WorkflowComponent, canActivate: [AuthGuard] },
  { path: 'sys/country', component: CountryComponent, canActivate: [AuthGuard] },
  { path: 'sys/city', component: CountrystatecityComponent, canActivate: [AuthGuard] },
  { path: 'sys/state', component: CountrystateComponent, canActivate: [AuthGuard] },
  { path: 'sys/jobs', component: JobsComponent, canActivate: [AuthGuard] },
  { path: 'sys/bank', component: BankComponent, canActivate: [AuthGuard] },
  { path: 'sys/frequency', component: FrequencyComponent, canActivate: [AuthGuard] },
  { path: 'sys/document-template', component: DocumenttemplateComponent, canActivate: [AuthGuard] },
  { path: 'sys/attachments', component: AttachmentsComponent, canActivate: [AuthGuard] },
  { path: 'sys/generic-table', component: TableGenericComponent, canActivate: [AuthGuard] },
  { path: 'sys/rnd', component: DemoaggridComponent, canActivate: [AuthGuard] },
  { path: 'sys/tax-code', component: TaxCodeComponent, canActivate: [AuthGuard] },
  { path: 'sys/currency-rate', component: CurrencyRatesComponent, canActivate: [AuthGuard] },
  { path: 'sys/currency', component: CurrencyComponent, canActivate: [AuthGuard] },
  { path: 'sys/Configuration', component: ConfigurationComponent, canActivate: [AuthGuard] },
  { path: 'sys/profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'sys/changing-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'sys/report-schedule', component: ReportEMailScheduleComponent, canActivate: [AuthGuard] },
  { path: 'sys/SalesPerson', component: SalesPersonComponent, canActivate: [AuthGuard] },
  { path: 'sys/reports', component: SysReportsComponent, canActivate: [AuthGuard] },
  { path: 'sys/BackUPDataBase', component: UtilityBackUPDataBaseComponent, canActivate: [AuthGuard] },
  { path: 'sys/newprofile', component: ProfileComponent, canActivate: [AuthGuard] }
  
  
  
  
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoute),
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    CustomFormsModule,
    SHAREModule,
    CKEditorModule,
    CurrencyMaskModule,
    NgbModule
  ],
  declarations: [
    OrganisationMaintenanceComponent,
    UserComponent,
    AggridOrganisationComponent,
    RoleComponent,
    DemoaggridComponent,
    WorkflowComponent,
    CountrystatecityComponent,
    CountrystateComponent,
    CountryComponent,
    JobsComponent,
    FrequencyComponent,
    BankComponent,
    RoleCompanyAccessComponent,
    RoleMenuAccessComponent,
    DocumenttemplateComponent,
    AttachmentsComponent,
    RoleModuleAccessComponent,
    TableGenericComponent,
    TaxCodeComponent,
    BankAccountComponent,
    CurrencyRatesComponent,
    BankAccountMappingComponent,
    TaxCodeDetailsComponent,
    WorkflowApproversComponent,
    UserRoleComponent,
    CurrencyComponent,
    ConfigurationComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    ReportDocumentTemplateComponent,
    ReportEMailScheduleComponent,
    RoleWarehouseAccessComponent,
    SalesPersonComponent,
    SysReportsComponent,
    UtilityBackUPDataBaseComponent,
    ProfileComponent
    
    
    
  ],
  providers: [
    OrganisationMaintenanceService,
    WorkflowService,
    UserService,
    RoleService,
    CountryService,
    JobsService,
    FrequencyService,
    CryptoAes
  ]
})
export class SYSModule { }
