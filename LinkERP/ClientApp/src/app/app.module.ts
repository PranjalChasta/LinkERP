import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

//Modules
import { SYSModule } from './sys/sys.module';
import { AccountModule } from './account/account.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { INVModule } from './inv/inv.module';
import { AppInterceptorService } from './http-interceptor/app-interceptor.service';
import { PurModule } from './pur/pur.module';
import { DocModule } from './doc/doc.module';
import { CryptoAes } from './directives/crypto-aes';
import { AuthGuard } from './auth.guard';
import { POSModule } from './POS/pos.module';
import { KitchenviewModule } from './kitchenview/kitchenview.module';
import { DebterTranctionModule } from './Account Receivable/debtor-tranction/debter-tranction.module';



// import { DocModule } from './doc/doc.module';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent


  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    SYSModule,
    INVModule,
    PurModule,
    POSModule,
    DocModule,
   
    DebterTranctionModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
      
      //  { path: '', component: HomeComponent, pathMatch: 'full' },
      //  { path: '', component: HomeComponent, pathMatch: 'full' },
      //   { path: 'counter', component: CounterComponent },
      //   { path: 'fetch-data', component: FetchDataComponent },
    ]),
    NgbModule.forRoot(),
    AccountModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    AccountModule,
    KitchenviewModule
    
  ],
  providers: [CryptoAes,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
