import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridComponent } from '../directives/ag-grid/ag-grid.component';
import { AgGridModule } from 'ag-grid-angular';
import { AttachmentFilesComponent } from '../directives/attachment-files/attachment-files.component';
import { AttachmentsService } from './services/attachments.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReportViewerModule } from 'ngx-ssrs-reportviewer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap';

import { ToastrModule } from 'ngx-toastr';
import { GeneralNotesComponent } from '../directives/general-notes/general-notes.component';
import { BsDatepickerModule, TimepickerModule, BsModalService } from 'ngx-bootstrap';
import { GenericTableDataComponent } from '../directives/generic-table-data/generic-table-data.component';
import { OnlyNumber } from '../directives/onlynumber';
import { InventoryPriceComponent } from '../directives/inventory-price/inventory-price.component';
import { CryptoAes } from '../directives/crypto-aes';
import { ConfirmDialogPopupComponent } from '../directives/confirm-dialog-popup/confirm-dialog-popup.component';
import { ConfirmationDialogPopupComponent } from '../shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

import { ConfirmEqualValidatorDirective } from '../directives/confirm-equal-validator.directive';

//Components
import { ReportFormComponent } from '../reports-base/report-form/report-form.component';
import { ViewReportComponent } from '../reports-base/view-report/view-report.component';
import { SendReportMailComponent } from '../reports-base/send-report-mail/send-report-mail.component';


import { AddChildTableDataComponent } from '../directives/generic-table-data/add-child-table-data/add-child-table-data.component';
import { FourDigitDecimaNumberDirective } from '../directives/FourDigitDecimaNumberDirective';
import { TwoDigitDecimaNumberDirective } from '../directives/TwoDigitDecimaNumberDirective';
import { CustomDateFormatPipe } from './shared-pipes/custom-date-format.pipe';
import { CustomDateTimeFormatPipe } from './shared-pipes/custom-date-time-format.pipe';
import { CustomTimeFormatPipe } from './shared-pipes/custom-time-format.pipe';
import { DatePickerComponent } from './shared-controls/date-picker/date-picker.component';
//import { NumberFormatterComponent } from '../directives/number-formatter.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library as fontLibrary } from '@fortawesome/fontawesome-svg-core';
import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { DateTimePickerComponent } from './shared-controls/date-time-picker/date-time-picker.component';
import { ProductDropdownComponent } from './shared-controls/Applications/product-dropdown/product-dropdown.component';
import { ProductSearchComponent } from './shared-controls/Applications/product-search/product-search.component';
import { ProductSearchDropdownComponent } from './shared-controls/Applications/product-search-dropdown/product-search-dropdown.component';

import { SelectDropDownModule } from 'ngx-select-dropdown';
import { WarehouseSearchDropdownComponent } from './shared-controls/Applications/warehouse-search-dropdown/warehouse-search-dropdown.component';
import { WarehouseBinSearchDropdownComponent } from './shared-controls/Applications/warehouse-bin-search-dropdown/warehouse-bin-search-dropdown.component';
import { VendorSearchDropdownComponent } from './shared-controls/Applications/vendor-search-dropdown/vendor-search-dropdown.component';
import { CategorySearchDropdownComponent } from './shared-controls/Applications/category-search-dropdown/category-search-dropdown.component';
import { SubCategorySearchDropdownComponent } from './shared-controls/Applications/sub-category-search-dropdown/sub-category-search-dropdown.component';
import { SearchByPipe } from '../directives/search-by-pipe';
import { PurchaseOrderSearchComponent } from './shared-controls/Applications/purchase-order-search/purchase-order-search.component';
import { PurchaseRequisitionSearchDropdownComponent } from './shared-controls/Applications/purchase-requisition-search-dropdown/purchase-requisition-search-dropdown.component';
import { PurchaseOrderNumberSearchDropdownComponent } from './shared-controls/Applications/purchase-order-number-search-dropdown/purchase-order-number-search-dropdown.component';
import { ShiftSearchDropdownComponent } from './shared-controls/Applications/shift-search-dropdown/shift-search-dropdown.component';
import { PriceGroupSearchDropdownComponent } from './shared-controls/Applications/price-group-search-dropdown/price-group-search-dropdown.component';
import { DebtorSearchDropdownComponent } from './shared-controls/Applications/debtor-search-dropdown/debtor-search-dropdown.component';
import { CurrencySearchDropdownComponent } from './shared-controls/Applications/currency-search-dropdown/currency-search-dropdown.component';
import { UsersSearchDropdownComponent } from './shared-controls/Applications/users-search-dropdown/users-search-dropdown.component';
import { DebtorSearchComponent } from './shared-controls/Applications/debtor-search/debtor-search.component';
import { AdjustmentDropdownComponent } from './shared-controls/Applications/adjustment-dropdown/adjustment-dropdown.component';
import { AdjustmentDetailDropdownComponent } from './shared-controls/Applications/adjustment-detail-dropdown/adjustment-detail-dropdown.component';
import { OrganisationDetailsComponent } from './shared-controls/Applications/organisation-details/organisation-details.component';
import { RoleDetailasComponent } from './shared-controls/Applications/role-detailas/role-detailas.component';
// import { CommonProductSearchComponent } from './shared-controls/Applications/common-product-search/common-product-search.component';
//import { NumericTextboxModule } from 'ngx-numeric-textbox';
fontLibrary.add(
  faCalendar,
  faClock
);

const appRoute: Routes = [

];

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    //RouterModule.forRoot(appRoute),
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ReportViewerModule,
    AgGridModule.withComponents([]),
    NgbModule,
    ModalModule,
    SelectDropDownModule//,
    //NumericTextboxModule
  ],
  declarations: [
    OnlyNumber,
    AgGridComponent,
    AttachmentFilesComponent,
    GeneralNotesComponent,
    GenericTableDataComponent,
    InventoryPriceComponent,
    ReportFormComponent,
    ViewReportComponent,
    SendReportMailComponent,
    ConfirmDialogPopupComponent,
    ConfirmationDialogPopupComponent,
    AddChildTableDataComponent,
    ConfirmEqualValidatorDirective,
    FourDigitDecimaNumberDirective,
    TwoDigitDecimaNumberDirective,
    CustomDateFormatPipe,
    CustomDateTimeFormatPipe,
    CustomTimeFormatPipe,
    DatePickerComponent,
    DateTimePickerComponent,
    ProductDropdownComponent,
    ProductSearchComponent,
    ProductSearchDropdownComponent,
    WarehouseSearchDropdownComponent,
    WarehouseBinSearchDropdownComponent,
    VendorSearchDropdownComponent,
    CategorySearchDropdownComponent,
    SubCategorySearchDropdownComponent,
    PurchaseOrderSearchComponent,
    SearchByPipe,
    PurchaseRequisitionSearchDropdownComponent,
    PurchaseOrderNumberSearchDropdownComponent,
   // ShiftsearchdropdownComponent,
    ShiftSearchDropdownComponent,
   PriceGroupSearchDropdownComponent,
   DebtorSearchDropdownComponent,
   CurrencySearchDropdownComponent,
   UsersSearchDropdownComponent,
   DebtorSearchComponent,
   AdjustmentDropdownComponent,
   AdjustmentDetailDropdownComponent,
   OrganisationDetailsComponent,
   RoleDetailasComponent,
    //CommonProductSearchComponent,
    // NumberFormatterComponent
  ],
  exports: [
    OnlyNumber,
    AgGridComponent,
    AttachmentFilesComponent,
    GeneralNotesComponent,
    GenericTableDataComponent,
    InventoryPriceComponent,
    ReportFormComponent,
    ViewReportComponent,
    SendReportMailComponent,
    ConfirmDialogPopupComponent,
    ConfirmationDialogPopupComponent,
    AddChildTableDataComponent,
    ConfirmEqualValidatorDirective,
    FourDigitDecimaNumberDirective,
    TwoDigitDecimaNumberDirective,
    CustomDateFormatPipe,
    CustomDateTimeFormatPipe,
    CustomTimeFormatPipe,
    DatePickerComponent,
    DateTimePickerComponent,
    ProductDropdownComponent,
    ProductSearchComponent,
    PurchaseOrderSearchComponent,
    SearchByPipe,
    DebtorSearchComponent,
    // NumberFormatterComponent
  ],
  providers: [
    AttachmentsService,
    DatePipe,
    CryptoAes,
    BsModalService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SHAREModule { }
