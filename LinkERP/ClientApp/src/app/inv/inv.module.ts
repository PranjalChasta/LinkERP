/* import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WarehouseComponent } from './warehouse/warehouse.component';
import { AgGridModule } from 'ag-grid-angular';
import { SHAREModule } from '../shared/share.module';

//import { AgGridComponent } from '../directives/ag-grid/ag-grid.component';

import { InventoryPriceLevelComponent } from './inventory-price-level/inventory-price-level.component';
import { InventoryPriceLevelService } from './services/inventory-price-level.service';
import { ProductStyleMatrixComponent } from './product-style-matrix/product-style-matrix.component';
//import { a } from '@angular/core/src/render3';
import { ProductStyleMatrixService } from './services/product-style-matrix.service';
import { ProductStyleMatrixDetailComponent } from './product-style-matrix-detail/product-style-matrix-detail.component';
import { WareHouseBinComponent } from './ware-house-bin/ware-house-bin.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryDetailComponent } from './inventory/inventory-detail/inventory-detail.component';
import { PriceGroupsComponent } from './price-groups/price-groups.component';
//import { SHAREModule } from '../shared/share.module';
//import { AgGridModule } from 'ag-grid-angular';
//import { AgGridComponent } from '../directives/ag-grid/ag-grid.component';
//Services 
const appRoute: Routes = [
  { path: 'inv/warehouse', component: WarehouseComponent },
  { path: 'inv/inventorypricelevel',component:InventoryPriceLevelComponent},
  { path: 'inv/product-style-matrix', component: ProductStyleMatrixComponent } ,
 // { path: 'inv/product-style-matrix-detail', component: ProductStyleMatrixDetailComponent } ,
  { path: 'inv/ware-house-bin', component: WareHouseBinComponent },
  { path: 'inv/inventory', component: InventoryComponent },
  { path: 'inv/inventory-detail', component: InventoryDetailComponent },
  { path: 'inv/price-groups', component: PriceGroupsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoute),
    FormsModule,
    ReactiveFormsModule,
    SHAREModule
  //  AgGridModule.withComponents([])
    
  ],
  declarations: [WarehouseComponent, InventoryPriceLevelComponent,ProductStyleMatrixComponent,ProductStyleMatrixDetailComponent,WareHouseBinComponent, InventoryComponent,InventoryDetailComponent,PriceGroupsComponent]  ,
  providers: [ProductStyleMatrixService]
})
export class INVModule { }
 */

import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WarehouseComponent } from './warehouse/warehouse.component';
import { AgGridModule } from 'ag-grid-angular';
import { SHAREModule } from '../shared/share.module';
import { CustomFormsModule } from 'ngx-custom-validators';
//import { AgGridComponent } from '../directives/ag-grid/ag-grid.component';

import { InventoryPriceLevelComponent } from './inventory-price-level/inventory-price-level.component';
import { InventoryPriceLevelService } from './services/inventory-price-level.service';
import { ProductStyleMatrixComponent } from './product-style-matrix/product-style-matrix.component';
//import { a } from '@angular/core/src/render3';
import { ProductStyleMatrixService } from './services/product-style-matrix.service';
//import { ProductStyleMatrixDetailComponent } from './product-style-matrix-detail/product-style-matrix-detail.component';
import { WareHouseBinComponent } from './ware-house-bin/ware-house-bin.component';
import { ProductStyleMatrixDetailComponent } from './product-style-matrix/product-style-matrix-detail/product-style-matrix-detail.component';
import { PriceGroupsComponent } from './price-groups/price-groups.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryDetailComponent } from './inventory/inventory-detail/inventory-detail.component';
import { BsDatepickerModule, TimepickerModule, BsModalService, ModalModule } from 'ngx-bootstrap';
import { CurrencyRatesComponent } from '../sys/currency-rates/currency-rates.component';
import { WarehouseNextNumberComponent } from './warehouse-next-number/warehouse-next-number.component';
import { InventoryVendorsComponent } from './inventory/inventory-vendors/inventory-vendors.component';
import { InventoryUnitOfMeasureConversionsComponent } from './inventory/inventory-unit-of-measure-conversions/inventory-unit-of-measure-conversions.component';
import { InventoryBarcodeComponent } from './inventory/inventory-barcode/inventory-barcode.component';
//import { InventoryProductPriceComponent } from './inventory/inventory-product-price/inventory-product-price.component';
//import { InventoryStockAllocationDetailsComponent } from './inventory/inventory-stock-allocation-details/inventory-stock-allocation-details.component';
import { InvGenericTableComponent } from './inv-generic-table/inv-generic-table.component';
import { InventoryProductPriceComponent } from './inventory/inventory-product-price/inventory-product-price.component';
import { InventoryStockAllocationDetailsComponent } from './inventory/inventory-stock-allocation-details/inventory-stock-allocation-details.component';
//import { CustomFormsModule } from 'ngx-custom-validators';
import { InventoryKitComponent } from './inventory/inventory-kit/inventory-kit.component';

import { InventoryDebtorPriceComponent } from './inventory/inventory-product-price/inventory-debtor-price/inventory-debtor-price.component';
import { InventoryDebtorPriceService } from './services/inventory-debtor-price.service';

import { VendorPriceSchemeComponent } from './vendor-price-scheme/vendor-price-scheme.component';
import { MakeComponent } from './inventory/make/make.component';
import { MakeModelComponent } from './inventory/make/make-model/make-model.component';
import { SeriesComponent } from './inventory/make/series/series.component';
import { EngineComponent } from './inventory/make/engine/engine.component';
import { InventoryTransferComponent } from './inventory-transfer/inventory-transfer.component';
import { InventoryTransferDetailComponent } from './inventory-transfer/inventory-transfer-detail/inventory-transfer-detail.component';
import { InventoryAutomativeComponent } from './inventory/inventory-automative/inventory-automative.component';
import { InventoryImageComponent } from './inventory/inventory-image/inventory-image.component';
import { InventoryStockTakeComponent } from './inventory-stock-take/inventory-stock-take.component';

import { InventoryStockTakeDetailComponent } from './inventory-stock-take/inventory-stock-take-detail/inventory-stock-take-detail.component';
import { InventoryAdjustmentComponent } from './inventory-adjustment/inventory-adjustment.component';
import { InventoryAdjustmentDetailComponent } from './inventory-adjustment/inventory-adjustment-detail/inventory-adjustment-detail.component';
import { SerialisedProductComponent } from './inventory-adjustment/inventory-adjustment-detail/serialised-product/serialised-product.component';
import { MatrixProductComponent } from './inventory-adjustment/inventory-adjustment-detail/matrix-product/matrix-product.component';
import { SerialisedProductOutComponent } from './inventory-adjustment/inventory-adjustment-detail/serialised-product-out/serialised-product-out.component';
import { InvReportsComponent } from './inv-reports/inv-reports.component';
import { SearchByPipe } from '../directives/search-by-pipe';
import { SerialisedProductTransferOutComponent } from './inventory-transfer/serialised-product-transfer-out/serialised-product-transfer-out.component';
// import { ViewReportComponent } from '../reports-base/view-report/view-report.component';
// import { ReportFormComponent } from '../reports-base/report-form/report-form.component';
import { StockTakeSerialisedProductComponent } from './inventory-stock-take/inventory-stock-take-detail/stock-take-serialised-product/stock-take-serialised-product.component';
import { SerialisedProductTransferInComponent } from './inventory-transfer/serialised-product-transfer-in/serialised-product-transfer-in.component';
import { MatrixProductTransferComponent } from './inventory-transfer/matrix-product-transfer/matrix-product-transfer.component';
import { StockTakeStyleMatrixrowComponent } from './inventory-stock-take/inventory-stock-take-detail/stock-take-style-matrix-row/stock-take-style-matrix-row.component';

import { AuthGuard } from '../auth.guard';
import { DebtorComponent } from './debtor/debtor.component';
import { VendorComponent } from '../pur/vendor/vendor.component';
import { InventoryPrescriptionComponent } from './inventory/inventory-prescription/inventory-prescription.component';
import { StockTakeOtherComponent } from './inventory-stock-take/inventory-stock-take-detail/stock-take-other/stock-take-other.component';
import { InventoryadtustmentOtherComponent } from './inventory-adjustment/inventory-adjustment-detail/inventoryadtustment-other/inventoryadtustment-other.component';
import { InventoryadtustmentOtherOutComponent } from './inventory-adjustment/inventory-adjustment-detail/inventoryadtustment-other-out/inventoryadtustment-other-out.component';
import { InventorytransferOtherOutComponent } from './inventory-transfer/inventorytransfer-other-out/inventorytransfer-other-out.component';
import { InventorytransferOtherInComponent } from './inventory-transfer/inventorytransfer-other-in/inventorytransfer-other-in.component';
import { MatrixProductInComponent } from './inventory-transfer/matrix-product-in/matrix-product-in.component';
import { MatrixProductOutComponent } from './inventory-transfer/matrix-product-out/matrix-product-out.component';
import { InventoryDataImportComponent } from './inventory-data-import/inventory-data-import.component';
import { AdjMatrixProductOutComponent } from './inventory-adjustment/inventory-adjustment-detail/adj-matrix-product-out/adj-matrix-product-out.component';
import { PurchasedOrderSchemeComponent } from './vendor-price-scheme/purchased-order-scheme/purchased-order-scheme.component';
import { FinaliseComponent } from './vendor-price-scheme/finalise/finalise.component';
import { UtilitesComponent } from './utilites/utilites.component';
import { HistoryComponent } from './history/history.component';
import { TransferComponent } from './transfer/transfer.component';
import { StockTakeComponent } from './stock-take/stock-take.component';
import { PriceChangeAuditComponent } from './inventory/PriceChangeAudit/price-change-audit/price-change-audit.component';
//import { SHAREModule } from '../shared/share.module';
//import { AgGridModule } from 'ag-grid-angular';
//import { AgGridComponent } from '../directives/ag-grid/ag-grid.component';
//Services 
const appRoute: Routes = [
  { path: 'inv/warehouse', component: WarehouseComponent, canActivate: [AuthGuard] },
  { path: 'inv/inventorypricelevel', component: InventoryPriceLevelComponent, canActivate: [AuthGuard] },
  { path: 'inv/product-style-matrix', component: ProductStyleMatrixComponent, canActivate: [AuthGuard] },
  //{ path: 'inv/product-style-matrix-detail', component: ProductStyleMatrixDetailComponent } ,
  { path: 'inv/ware-house-bin', component: WareHouseBinComponent, canActivate: [AuthGuard] },
  { path: 'inv/price-groups', component: PriceGroupsComponent, canActivate: [AuthGuard] },
  { path: 'inv/inventory', component: InventoryComponent, canActivate: [AuthGuard] },
  { path: 'inv/inventory-detail', component: InventoryDetailComponent, canActivate: [AuthGuard] },
  { path: 'inv/generic-table', component: InvGenericTableComponent, canActivate: [AuthGuard] },

  { path: 'inv/vendor-price-scheme', component: VendorPriceSchemeComponent, canActivate: [AuthGuard] },
  { path: 'inv/inventorytransfer', component: InventoryTransferComponent, canActivate: [AuthGuard] },
  { path: 'inv/inventorytransfer/:id', component: InventoryTransferComponent, canActivate: [AuthGuard] },
  { path: 'inv/make', component: MakeComponent, canActivate: [AuthGuard] },
  { path: 'inv/inventorystocktake', component: InventoryStockTakeComponent, canActivate: [AuthGuard] },
  { path: 'inv/inventorystocktake/:id', component: InventoryStockTakeComponent, canActivate: [AuthGuard] },
  { path: 'inv/inventory-adjustment', component: InventoryAdjustmentComponent, canActivate: [AuthGuard] },
  { path: 'inv/inventory-adjustment/:id', component: InventoryAdjustmentComponent, canActivate: [AuthGuard] },
  { path: 'inv/reports', component: InvReportsComponent, canActivate: [AuthGuard] },
  { path: 'inv/Debtor', component: DebtorComponent },
  { path: 'inv/vendor', component: VendorComponent, canActivate: [AuthGuard] },
  { path: 'inv/inventory-data-import', component: InventoryDataImportComponent, canActivate: [AuthGuard] },
  { path: 'inv/utilites', component: UtilitesComponent, canActivate: [AuthGuard] },
  { path: 'inv/PriceChangeAudit', component: PriceChangeAuditComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoute),
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    SHAREModule
    // AgGridModule.withComponents([])

  ],
  declarations: [
    WarehouseComponent,
    InventoryPriceLevelComponent,
    WarehouseNextNumberComponent,
    InventoryVendorsComponent,
    ProductStyleMatrixComponent,
    ProductStyleMatrixDetailComponent,
    WareHouseBinComponent,
    PriceGroupsComponent,
    InventoryComponent,
    InventoryDetailComponent,
    WarehouseNextNumberComponent,
    InventoryVendorsComponent,
    InventoryUnitOfMeasureConversionsComponent,
    InventoryBarcodeComponent,
    InvGenericTableComponent,
    InventoryProductPriceComponent,
    InventoryStockAllocationDetailsComponent,
    InventoryKitComponent,
    InventoryDebtorPriceComponent,
    VendorPriceSchemeComponent,
    MakeComponent,
    MakeModelComponent,
    SeriesComponent,
    EngineComponent,
    InventoryTransferComponent,
    InventoryTransferDetailComponent,
    InventoryAutomativeComponent,
    InventoryImageComponent,
    InventoryStockTakeComponent,
    InventoryStockTakeDetailComponent,
    InventoryAdjustmentComponent,
    InventoryAdjustmentDetailComponent,
    SerialisedProductComponent,
    MatrixProductComponent,
    SerialisedProductOutComponent,
    InvReportsComponent,
   // SearchByPipe,
    SerialisedProductTransferOutComponent,
    // ViewReportComponent,
    // ReportFormComponent,
    StockTakeSerialisedProductComponent,
    SerialisedProductTransferInComponent,
    MatrixProductTransferComponent,
    StockTakeStyleMatrixrowComponent,
    DebtorComponent,
    VendorComponent,
    InventoryPrescriptionComponent,
    StockTakeOtherComponent,
    InventoryadtustmentOtherComponent,
    InventoryadtustmentOtherOutComponent,
    InventorytransferOtherOutComponent,
    InventorytransferOtherInComponent,
    MatrixProductInComponent,
    MatrixProductOutComponent,
    InventoryDataImportComponent,
    AdjMatrixProductOutComponent,
    PurchasedOrderSchemeComponent,
    FinaliseComponent,
    UtilitesComponent,
    HistoryComponent,
    TransferComponent,
    StockTakeComponent,
    PriceChangeAuditComponent
  ],
  providers: [
    ProductStyleMatrixService
  ]
})
export class INVModule { } 
