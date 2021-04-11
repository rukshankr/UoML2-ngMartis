import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { HttpClientModule } from "@angular/common/http"; //added for API calls
import { FormsModule } from "@angular/forms";
import { SqliteService } from "./services/sqlite.service";
import { LoginComponent } from "./login-comp/login-comp.component";
import { OktaAuthModule, OKTA_CONFIG } from "@okta/okta-angular";

const config = {
  issuer: "https://dev-44560058.okta.com/oauth2/default",
  redirectUri: "http://localhost:8100/login/callback",
  postLogoutRedirectUri: "http://localhost:8100/login",
  clientId: "0oag5ujmllTDi2zrM5d6",
  pkce: true,
};

@NgModule({
  declarations: [AppComponent, LoginComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    OktaAuthModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: OKTA_CONFIG, useValue: config },
    SqliteService,
    Geolocation,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
