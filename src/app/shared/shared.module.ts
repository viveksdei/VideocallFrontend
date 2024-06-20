import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallRingerComponent } from './call-ringer/call-ringer.component';




@NgModule({
  declarations: [CallRingerComponent],
  imports: [
    CommonModule
  ],
  exports:[CallRingerComponent],
})
export class SharedModule { }
