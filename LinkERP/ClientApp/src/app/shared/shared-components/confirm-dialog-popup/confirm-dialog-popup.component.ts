import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog-popup',
  templateUrl: './confirm-dialog-popup.component.html',
  styleUrls: ['./confirm-dialog-popup.component.css']
})
export class ConfirmDialogPopupComponent implements OnInit {

  @Output() OnAccept = new EventEmitter();
  @Output() OnCancel = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  OnAccepted() {
    this.OnAccept.emit();
  }

  OnCanceled() {
    this.OnCancel.emit();
  }

}
