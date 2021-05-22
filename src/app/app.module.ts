import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SqliteService } from './services/sqlite.service';
import { LoginComponent } from './login-comp/login-comp.component';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { MobileLoginComponent } from './mobile-login/mobile-login.component';
import { DeviceAuthService } from './services/device-auth.service';

const config = {
	issuer: 'https://dev-44560058.okta.com/oauth2/default',
	redirectUri: 'https://martiswabtec.web.app/login/callback',
	postLogoutRedirectUri: 'https://martiswabtec.web.app/login',
	clientId: '0oag5ujmllTDi2zrM5d6',
	pkce: true
};

@NgModule({
	declarations: [ AppComponent, LoginComponent, MobileLoginComponent ],
	entryComponents: [],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		OktaAuthModule,
		ReactiveFormsModule
	],
	providers: [
		StatusBar,
		SplashScreen,
		UniqueDeviceID,
		Uid,
		AndroidPermissions,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{ provide: OKTA_CONFIG, useValue: config },
		SqliteService,
		Geolocation,
		DeviceAuthService
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
