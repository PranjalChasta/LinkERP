import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequisitionComponent } from './requisition/requisition.component';
import { Routes, RouterModule } from '@angular/router';
import { RequisitionDetailsComponent } from './requisition/requisition-details/requisition-details.component';
import { RequisitionApprovalLogicComponent } from './requisition/requisition-approval-logic/requisition-approval-logic.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ngx-custom-validators';
import { TimepickerModule, BsDatepickerModule } from 'ngx-bootstrap';
import { SHAREModule } from '../shared/share.module';
import { PurchaseTemplateComponent } from './purchase-template/purchase-template.component';
import { InternalTransfersComponent } from './internal-transfers/internal-transfers.component';


/* import { RequisitionApprovalLogicComponent } from './requisition/requisition-approval-logic/requisition-approval-logic.component'; */
import { PurchaseTemplateDetailComponent } from './purchase-template/purchase-template-detail/purchase-template-detail.component';

import { RequisitionQuotationAnalysisComponent } from './requisition-quotation-analysis/requisition-quotation-analysis.component'
import { RequestApprovalComponent } from './request-approval/request-approval.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseGoodsReceiveNoteComponent } from './purchase-goods-receive-note/purchase-goods-receive-note.component';
import { LandedCostComponent } from './landed-cost/landed-cost.component';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase-invoice.component';
import { PurchaseOrderDetailComponent } from './purchase-order/purchase-order-detail/purchase-order-detail.component';
import { LandedCostPurchaseOrderComponent } from './landed-cost/landed-cost-purchase-order/landed-cost-purchase-order.component';
import { PurchaseGRNDetailsComponent } from './purchase-goods-receive-note/purchase-grndetails/purchase-grndetails.component';
import { LandedCostInvoicesComponent } from './landed-cost/landed-cost-invoices/landed-cost-invoices.component';

import { PurchaseApprovalLogicComponent } from './purchase-order/purchase-approval-logic/purchase-approval-logic.component';
import { LandedCostTaxableImportsComponent }
  from './landed-cost/landed-cost-taxable-imports/landed-cost-taxable-imports.component';

import { AuthGuard } from '../auth.guard';
import { VendorComponent } from './vendor/vendor.component';
import { RequestForQuotationComponent } from './request-for-quotation/request-for-quotation.component';
import { VendorQuotePriceComponent } from './request-for-quotation/vendor-quote-price/vendor-quote-price.component';
import { VendorPriceComparisionComponent } from './request-for-quotation/vendor-price-comparision/vendor-price-comparision.component';
import { ConvertRequisitionToPoComponent } from './convert-requisition-to-po/convert-requisition-to-po.component';
import { InitiateInternalTransfersComponent } from './initiate-internal-transfers/initiate-internal-transfers.component';

import { SearchByPipe } from '../directives/search-by-pipe';
import { OrderApprovalComponent } from './order-approval/order-approval.component';
import { RequestionProductMatrixComponent } from './requisition/requestion-product-matrix/requestion-product-matrix.component';
import { LandedCostImportCostComponent } from './landed-cost/landed-cost-import-cost/landed-cost-import-cost.component';
import { LandedCostShipmentLinesComponent } from './landed-cost/landed-cost-shipment-lines/landed-cost-shipment-lines.component';
import { LandedCostStockBookedInComponent } from './landed-cost/landed-cost-stock-booked-in/landed-cost-stock-booked-in.component';
import { TenderTypesLookupListComponent } from './tender-types-lookup-list/tender-types-lookup-list.component';
import { PurReportsComponent } from './pur-reports/pur-reports.component';
import { GoodsReceivedNoteComponent } from './goods-received-note/goods-received-note.component';
//import { TenderTypesLookupListComponent } from './tender-types-lookup-list/tender-types-lookup-list.component';
import { PurchaseProductMatrixComponent } from './purchase-order/purchase-order-detail/purchase-product-matrix/purchase-product-matrix.component';
import { CreatePoFromTempleteComponent } from './purchase-order/create-po-from-templete/create-po-from-templete.component';
import { PurchaseOrderdetailInlineComponent } from './purchase-order/purchase-order-detail/purchase-orderdetail-inline/purchase-orderdetail-inline.component';
import { InitiateInternalTransfersDetailsComponent } from './initiate-internal-transfers/initiate-internal-transfers-details/initiate-internal-transfers-details.component';
import { GrnProductMatrixComponent } from './goods-received-note/grn-product-matrix/grn-product-matrix.component';
import { GrnProductSerialComponent } from './goods-received-note/grn-product-serial/grn-product-serial.component';
import { GoodsReciveProductstyleComponent } from './goods-received-note/goods-recive-productstyle/goods-recive-productstyle.component';
import { AppGrnProductOtherComponent } from './goods-received-note/app-grn-product-other/app-grn-product-other.component';
import { PurchaseOrderAuditComponent } from './purchase-order/purchase-order-audit/purchase-order-audit.component'; 
const appRoute: Routes = [
  { path: 'pur/requisition', component: RequisitionComponent, canActivate: [AuthGuard] },
  { path: 'pur/requisition/:id', component: RequisitionComponent, canActivate: [AuthGuard] },
  { path: 'pur/purchaseTemplate', component: PurchaseTemplateComponent, canActivate: [AuthGuard] },
  { path: 'pur/internaltransfer', component: InitiateInternalTransfersComponent, canActivate: [AuthGuard] },
  { path: 'pur/quotation', component: RequisitionQuotationAnalysisComponent, canActivate: [AuthGuard] },
  { path: 'pur/requestApproval', component: RequestApprovalComponent, canActivate: [AuthGuard] },
  { path: 'pur/purchase-order', component: PurchaseOrderComponent, canActivate: [AuthGuard] },
  { path: 'pur/purchase-order/:id', component: PurchaseOrderComponent, canActivate: [AuthGuard] },
  { path: 'pur/goodsReceiveNote', component: PurchaseGoodsReceiveNoteComponent, canActivate: [AuthGuard] },
  { path: 'pur/landedcost', component: LandedCostComponent, canActivate: [AuthGuard] },
  { path: 'pur/purchase-invoice', component: PurchaseInvoiceComponent, canActivate: [AuthGuard] },
  { path: 'pur/landed-cost-shipment-lines', component: LandedCostShipmentLinesComponent, canActivate: [AuthGuard] },
  { path: 'pur/request-for-quotation', component: RequestForQuotationComponent, canActivate: [AuthGuard] },
  { path: 'pur/orderApproval', component: OrderApprovalComponent, canActivate: [AuthGuard] },
  { path: 'pur/quote-analysis', component: RequestForQuotationComponent, canActivate: [AuthGuard] },
  { path: 'pur/convert-to-purchase-order', component: ConvertRequisitionToPoComponent, canActivate: [AuthGuard] },
  { path: 'pur/quote-analysis', component: RequestForQuotationComponent, canActivate: [AuthGuard] },
  { path: 'pur/tender-types', component: TenderTypesLookupListComponent, canActivate: [AuthGuard] },
  { path: 'pur/pur-reports', component: PurReportsComponent, canActivate: [AuthGuard] },
  { path: 'pur/goods-received-note', component: GoodsReceivedNoteComponent, canActivate: [AuthGuard] },
  { path: 'pur/goods-received-note/:id', component: GoodsReceivedNoteComponent, canActivate: [AuthGuard] },
  { path: 'pur/quote-analysis', component: RequestForQuotationComponent, canActivate: [AuthGuard] },
  //{ path: 'pur/tender-types', component: TenderTypesLookupListComponent, canActivate: [AuthGuard] } ,

]

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forRoot(appRoute),
    ReactiveFormsModule,
    CustomFormsModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SHAREModule//,
    //NumericTextboxModule

  ],
  declarations: [
    RequisitionComponent,
    RequisitionDetailsComponent,
    PurchaseTemplateComponent,
    PurchaseTemplateDetailComponent,
    RequisitionApprovalLogicComponent,
    InternalTransfersComponent,
    RequisitionQuotationAnalysisComponent,
    RequestApprovalComponent,
    PurchaseOrderComponent,
    PurchaseGoodsReceiveNoteComponent,
    LandedCostComponent,
    PurchaseInvoiceComponent,
    PurchaseOrderDetailComponent,
    LandedCostPurchaseOrderComponent,
    PurchaseGRNDetailsComponent,
    LandedCostInvoicesComponent,
    PurchaseApprovalLogicComponent,
    LandedCostShipmentLinesComponent,
    LandedCostTaxableImportsComponent,
    RequestForQuotationComponent,
    VendorQuotePriceComponent,
    VendorPriceComparisionComponent,
    OrderApprovalComponent,
    ConvertRequisitionToPoComponent,
    InitiateInternalTransfersComponent,
    RequestionProductMatrixComponent,
    // TenderTypesLookupListComponent,
    //,SearchByPipe
    LandedCostImportCostComponent,
    LandedCostStockBookedInComponent,
    PurReportsComponent,
    GoodsReceivedNoteComponent,
    // VendorComponent
    PurchaseProductMatrixComponent,
    CreatePoFromTempleteComponent,
    PurchaseOrderdetailInlineComponent,
    InitiateInternalTransfersDetailsComponent,
    GrnProductMatrixComponent,
    GrnProductSerialComponent,
    GoodsReciveProductstyleComponent,
    AppGrnProductOtherComponent,
    PurchaseOrderAuditComponent  
   // VendorComponent
  ],
  providers: [RequisitionComponent],
})
export class PurModule { }

