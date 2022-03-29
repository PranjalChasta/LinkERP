import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MakeService } from '../../services/make.service';
import { LBSINVMake } from 'src/app/models/inv/lbs-inv-make';
import { ToastrService } from 'ngx-toastr';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-make',
  templateUrl: './make.component.html',
  styleUrls: ['./make.component.css']
})
export class MakeComponent implements OnInit {
  MakeForm: FormGroup;
  Mode: any = 'List';
  submitted: any = false;
  Loading: any = false;
  CompanyId = localStorage.getItem('CompanyID');
  VisibleForm: any = 'MakeDetails';
  MakeDetails: any[] = [];
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  AccessTab: string;
  SelectedMakeID: any;
  onModelReturn: any;
  selectedmodel: any;
  SelectedInventryID: any;
  MakeName: any;
  LineEditField: string;
  //permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  IsActive: boolean;
  PageSize: any;
  IsModelPrice: boolean;
  Currentpage: string;
  constructor(
    private syscommon: SysCommonService,
    private cryptoAes: CryptoAes,
    private FB: FormBuilder,
    private MakeService: MakeService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    console.log("testing")
    this.AgLoad = false;
    this.LineEditField = "MakeDescription"
    this.CreateForm();
    this.AccessTab = "Make";
    this.SetPermissions();
    this.AgGridColumns();
    this.BindMake();
    this.PageSize = "50";
    this.Currentpage = "0";
  }
  CreateForm() {
    this.MakeForm = this.FB.group({
      ID: [''],
      MakeDescription: ['', Validators.required]
    })
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Description', field: 'makeDescription', sortable: true, filter: true, checkboxSelection: false, },
      //  { headerName: 'UOMID TO', field: 'uomidTo', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Price', cellRenderer: this.CustomDetailIconFunc, type: 'Action', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }

    ];
  }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "209");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.MakeForm.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          this.MakeForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.MakeForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }


  }
  ResetForm() {
    this.MakeName = '';
    this.MakeForm.patchValue({
      ID: '',
      MakeDescription: ''
    });
  }

  get f() { return this.MakeForm.controls; }
  /* FOR Aggird end */
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  CustomDetailIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-align-justify"></i></div>';
    return cellContent
  }
  CustomPriceIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-usd"></i></div>';
    return cellContent
  }
  CustomSaveIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-save"></i></div>';
    return cellContent
  }

  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-align-justify" aria-hidden="true"></i></i></div>';
    return cellContent
  }
  //bindinventory
  BindMake() {
    debugger;
    this.Loading = true;
    this.Mode = 'List';
    this.AgLoad = false;
    this.MakeService.getMake().subscribe((resp: any) => {
      console.log(resp);
      this.MakeDetails = resp.data.makedetails;
      this.RowData = resp.data.makedetails;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Cancelnew() {
    this.BindMake();
    this.Mode = 'List'

  }
  //add operation
  AddNew() {
    this.ResetForm();
    this.Mode = 'Add';
    this.IsActive = true;
    this.MakeForm.enable();
   
  }

  Edit(ID): void {

    this.Mode = 'Edit';
    this.BindmakeById(ID);

  }
  BindmakeById(ID) {
    debugger;
    this.IsModelPrice = ID;
    this.MakeService.getMakeByID(ID).subscribe((resp: any) => {
      console.log(resp);
      if (resp.isSuccess == true) {
        let make: any = new LBSINVMake();
        make = resp.data.makedetailbyId;
        this.MakeForm.patchValue({
          ID: make.id,
          MakeDescription: make.makeDescription
        });
        if (!make.deleted) {
          this.MakeForm.enable();
          this.IsActive = true;
        } else {
          this.MakeForm.disable();
          this.IsActive = false;
        }
      }

    },
      (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
  }
  //cancel
  Cancel() {
    this.ResetForm();
    this.BindMake();
    this.Mode = 'List';
  }

  AgEdit(event) {
    debugger;
    this.MakeForm.patchValue({
      ID: event.id,
      MakeDescription: event.makeDescription
    });
    this.Mode = 'Edit';
  }
  OnActionClick(event: any) {
    debugger;
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.SelectedMakeID = event.data.id;
      this.Edit(event.data.id);


    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    } else if (colId == 'Price') {
      debugger;

      this.SelectedMakeID = event.data.id;
      this.MakeName = event.data.makeDescription;
      this.Mode = 'Price';
      if (!event.data.deleted) {
        this.IsActive = true;
      } else {
        this.IsActive = false;
      }

    }
  }
  OnCancel() {
    this.ResetForm();
    this.Mode = 'Add';
  }

  OnSaveall() {
    debugger;
    this.MakeService.AddUpdateMakeData(this.RowData).subscribe((resp: any) => {
      console.log(resp);
      if (!resp.isSuccess) {
        this.toastr.warning(resp.message);
        this.BindMake();
      } else {
        this.toastr.success('Make added successfully');
        this.BindMake();
        this.Mode = 'List';
      }

    }, (error) => {
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    debugger;
    this.submitted = true;
    if (this.MakeForm.invalid) {
      return;
    }
    let make = new LBSINVMake();
    make.CompanyID = this.CompanyId;
    make.MakeDescription = this.MakeForm.get('MakeDescription').value;
    make.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      debugger;
      this.MakeService.addMake(make).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Make Details added successfully')

          if (saveAction == 'Close') {
            this.Cancel();
            this.BindMake();
            this.Mode = 'List';
          }
          else {
            this.SelectedMakeID = resp.data.id;
            this.Edit(resp.data.id);
            this.BindMake();
            this.Mode = 'Edit';
          }
          this.Loading = false;
        }
        else {
          this.toastr.warning("Make description is already  exist");
          this.Loading = false;
        }

      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
      //this.Mode = 'List';
    }
    else if (this.Mode == 'Edit') {
      debugger;
      make.ID = this.MakeForm.get('ID').value;
      this.MakeService.updateMake(make).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Make Details updated successfully')
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindMake();
          }
          else {
            this.Edit(this.MakeForm.get('ID').value);
          }

        }
        else {
          this.toastr.warning("Make description is already  exist");
        }

      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    this.Loading = false;
  }
  AgSave(event) {
    debugger;
    let makedetail = new LBSINVMake();
    makedetail.ID = event.id;
    makedetail.CompanyID = this.CompanyId;
    makedetail.MakeDescription = event.makeDescription;
    this.MakeService.updateMake(makedetail).subscribe((resp: any) => {
      this.toastr.success('Make Details updated successfully')
      {
        //this.ResetForm();
        this.BindMake();
        this.Mode = 'List';
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });

  }

  onDeleteChecked(ID) {
    //this.Loading = true;
    this.MakeService.deleteMakeByID(ID, 'LBS_INV_Make', localStorage.getItem('LoginID')).subscribe((resp: any) => {

      if (resp.isSuccess == true) {
        this.BindMake();
      }
      //this.Loading = false;
    }, (error) => {
      //this.Loading = false;
    });
  }

  onModeChange(mode: any) {
    // alert(mode);
    this.Mode = mode;
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

