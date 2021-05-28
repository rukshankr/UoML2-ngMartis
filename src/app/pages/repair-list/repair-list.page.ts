import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Repair } from 'src/app/services/database.service';
import { RepairListService } from 'src/app/services/repair-list.service';

import { Geolocation } from '@capacitor/geolocation';
import { DatePipe } from '@angular/common';
@Component({
	selector: 'app-repair-list',
	templateUrl: './repair-list.page.html',
	styleUrls: [ './repair-list.page.scss' ]
})
export class RepairListPage implements OnInit {
	repairs = [];
	log: string = '';
	platform: string;
	handlerPermissions: any;
	initPlugin: boolean = false;

	constructor(
		private _RepairListService: RepairListService,
		private plt: Platform,
		private _sqlite: SqliteService,
		public datePipe: DatePipe,
		private alertCtrl: AlertController,
		private loadingctrl: LoadingController
	) {}

	lst: any = [];
	lest: Repair[] = [];
	desktop: boolean = true;
	empLocation: Coords;

	doRefresh(event) {
		this.ngOnInit();
		setTimeout(() => {
			event.target.complete();
		}, 2000);
	}

	async ngOnInit() {
		const showAlert = async (message: string) => {
			let msg = this.alertCtrl.create({
				header: 'Error',
				message: message,
				buttons: [ 'OK' ]
			});
			(await msg).present();
		};

		const coordinates = await Geolocation.getCurrentPosition();
		this.empLocation = new Coords(coordinates.coords.latitude, coordinates.coords.longitude);

		if (this.plt.is('mobile') || this.plt.is('android') || this.plt.is('ios')) {
			this.desktop = false;
			try {
				await this.getList();
			} catch (err) {
				this.log += '\n ' + err.message;
				await showAlert(err.message);
			}
		} else if (this.plt.is('desktop')) {
			this.loadingctrl
				.create({
					message: 'Loading'
				})
				.then((loadingEl) => {
					loadingEl.present();
					setTimeout(() => {
						loadingEl.dismiss();
					}, 5000);
					this._RepairListService
						.sortRepairsByDistance(this.empLocation.latitude, this.empLocation.longitude)
						.subscribe((data) => {
							this.lst = data;
							this.lst = Array.of(this.lst.data);
							console.log(this.lst);
							loadingEl.dismiss();
						});
				});
		}
	}

	async getList(): Promise<void> {
		try {
			let nearByAssets = [];
			// initialize the connection
			const db = await this._sqlite.createConnection('martis', false, 'no-encryption', 1);
			this.log += '\ndb connected ' + db;

			// open db testNew
			await db.open();

			// select all assets in db
			let ret = await db.query(
				`SELECT repair.id, repair.CreatedDate, repair.CompletedDate, repair.comments, repair.EngineerID, asset.GPSLatitude, asset.GPSLongitude 
			FROM repair, asset 
			WHERE repair.id = asset.id 
			AND (repair.CompletedDate is NULL OR  repair.CompletedDate = "0000-00-00 00:00:00")`
			);

			if (ret.values.length === 0) {
				return Promise.reject(new Error('Query 2 repair failed'));
			}

			this.repairs = ret.values;

			// Close Connection MartisDB
			await this._sqlite.closeConnection('martis');

			this.repairs.forEach((e) => {
				let assetLoc = new Coords(e.GPSLatitude, e.GPSLongitude);
				const distance = Math.round(this._sqlite.haversine(this.empLocation, assetLoc));
				if (distance) {
					nearByAssets.push({
						distance: distance,
						AssetID: e.id,
						CreatedDate: e.CreatedDate,
						CompletedDate: e.CompletedDate,
						comments: e.comments,
						EngineerID: e.EngineerID
					});
				}
			});

			this.repairs = nearByAssets.sort((a, b) => a.distance - b.distance);

			return Promise.resolve();
		} catch (err) {
			// Close Connection MartisDB
			await this._sqlite.closeConnection('martis');

			return Promise.reject(err);
		}
	}
}
export class Coords {
	latitude: number;
	longitude: number;

	constructor(lat?: number, long?: number) {
		this.latitude = lat;
		this.longitude = long;
	}
}
