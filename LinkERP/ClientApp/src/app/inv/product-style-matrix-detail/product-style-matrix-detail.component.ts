import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductStyleMatrixDetailService } from '../services/product-style-matrix-detail.service';
import { LbsInvProductstylematrixdetail } from 'src/app/models/inv/lbs-inv-productstylematrixdetail';
import { ToastrService } from 'ngx-toastr';
import { ProductStyleMatrixService } from '../services/product-style-matrix.service';
@Component({
  selector: 'app-product-style-matrix-detail',
  templateUrl: './product-style-matrix-detail.component.html',
  styleUrls: ['./product-style-matrix-detail.component.css']
})
export class ProductStyleMatrixDetailComponent implements OnInit {
  MatrixForm: FormGroup;
  Loading: any = false;
  Mode: any = 'List';
  submitted: boolean;

  Matrix: any[] = [];//Array variable of matrix data to bind grid
  //Ag-grid 
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  CompanyId = localStorage.getItem('CompanyID');
  StyleMatrixID = localStorage.getItem('StyleMatrixID');
  @Input() write_Access: boolean;
  @Input() delete_Access: boolean;
  @Input() IsActive: boolean;
  constructor(
    private matrixService: ProductStyleMatrixDetailService,
    private toastr: ToastrService,
    private MatrixFB: FormBuilder,
    private productStyleMatrixService: ProductStyleMatrixService
  ) { }

  ngOnInit() {
    //alert(this.write_Access);
    //alert(this.delete_Access);
    //alert(this.IsActive);
    this.AgLoad = false;
    this.Mode = "List";
    this.ColumnDefs = [
      { headerName: 'Code', field: 'styleMatrixDetailCode', sortable: true, filter: true, checkboxSelection: false, },
      { headerName: 'Namesdfgdsfgsdf', field: 'styleMatrixDetailName', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleted', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false },
      { headerName: '', field: 'Delete', cellRenderer: this.CustomDeleteIconFunc, type: 'Action', hide: false }
    ];
    //To create the warehouseform Form Controls.

    this.MatrixForm = this.MatrixFB.group({
      ID: [''],
      CompanyID: [''],
      StyleMatrixID: [''],
      StyleMatrixDetailCode: [''],
      StyleMatrixDetailName: ['']
    });
    this.Bindmatrix();
  }
  //Resetting the form after Add/Edit
  ResetForm() {
    this.MatrixForm.patchValue({
      ID: '',
      CompanyID: '',
      StyleMatrixID: '',
      StyleMatrixDetailCode: '',
      StyleMatrixDetailName: '',

    });
  }
  //Add new warehouse
  AddNew(): void {
    this.Mode = 'Add';
  }
  //To bind the data of warehouse to the controls to edit/update.
  Edit(ID): void {
    this.BindmatrixByID(ID);
    this.Mode = 'Edit';
  }
  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.Bindmatrix();
    this.Mode = "List";
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Edit(event.data.id)
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
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
  /* FOR Aggird End  */

  //To bind the data of all matrix to the Grid.


  BindmatrixdetailbyID() {

    this.Loading = true;
    this.AgLoad = false;
    this.StyleMatrixID = localStorage.getItem('StyleMatrixID');
    this.matrixService.getMatrixDetailByID(this.StyleMatrixID).subscribe((resp: any) => {
      console.log(resp);
      this.Matrix = resp.data.matrix;
      this.RowData = resp.data.matrix;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Bindmatrix() {
    this.Loading = true;
    this.AgLoad = false;
    this.matrixService.getMatrixDetail().subscribe((resp: any) => {
      console.log(resp);
      this.Matrix = resp.data.matrix;
      this.RowData = resp.data.matrix;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To save the matrix details to database table by calling the API service
  onSave() {

    this.submitted = true;
    if (this.MatrixForm.invalid) {
      return;
    }
    this.Loading = true;
    let matrix = new LbsInvProductstylematrixdetail();
    matrix.CompanyID = this.CompanyId;
    matrix.StyleMatrixID = this.StyleMatrixID;
    matrix.StyleMatrixDetailCode = this.MatrixForm.get('StyleMatrixDetailCode').value;
    matrix.StyleMatrixDetailName = this.MatrixForm.get('StyleMatrixDetailName').value;

    //If the mode Add will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.matrixService.addMatrixDetail(matrix).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('matrix details added successfully');
          this.ResetForm();
          this.Edit(resp.data.id)
          this.Bindmatrix();
          //this.Mode = 'List';
          this.Loading = false;
        }
        else {
          this.toastr.warning('matrix code already exists');
          this.Loading = false;
        }
      },
        (error) => {
          console.error('Problem with the sevice. Please try later : ' + error.message);
        });
    }
    else if (this.Mode == 'Edit') {
      matrix.ID = this.MatrixForm.get('ID').value;
      this.matrixService.updateMatrixDetail(matrix).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('matrix  details updated successfully');
          this.ResetForm();
          this.Bindmatrix();
          this.Mode = 'List';
        } else {
          this.toastr.warning('matrix code already exists');
          this.Loading = false;
        }
      }, (error) => {
        //console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  //Bind Warehouse by  ID
  BindmatrixByID(ID) {
    this.matrixService.getMatrixDetailByID(ID).subscribe((resp: any) => {
      console.log(resp);
      if (resp.isSuccess == true) {
        let matrixDetails: any = new LbsInvProductstylematrixdetail();
        matrixDetails = resp.data.matrixDetails;
        this.MatrixForm.patchValue({
          ID: matrixDetails.id,
          CompanyID: matrixDetails.companyID,
          StyleMatrixID: matrixDetails.styleMatrixID,
          StyleMatrixDetailCode: matrixDetails.styleMatrixDetailCode,
          StyleMatrixDetailName: matrixDetails.styleMatrixDetailName,


        });
      }
    });
  }

  //Delete the record
  onDeleteChecked(ID) {
    this.Loading = true;
    this.productStyleMatrixService.checkProductStyleMatrix(this.StyleMatrixID).subscribe((resp: any) => {
      if (resp.isSuccess && resp.data.exists != 1) {
        this.matrixService.deleteMatrixDetailByID(ID, localStorage.getItem('LoginID')).subscribe((resp: any) => {
          if (resp.isSuccess == true) {
            this.Bindmatrix();
          }
          this.Loading = false;
        }, (error) => {
          this.Loading = false;
        });
      }
      else {
        this.toastr.warning('This Product Style Matrix is in Use! Cant Delete!');
        this.Loading = false;
        return;
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });

  }

}



