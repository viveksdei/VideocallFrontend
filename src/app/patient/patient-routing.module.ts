import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientComponent } from './patient.component';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';


import { patientAuthGuardGuard } from '../core/authguard/patient-auth-guard.guard';
import { CounselingHistoryComponent } from './counseling-history/counseling-history.component';

const routes: Routes = [
  { path: '', component:  PatientComponent,

  children: [
    { path: '', redirectTo: 'patient-dashboard', pathMatch: 'full' },
    {path:'patient-dashboard',component:PatientDashboardComponent,canActivate: [patientAuthGuardGuard]},
    {path:'counseling-history',component:CounselingHistoryComponent},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
