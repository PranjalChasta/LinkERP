import { Component, OnInit, Input, forwardRef, ViewChild, AfterViewInit, Injector } from '@angular/core';

import { NgbTimeStruct, NgbDateStruct, NgbPopoverConfig, NgbPopover, NgbDatepicker, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { DateTimeModel } from './date-time-model';
import { noop } from 'rxjs';
import * as config from 'src/assets/config.json';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.css'],
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true
    }
  ]
})
export class DateTimePickerComponent implements OnInit, ControlValueAccessor, AfterViewInit {

  @Input()
  dateString: string;

  @Input()
  inputDatetimeFormat = 'M/d/yyyy h:mm:ss a';
  @Input()
  hourStep = 1;
  @Input()
  minuteStep = 15;
  @Input()
  secondStep = 30;
  @Input()
  seconds = true;
  @Input()
  disabled = false;

  @Input()
  showDatePicker = true;
  @Input()
  showTimePicker = true;

  @Input()
  set isInvalid(isInvalid: boolean) {
    this._isInvalid = isInvalid;
  }
  get isInvalid() {
    return this._isInvalid;
  }

  _isInvalid: boolean = false;

  // @Input()
  // MaxDate: Date = null;

  @Input()
  set MaxDate(MaxDate: Date) {
    this.appMaxDate = { year: MaxDate.getFullYear(), month: MaxDate.getMonth() + 1, day: MaxDate.getDate() };
  }

  get disableSince() {
    return this.appMaxDate;
  }

  @Input()
  set MinDate(MinDate: Date) {
    this.appMinDate = { year: MinDate.getFullYear(), month: MinDate.getMonth() + 1, day: MinDate.getDate() };
  }

  get MinDate() {
    return this.appMinDate;
  }
  // @Input() OnMaxDateChange: function MaxDateChange(params: Date) {

  // }

  private showTimePickerToggle = false;

  private datetime: DateTimeModel = new DateTimeModel();
  private firstTimeAssign = true;

  @ViewChild(NgbDatepicker)
  private dp: NgbDatepicker;

  @ViewChild(NgbPopover)
  private popover: NgbPopover;

  private onTouched: () => void = noop;
  private onChange: (_: any) => void = noop;

  private ngControl: NgControl;

  constructor(private config: NgbPopoverConfig, private inj: Injector,
    private calendar: NgbCalendar, private toastr: ToastrService,) {
    config.autoClose = 'outside';
    config.placement = 'auto';
  }
  appMaxDate: any;// { year: 2020, month: 5, day: 27 };
  appMinDate: any;// { year: 2020, month: 5, day: 27 };
  // = { year: this.MaxDate.getFullYear(), month: this.MaxDate.getMonth(), day: this.MaxDate.getDate() };

  ngOnInit(): void {
    // if (this.MaxDate != null) {
    //   this.appMaxDate = { year: this.MaxDate.getFullYear(), month: this.MaxDate.getMonth(), day: this.MaxDate.getDate() };
    // }

    // this.dp.maxDate = { year: 2020, month: 5, day: 28 };
    this.ngControl = this.inj.get(NgControl);
    if (!this.showDatePicker && !this.showTimePicker) {
      this.showDatePicker = true;
      this.showTimePicker = true;
      this.inputDatetimeFormat = config.DateTimeFormat.DateTime;
    }
    else if (this.showDatePicker && !this.showTimePicker) {
      this.inputDatetimeFormat = config.DateTimeFormat.Date;
    }
    else if (!this.showDatePicker && this.showTimePicker) {
      let d: Date = new Date(Date.now());
      this.datetime.year = d.getFullYear();
      this.datetime.month = d.getMonth() + 1;
      this.datetime.day = d.getDate();
      this.datetime.hour = d.getHours();
      this.datetime.minute = d.getMinutes();
      this.datetime.second = d.getSeconds();
      this.dateString = this.datetime.toString();
      //CHANGES
      this.onChange(this.dateString);
      this.setDateStringModel();
      this.inputDatetimeFormat = config.DateTimeFormat.Time;
      this.showTimePickerToggle = true;
    }
    else {
      this.inputDatetimeFormat = config.DateTimeFormat.DateTime;
    }

    //let maxDate: NgbDateStruct = { year: 2020, month: 5, day: 28 };
  }

  ngAfterViewInit(): void {
    this.popover.hidden.subscribe($event => {
      if (this.showTimePicker && !this.showDatePicker) {
        this.showTimePickerToggle = true;
      }
      else {
        this.showTimePickerToggle = false;
      }
    });
  }

  writeValue(newModel: string) {
    if (newModel) {
      this.datetime = Object.assign(this.datetime, DateTimeModel.fromLocalString(newModel));
      this.dateString = newModel;
      this.setDateStringModel();
    } else {
      this.datetime = new DateTimeModel();
      this.onChange(null);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleDateTimeState($event) {
    this.showTimePickerToggle = !this.showTimePickerToggle;
    $event.stopPropagation();
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange($event: any) {
    debugger;
   
    var values = $event.target.value.trim().split(" ");
   
    var DateTimeString = values[0];
    var input = DateTimeString;
    var pattern = /^((0[1-9]|[12][0-9]|3[01])(\/)(0[13578]|1[02]))|((0[1-9]|[12][0-9])(\/)(02))|((0[1-9]|[12][0-9]|3[0])(\/)(0[469]|11))(\/)\d{4}$/;
    if(!pattern.test(input))
    {
      this.toastr.warning('Incorrect Date');
      let d: Date = new Date(Date.now());
      this.datetime.year = d.getFullYear();
      this.datetime.month = d.getMonth() + 1;
      this.datetime.day = d.getDate();
      this.datetime.hour = d.getHours();
      this.datetime.minute = d.getMinutes();
      this.datetime.second = d.getSeconds();
      this.dateString = this.datetime.toString();
      this.onChange(this.dateString);
    this.setDateStringModel();
      return;
    }
    var year = DateTimeString.trim().split("/");
    var GetYear=year[2]
    if (GetYear.length != 4) {
      let d: Date = new Date(Date.now());
      this.datetime.year = d.getFullYear();
      this.datetime.month = d.getMonth() + 1;
      this.datetime.day = d.getDate();
      this.datetime.hour = d.getHours();
      this.datetime.minute = d.getMinutes();
      this.datetime.second = d.getSeconds();
      this.dateString = this.datetime.toString();
      this.onChange(this.dateString);
    this.setDateStringModel();
      this.toastr.warning('Incorrect Date');
      return;
  }

   var ToformDate= stringToDate(DateTimeString,"dd/MM/yyyy","/")
   const cValue = formatDate(ToformDate, 'yyyy-MM-dd', 'en-US');
    function stringToDate(_date,_format,_delimiter)
{
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            return formatedDate;
}

    const value = $event.target.value;
    const dt = DateTimeModel.fromLocalString(cValue);
    this.onDateChange(dt);
    // if (dt) {
    //   this.datetime = dt;
    //   this.setDateStringModel();
    // } else if (value.trim() === '') {
    //   this.datetime = new DateTimeModel();
    //   this.dateString = '';
    //   this.onChange(this.dateString);
    // } else {
    //   this.onChange(value);
    // }
    // alert(this.datetime)
  }

  onCalenderPopup() {
    //alert(this.datetime.year + ' ' + this.datetime.month + ' ' + this.datetime.day);
  //this.dp.navigateTo({ year: 2020, month: 5 });
  }


  onDateChange($event: NgbDateStruct) {
    let $event2: any;
    if ($event.year) {
      $event2 = `${$event.year}-${$event.month}-${$event.day}`
    }

    const date = DateTimeModel.fromLocalString($event2);

    if (!date) {
      this.dateString = this.dateString;
      return;
    }

    if (!this.datetime) {
      this.datetime = date;
    }

    this.datetime.year = date.year;
    this.datetime.month = date.month;
    this.datetime.day = date.day;
    this.datetime.hour = date.hour;
    this.datetime.minute = date.minute;
    this.datetime.second = date.second;
    //this.dp.navigateTo({ year: this.datetime.year, month: this.datetime.month });
    //console.log('test');
    this.dateString = this.datetime.toString();
    this.onChange(this.dateString);
    this.setDateStringModel();

    if (this.showTimePicker) { this.showTimePickerToggle = true; }
    else
      if (this.popover.isOpen && !this.showTimePicker) this.popover.close();
  }

  onTimeChange(event: NgbTimeStruct) {
debugger
    if (!this.showDatePicker && this.showTimePicker) {
      let d: Date = new Date(Date.now());
      this.datetime.year = d.getFullYear();
      this.datetime.month = d.getMonth() + 1;
      this.datetime.day = d.getDate();
    }
    this.datetime.hour = event.hour;
    this.datetime.minute = event.minute;
    this.datetime.second = event.second;

    this.setDateStringModel();
  }

  setDateStringModel() {
    this.dateString = this.datetime.toString();

    if (!this.firstTimeAssign) {
      this.onChange(this.dateString);
    } else {
      // Skip very first assignment to null done by Angular
      if (this.dateString !== null) {
        this.firstTimeAssign = false;
      }
    }
  }

  inputBlur($event) {
    this.onTouched();
  }

  Today($event) {
    let d: Date = new Date(Date.now());
    if (this.showDatePicker) {
      this.datetime.year = d.getFullYear();
      this.datetime.month = d.getMonth() + 1;
      this.datetime.day = d.getDate();
    } else {
      this.datetime.year = 1;
      this.datetime.month = 1;
      this.datetime.day = 2020;
      this.setDateStringModel();
    }
    if (this.showTimePicker) {
      this.datetime.hour = d.getHours();
      this.datetime.minute = d.getMinutes();
      this.datetime.second = d.getSeconds();
    }
    // this.datetime = new DateTimeModel();
    // this.datetime = this.calendar.getToday();
    //this.dp.navigateTo({ year: this.datetime.year, month: this.datetime.month, day: this.datetime.day });
    console.log('test');
    this.dateString = this.datetime.toString();
    this.onChange(this.dateString);
    this.setDateStringModel();
    //  $event.stopPropagation();

    if (this.popover.isOpen) this.popover.close();

  }
}

