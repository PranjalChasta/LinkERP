import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { SHAREModule } from '../shared/share.module';

import { AuthGuard } from '../auth.guard';
import { DocMastersComponent } from './doc-masters/doc-masters.component';
import { DocumentsComponent } from './documents/documents.component';


const appRoute: Routes = [
  { path: 'doc/document-masters', component: DocMastersComponent, canActivate: [AuthGuard] },
  { path: 'doc/documents', component: DocumentsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    DocMastersComponent,
    DocumentsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoute),
    ReactiveFormsModule,
    FormsModule,
    SHAREModule
  ]
})
export class DocModule { }
