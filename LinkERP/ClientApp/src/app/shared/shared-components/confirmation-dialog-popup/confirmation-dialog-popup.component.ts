import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
@Component({
  selector: 'confirmation-dialog-popup',
  templateUrl: './confirmation-dialog-popup.component.html',
  styleUrls: ['./confirmation-dialog-popup.component.css']
})
export class ConfirmationDialogPopupComponent implements OnInit {

  @Input() Message = '';
  @Output() OnAccept = new EventEmitter<any>();
  @Output() OnCancel = new EventEmitter();
  @Input() SaveAction = '';

  modalRef: BsModalRef;
  @ViewChild('confirmation') confirmation: TemplateRef<any>;
  constructor(
    public modalService: BsModalService, ) { }

  ngOnInit() {

  }

  OnAccepted() {
    this.modalRef.hide();
    this.OnAccept.emit(this.SaveAction);
  }

  OnCanceled() {
    this.modalRef.hide();
    this.OnCancel.emit();
  }

  ConfirmationPopup(message) {
    this.Message = message;
    this.modalRef = this.modalService.show(this.confirmation);
  }
  ConfirmationPopupSave(message, saveAction) {
    this.Message = message;
    this.SaveAction = saveAction;
    this.modalRef = this.modalService.show(this.confirmation);
  }
}
