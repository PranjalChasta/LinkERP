import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { ToastrService } from 'ngx-toastr';
import { MakeService } from 'src/app/inv/services/make.service';
import { LBSINVSeries } from 'src/app/models/inv/lbs-inv-series';
import { SeriesService } from 'src/app/inv/services/series.service';
import { MakeModelService } from 'src/app/inv/services/make-model.service';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { YearService } from 'src/app/inv/services/year.service';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css']
})
export class SeriesComponent implements OnInit {
  @Input() ModelID: any;
  @Input() MakeID: any;
  @Input() SelectedModelID:any;
  @Input() ISParentActive:boolean;
  @Input() IsModelActive:boolean;
  submitted: any = false;
  Loading: any = false;
  CompanyId = localStorage.getItem('CompanyID');
  Mode: any = 'List';
  SeriesForm: FormGroup;
  AccessTab: string;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  MakeModelDetails: any[] = [];
  serieslist: any[] = [];
  makelist: any[] = [];
  modellist: any[] = [];
  ModelByseries: any[] = [];
  yearlist: any[]
  //permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  IsActive: boolean;
  SelectedMakeID: any;
  SelectedModelIDs: any;
  PageSize: any;
  Currentpage: string;
  constructor(
    private cryptoAes: CryptoAes,
    private yearservice: YearService,
    private modelservice: MakeModelService,
    private seriesservice: SeriesService,
    private syscommon: SysCommonService,
    private FB: FormBuilder,
    private MakeService: MakeService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
     console.log(this.SelectedModelID);
    console.log(this.MakeID);
   // localStorage.getItem('MakeID');
    console.log(localStorage);
    this.AgLoad = false;
    this.Createform();
    this.SetPermissions();
    this.AgGridColumns();
    this.BindMakeModelByMakeID();
    this.Bindmake();
    this.Bindmakemodel();
    this.BindYear();
    this.Currentpage = "0";
    this.PageSize = "50";
  }
  Createform() {
    this.SeriesForm = this.FB.group({
      ID: [''],
      CompanyID: ['-1'],
      MakeID: [''],
      ModelID: [''],
      Series: ['',Validators.required],
      Year: ['-1',CustomValidators.notEqual('-1')]
    })
  }
  AgGridColumns() {
    this.ColumnDefs = [
     // { headerName: 'Model', field: 'modelDescription', sortable: true, filter: true, checkboxSelection: false, width: 500 },
      { headerName: 'Series', field: 'series', sortable: true, filter: true, width: 430 },
      { headerName: 'Year', field: 'name', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false },
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
      this.SeriesForm.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          this.SeriesForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.SeriesForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }


  }
  get f() { return this.SeriesForm.controls; }
  /* FOR Aggird end */
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }

  CustomSaveIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-save"></i></div>';
    return cellContent
  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  BindYear() {
    this.yearservice.getYear().subscribe((resp: any) => {
      console.log(resp);
      this.yearlist = resp.data.yeardetails;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //
  Bindmake() {
    this.Loading = true;
    this.MakeService.getMake().subscribe((resp: any) => {
      this.makelist = resp.data.makedetails;
      console.log(this.makelist);
      this.Loading = false;

    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Bindmakemodel() {
    this.Loading = true;
    this.modelservice.getmakemodel().subscribe((resp: any) => {
      this.modellist = resp.data.makemodellist;
      console.log(this.modellist);
      this.Loading = false;

    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindMakeModelByMakeID() {
    debugger;
    this.Loading = true;
    this.Mode = 'List';
    this.AgLoad = false;
    this.syscommon.getSeriesByMakeIDDetails(this.MakeID,this.SelectedModelID).subscribe((resp: any) => {
      console.log(resp);
      this.MakeModelDetails = resp.data.makemodeldetails;
      this.RowData = resp.data.makemodeldetails;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //add operation
  AddNew() {
    this.Mode = 'Add';
    this.IsActive = true;
    this.ResetForm();
    this.SeriesForm.enable();
  }
  //cancel
  Cancel() {
    this.ResetForm();
    this.BindMakeModelByMakeID()
    this.Mode = 'List';
  }
  OnActionClick(event: any) {
    debugger;
    var colId = event.column.getId();
    if (colId == 'Edit') {
      // this.AgEdit(event.data);
      this.Edit(event.data.id);
      this.MakeID = event.data.makeID;
      this.SelectedModelID=event.data.modelID;
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
  }
  Edit(ID): void {
    debugger;
    this.Mode = 'Edit';
    this.BindSeriesbyId(ID);
  }
  //edit operation
  AgEdit(event) {
    debugger;
    console.log(event);

    this.SeriesForm.patchValue({
      ID: event.id,
      CompanyID: event.companyID,
      MakeID: event.makeDescription,
      ModelID: event.modelID,
      Series: event.series,
      Year: event.year
      ///Ratio: event.conversionRatio
    });
    if (!event.deleteStatus) {
      this.SeriesForm.enable();
      this.IsActive = true;
    } else {
      this.SeriesForm.disable();
      this.IsActive = false;
    }

    this.Mode = 'Edit';
  }
  BindSeriesbyId(ID) {
    debugger;
    this.SelectedMakeID = this.MakeID
    this.SelectedModelIDs=this.SelectedModelID
    this.seriesservice.getSeriesByID(ID).subscribe((resp: any) => {
      let lBSINVSeries: any = new LBSINVSeries();
      lBSINVSeries = resp.data.makemodeldetailbyId;
      console.log(lBSINVSeries);
      this.SeriesForm.patchValue({
        ID: lBSINVSeries.id,
        CompanyID: lBSINVSeries.companyID,
        MakeID: lBSINVSeries.makeDescription,
        ModelID: lBSINVSeries.modelID,
        Series: lBSINVSeries.series,
        Year: lBSINVSeries.year,
      });
      if (!lBSINVSeries.deleted) {
        this.SeriesForm.enable();
        this.IsActive = true;
      } else {
        this.SeriesForm.disable();
        this.IsActive = false;
      }
    },
      (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error);
      });
  }
  OnCancel() {
    this.Cancel();
    this.BindMakeModelByMakeID()
    this.Mode = 'Add';
  }
  onSaveold(saveAction) {
    debugger;
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    debugger;
    this.submitted = true;
    if (this.SeriesForm.invalid) {
      return;
    }
    let series = new LBSINVSeries();
    series.CompanyID = this.CompanyId;
    series.MakeID = this.MakeID;
    series.ModelID = this.SelectedModelID;;
    series.Series = this.SeriesForm.get('Series').value;
    series.CreatedBY = localStorage.getItem('LoginID');
    series.Year = this.SeriesForm.get('Year').value;
    if (this.Mode == 'Add') {
      debugger;
      this.seriesservice.addSeries(series).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Series Details added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindMakeModelByMakeID();
            this.Mode = 'List';
          } else {
            this.SelectedMakeID = resp.data.makeID;
           // this.SelectedModelID=resp.data.modelID;
            this.Edit(resp.data.id);
            this.BindMakeModelByMakeID();
            this.Mode = 'Edit';
          }
          this.Loading = false;
        } else {
         this.toastr.warning('series name is already exist');
         this.Loading=false;
        }

      }, (error) => {
     //   console.error('Problem with the sevice. Please try later : ' + error);
      });
      //this.Mode = 'List';
    }
    else if (this.Mode == 'Edit') {
      debugger;
      series.ID = this.SeriesForm.get('ID').value;
      this.seriesservice.updateseries(series).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Series Details updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindMakeModelByMakeID();
          }
          else {
            this.Edit(this.SeriesForm.get('ID').value);
          }
         
        }
        else {
          this.toastr.warning('series name is already exist');
          this.Loading=false;
        }
      }, (error) => {
       // console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    this.Loading = false;
  }
  AgSave(event) {
    debugger;
    let seriesdetails = new LBSINVSeries();
    seriesdetails.ID = event.id;
    seriesdetails.CompanyID = this.CompanyId;
    seriesdetails.MakeID = event.makeID;
    seriesdetails.ModelID = event.modelID;
    seriesdetails.Year = event.year;
    seriesdetails.Series = event.series;
    this.seriesservice.updateseries(seriesdetails).subscribe((resp: any) => {
      this.toastr.success('Make-model Details updated successfully')
      {
        //this.ResetForm();
        this.BindMakeModelByMakeID();
        this.Mode = 'List';
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });

  }


  ResetForm() {
    this.SeriesForm.patchValue({
      ID: '',
      CompanyID: '-1',
      MakeID: this.MakeID,
      ModelID: this.SelectedModelID,
      Year: '-1',
      Series: ''

    });
    this.SeriesForm.markAsUntouched();
    this.SeriesForm.markAsPristine();
    this.submitted=false;

  }

  onDeleteChecked(ID) {
    //this.Loading = true;
    this.MakeService.deleteMakeByID(ID, 'LBS_INV_Series', localStorage.getItem('LoginID')).subscribe((resp: any) => {

      if (resp.isSuccess == true) {
        this.BindMakeModelByMakeID();
      }
      //this.Loading = false;
    }, (error) => {
      //this.Loading = false;
    });
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
