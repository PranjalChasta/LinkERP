import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addnotes(data) {
    this.url = this.baseurl + 'api/SHARED/Note/AddNote';
    return this.http.post(this.url, data);
  }
  updatenotes(data) {
    this.url = this.baseurl + 'api/SHARED/Note/UpdateNote';
    return this.http.post(this.url, data);
  }
  getAllnotes() {

    this.url = this.baseurl + 'api/SHARED/Note/GetNotes';
    return this.http.get(this.url);
  }
  getNoteByID(ID) {
    this.url = this.baseurl + 'api/SHARED/Note/GetNoteByID/' + ID;
    return this.http.get(this.url);
  }
  deletenotessBYID(ID, LoginID) {
    this.url = this.baseurl + 'api/SHARED/Note/DeleteNoteByID/' + ID + '/' + LoginID;
    return this.http.post(this.url, null);
  }
  getAllnotetypes() {

    this.url = this.baseurl + 'api/SHARED/Note/GetNotetype';
    return this.http.get(this.url);
  }

  getNoteByRecID(ID) {
    this.url = this.baseurl + 'api/SHARED/Note/GetNoteByRecID/' + ID;
    return this.http.get(this.url);
  }
  getNoteDetailByID(ID) {
    this.url = this.baseurl + 'api/SHARED/Note/GetNoteDetailByID/' + ID;
    return this.http.get(this.url);
  }  

  deleteDeleteRecordsBYID(ID, TableName, DeletedBy)
  {
     this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
     return this.http.post(this.url, null);
  }
}
