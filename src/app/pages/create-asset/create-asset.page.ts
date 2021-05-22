import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AssetService } from 'src/app/services/asset-service.service';
import { AlertController, Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { SqliteService } from 'src/app/services/sqlite.service';
import { CapacitorException } from '@capacitor/core';

@Component({
	selector: 'app-create-asset',
	templateUrl: './create-asset.page.html',
	styleUrls: [ './create-asset.page.scss' ]
})
export class CreateAssetPage implements OnInit {
	opost = new Posts();
	sendToMain: boolean = true;
	log: string = '';
	assetid: string;

	//platform check
	desktop: boolean = true;

	get assetID() {
		return this.createAssetForm.get('AssetID');
	}
	get gpsLat() {
		return this.createAssetForm.get('GPSLatitude');
	}
	get gpsLong() {
		return this.createAssetForm.get('GPSLongitude');
	}

	public errorMessage = {
		assetID: [
			{ type: 'required', message: 'Asset ID is required' },
			{ type: 'maxlength', message: "Can't be longer than 4 characters" },
			{ type: 'pattern', message: 'Should follow the pattern of A000' }
		],
		gps: [ { type: 'pattern', message: 'Please enter a valid number only' } ]
	};

	createAssetForm = this.formBuilder.group({
		AssetID: [ '', [ Validators.required, Validators.pattern('^A[0-9]{3}'), Validators.maxLength(4) ] ],
		AssetType: [ '' ],
		Status: 'Functions',
		NearestMilePost: [ '', [ Validators.pattern('^MP[0-9]{3}'), Validators.maxLength(5) ] ],
		Division: [ '' ],
		SubDivision: [ '' ],
		Region: [ '' ],
		GPSLongitude: [ '', [ Validators.pattern('^[-]*[0-9]+.?[0-9]*') ] ],
		GPSLatitude: [ '', [ Validators.pattern('^[-]*[0-9]+.?[0-9]*') ] ],
		LastTestedDate: null
	});

	constructor(
		private formBuilder: FormBuilder,
		private assetService: AssetService,
		private _sqlite: SqliteService,
		private alertCtrl: AlertController,
		private plt: Platform
	) {}

	ngOnInit() {
		if (this.plt.is('mobile') || this.plt.is('android') || this.plt.is('ios')) {
			this.desktop = false;
		} else if (this.plt.is('desktop')) {
			this.desktop = true;
			this.assetService.getLatestAsset().subscribe((data) => {
				this.assetid = data.data[0].AssetID;
				let num = parseInt(this.assetid[1] + this.assetid[2] + this.assetid[3]) + 1;
				this.assetid = this.assetid[0] + num.toString();
				console.log(this.assetid);
			});
		}
	}

	async onSave() {
		if (!this.desktop) {
			try {
				//connect
				const db = await this._sqlite.createConnection('martis', false, 'no-encryption', 1);
				this.log += '\ndb connected ' + db;
				//open
				await db.open();
				this.log += '\ndb opened.\n';
				//insert
				let sqlcmd: string =
					"INSERT INTO asset (id, AssetType, Status, GPSLatitude, GPSLongitude, Region, Division, SubDivision, NearestMilePost, LastTestedDate, last_modified) VALUES (?,?,?,?,?,?,?,?,?,?, (strftime('%s', 'now')))";
				this.opost = this.createAssetForm.value;
				var p = this.opost;
				let postableChanges = [
					p.AssetID,
					p.AssetType,
					p.Status,
					p.GPSLatitude,
					p.GPSLongitude,
					p.Region,
					p.Division,
					p.SubDivision,
					p.NearestMilePost,
					`CURRENT_TIMESTAMP`
					//p.LastTestedDate,
				];
				let ret: any = await db.run(sqlcmd, postableChanges);
				this.log += ' // changes: ' + ret.changes.changes;
				//check insert
				if (ret.changes.changes === 0) {
					return Promise.reject(new CapacitorException('Execution failed'));
				}

				//disconnect
				await this._sqlite.closeConnection('martis');
				await this.showAlert('asset added.');
				return Promise.resolve();
			} catch (err) {
				//disconnect
				await this._sqlite.closeConnection('martis');
				await this.showAlert(err.message);
			}
		} else {
			console.log('platform-desktop: ' + this.desktop);
			this.opost = this.createAssetForm.value;
			console.log('Page Saved', this.opost);
			this.assetService.post(this.opost).subscribe((data) => {
				console.log('Post method success?: ', data);
				if (data !== 'Error') {
					this.showAlert(true);
				} else {
					this.showAlert(false);
				}
			});
		}
	}

	async showAlert(val) {
		await this.alertCtrl
			.create({
				header: 'Result',
				message: val ? 'Asset added Sucessfully' : 'Error',
				buttons: [
					{
						text: 'OK',
						handler: () => {
							this.createAssetForm.reset();
						}
					}
				]
			})
			.then((res) => res.present());
	}

	async getCurrentPosition() {
		const coordinates = await Geolocation.getCurrentPosition();
		this.createAssetForm['GPSLatitude'] = coordinates.coords.latitude;
		this.createAssetForm['GPSLongitude'] = coordinates.coords.longitude;
	}
}

export class Posts {
	AssetID: string;
	AssetType: string;
	Status: string;
	NearestMilePost: string;
	Division: string;
	SubDivision: string;
	Region: string;
	GPSLongitude: string;
	GPSLatitude: string;
	LastTestedDate: null;
}
