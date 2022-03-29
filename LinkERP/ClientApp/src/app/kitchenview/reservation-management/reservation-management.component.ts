import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { KitchenviewService } from '../kitchenview.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { CustomValidators } from 'ngx-custom-validators';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { KitchenReservation } from 'src/app/models/kitchenview/kitchen-reservation';

@Component({
  selector: 'app-reservation-management',
  templateUrl: './reservation-management.component.html',
  styleUrls: ['./reservation-management.component.css']
})
export class ReservationManagementComponent implements OnInit {
  @Input() TableID: any;
  AccessTab: any;
  ReservationForm: FormGroup;
  Loading: any = false;
  Mode: any = 'List';
  submitted: boolean;
  //WareHouseID: any;
  reservations: any[] = [];//Array variable of warehouse data to bind grid
  addreadonly: boolean;
  //Ag-grid 
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  CompanyId = localStorage.getItem('CompanyID');
  HeaderNames: any;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  IsActive: boolean;
  PageSize: any;
  Currentpage: string;
  SelectedReservationID: any;
  constructor(
    private kitchenviewService: KitchenviewService,
    private ReservationsFB: FormBuilder,
    private toastr: ToastrService,
    private deleteRecordsService: DeleteRecordsService,
    private cryptoAes: CryptoAes
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Mode = "List";
    this.submitted = false;
    this.HeaderNames = "Reservation";
    this.AccessTab = "Reservation";
    this.PageSize = "50";
    this.Currentpage = "0";
    this.BindReservationByTable();

    //To create the reservationform Form Controls
    this.ReservationForm = this.ReservationsFB.group({
      ID: [''],
      CompanyID: [''],
      GuestName: ['', Validators.required],
      ReservationTimeFrom: [''],
      ReservationTimeTo: ['']
    });
    this.SetPermissions();
    this.ColumnDefs = [
      { headerName: 'Guest Name', field: 'guestName', sortable: true, filter: true },
      { headerName: 'Reservation Time From', field: 'reservationTimeFrom', sortable: true, filter: true },
      { headerName: 'Reservation Time To', field: 'reservationTimeTo', sortable: true, filter: true },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
  get f() { return this.ReservationForm.controls; }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "202");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.ReservationForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.ReservationForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.ReservationForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  //Add new Reservation
  AddNew(): void {
    this.Mode = 'Add';
    this.IsActive = true;
    this.ReservationForm.enable();
  }
  //To bind the data of reservations to the controls to edit/update.
  Edit(ID): void {
    debugger;
    this.Mode = 'Edit';
    this.SelectedReservationID = ID;
    this.BindReservationByID(ID);

  }
  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.BindReservationByTable();
    this.Mode = "List";
  }
  /* FOR Aggrid Start */
  OnActionClick(event: any) {
    debugger;
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Edit(event.data.id);
      this.SelectedReservationID = event.data.id;
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id);
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
  /* FOR Aggrid End  */

  //Resetting the form after Add/Edit
  ResetForm() {
    this.ReservationForm.patchValue({
      ID: '',
      GuestName: '',
      ReservationTimeFrom: '',
      ReservationTimeTo: ''
    });
    this.ReservationForm.markAsTouched();
    this.ReservationForm.markAsPristine();
    this.submitted = false;
  }


  //To bind the data of all Reservations to the Grid.
  BindReservationByTable() {
    debugger;
    this.Loading = true;
    this.AgLoad = false;
    this.kitchenviewService.getReservationsByTableID(this.TableID).subscribe((resp: any) => {
      this.reservations = resp.data.reservations;
      this.RowData = resp.data.reservations;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {

      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  OnCancel() {
    this.ResetForm();
    this.Mode = 'Add';
  }
  onSaveold(saveAction) {
    debugger;
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  //To save the Table Reservation details to database table by calling the API service
  onSave(saveAction) {
    debugger;
    this.submitted = true;
    if (this.ReservationForm.invalid) {
      return;
    }
    this.Loading = true;
    let tableReservation = new KitchenReservation();
    tableReservation.CompanyID = this.CompanyId;
    tableReservation.TableID = this.TableID;
    tableReservation.GuestName = this.ReservationForm.get('GuestName').value;
    tableReservation.ReservationTimeFrom = this.ReservationForm.get('ReservationTimeFrom').value;
    tableReservation.ReservationTimeTo = this.ReservationForm.get('ReservationTimeTo').value;
    tableReservation.CreatedBY = localStorage.getItem('LoginID');

    //If the mode is Add then it will insert data to DB Reservation else update the row by ID
    if (this.Mode == 'Add') {
      this.kitchenviewService.addReservation(tableReservation).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          console.log(resp)
          this.toastr.success('Reservation is added Successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindReservationByTable();
            this.Mode = 'List';
          }
          else {
            //this.Edit(resp.data.id);
            this.BindReservationByTable();
            this.Mode = 'Edit';
          }
          this.Loading = false;
        }
      });
    }

    else if (this.Mode == 'Edit') {
      //tableReservation.ID = this.ReservationForm.get('ID').value;
      tableReservation.ID = this.SelectedReservationID;
      this.kitchenviewService.updateReservation(tableReservation).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Reservation details Updated Successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindReservationByTable();
          }
          else {
            //this.Edit(this.SelectedReservationID);
          }
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    this.Loading = false;
  }
  //Bind Reservation by ID
  BindReservationByID(ID) {
    this.kitchenviewService.getReservationByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        let tableReservation: any = new KitchenReservation();
        tableReservation = resp.data.reservation;
        this.ReservationForm.patchValue({
          ID: tableReservation.id,
          CompanyID: tableReservation.companyID,
          GuestName: tableReservation.guestName,
          ReservationTimeFrom: tableReservation.reservationTimeFrom,
          ReservationTimeTo: tableReservation.reservationTimeTo
        })
        if (!tableReservation.deleted) {
          debugger;
          this.ReservationForm.enable();
          this.IsActive = true;
        } else {
          this.ReservationForm.disable();
          this.IsActive = false;
        }
      }
    },
      (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
  }



  //Delete the record
  onDeleteChecked(ID) {
    debugger;
    this.Loading = true;
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SOP_TableManagementReservation', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.Mode = 'List';
      this.BindReservationByTable();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
}

