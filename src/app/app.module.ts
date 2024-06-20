import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpTokenInterceptor } from './core/interceptors';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AngularMaterialModule } from './platform/shared/material.module';
import { DatePipe } from '@angular/common';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  NgxUiLoaderHttpModule,
  SPINNER,
  POSITION,
  PB_DIRECTION
} from 'ngx-ui-loader';
import { OpentokService } from './opentok.service';
import { SharedModule } from './shared/shared.module';
import { TherapistModule } from './platform/therapist/therapist.module';



const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: '#4281EA',
  fgsPosition: POSITION.centerCenter,
  fgsSize: 60,
  fgsType: SPINNER.rectangleBounceParty,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 3,
  pbColor: '#4281EA',
  overlayColor: 'rgba(0,0,0,0.3)'
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    SharedModule,
    TherapistModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule.forRoot({ showForeground: false }),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
    }),
  
  ],
  providers: [
    OpentokService,
    provideClientHydration(),
    DatePipe,
    ToastrService,
  ],
  bootstrap: [AppComponent],

})

export class AppModule { }
