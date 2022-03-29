import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DualListBoxModule } from 'ng2-dual-list-box';
//Module
import { SHAREModule } from '../shared/share.module';
import { CKEditorModule } from 'ng2-ckeditor';
import { CurrencyMaskModule } from 'ng2-currency-mask';
//Auth Guard
import { AuthGuard } from '../auth.guard';

//Services
import { CreditReasonsService } from './services/credit-reasons.service';

//Components
import { CreditReasonsComponent } from './credit-reasons/credit-reasons.component';
import { GiftVoucherComponent } from './gift-voucher/gift-voucher.component';
import { TerminalsComponent } from './terminals/terminals.component';
import { TerminalGroupComponent } from './terminals/terminal-group/terminal-group.component';
import { TenderTypesComponent } from './tender-types/tender-types.component';
import { TerminalGroupItemsComponent } from './terminals/terminal-group-items/terminal-group-items.component';
import { NextNumberComponent } from './next-number/next-number.component';
import { PriceWorkflowComponent } from './price-workflow/price-workflow.component';

import { TenderTypesLookupListComponent } from '../pur/tender-types-lookup-list/tender-types-lookup-list.component';
import { SopTenderTypesComponent } from './sop-tender-types/sop-tender-types.component';
import { QuotationComponent } from './quotation/quotation.component';
import { QuotationDetailsComponent } from './quotation/quotation-details/quotation-details.component';
import { QuotationDetailTaxLabelsComponent } from './quotation/quotation-detail-tax-labels/quotation-detail-tax-labels.component';
import { ModalModule } from 'ngx-bootstrap';
import { SopOrderComponent } from './sop-order/sop-order.component';
import { SopOrderDetailComponent } from './sop-order/sop-order-detail/sop-order-detail.component';
import { SopOrderDetailTaxLabelComponent } from './sop-order/sop-order-detail-tax-label/sop-order-detail-tax-label.component';
import { SopOrderDetailKitComponent } from './sop-order/sop-order-detail-kit/sop-order-detail-kit.component';
import { SopOrderDetailPriceschemeComponent } from './sop-order/sop-order-detail-pricescheme/sop-order-detail-pricescheme.component';
import { SopOrderDetailMatrixComponent } from './sop-order/sop-order-detail-matrix/sop-order-detail-matrix.component';
import { SopOrderDetailSerialisedComponent } from './sop-order/sop-order-detail-serialised/sop-order-detail-serialised.component';
import { PrescriptionDoctorComponent } from './prescription-doctor/prescription-doctor.component';
import { PrescriptionInstructionsComponent } from './prescription-instructions/prescription-instructions.component';
import { PatientMaintenanceComponent } from './patient-maintenance/patient-maintenance.component';
import { NonPrescriptionLabelsComponent } from './non-prescription-labels/non-prescription-labels.component';
import { PrescriptionEntryComponent } from './prescription-entry/prescription-entry.component';
import { PrescriptionEntryDetailsComponent } from './prescription-entry/prescription-entry-details/prescription-entry-details.component';
import { PrescriptionViewCopiesComponent } from './prescription-entry/prescription-view-copies/prescription-view-copies.component';
import { ShiftListComponent } from './shift-list/shift-list.component';
import { CloseShiftComponent } from './close-shift/close-shift.component';
import { PaymentCloseShiftComponent } from './payment-close-shift/payment-close-shift.component';
import { PatientViewDetailsComponent } from './patient-view-details/patient-view-details.component';
import { ServerRelationshipComponent } from './server-relationship/server-relationship.component';
import { PosReportsComponent } from './pos-reports/pos-reports.component';
import { PrescriptionListComponent } from './prescription-list/prescription-list.component';
import { MixtureDetailComponent } from './prescription-entry/mixture-detail/mixture-detail.component';
import { ChangeQuantityComponent } from './sop-order/sop-order-detail/change-quantity/change-quantity.component';
import { ChangeUnitpriceComponent } from './sop-order/sop-order-detail/change-unitprice/change-unitprice.component';
import { ChangeDiscountComponent } from './sop-order/sop-order-detail/change-discount/change-discount.component';
import { PaymentscreenComponent } from './sop-order/paymentscreen/paymentscreen.component';
import { CreditPaymentComponent } from './sop-order/credit-payment/credit-payment.component';
import { ChequePaymentComponent } from './sop-order/cheque-payment/cheque-payment.component';
import { CredPaymentComponent } from './sop-order/cred-payment/cred-payment.component';
import { CashPaymentComponent } from './sop-order/cash-payment/cash-payment.component';
import { PaymentMethodsComponent } from './sop-order/payment-methods/payment-methods.component';
import { TerminalConfigurationComponent } from './terminal-configuration/terminal-configuration.component';
const appRoute: Routes = [
  { path: 'pos/credit-reasons', component: CreditReasonsComponent, canActivate: [AuthGuard] },
  { path: 'pos/gift-voucher', component: GiftVoucherComponent, canActivate: [AuthGuard] },
  { path: 'pos/terminals', component: TerminalsComponent, canActivate: [AuthGuard] },
  { path: 'pos/tender-types', component: TenderTypesLookupListComponent, canActivate: [AuthGuard] },
  { path: 'pos/quotation', component: QuotationComponent, canActivate: [AuthGuard] },
  { path: 'pos/price-workflow', component: PriceWorkflowComponent, canActivate: [AuthGuard] },
  { path: 'pos/generic-table', component: SopTenderTypesComponent, canActivate: [AuthGuard] },
  { path: 'pos/sop-order', component: SopOrderComponent, canActivate: [AuthGuard] },
  { path: 'pos/prescription-doctor', component: PrescriptionDoctorComponent, canActivate: [AuthGuard] },
  { path: 'pos/patient-maintenance', component: PatientMaintenanceComponent, canActivate: [AuthGuard] },
  { path: 'pos/prescription-instruction', component: PrescriptionInstructionsComponent, canActivate: [AuthGuard] },
  { path: 'pos/non-prescription-labels', component: NonPrescriptionLabelsComponent, canActivate: [AuthGuard] },
  { path: 'pos/prescription-entry', component: PrescriptionEntryComponent, canActivate: [AuthGuard] },
  { path: 'pos/shift-list', component: ShiftListComponent, canActivate: [AuthGuard] },
  { path: 'pos/close-shift', component: CloseShiftComponent, canActivate: [AuthGuard] },
  { path: 'pos/payment-close-shift', component: PaymentCloseShiftComponent, canActivate: [AuthGuard] },
  { path: 'pos/server-relationship', component: ServerRelationshipComponent, canActivate: [AuthGuard] },
  { path: 'pos/pos-reports', component: PosReportsComponent, canActivate: [AuthGuard] },
  { path: 'pos/mixture-detail', component: MixtureDetailComponent, canActivate: [AuthGuard] },
  { path: 'pos/terminal-configuration', component: TerminalConfigurationComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoute),
    FormsModule,
    ReactiveFormsModule,
    SHAREModule,
    CKEditorModule,
    CurrencyMaskModule,
    NgbModule,
    ModalModule.forRoot(),
    DualListBoxModule.forRoot()
  ],
  declarations: [
    CreditReasonsComponent,
    GiftVoucherComponent,
    TerminalsComponent,
    TerminalGroupComponent,
    TenderTypesComponent,
    TerminalGroupItemsComponent,
    NextNumberComponent,
    PriceWorkflowComponent,
    TenderTypesLookupListComponent,
    SopTenderTypesComponent,
    QuotationComponent,
    QuotationDetailsComponent,
    QuotationDetailTaxLabelsComponent,
    SopOrderComponent,
    SopOrderDetailComponent,
    SopOrderDetailTaxLabelComponent,
    SopOrderDetailKitComponent,
    SopOrderDetailPriceschemeComponent,
    SopOrderDetailMatrixComponent,
    SopOrderDetailSerialisedComponent,
    PrescriptionDoctorComponent,
    PrescriptionInstructionsComponent,
    PatientMaintenanceComponent,
    NonPrescriptionLabelsComponent,
    PrescriptionEntryComponent,
    PrescriptionEntryDetailsComponent,
    PrescriptionViewCopiesComponent,
    ShiftListComponent,
    CloseShiftComponent,
    PaymentCloseShiftComponent,
    PatientViewDetailsComponent,
    ServerRelationshipComponent,
    PosReportsComponent,
    PrescriptionListComponent,
    MixtureDetailComponent,
    ChangeQuantityComponent,
    ChangeUnitpriceComponent,
    ChangeDiscountComponent,
    PaymentscreenComponent,
    CashPaymentComponent,
    CreditPaymentComponent,
    ChequePaymentComponent,
    CredPaymentComponent,
    PaymentMethodsComponent,
    TerminalConfigurationComponent
  ],
  providers: [
    CreditReasonsService
  ]
})
export class POSModule { }
