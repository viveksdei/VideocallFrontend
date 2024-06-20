import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
};
const routes: Routes = [

  // {
  //   path: '',
  //   loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  // },
  { path: '',
    loadChildren: () => import('./platform/platform.module').then(m => m.PlatformModule)
  },
  {path: 'patient',
    loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule)
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
