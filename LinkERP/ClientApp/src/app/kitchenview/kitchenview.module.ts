import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { SHAREModule } from '../shared/share.module';
import { CustomFormsModule } from 'ngx-custom-validators';
import { TableManagementComponent } from '../kitchenview/table-management/table-management.component';
import { ReservationManagementComponent } from '../kitchenview/reservation-management/reservation-management.component';
import { AuthGuard } from '../auth.guard';
import { BsDatepickerModule, ModalModule, TimepickerModule } from 'ngx-bootstrap';
import { KitchenProcessingViewComponent } from './kitchen-processing-view/kitchen-processing-view.component';

const appRoute: Routes = [
  { path: 'kitchen/tableview', component: TableManagementComponent, canActivate: [AuthGuard] },
  { path: 'kitchen/reservationview', component: ReservationManagementComponent, canActivate: [AuthGuard] },
  { path: 'kitchen/kitchenProcessing', component: KitchenProcessingViewComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [
    TableManagementComponent,
    ReservationManagementComponent,
    KitchenProcessingViewComponent
  ],
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
  ]
})
export class KitchenviewModule { }
