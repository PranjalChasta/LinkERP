import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TerminalsService } from '../../services/terminals.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CustomValidators } from 'ngx-custom-validators';

@Component({
  selector: 'app-terminal-group-items',
  templateUrl: './terminal-group-items.component.html',
  styleUrls: ['./terminal-group-items.component.css']
})
export class TerminalGroupItemsComponent implements OnInit {
  TerminalGroupItemForm: FormGroup;
  @Input() TerminalGroupID: any;
  @Input() WareHouseID: any;

  @Output() onModeChange = new EventEmitter();
  @Output() onBackBtnClicked = new EventEmitter();

  @Input() IsActive: boolean;
  Mode: any = 'List';
  submitted: boolean;
  Loading: any = false;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  CompanyId = localStorage.getItem('CompanyID');
  productList;
  Currentpage: string;
  TerminalGroupItem: any;
  SelectedTerminalGroupID: any;

  constructor(
    private toastrService: ToastrService,
    private FB: FormBuilder,
    private terminalsServcie: TerminalsService,
    private deleteRecordsService: DeleteRecordsService,
  ) { }

  ngOnInit() {
    this.submitted = false;
    this.AgLoad = false;
    this.Currentpage = "0";
    this.Mode = "List";
    this.CreateForm();
    this.AgGridColumns();

    this.BindTerminalGroupItems();
    this.GetProducts();
  }
  get f() { return this.TerminalGroupItemForm.controls; }

  CreateForm() {
    this.TerminalGroupItemForm = this.FB.group({
      ID: [''],
      Product: ['-1', CustomValidators.notEqual('-1')]
    });
  }
  //To Reset the Form after Add/Edit
  ResetForm() {
    this.TerminalGroupItemForm.patchValue({
      ID: '',
      Product: '-1'
    });
    this.TerminalGroupItemForm.markAsUntouched();
    this.TerminalGroupItemForm.markAsPristine();
    this.submitted = false;
  }
  //To Cancel the Page
  Cancel(): void {
    this.ResetForm();
    this.BindTerminalGroupItems();
    this.Mode = "List";
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Product Name', field: 'productName', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus', width: 80, },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    ];
  }
  GetProducts() {
    this.terminalsServcie.getProductList(this.WareHouseID, localStorage.getItem('CompanyID')).subscribe((resp: any) => {
      this.productList = resp.data.productsForTerminalGroupItems;
      console.log(this.productList);

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindTerminalGroupItems() {
    this.AgLoad = false;
    this.terminalsServcie.getTerminalGroupItemsByTerminalGroupID(this.TerminalGroupID).subscribe((resp: any) => {
      this.TerminalGroupItem = resp.data.terminalGroupItem;
      this.RowData = resp.data.terminalGroupItem;
      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  //Add New  Terminal Group
  AddNew(): void {
    this.Mode = 'Add';
  }
  Back() {
    this.OnModeChanged();
  }
  OnModeChanged() {
    this.onModeChange.emit('List');
    this.onBackBtnClicked.emit();
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.SelectedTerminalGroupID = event.data.id;
      this.AgEdit(event.data);
      this.Mode = 'Edit';

    } else if (colId == 'Delete') {
      this.onDelete(event.data.id)

    } else if (colId == 'Save') {
      this.AgSave(event.data)
    }
  }
  OnSubmit(saveAction) {
    this.submitted = true;
    if (this.TerminalGroupItemForm.invalid) {
      return;
    }
    let terminalGrpItem = {
      'ID': '',
      'ProductID': this.TerminalGroupItemForm.get('Product').value,
      'GroupID': this.TerminalGroupID,
      'CreatedBy': localStorage.getItem('LoginID'),
      'CompanyID': localStorage.getItem('CompanyID')
    }
    debugger
    //If the mode is Add then it will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.terminalsServcie.addTerminalGroupItem(terminalGrpItem).subscribe((resp: any) => {
        this.submitted = false;
        if (resp.isSuccess == true) {
          this.toastrService.success('Terminal Group item added successfully')
          //  this.Loading = false;
          if (saveAction == 'SaveNClose') {
            this.Cancel();
            //this.ResetForm();
            //this.BindTerminalGroupItems();
            this.Mode = 'List';
          }
          else {
            this.AgEdit(this.TerminalGroupItemForm.get('ID').value);
          }
        }
        else if (!resp.isSuccess) {
          this.toastrService.warning(resp.message)
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    else if (this.Mode == 'Edit') {
      terminalGrpItem.ID = this.TerminalGroupItemForm.get('ID').value;
      this.terminalsServcie.updateTerminalGroupItem(terminalGrpItem).subscribe((resp: any) => {
        this.submitted = false;
        if (resp.isSuccess) {
          this.toastrService.success('Terminal Group item updated successfully')
          this.Loading = false;
          if (saveAction == 'SaveNClose') {
            this.Cancel();
            //this.ResetForm();
            //this.BindTerminalGroupItems();
            this.Mode = 'List';
          }
          else {
            this.AgEdit(this.TerminalGroupItemForm.get('ID').value);
          }
        }
        else if (!resp.isSuccess) {
          this.toastrService.warning(resp.message)
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  AgEdit(event) {
    this.TerminalGroupItemForm.patchValue({
      ID: event.id,
      Product: event.productID
    });
    this.Mode = 'Edit';
  }
  AgSave(event) {
    let terminalGrpItem = {
      'ID': '',
      'ProductID': this.TerminalGroupItemForm.get('Product').value,
      'GroupID': this.TerminalGroupID
    }
    this.terminalsServcie.updateTerminalGroupItem(terminalGrpItem).subscribe((resp: any) => {
      this.toastrService.success('Terminal Group item updated successfully')
      {
        this.ResetForm();
        this.BindTerminalGroupItems();
        this.Mode = 'List';
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To delete a particular Workflow Approvers details
  onDelete(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SOP_TerminalGroupItems', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindTerminalGroupItems();
      this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onProductChange(ID, index: number) {
    //alert(ID + ':' + i);
    for (let i = 0; i < this.RowData.length; i++) {
      if (i != index) {
        if (this.RowData[i].productID == ID) {
          this.toastrService.warning('The selected product already existed in the list.');
          this.RowData[index].productID = '-1';
          return;
        }
      }
    }
  }
}
