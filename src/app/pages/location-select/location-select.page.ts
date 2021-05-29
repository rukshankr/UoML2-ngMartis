import { Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AssetService } from 'src/app/services/asset-service.service';
import { MapLocationService } from 'src/app/services/map-location.service';
import { SqliteService } from 'src/app/services/sqlite.service';


declare var google;

@Component({
  selector: 'app-location-select',
  templateUrl: './location-select.page.html',
  styleUrls: ['./location-select.page.scss'],
})
export class LocationSelectPage implements OnInit, OnDestroy {


  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;

  //platform
  desktop : boolean = true;
  
  //places
  coords : any = [];
  asset;
  

  latitude: number;
  longitude: number;

  //subscriptions
  assetLocSub: Subscription;

  //error alert
  async showAlert(data: any) {
    let alert = this.alertCtrl.create({
      header: data.head,
      message: data.msg
    });
    (await alert).present();  
  } 

  constructor(
    //private geolocation: Geolocation,
    private navCtrl : NavController,
    private mapLocation: MapLocationService,
    private assetService: AssetService,
    private plt: Platform,
    private _sqlite: SqliteService,
    private alertCtrl: AlertController
    ) {}

  async ngOnInit() {
    this.loadMap();
    if (this.plt.is('mobile') || this.plt.is('android') || this.plt.is('ios')) {
			this.desktop = false;
      try{
        await this.getAssetLocations();
      }
      catch(err){
        this.showAlert({head: 'Error', msg:err.message});
      }
		} else {
			this.desktop = true;
      this.assetLocSub = this.assetService.getAssetLocations().subscribe((data) =>{
        console.log(data.data);
        this.coords = data.data;
      });
		}
  }

  

  loadMap() {
    Geolocation.getCurrentPosition().then((resp) => {

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.map.addListener('dragend', () => {

        this.latitude = this.map.center.lat();
        this.longitude = this.map.center.lng();

      });

    }).catch((error) => {
      this.showAlert({head:'Error getting location', msg:error});
    });
  }

  setLocation(){
    this.mapLocation.setMapLocation(this.latitude, this.longitude);
    this.navCtrl.back();
  }

  back(){
    this.navCtrl.back();
  }
  async getAssetLocations(): Promise<void>{
    try{
      // initialize the connection
			const db = await this._sqlite.createConnection('martis', false, 'no-encryption', 1);

			// open db testNew
			await db.open();

      //query for assets
      let ret = await db.query(`SELECT id as AssetID, GPSLatitude, GPSLongitude FROM asset`);

      this.coords = ret.values;
      //check query
			if (ret.values.length === 0) {
				return Promise.reject(new Error('Query for assets failed'));
			}
      console.log('#### Assets loaded');

      // Close Connection MyDB
			await this._sqlite.closeConnection('martis');

			return Promise.resolve();
    }
    catch(err){
      // Close Connection Martis
			if (this._sqlite.sqlite.isConnection('martis')) {
				await this._sqlite.closeConnection('martis');
			}

			this.showAlert({head:'Error' , msg:err.message});
			return Promise.reject(err);
    }
  }
  loadMapForAsset(asset) {

    const obj = this.coords.find(element => element.AssetID == asset);
    this.latitude = obj.GPSLatitude;
    this.longitude = obj.GPSLongitude;

		let latLng = new google.maps.LatLng(obj.GPSLatitude, obj.GPSLongitude);
		let mapOptions = {
			center: latLng,
			zoom: 10,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
		this.map.addListener('dragend', () => {
      this.latitude = this.map.center.lat();
      this.longitude = this.map.center.lng();
		});
	}

  ngOnDestroy(){
    if(this.assetLocSub){
      this.assetLocSub.unsubscribe();
    }
  }
}