import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LbsSysNotes } from 'src/app/models/sys/lbs-sys-notes';
import { NoteService } from 'src/app/shared/services/note.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { CustomValidators } from 'ngx-custom-validators';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';
import { DatePipe, formatDate } from '@angular/common'
@Component({
  selector: 'app-general-notes',
  templateUrl: './general-notes.component.html',
  styleUrls: ['./general-notes.component.css']
})

export class GeneralNotesComponent implements OnInit {
  @Input() HeaderNames: any;
  @Input() RecID: any;
  @Input() write_Access: boolean;
  @Input() delete_Access: boolean;
  @Input() IsActive: boolean;
  Notesform: FormGroup;
  Mode: any = 'List';
  submitted: boolean;
  Loading: any = false
  read: boolean;
  //RecID=localStorage.getItem('RecID');
  NoteTypeID = localStorage.getItem('NoteTypeID');

  Note: any[] = [];  //Array variable of note data to bind grid
  NoteType: any[] = [];
  NoteDetail: any[] = [];
  /* FOR Aggird Start */
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  /* FOR Aggird End  */
  SubColumnDefs;
  SubRowData: any;
  SubAgLoad: boolean = false;
  lbl_DateCreated: string;
  SelectedNoteID: string;
  PageSize: any;

  Status =
    [
      { id: '1', name: 'New' },
      { id: '2', name: 'In Progress' },
      { id: '3', name: 'Cancelled' },
      { id: '4', name: 'Deferred' },
      { id: '5', name: 'Completed' }

    ];
  datePickerConfig: Partial<BsDatepickerConfig>
  minDate: any;
  constructor(
    private NoteFB: FormBuilder,
    private NoteService: NoteService,
    private toastr: ToastrService,
    private sharedFormatterService: SharedFormatterService
  ) {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.datePickerConfig = Object.assign({}, { dateInputFormat: 'MM-DD-YYYY', showWeekNumbers: false });
  }

  ngOnInit() {
    this.Mode = 'List';
    this.AgLoad = false;
    this.GetAgColumns();
    this.BindNotesByRecID();
    this.PageSize = "50";
    this.BindNotetypes();
    console.log(this.IsActive)
    //To create the jobsform Form Controls.
    this.Notesform = this.NoteFB.group({
      ID: [''],
      RecID: [''],
      NoteTypeID: [''],
      NoteSubject: ['', Validators.required],
      NoteText: ['', Validators.required],
      NextFollowupDate: [new Date()],
      NoteTypeName: ['-1', CustomValidators.notEqual('-1')],
      Status: ['New']

    });
    if (!this.write_Access) {
      this.Notesform.disable();
    } else {
      this.Notesform.enable();
    }
  }
  GetAgColumns() {
    this.ColumnDefs = [
      { headerName: 'NoteType', field: 'noteTypeName', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Note Subject', field: 'noteSubject', sortable: true, filter: true },
      { headerName: 'Progress Status', field: 'status', sortable: true, filter: true },
      // { headerName: 'NoteText', field: 'noteText', sortable: true, filter: true },
      { headerName: 'NextFollowupDate', field: 'nextFollowupDate', sortable: true, filter: true,},
      { headerName: 'Date Created', field: 'dateCreated', sortable: true, filter: true},
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
  //Resetting the form after Add/Edit
  ResetForm() {
    this.Notesform.patchValue({
      ID: '',
      RecID: '',
      NoteTypeID: '',
      NoteSubject: '',
      NoteText: '',
      NextFollowupDate: new Date(),
      NoteTypeName: '-1',
      Status: 'New'
    });
    this.Notesform.markAsUntouched();
    this.Notesform.markAsPristine();
    this.submitted = false;
  }

  AgEdit(Event) {
    let notes: any = new LbsSysNotes();
    notes = Event.data;
    this.Notesform.patchValue({
      ID: notes.id,
      RecID: notes.recID,
      NoteTypeID: notes.noteTypeID,
      NoteText: notes.noteText,
      NoteSubject: notes.noteSubject,
      NoteTypeName: notes.noteTypeID,
      NextFollowupDate: notes.nextFollowupDate,
      Status: notes.status

    });
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.colId;
    if (colId == 'Edit') {
      this.GetSubAgColumns();
      //this.Mode='Subgrid' 
      this.SelectedNoteID = event.data.id;
      this.GetNoteDetailByID(event.data.id);
      this.read = true;
      //this.SubAgLoad= true;
      // this.AgEdit(event)
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
  }
  GetSubAgColumns() {
    this.SubColumnDefs = [
      { headerName: 'Progress Status', field: 'status', sortable: true, filter: true },
      { headerName: 'NoteText', field: 'noteText', sortable: true, filter: true },
      { headerName: 'NextFollowupDate', field: 'nextFollowupDate', sortable: true, filter: true,},
      { headerName: 'Date Created', field: 'dateCreated', sortable: true,filter: true,},
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
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
  //Add new job
  AddNew(): void {
    this.Mode = 'Add';
    this.read = false;
  
  }
  //To bind the data of job to the controls to edit/update.
  Edit(ID): void {
    this.Mode = 'Edit';
    this.GetNoteDetailByID(ID);
    //this.BindNoteById(ID);
    this.read = true;
  }
  //Cancel the Add/Edit
  Back() {
    this.ResetForm();
    this.BindNotesByRecID();
    this.Mode = 'List';
    this.IsActive = true;
    this.Notesform.enable();
  }
  Cancel() {
    // this.ResetForm();
    this.GetSubAgColumns();
    //this.Mode='Subgrid'  
    this.read = true;
    if (this.SelectedNoteID) {
      this.GetNoteDetailByID(this.SelectedNoteID);
      this.Mode = 'Subgrid';
    } else {
      this.Back()
    }

  }
  //To bind the data of all note to the Grid.
  BindNotes() {
    this.Loading = true;
    //this.Mode = 'List';
    this.AgLoad = false;

    this.NoteService.getAllnotes().subscribe((resp: any) => {
      console.log(resp);
      this.Note = resp.data.notes;
      this.RowData = resp.data.notes;
     
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindNotesByRecID() {
    this.Loading = true;
    this.AgLoad = false;
    this.NoteService.getNoteByRecID(this.RecID).subscribe((resp: any) => {
      console.log(resp);
      this.Note = resp.data.note;
      this.RowData = resp.data.note;
      this.RowData.forEach(element => {
        let dateCreated = {'value': element.dateCreated}
        let nextFollowupDate = {'value': element.nextFollowupDate}
        
        element.dateCreated=this.sharedFormatterService.dateTimeFormatter(dateCreated);
        element.nextFollowupDate=this.sharedFormatterService.dateTimeFormatter(nextFollowupDate);
      });
      // this.NoteDetail=resp.data.note.lbS_SYS_NotesDetail;
      // this.SubRowData=resp.data.note.lbS_SYS_NotesDetail;
      this.AgLoad = true;
      this.Loading = false;

    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindNotetypes() {
    this.Loading = true;
    this.NoteService.getAllnotetypes().subscribe((resp: any) => {
      console.log(resp);
      this.NoteType = resp.data.notetypes;
      this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To save the State details to database table by calling the API service
  onSave() {
    debugger;
    this.submitted = true;
    if (this.Notesform.invalid) {
      return;
    }
    let currDate = new Date();
    const cValue = formatDate(currDate, 'yyyy-MM-dd', 'en-US');
    let CurrentDate = new Date(cValue).getTime();
    let nextFollowupDate = this.Notesform.get('NextFollowupDate').value;
    nextFollowupDate = formatDate(nextFollowupDate, 'yyyy-MM-dd', 'en-US');
    nextFollowupDate = new Date(nextFollowupDate);
    let nxtfollowDate = new Date(nextFollowupDate).getTime();
    if(nextFollowupDate < CurrentDate){
      this.toastr.warning('Next Followup Date should not be less than Current Date!');
      return;
    }
    this.Loading = true;
    let note = new LbsSysNotes();
  //  this.RecID = localStorage.getItem('RecID');
  //  alert(this.RecID);
    note.RecID = this.RecID;
    note.CreatedBY = localStorage.getItem('LoginID');
    note.NoteTypeID = this.Notesform.get('NoteTypeName').value;
    note.NoteTypeName = this.Notesform.get('NoteTypeName').value;
    note.NoteSubject = this.Notesform.get('NoteSubject').value;
    note.NoteText = this.Notesform.get('NoteText').value;
    note.NextFollowupDate = this.Notesform.get('NextFollowupDate').value;
    note.Status = this.Notesform.get('Status').value;
    //If the mode Add will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.NoteService.addnotes(note).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Note details saved successfully');
          this.ResetForm();
          this.BindNotesByRecID();
          this.Mode = 'List';
          this.Loading = false;
        }
      }
      );
    }
    else if (this.Mode == 'Edit') {
      note.ID = this.Notesform.get('ID').value;
      this.NoteService.updatenotes(note).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Note  details updated successfully');
          // this.ResetForm();
          this.BindNotesByRecID();
          //this.Mode = 'List';
        }
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }

  //Delete the record
  onDeleteChecked(ID) {
    this.Loading = true;
    this.NoteService.deletenotessBYID(ID, localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.BindNotesByRecID();
      }
      this.Loading = false;
    }, (error) => {
      this.Loading = false;

      // console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  onDeleteNewChecked(ID) {
    //this.Loading = true;
    this.NoteService.deleteDeleteRecordsBYID(ID, 'LBS_SYS_NotesDetail', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        if (this.SelectedNoteID) {
          this.GetNoteDetailByID(this.SelectedNoteID);
          this.Mode = 'Subgrid';
        } else {
          this.Back()
        }
      }
    }, (error) => {
    });
  }
  //Bind note by  ID
  NoteTypeName: string;
  BindNoteById(ID) {
    this.NoteService.getNoteByID(ID).subscribe((resp: any) => {
      console.log(resp);
      if (resp.isSuccess == true) {
        let notes: any = new LbsSysNotes();
        this.Mode = 'Edit';
        notes = resp.data.note;
        this.lbl_DateCreated = notes.dateCreated;
        this.Notesform.patchValue({
          /*  ID: notes.id,
           RecID:notes.recID,
           NoteTypeID: notes.noteTypeID,
           NoteText: notes.noteText,
           NoteTypeName:notes.noteTypeName,
           NextFollowupDate:notes.nextFollowupDate,
           Status: notes.status  */
          ID: notes.id,
          RecID: notes.recID,
          NoteTypeID: notes.noteTypeID,
          NoteText: notes.noteText,
          NoteSubject: notes.noteSubject,
          NoteTypeName: notes.noteTypeID,
          NextFollowupDate: notes.nextFollowupDate,
          Status: notes.status

        });
        if (notes.deleteStatus == 'Active') {
          this.Notesform.enable();
          this.IsActive = true;
        } else {
          this.Notesform.disable();
          this.IsActive = false;
        }
        this.NoteTypeName = notes.noteTypeName;
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onNoteStatusChange(ID) {
    let index = this.NoteDetail.findIndex(c => c.status == ID);
    if (index >= 0) {
      this.Notesform.patchValue({
        NoteText: this.NoteDetail[index].noteText,
        NextFollowupDate: this.NoteDetail[index].nextFollowupDate,
      });
    } else {
      this.Notesform.patchValue({
        NoteText: '',
        NextFollowupDate: new Date(),
      });
    }
  }

  GetNoteDetailByID(ID) {
    this.SubAgLoad = false;
    this.NoteService.getNoteDetailByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.NoteDetail = resp.data.note;
        this.SubRowData = resp.data.note;
        this.SubRowData.forEach(element => {
          let dateCreated = {'value': element.dateCreated}
          let nextFollowupDate = {'value': element.nextFollowupDate}
          
          element.dateCreated=this.sharedFormatterService.dateTimeFormatter(dateCreated);
          element.nextFollowupDate=this.sharedFormatterService.dateTimeFormatter(nextFollowupDate);
        });
        this.Mode = 'Subgrid';
        this.SubAgLoad = true;
      }
    });
  }

  OnSubActionClick(event: any) {
    var colId = event.column.colId;
    if (colId == 'Edit') {
      this.BindNoteById(event.data.id);
    } else if (colId == 'Delete') {
      this.onDeleteNewChecked(event.data.id)
    }
  }
  get f() { return this.Notesform.controls; }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
}
