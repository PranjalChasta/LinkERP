import { ElementRef, HostListener, Input, Directive } from '@angular/core';
import { NgModel } from '@angular/forms';
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[OnlyNumber]',
  providers: [NgModel]
})
// tslint:disable-next-line:directive-class-suffix
export class OnlyNumber {

  regexStr = '^[0-9]*$';
  constructor(private el: ElementRef) { }

  @Input() OnlyNumber: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent>event;

    if (this.OnlyNumber) {
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        /*  (e.keyCode == 65 && e.ctrlKey === true) ||
         // Allow: Ctrl+C
         (e.keyCode == 67 && e.ctrlKey === true) ||
         // Allow: Ctrl+V
         (e.keyCode == 86 && e.ctrlKey === true) || */
        // Allow: Ctrl+X
        [96, 97, 98, 99, 100, 101, 102, 103, 104, 105].indexOf(e.keyCode) !== -1 ||

        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
      if ((e.keyCode === 65 && e.ctrlKey === true) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && e.ctrlKey === true) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && e.ctrlKey === true)) {
        return false;
      }
      const ch = String.fromCharCode(e.keyCode);
      const regEx = new RegExp(this.regexStr);
      if (regEx.test(ch)) {
        return;
      } else {
        e.preventDefault();
      }
    }
  }
}
