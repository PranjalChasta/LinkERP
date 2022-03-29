import { Component, OnInit, forwardRef, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgSelectOption } from '@angular/forms'
import { noop } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { SysCommonService } from 'src/app/sys/services/sys-common.service'
import { Router } from '@angular/router';

@Component({
  selector: 'debtor-search',
  templateUrl: './debtor-search.component.html',
  styleUrls: ['./debtor-search.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DebtorSearchComponent),
    multi: true
  }]
})
export class DebtorSearchComponent implements OnInit, ControlValueAccessor {
  private onChange: (_: any) => void = noop;
  private value: any;
  @Input() WarehouseID: any;
  @Input() ModuleName: any;
  DebtorDetails: any = '';
  SearchText: any = '';
  @Output() change = new EventEmitter<any>();
  @Input() VendorId: any;
  @Input() Action: any;
  DebtorID:any;
  Status: any
  constructor(private router: Router,private modalService: BsModalService,
    private sysCommonService: SysCommonService) { }

  writeValue(obj: any): void {
    debugger;
    console.log(this.WarehouseID);
    this.value = obj;

    if (this.value == null || this.value == '') {
    }
    else {
      this.GetDebtorByID(this.value);
    }
    this.onChange(this.value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {

  }
  setDisabledState?(isDisabled: boolean): void {

  }

  ngOnInit() {
    //alert(this.VendorId);
    //alert(this.Action);
    //alert(this.ModuleName);
  }
  modalRef: BsModalRef;
  @ViewChild('debtorSearchBox') debtorSearchBox: TemplateRef<any>;

  OpenSearch() {
    this.modalRef = this.modalService.show(this.debtorSearchBox);
  }
  Debtors: any[] = [];
  SearchDebtor() {
    debugger;
    let searchParam: any = {
      'SearchText': this.SearchText,
      'ModuleName': this.ModuleName,
      //'WarehouseID': this.WarehouseID,
      //'SearchID1': this.VendorId,
      'Action': this.Action
    }
    this.sysCommonService.searchDebtor(searchParam).subscribe((resp: any) => {
      this.Debtors = resp.data.debtorDetails;
    }, (error: any) => {

    });
  }
  DebtorDetail: any;
  GetDebtorByID(ID) {
    debugger;
 
    if (ID != "-1" && ID != null && ID != "00000000-0000-0000-0000-000000000000") {
      console.log(this.ModuleName)
      console.log(ID)
      this.sysCommonService.getDebtorByID(ID, this.ModuleName).subscribe((resp: any) => {
        let debtor = resp.data.debtorbyId;
        debugger;
        this.DebtorID=ID;
        console.log(resp)
        console.log(debtor)
        this.DebtorDetails = debtor.debtorCode + ' - ' + debtor.debtorAccountName;
      }, (error: any) => {
      });
    }
  }
  SelectedDebtorID: any;
  SelectDebtor(ID, Code, Name) {
    debugger;
    this.SelectedDebtorID = ID;
    this.DebtorDetails = Code + ' - ' + Name;
    this.value = ID;
    this.DebtorID=ID;
    this.onChange(this.value);
    this.change.emit(ID);
    this.modalRef.hide();
  }
  Cancel() {
    this.modalRef.hide();
  }
  checkDebtor(){
    if(this.DebtorID!=undefined && this.DebtorID!=null)
    {
      this.router.navigate([]).then(result => {  window.open( `/AR/Debtors/${this.DebtorID}`, '_blank'); });
    }
    else{
      console.log("DebtorId Is not there");
    }
    
  }
}
