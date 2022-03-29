import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
//import { AuthGuard } from './auth.guard';
import { DebterTranctionComponent } from 'src/app/Account Receivable/debtor-tranction/debter-tranction/debter-tranction.component';
import { DebtorsComponent } from 'src/app/Account Receivable/debtor-tranction/Debtors/debtors/debtors.component';
import { SHAREModule } from 'src/app/shared/share.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ngx-custom-validators';
import { DebtorCreditPaymentComponent } from 'src/app/Account Receivable/debtor-tranction/debter-tranction/debtor-credit-payment/debtor-credit-payment.component';
import { ReceiptsComponent } from './receipts/receipts.component';
import { TranctionAllocationComponent } from './debter-tranction/TranctionAllocation/tranction-allocation/tranction-allocation.component';
import { PreviousTranctionComponent } from './debter-tranction/debtor-credit-payment/previous-tranction/previous-tranction.component';
import { RefundComponent } from './Refund/refund/refund.component';
import { RefundDetailsComponent } from './Refund/refund/refund-details/refund-details.component';
import { RefundAllocationComponent } from './Refund/refund/refund-details/refund-allocation/refund-allocation.component';
import { DebtorAdjustmentComponent } from './Adjustment/debtor-adjustment/debtor-adjustment.component';
import { DebtorAdjustmentDetailsComponent } from './Adjustment/AdjustmentDetails/debtor-adjustment-details/debtor-adjustment-details.component';
import { ACRReportsComponent } from './acrreports/acrreports.component';
import { AuthGuard } from 'src/app/auth.guard';
const appRoute: Routes = [
  { path: 'AR/Debtors', component:DebtorsComponent },
  { path: 'AR/Receipts', component:ReceiptsComponent },
  { path: 'AR/Refund', component:RefundComponent },
  { path: 'AR/Debtors/:id', component: DebtorsComponent },
  { path: 'AR/Adjustment', component: DebtorAdjustmentComponent },
  { path: 'AR/reports', component: ACRReportsComponent }
];
@NgModule({
  declarations: [DebterTranctionComponent,DebtorsComponent,
    DebtorCreditPaymentComponent,
    ReceiptsComponent,
    TranctionAllocationComponent,
    PreviousTranctionComponent,
    RefundComponent,
    RefundDetailsComponent,
    RefundAllocationComponent,
    DebtorAdjustmentComponent,
    DebtorAdjustmentDetailsComponent,
    ACRReportsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoute),
    SHAREModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
  ]
})
export class DebterTranctionModule { }
