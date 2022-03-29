import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog-popup',
  templateUrl: './confirm-dialog-popup.component.html',
  styleUrls: ['./confirm-dialog-popup.component.css']
})
export class ConfirmDialogPopupComponent implements OnInit {

  @Output() OnDelete = new EventEmitter();
  @Output() OnCancel= new EventEmitter(); 

  constructor() { }

  ngOnInit() {

  }

  DeleteAll() {
    this.OnDelete.emit();
  }

  ClosePopup() {
    this.OnCancel.emit();
  }
}
