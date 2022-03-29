import { Component, OnInit, Input, Output, EventEmitter, IterableDiffers, SimpleChanges, ViewChild } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.css']
})
export class AgGridComponent implements OnInit {
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
  @Input() ColumnDefs: any;
  @Input() RowData: any;
  @Input() IsSearch: boolean;
  @Input() IsExport: boolean;
  @Input() IsEditable: boolean = false;
  @Input() paginationPageSize: any;
  @Input() IsColumnsToFit: boolean;
  @Input() IsInlineEdit: boolean;
  @Input() LineEditField: string;
  @Input() Currentpage: string;
  @Input() RowIndex: any;
  companylist: any;
  check;
  AgLoad: boolean;
  gridApi: any;
  gridColumnApi: any;
  SearchValue: any;
  columnTypes: any;
  defaultColDef: any;
  tempparms: any;
  posts: any; differ;
  private editType;
  AGDataForm: FormGroup;
  @Output() OnActionClick = new EventEmitter<any>();
  @Output() OnActionClick2 = new EventEmitter<any>();
  @Output() OnEditStoped = new EventEmitter<any>();
  @Output() OnchangeCurrentpage = new EventEmitter();
  @Output() OnPageSizeChange = new EventEmitter<any>();

  private paginationNumberFormatter;
  private getRowNodeId;
  constructor(differs: IterableDiffers, private toastr: ToastrService, private TableAGFB: FormBuilder,) {
    console.log('data');
    this.differ = differs.find([]).create(null);

  }

  ngOnInit() {
    this.check = "0";
    this.AgLoad = true;
    this.editType = "";
    this.AGDataForm = this.TableAGFB.group({
      PageSize: [this.paginationPageSize]
    });

    if (this.IsColumnsToFit == null) {
      this.IsColumnsToFit = true;
    }
    this.defaultColDef = {
      //cellStyle: { 'text-align': "right" },
      // cellClass: "pm-grid-number-cell",
      resizable: true, editable: this.IsEditable,
    };

    /* this.getRowNodeId = function(data) {
      console.log(data);  
      return data.id;
    }; */
    this.columnTypes = {
      Action: {
        headerName: "Action",
        width: 30,
        sortable: false
        , hide: true, pinned: "right", editable: false
      },
      Numeric: {
        filter: 'number',
        maxLength: 100,
        cellvaluechanging: function (row, datafield, columntype, oldvalue, newvalue) {
          if (newvalue.length > 8) {
            return oldvalue;
          };
        }
      },
      DeleteStatus: {
        //cellRenderer: this.cellRendererSelector,
        filter: true,
        editable: false
      },
      DeleteAction: {
        width: 30,
        sortable: false
        , hide: true, pinned: "right", editable: false,
        cellRenderer: this.CustomDeleteIconFunc
      },
      DeleteActionGRN: {
        width: 30,
        sortable: false
        , hide: true, pinned: "right", editable: false,
        cellRenderer: this.CustomDeleteIconFuncGRN
      },
      DeleteActionAdj: {
        width: 30,
        sortable: false,
        pinned: "right", editable: false,
        cellRenderer: this.CustomDeleteIconFuncAdj
      },
      DeleteActionStockTake: {
        width: 30,
        sortable: false,
        pinned: "right", editable: false,
        cellRenderer: this.CustomDeleteIconFuncstock
      },
      DeleteActionTransfer: {
        width: 30,
        sortable: false,
        pinned: "right", editable: false,
        cellRenderer: this.CustomDeleteIconFunTransfer
      },
      EditAction: {
        width: 30,
        sortable: false
        , hide: true, pinned: "right", editable: false,
        cellRenderer: this.CustomEditIconFunc
      },
      EditActionAdj: {
        width: 30,
        sortable: false
        , hide: true, pinned: "right", editable: false,
        cellRenderer: this.CustomEditFunAdj
      }
    }
    /*  this.paginationNumberFormatter = function(params) {
       return '[' + params.value.toLocaleString() + ']';
     }; */
    this.rowClassRules = {
      'sick-days-warning': function (params) {
        var numSickDays = params.data.id;
        return numSickDays = '0b516597-a43e-484d-99d1-1db866d354b8';
      },
      'sick-days-breach': 'data.sickDays >= 8',
    };
  }
  rowClassRules;
  CustomEditIconFunc(params): string {

    let cellContent: string = '<div style="cursor: pointer;"><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      // only run when property "data" changed
      if (propName === 'posts') {
        //  this line will update posts values 
        this.posts = changes[propName].currentValue

        console.log(this.posts)
      }
    }
  }

  ngDoCheck() {
    const change = this.differ.diff(this.RowData);
    if (change) {
      if (this.check == "1") { //this.editType="fullRow";
        //  this.gridApi.refreshClientSideRowModel("filter");
        if (this.IsInlineEdit) {

          this.AgLoad = false;
          this.RowData = this.RowData;
          this.AgLoad = true;
          this.gridApi.setRowData(this.RowData);
          this.gridApi.batchUpdateRowData();
          var len = this.RowData.length - 1;
          this.gridApi.setFocusedCell(len, 0);
          this.gridApi.startEditingCell({
            rowIndex: 0,
            colKey: this.LineEditField
          });
          /* var len=this.RowData.length-1;
          this.gridApi.setFocusedCell(len,0);
       this.gridApi.startEditingCell({
         rowIndex: len,
         colKey: "taxLabel"
       });  */
        }
      }
      // this.CheckRowDataitems()
    }
    this.check = "1";
  }

  CheckRowDataitems() {
    if (this.RowData) {

      const ArrayType = [];
      const self = this;

      this.RowData = ArrayType;
    }
  }
  cellRendererSelector(params) {
    if (params.data.deleted)
      return 'InActive';
    else if (!params.data.deleted)
      return 'Active';
    else
      return null;

  }
  exportToExcel() {
    const params = {
      skipHeader: false,
      skipFooters: true,
      skipGroups: true,
      fileName: 'export.csv'
    };
    this.gridApi.exportDataAsCsv(params);

  }
  quickSearch() {
    this.gridApi.setQuickFilter(this.SearchValue);
  }

  BindData(params) {
    if (!this.Currentpage) {
      this.Currentpage = "0";
    }
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData(this.RowData);
    if (this.IsColumnsToFit) {
      this.gridApi.sizeColumnsToFit();
    }
    // params.api.forEachNode(node => node.rowIndex ? 2 : node.setSelected(true));
    this.gridApi.paginationSetPageSize(Number(this.paginationPageSize));
    this.AGDataForm.patchValue({
      PageSize: this.paginationPageSize
    });
    params.api.paginationGoToPage(this.Currentpage);
    // this.gridApi.api.paginationGoToPage(2);
    if (this.RowIndex) {
      params.api.selectIndex(this.RowIndex, false, false);
    }

    //this.gridApi.api.setFocusedCell(1, ['deleteStatus'])
    /* this.gridApi.api.getEditingCells();
    this.defaultColDef.forEach(function(cellDef) {
    console.log(cellDef.rowIndex);
    console.log(cellDef.column.getId());
    console.log(cellDef.floating);
}); */

  }
  randomInt() {
    return Math.floor(Math.random() * 10);
  }
  onCellClicked(params) {
    /*   if (params.data.type === 'age') return {
        component: 'numericColumn'
    }; */
    debugger;
    let t = this.gridApi.getDisplayedRowCount();
    let tt = this.gridApi.getSelectedRows();
    this.OnchangeCurrentpage.emit(this.gridApi.paginationGetCurrentPage())
    if (params.colDef.type == 'Action') {
      this.OnActionClick.emit(params);
    }
    if (params.colDef.type == 'ok') {
      this.OnActionClick.emit(params);
    }
    else if (params.colDef.type == 'EditAction') {
      console.log(this.gridApi.paginationGetCurrentPage() + 1);
      this.OnActionClick.emit(params);
    }
    else if (params.colDef.type == 'DeleteActionStockTake') {
      this.tempparms = params;
      if (params.data.stockTakeStatus != 'Approved') {
        this.Deleteactions(params)
      }
    }
    else if (params.colDef.type == 'DeleteActionTransfer') {
      this.tempparms = params;
      if (params.data.status != 'Completed') {
        this.Deleteactions(params)
      }
    }
    else if (params.colDef.type == 'DeleteActionAdj') {
      this.tempparms = params;
      if (params.data.status != 'Closed') {
        /*   if (this.IsEditable) {
            if (params.data.id) {
              if (params.data.deleteStatus == 'Active') {
                this.confirmation.ConfirmationPopup('Are you sure you want to mark the selected record as Inactive?');
              } else {
                this.confirmation.ConfirmationPopup('Are you sure you want to mark the selected record as Active?');
              }
            } else {
              this.RowData.splice(params.rowIndex, 1);
            }
          }
          else {
            if (params.data.deleteStatus == 'Active') {
              this.confirmation.ConfirmationPopup('Are you sure you want to mark the selected record as Inactive?');
            } else {
              this.confirmation.ConfirmationPopup('Are you sure you want to mark the selected record as Active?');
            }
          } */
        this.Deleteactions(params)
      }
    }

    else if (params.colDef.type == 'DeleteAction') {
      this.tempparms = params;
      this.Deleteactions(params)
      /*   if (this.IsEditable) {
          if (params.data.id) {
            if (params.data.deleteStatus == 'Active') {
              this.confirmation.ConfirmationPopup('Are you sure you want to mark the selected record as Inactive?');
            } else {
              this.confirmation.ConfirmationPopup('Are you sure you want to mark the selected record as Active?');
            }
          } else {
            this.RowData.splice(params.rowIndex, 1);
          }
        }
        else {
          if (params.data.deleteStatus == 'Active') {
            this.confirmation.ConfirmationPopup('Are you sure you want to mark the selected record as Inactive?');
          } else {
            this.confirmation.ConfirmationPopup('Are you sure you want to mark the selected record as Active?');
          }
        }  */
    }
    else if (params.colDef.type == 'DeleteActionGRN') {
      this.tempparms = params;
      this.Deleteactions(params)
    }
    /*  var colId = params.column.getId();
     if(colId=='edit'){
       this.OnEditClick.emit(params.data); 
     }else  if(colId=='delete'){
       this.OnDeleteClick.emit(params.data); 
     }  */
  }

  Deleteactions(params) {
    if (this.IsEditable) {
      if (params.data.id) {
        if (params.data.deleteStatus == 'Active') {
          this.confirmation.ConfirmationPopup('Are you sure you want to mark the selected record as Inactive?');
        } else {
          this.confirmation.ConfirmationPopup('Are you sure you want to mark the selected record as Active?');
        }
      } else {
        this.RowData.splice(params.rowIndex, 1);
      }
    }
    else {
      if (params.data.deleteStatus == 'Active') {
        this.confirmation.ConfirmationPopup('Are you sure you want to mark the selected record as Inactive?');
      } else {
        this.confirmation.ConfirmationPopup('Are you sure you want to mark the selected record as Active?');
      }
    }
  }
  onSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();

    var selectedRowsString = "";
    selectedRows.forEach(function (selectedRow, index) {
      if (index !== 0) {
        selectedRowsString += ", ";
      }
      selectedRowsString += selectedRow.athlete;
    });
    document.querySelector("#selectedRows").innerHTML = selectedRowsString;
  }

  onCellValueChanged() {
    debugger;
  }
  OncellValueChanged(event) {
    debugger;
    console.log(event)
  }
  rowValueChanged(event) {
    debugger
    console.log(event)

  }
  ISeditingStart: boolean;
  onCellEditingStarted(event) {
    console.log('cellEditingStarted');
    this.OnEditStoped.emit(event);
    console.log(this.RowData)
    console.log(event)
    this.ISeditingStart = true;
    //this.gridApi.setFocusedCell(0, 'value');
  }
  onnewCellValueChanged($event) {
    if (this.ISeditingStart) {
      console.log($event);
      this.gridApi.stopEditing();
    }
  }
  onCellEditingStopped(event) {
    console.log('cellEditingStopped');
    this.OnEditStoped.emit(event);
    this.ISeditingStart = false;
  }
  OnAccept() {
    console.log('OnAccept');
    this.OnActionClick.emit(this.tempparms);
  }
  OnCancel() {
    console.log('OnCancel');
  }
  CustomDeleteIconFunc(params): string {
    if (params.data.deleteStatus == 'Active') {
      let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
      return cellContent
    } else {
      let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-undo"></i></div>';
      return cellContent
    }
  }
  CustomDeleteIconFuncAdj(params): string {
    if (params.data.status == 'Closed') {
      let cellContent: string = '';
      return null
    } else
      if (params.data.deleteStatus == 'Active') {
        let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
        return cellContent
      } else {
        let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-undo"></i></div>';
        return cellContent
      }
  }
  CustomDeleteIconFuncstock(params): string {
    if (params.data.stockTakeStatus == 'Approved') {
      let cellContent: string = '';
      return null
    } else
      if (params.data.deleteStatus == 'Active') {
        let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
        return cellContent
      } else {
        let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-undo"></i></div>';
        return cellContent
      }
  }
  CustomDeleteIconFunTransfer(params): string {
    if (params.data.status == 'Completed' || params.data.status == 'Shipped' || params.data.status == 'PartiallyReceived') {
      let cellContent: string = '';
      return null
    } else
      if (params.data.deleteStatus == 'Active') {
        let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
        return cellContent
      } else {
        let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-undo"></i></div>';
        return cellContent
      }
  }

  CustomEditFunAdj(params): string {
    debugger;
    let isEditAdj = params.data.deletedBy.split(',');
    isEditAdj = isEditAdj[1];
    if (isEditAdj) {
      let cellContent: string = '';
      return null
    }
    let cellContent: string = '<div style="cursor: pointer;"><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }

  onPageSizeChanged(event: any) {
    /*  //var value = document.getElementById('page-size').value; */
    this.gridApi.paginationSetPageSize(Number(event.target.value));
    this.AGDataForm.patchValue({
      PageSize: event.target.value
    });
    this.OnPageSizeChange.emit(event);
  }

  CustomDeleteIconFuncGRN(params): string {
    if (params.data.statusName == 'Closed') {
      let cellContent: string = '';
      return null
    } else
      if (params.data.deleteStatus == 'Active') {
        let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
        return cellContent
      } else {
        let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-undo"></i></div>';
        return cellContent
      }
  }

}
