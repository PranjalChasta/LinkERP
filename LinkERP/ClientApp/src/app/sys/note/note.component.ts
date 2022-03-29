import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NoteService } from 'src/app/shared/services/note.service';
import { LbsSysNotes } from 'src/app/models/sys/lbs-sys-notes';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  Notesform: FormGroup;
  Mode: any = 'List';
  submitted: boolean;
  Loading: any = false
  read:boolean;
  RecID=localStorage.getItem('RecID');
  NoteTypeID=localStorage.getItem('NoteTypeID');
  
Note:any[]=[];  //Array variable of note data to bind grid
NoteType:any[]=[];
  /* FOR Aggird Start */
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  /* FOR Aggird End  */


  Status=
  [
    { id: '1', name: 'New' },
    { id: '2', name: 'In Progress' },
    { id: '3', name: 'Cancelled' },
    { id: '4', name: 'Deferred' },
    { id: '5', name: 'Completed' }
    
  ];
  constructor( private NoteFB: FormBuilder,private NoteService:NoteService,private toastr: ToastrService) { }

  ngOnInit() {
    /* this.AgLoad = false;
    this.ColumnDefs = [
      { headerName: 'NoteType', field: 'noteTypeName', sortable: true, filter: true, checkboxSelection: false },
      // { headerName: 'RecID', field: 'recID', sortable: true, filter: true },
      // { headerName: 'NoteTypeID', field: 'noteTypeID', sortable: true, filter: true },
      { headerName: 'NoteText', field: 'noteText', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleted', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false },
      { headerName: '', field: 'Delete', cellRenderer: this.CustomDeleteIconFunc, type: 'Action', hide: false }
    ];
    this.BindNotes();
    this.BindNotetypess();
    //To create the jobsform Form Controls.
    this.Notesform = this.NoteFB.group({
      ID: [''],
      RecID: [''],
      NoteTypeID:[''],
      NoteText:[''],
      NextFollowupDate:[''],
      NoteTypeName:['-1'],
      Status:['-1']
     
    }); */
  }
 //Resetting the form after Add/Edit
 ResetForm() {
  this.Notesform.patchValue({
    ID: '',
    RecID: '',
    NoteTypeID: '',
    NoteText: '',
    NextFollowupDate: '',
    NoteTypeName:'-1',
    Status:'-1'
  });
  this.Notesform.markAsUntouched();
  this.Notesform.markAsPristine();
  this.submitted = false;
}

  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Mode='Edit'
      
      this.Edit(event.data.id)
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
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
    this.read=false;
  }
  //To bind the data of job to the controls to edit/update.
  Edit(ID): void {
    this.Mode = 'Edit';
   this.BindNoteById(ID);
   this.read=true;
  }
  //Cancel the Add/Edit
  Cancel(){
    this.ResetForm();
    this.Mode = 'List';
  }
  //To bind the data of all note to the Grid.
BindNotes(){
  
  this.Loading=true;
  this.Mode = 'List';
  this.AgLoad=false;
  
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

BindNotetypess(){
  
  this.Loading=true;
  
  
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
  this.submitted = true;
  if (this.Notesform.invalid) {
    return;
  }
  this.Loading = true;
  let note = new LbsSysNotes();
  note.RecID = this.RecID;
  note.NoteTypeID = this.NoteTypeID;
  note.NoteTypeName=this.Notesform.get('NoteTypeName').value;
  note.NoteText = this.Notesform.get('NoteText').value;
  note.NextFollowupDate = this.Notesform.get('NextFollowupDate').value;
  note.Status = this.Notesform.get('Status').value;
 //If the mode Add will insert data to DB table else update the row by ID
  if (this.Mode == 'Add') {
    this.NoteService.addnotes(note).subscribe((resp: any) => {
      if (resp.isSuccess) { 
        this.toastr.success('Note details saved successfully');
        this.ResetForm();
        this.BindNotes();
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
       this.ResetForm();
        this.BindNotes();
        this.Mode = 'List';
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
      this.toastr.success('note deleted successfully')
      this.BindNotes();
    }
    this.Loading = false;
  }, (error) => {
    this.Loading = false;

    // console.error('Problem with the sevice. Please try later : ' + error.message);
  });
}

//Bind note by  ID
BindNoteById(ID) {
  
  this.NoteService.getNoteByID(ID).subscribe((resp: any) => {
    console.log(resp);
    if (resp.isSuccess == true) {
    let notes: any = new LbsSysNotes();
    
    notes = resp.data.note; 
    this.Notesform.patchValue({
      ID: notes.id,
      RecID:notes.recID,
      NoteTypeID: notes.noteTypeID,
      NoteText: notes.noteText,
      NoteTypeName:notes.noteTypeName,
      NextFollowupDate:notes.nextFollowupDate,
      Status: notes.status 
      
    });
     }
  }, (error) => {
    console.error('Problem with the sevice. Please try later : ' + error);
  });
}
}
