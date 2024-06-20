import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TherapistRoutingModule } from './therapist-routing.module';
import { ChatComponent } from './startCall/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TherapistComponent } from './therapist/therapist.component';
import { VideocallComponent } from './videocall/videocall.component';
import { NewSessionNoteComponent } from './new-session-note/new-session-note.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxEditorModule } from 'ngx-editor';
import { PreviousSessionNoteComponent, RemoveParagraphTagsPipe } from './previous-session-note/previous-session-note.component';
import { SessionNoteArchiveComponent } from './session-note-archive/session-note-archive.component';
import { AgePipePipe } from '../shared/pipes/age-pipe.pipe';
import { VideoChatComponent } from './video-chat/video-chat.component';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { AngularMaterialModule } from '../shared/material.module';
import { SubscriberComponent } from './subscriber/subscriber.component';
import { PublisherComponent } from './publisher/publisher.component';
import { RemoveHtmlTagsPipe } from '../shared/pipes/remove-html-tags.pipe';



@NgModule({
  declarations: [
    ChatComponent,
    TherapistComponent,
    VideocallComponent,
    NewSessionNoteComponent,
    PreviousSessionNoteComponent,
    SessionNoteArchiveComponent,
    AgePipePipe,
    RemoveParagraphTagsPipe,
    VideoChatComponent,
    SubscriberComponent,
    PublisherComponent,
    RemoveHtmlTagsPipe
  ],
  imports: [
    CommonModule,
    TherapistRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatTabsModule,
    NgxEditorModule,

    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,

    MatCheckboxModule,
    MatTableModule,
    MatExpansionModule,

    AngularMaterialModule,
  ],
  exports:[VideoChatComponent,
    SubscriberComponent,
    PublisherComponent]
})
export class TherapistModule { }
