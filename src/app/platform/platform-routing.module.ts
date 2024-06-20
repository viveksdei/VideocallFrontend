import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlatformComponent } from './platform.component';


const routes: Routes = [
  {
    path: '', component: PlatformComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./therapist/therapist.module').then(m => m.TherapistModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformRoutingModule { }
