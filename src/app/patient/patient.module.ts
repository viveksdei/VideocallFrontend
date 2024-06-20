import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { PatientComponent } from './patient.component';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularMaterialModule } from '../platform/shared/material.module';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';import { ChangeTimePipe } from '../platform/shared/pipes/change-time.pipe';
import { CounselingHistoryComponent, RemoveParagraphTagsPipe } from './counseling-history/counseling-history.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PatientDashboardComponent,
    PatientComponent,
    ChangeTimePipe,
    CounselingHistoryComponent,
    RemoveParagraphTagsPipe
  ],
  imports: [
    CommonModule,
    PatientRoutingModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    ReactiveFormsModule ,
    MatCheckboxModule,
    MatTableModule,
    MatExpansionModule,
    MatDialogModule,
    AngularMaterialModule,NgxMatIntlTelInputComponent,
    SharedModule
  ]
})
export class PatientModule { }
