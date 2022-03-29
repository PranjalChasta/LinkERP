import { Component, Input, Output, EventEmitter, OnInit, forwardRef,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import { debug } from 'console';
import { PriceWorkflowService } from '../services/price-workflow.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

const intersectionwith = require('lodash.intersectionwith');
const differenceWith = require('lodash.differencewith');

@Component({
  selector: 'app-price-workflow',
  templateUrl: './price-workflow.component.html',
  styleUrls: ['./price-workflow.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PriceWorkflowComponent),
    multi: true
  }]
})
export class PriceWorkflowComponent implements OnInit, ControlValueAccessor {
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;

  Mode: any = 'Grid';
  Loading: any = false;
  CompanyID = localStorage.getItem('CompanyID');
  CreatedBY = localStorage.getItem('LoginID');
  DeleteID:any;
  searchValue: any = "";
  priceWorkflow = {
    id: "00000000-0000-0000-0000-000000000000", companyID: this.CompanyID, priceWorkflowDescription: "",
    useCheapestPrice: 0, default: 0, createdBY: this.CreatedBY, deleted: 0
  }
  moveAllButton: boolean = true;
  availableText = 'Available';
  selectedText = 'Used';

  ColumnDefs;
  RowData: any;
  PageSize: any;
  Currentpage: string;
  AgLoad: boolean = false;
  priceWorkflowId: any = "00000000-0000-0000-0000-000000000000";


  // @Input() set availableSearch(searchTerm: string) {
  //   this.searchTermAvailable = searchTerm;
  //   this.availableSearchInputControl.setValue(searchTerm);
  // };
  // @Input() set selectedSearch(searchTerm: string) {
  //   this.searchTermSelected = searchTerm;
  //   this.selectedSearchInputControl.setValue(searchTerm);
  // };
  // @Input() valueField = 'id';
  // @Input() textField = 'description';
  // @Input() title: string;
  // @Input() debounceTime = 500;
  // @Input() moveAllButton = true;
  // @Input() availableText = 'Available';
  // @Input() selectedText = 'Used';
  // @Input() availableFilterPlaceholder = 'Filter...';
  // @Input() selectedFilterPlaceholder = 'Filter...';
  //  @Output() onAvailableItemSelected: EventEmitter<{} | Array<{}>> = new EventEmitter<{} | Array<{}>>();
  //  @Output() onSelectedItemsSelected: EventEmitter<{} | Array<{}>> = new EventEmitter<{} | Array<{}>>();
  // @Output() onItemsMoved: EventEmitter<IItemsMovedEvent> = new EventEmitter<IItemsMovedEvent>();

  searchTermAvailable = '';
  searchTermSelected = '';
  public availableItems: any = [];// Array<IListBoxItem> = [];
  public selectedItems: any = [];// Array<IListBoxItem> = [];
  listBoxForm: FormGroup;
  availableSelectedItem: any;
  usedSelectedItem: any;
  availableListBoxControl: FormControl = new FormControl();
  selectedListBoxControl: FormControl = new FormControl();
  pwpriceWorkflowDescription: FormControl = new FormControl();
  pwActive: FormControl = new FormControl();
  pwDefault: FormControl = new FormControl();
  pwCheap: FormControl = new FormControl();
  // availableSearchInputControl: FormControl = new FormControl();
  // selectedSearchInputControl: FormControl = new FormControl();

  _onChange = (_: any) => { };
  _onTouched = () => { };



  constructor(public fb: FormBuilder, private priceWorkflowSvc: PriceWorkflowService, private toastr: ToastrService,
    private deleteRecordsService: DeleteRecordsService) {

    this.listBoxForm = this.fb.group({
      availableListBox: this.availableListBoxControl,
      selectedListBox: this.selectedListBoxControl,
      pwpriceWorkflowDescription: this.pwpriceWorkflowDescription,
      pwActive: this.pwActive,
      pwDefault: this.pwDefault,
      pwCheap: this.pwCheap
      //availableSearchInput: this.availableSearchInputControl,
      //selectedSearchInput: this.selectedSearchInputControl
    });
  }

  ngOnInit(): void {
    this.AgLoad = false;
    this.GetPriceWorkflowsByCompany();
    this.ColumnDefs = [
      { headerName: 'PriceWorkflowDescription', field: 'priceWorkflowDescription' },
      { headerName: 'UseCheapestPrice', field: 'useCheapestPrice' },
      { headerName: 'Default', field: 'default' },
      { headerName: 'Active', field: 'deleted', },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    ];

    //this.getPriceWorkflow();
    //this.getUsedPriceWorkflow();
    // this.availableItems = [...(this.availablePrices || []).map((item: any, index: number) => ({
    //   value: item.id.toString(),
    //   text: item.description
    // }))];
    // this.selectedItems = [...(this.usedPrices || []).map((item: any, index: number) => ({
    //   index: index + 1,
    //    value: item.id.toString(),
    //  text: item.description
    // }))];
    // this.availableListBoxControl
    //   .valueChanges
    //   .subscribe((items: Array<{}>) => this.onAvailableItemSelected.emit(items));
    // this.selectedListBoxControl
    //   .valueChanges
    //   .subscribe((items: Array<{}>) => this.onSelectedItemsSelected.emit(items));
    // this.availableSearchInputControl
    //   .valueChanges
    //   .debounceTime(this.debounceTime)
    //   .distinctUntilChanged()
    //   .subscribe((search: string) => this.searchTermAvailable = search);
    // this.selectedSearchInputControl
    //   .valueChanges
    //   .debounceTime(this.debounceTime)
    //   .distinctUntilChanged()
    //   .subscribe((search: string) => this.searchTermSelected = search);
  }

  GetPriceWorkflowsByCompany() {
    debugger;
    this.AgLoad = false;
    this.priceWorkflowSvc.GetPriceWorkflowsByCompany(this.CompanyID).subscribe((resp: any) => {
      if (resp.isSuccess)
        this.RowData = resp.data.priceWorkflow;
      this.AgLoad = true;
    }, (error) => {
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  getAvailablePriceWorkflows() {
    debugger;
    this.priceWorkflowSvc.GetAvailablePriceWorkflows(this.CompanyID, "Available", this.priceWorkflow.id).subscribe((resp: any) => {
      if (resp.isSuccess)
        this.availableItems = resp.data.priceWorkflow;
    }, (error) => {
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  getUsedPriceWorkflows() {
    debugger;
    this.priceWorkflowSvc.GetAvailablePriceWorkflows(this.CompanyID, "Used", this.priceWorkflow.id).subscribe((resp: any) => {
      if (resp.isSuccess)
        this.selectedItems = resp.data.priceWorkflow;
    }, (error) => {
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  // getPriceWorkflow() {
  //   debugger;
  //   this.priceWorkflowSvc.GetAvailablePriceWorkflow(this.CompanyID).subscribe((resp: any) => {
  //     if (resp.isSuccess)
  //       this.availableItems = resp.data.priceWorkflow;
  //   }, (error) => {
  //     this.toastr.error('Problem with the sevice. Please try later : ' + error);
  //   });
  // }
  // getUsedPriceWorkflow() {
  //   debugger;
  //   this.priceWorkflowSvc.GetUsedPriceWorkflow(this.CompanyID).subscribe((resp: any) => {
  //     if (resp.isSuccess)
  //       this.selectedItems = resp.data.priceWorkflow;
  //   }, (error) => {
  //     this.toastr.error('Problem with the sevice. Please try later : ' + error);
  //   });
  // }
  savePriceWorkflow(action) {
    debugger;
    console.log(this.priceWorkflow);
    // if (this.prwDescription.length === 0) {
    //   this.toastr.warning("Description can not be empty.");
    //   return;
    // }
    // let priceWorkflow = {
    //   "companyID": this.CompanyID, "priceWorkflowDescription": this.prwDescription,
    //   "status": this.pwActive, "useCheapestPrice": this.pwCheap, "default": this.pwDefault, "createdBY": this.CreatedBY
    // }
    // console.log(priceWorkflow);
    // this.priceWorkflowSvc.SavePriceWorkflow(priceWorkflow).subscribe((resp: any) => {
    //   if (resp.isSuccess) {
    //     this.toastr.success(resp.message);
    //     if (action == "Close") {
    //       //this.getPriceWorkflow();
    //       this.Cancel();
    //     }
    //   }
    //   else
    //     this.toastr.error(resp.message);
    // }, (error) => {
    //   this.toastr.error('Problem with the sevice. Please try later : ' + error);
    // });
  }

  savePriceWorkflows(action) {
    debugger;
    console.log(this.priceWorkflow);
    if (this.priceWorkflow.priceWorkflowDescription.length > 0 && this.priceWorkflow.priceWorkflowDescription != "") {
      let model = { priceWorkFlow: this.priceWorkflow, selectedList: this.selectedItems };
      this.priceWorkflowSvc.SavePriceWorkflows(model, this.CompanyID).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success(resp.message);

          if (action == "Close") {
            //this.getPriceWorkflow();
            this.Cancel();
          }
         this.priceWorkflow.id=resp.data.result;
         this.getAvailablePriceWorkflows();
         this.getUsedPriceWorkflows();
        }
        else
          this.toastr.error(resp.message);
      }, (error) => {
        this.toastr.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    else {
      this.toastr.warning('Description can not be empty.');
    }
  }
  // moveAllItemsToSelected(): void {

  //   if (!this.availableItems.length) {
  //     return;
  //   }
  //   this.selectedItems = [...this.selectedItems, ...this.availableItems];
  //   this.availableItems = [];
  //   this.onItemsMoved.emit({
  //     available: this.availableItems,
  //     selected: this.selectedItems,
  //     movedItems: this.availableListBoxControl.value,
  //     from: 'available',
  //     to: 'selected'
  //   });
  //   this.availableListBoxControl.setValue([]);
  //   this.writeValue(this.getValues());
  // }

  // moveAllItemsToAvailable(): void {
  //   if (!this.selectedItems.length) {
  //     return;
  //   }
  //   this.availableItems = [...this.availableItems, ...this.selectedItems];
  //   this.selectedItems = [];
  //   this.onItemsMoved.emit({
  //     available: this.availableItems,
  //     selected: this.selectedItems,
  //     movedItems: this.selectedListBoxControl.value,
  //     from: 'selected',
  //     to: 'available'
  //   });
  //   this.selectedListBoxControl.setValue([]);
  //   this.writeValue([]);
  // }

  // moveMarkedAvailableItemsToSelected(): void {

  //   this.selectedItems = [...this.selectedItems,
  //   ...intersectionwith(this.availableItems, this.availableListBoxControl.value,
  //     (item: IListBoxItem, value: string) => item.value === value)];

  //   this.availableItems = [...differenceWith(this.availableItems, this.availableListBoxControl.value,
  //     (item: IListBoxItem, value: string) => item.value === value)];
  //   this.onItemsMoved.emit({
  //     available: this.availableItems,
  //     selected: this.selectedItems,
  //     movedItems: this.availableListBoxControl.value,
  //     from: 'available',
  //     to: 'selected'
  //   });
  //   this.availableListBoxControl.setValue([]);
  //   this.availableSearchInputControl.setValue('');
  //   this.writeValue(this.getValues());
  // }


  // moveMarkedSelectedItemsToAvailable(): void {

  //   this.availableItems = [...this.availableItems,
  //   ...intersectionwith(this.selectedItems, this.selectedListBoxControl.value,
  //     (item: IListBoxItem, value: string) => item.value === value)];
  //   this.selectedItems = [...differenceWith(this.selectedItems, this.selectedListBoxControl.value,
  //     (item: IListBoxItem, value: string) => item.value === value)];
  //   this.onItemsMoved.emit({
  //     available: this.availableItems,
  //     selected: this.selectedItems,
  //     movedItems: this.selectedListBoxControl.value,
  //     from: 'selected',
  //     to: 'available'
  //   });
  //   this.selectedListBoxControl.setValue([]);
  //   this.selectedSearchInputControl.setValue('');
  //   this.writeValue(this.getValues());
  // }


  // moveAvailableItemToSelected(item: IListBoxItem): void {

  //   this.availableItems = this.availableItems.filter((listItem: IListBoxItem) => listItem.value !== item.value);
  //   this.selectedItems = [...this.selectedItems, item];
  //   this.onItemsMoved.emit({
  //     available: this.availableItems,
  //     selected: this.selectedItems,
  //     movedItems: [item.value],
  //     from: 'available',
  //     to: 'selected'
  //   });
  //   this.availableSearchInputControl.setValue('');
  //   this.availableListBoxControl.setValue([]);
  //   this.writeValue(this.getValues());
  // }

  // moveSelectedItemToAvailable(item: IListBoxItem): void {

  //   this.selectedItems = this.selectedItems.filter((listItem: IListBoxItem) => listItem.value !== item.value);
  //   this.availableItems = [...this.availableItems, item];
  //   this.onItemsMoved.emit({
  //     available: this.availableItems,
  //     selected: this.selectedItems,
  //     movedItems: [item.value],
  //     from: 'selected',
  //     to: 'available'
  //   });
  //   this.selectedSearchInputControl.setValue('');
  //   this.selectedListBoxControl.setValue([]);
  //   this.writeValue(this.getValues());
  // }

  // trackByValue(index: number, item: {}): string {
  //   return item[this.valueField];
  // }

  writeValue(value: any): void {
    if (this.selectedItems && value && value.length > 0) {
      this.availableItems = [...this.availableItems];
      this.selectedItems = [...this.selectedItems];
      // this.selectedItems = [...this.selectedItems,
      // ...intersectionwith(this.availableItems, value, (item: IListBoxItem, val: string) => item.value === val)];
      // this.availableItems = [...differenceWith(this.availableItems, value,
      //   (item: IListBoxItem, val: string) => item.value === val)];
    }
    this._onChange(value);
  }

  registerOnChange(fn: (_: any) => {}): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }
  onAvailableSelect(item) {
    this.availableSelectedItem = item;

  }
  onUsedSelect(item) {
    this.usedSelectedItem = item;
  }
  addSelected() {
    debugger;
    let item = this.availableSelectedItem;
    this.selectedItems.push(item);
    let index = this.availableItems.indexOf(item)
    this.availableItems.splice(index, 1);
    this.availableSelectedItem = null;
  }
  addAll() {
    debugger;
    //this.selectedItems.push(...[this.availableItems]);
    this.availableItems.forEach(item => { this.selectedItems.push(item) })
    // this.availableItems.forEach(function (item) {
    //   let i=item;
    //   this.selectedItems.push(i);
    // });

    this.availableItems = [];
  }
  removeSelected() {
    let item = this.usedSelectedItem;
    debugger;
    this.availableItems.push(item);
    let index = this.selectedItems.indexOf(item)
    this.selectedItems.splice(index, 1);
    this.usedSelectedItem = null;
  }
  removeAll() {
    this.selectedItems.forEach(item => { this.availableItems.push(item) })

    //this.availableItems.push([...this.selectedItems]);
    // this.selectedItems.forEach(function (item) {
    //   this.availableItems.push(item);
    // });
    this.selectedItems = [];
  }

  move(array, element, delta) {
    debugger;
    //console.log('move', array, index, delta);
    let item = array.filter(f => f.value === element[0]);
    let index = array.indexOf(element);

    var newIndex = index + delta;
    if (newIndex < 0 || newIndex == array.length) return; //Already at the top or bottom.
    var indexes = [index, newIndex].sort((a, b) => a - b); //Sort the indixes (fixed)
    array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]); //Replace from lowest index, two elements, reverting the order
    // // //let item = array.filter(f => f.value === element[0]);
    // // let index = array.indexOf(element);
    // // let newIndex = index + delta;
    // // if (newIndex < 0 || newIndex == array.length)
    // //   return; //Already at the top or bottom.
    // // else {
    // //   let indexes = [index, newIndex].sort(); //Sort the indixes
    // //   this.selectedItems = [];
    // //   array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]); //Replace from lowest index, two elements, reverting the order
    // //   this.selectedItems = [...array];
    // // }
  };

  moveUp() {
    debugger;
    this.move(this.selectedItems, this.usedSelectedItem, -1);
  };

  moveDown() {
    debugger;
    this.move(this.selectedItems, this.usedSelectedItem, 1);
  };
  private getValues(): string[] {
    return (this.selectedItems || []).map((item: IListBoxItem) => item.value);
  }

  AddNew(): void {
    this.Mode = 'Add';
    this.priceWorkflow = {
      id: "00000000-0000-0000-0000-000000000000", companyID: this.CompanyID, priceWorkflowDescription: "",
      useCheapestPrice: 0, default: 0, createdBY: this.CreatedBY, deleted: 0
    }
    this.getAvailablePriceWorkflows();
    this.getUsedPriceWorkflows();

  }
  Cancel(): void {
    this.Mode = "Grid";
    this.priceWorkflow = {
      id: "00000000-0000-0000-0000-000000000000", companyID: this.CompanyID, priceWorkflowDescription: "",
      useCheapestPrice: 0, default: 0, createdBY: this.CreatedBY, deleted: 0
    }
    this.GetPriceWorkflowsByCompany();

  }
  ChangeValue(priceWorkflow){
    debugger;
    priceWorkflow.deleted = !priceWorkflow.deleted;
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  OnActionClick(id) {
    debugger;
    this.Mode = "Edit";
    this.priceWorkflow = this.RowData.filter(f => f.id === id)[0];
   // this.getAvailablePriceWorkflows();
    this.getUsedPriceWorkflows();
   this.getAvailablePriceWorkflows();
    // var colId = event.column.getId();
    // if (colId == 'Edit') {
    //   this.Mode="Add";
    //   this.priceWorkflow=this.RowData.filter(f => f.id === event.data.id);
    // } else if (colId == 'Delete') {
    //   //this.onDeleteChecked(event.data.id)
    // }
  }
  OnAccept(id){
    debugger
      this.deleteRecordsService.deleteRecordsBYID(this.DeleteID, 'LBS_SOP_PriceWorkflow', this.CreatedBY).subscribe((resp: any) => {
        this.toastr.success('Price Workflow deleted successfully');
        this.GetPriceWorkflowsByCompany();
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
  }
  DeletePriceWorkFlow(ID,alreadyDeleted) {
    if(alreadyDeleted){
      this.confirmation.ConfirmationPopup('Are you sure, you want to Re-Active this price workflow?');
    }
    else{
      this.confirmation.ConfirmationPopup('Are you sure, you want to delete this price workflow?');
    }

      this.DeleteID=ID
    // if (window.confirm("Are you sure, you want to delete this price workflow?")) {
    //   this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_SOP_PriceWorkflow', this.CreatedBY).subscribe((resp: any) => {
    //     this.toastr.success('Price Workflow deleted successfully');
    //     this.GetPriceWorkflowsByCompany();
    //   }, (error) => {
    //     console.error('Problem with the sevice. Please try later : ' + error);
    //   });

    // }
  }
  
  Search() {
    debugger;
    if (this.searchValue != "") {
      this.RowData = this.RowData.filter(res => { return res.priceWorkflowDescription.toLocaleLowerCase().match(this.searchValue.toLocaleLowerCase()) });
    }
    else if (this.searchValue == "") {
      this.ngOnInit();
    }
  }

}
export interface IListBoxItem {
  index: any;
  value: string;
  text: string;
}

export interface IItemsMovedEvent {
  available: Array<{}>;
  selected: Array<{}>;
  movedItems: Array<{}>;
  from: 'selected' | 'available';
  to: 'selected' | 'available';
}

