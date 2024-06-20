import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './startCall/chat.component';
import { TherapistComponent } from './therapist/therapist.component';
import { VideocallComponent } from './videocall/videocall.component';
import { SessionNoteArchiveComponent } from './session-note-archive/session-note-archive.component';

const routes: Routes = [
 {path:'', component:TherapistComponent,
  children: [
    {path:'',component:ChatComponent},
    ]},
    {path:'videocall',component:VideocallComponent},
    {path:'archivenote',component:SessionNoteArchiveComponent},
  ]
;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TherapistRoutingModule { }
