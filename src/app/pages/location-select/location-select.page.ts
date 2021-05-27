import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController, NavController } from '@ionic/angular';
import { MapLocationService } from 'src/app/services/map-location.service';


declare var google;

@Component({
  selector: 'app-location-select',
  templateUrl: './location-select.page.html',
  styleUrls: ['./location-select.page.scss'],
})
export class LocationSelectPage implements OnInit {


  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;

  latitude: number;
  longitude: number;

  constructor(
    //private geolocation: Geolocation,
    private navCtrl : NavController,
    private mapLocation: MapLocationService
    ) {}

  ngOnInit() {
    this.loadMap();
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
      console.log('Error getting location', error);
    });
  }

  setLocation(){
    this.mapLocation.setMapLocation(this.latitude, this.longitude);
    this.navCtrl.back();
  }

  back(){
    this.navCtrl.back();
  }

}