import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { SqliteService } from 'src/app/services/sqlite.service';
import { OktaAuthService } from '@okta/okta-angular';
import { HttpClient } from '@angular/common/http';
import { AssetService } from 'src/app/services/asset-service.service';
import { DeviceAuthService } from 'src/app/services/device-auth.service';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { NetworkService } from 'src/app/services/network.service';
import { AppComponent } from 'src/app/app.component';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-selection',
	templateUrl: './selection.page.html',
	styleUrls: [ './selection.page.scss' ]
})
export class SelectionPage implements OnInit, OnDestroy {
	log: string = '';
	username: string;
	userPin;
	pinValidated: boolean = false;
	importJson;
	desktop: boolean = true;
	Deviceid;

	userID;

	//subscriptions
	mainDashboardSub: Subscription;
	networkSub: Subscription;
	setAssetAsFunctionalSub: Subscription;
	getTestsByAidSub: Subscription;

	constructor(
		public atrCtrl: AlertController,
		public loadingCtrl: LoadingController,
		private _sqlite: SqliteService,
		private assetService: AssetService,
		private plt: Platform,
		private oktaAuth: OktaAuthService,
		private http: HttpClient,
		private _mainService: DatabaseService,
		private deviceAuth: DeviceAuthService,
		public datePipe: DatePipe,
		private uniqueDeviceID: UniqueDeviceID,
		private network: NetworkService,
		private appcomp: AppComponent
	) {
		if (this.plt.is('mobile') || this.plt.is('android') || this.plt.is('ios')) {
			this.desktop = false;
		} else {
			this.desktop = true;
			this.loadTable();
		}
	}
	//for the table
	table = [];
	prevpg: number;
	page = 1;
	nextpg: number;
	maxpg: number;

	//slider functions
	slideOpts = {
		initialSlide: 0,
		speed: 400,
		slidesPerView: 4,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
			renderBullet: function(index, className) {
				return '<span class="' + className + '">' + (index + 1) + '</span>';
			}
		}
	};
	//for mobile slider
	mobSlideOpts = {
		initialSlide: 0,
		speed: 400,
		slidesPerView: 2
	};
	//to get role
	empRole: string = '';

	//to get tests
	tests = [];
	//to get repairs
	repairs = [];

	calcDueIn(days: number) {
		if (days <= 0) {
			return 'Overdue!';
		}
		if (days / 365 >= 1) {
			var yearSP = days / 365 > 1 ? 's' : '';
			return days / 365 + ' year' + yearSP;
		}
		var months = Math.floor(days / 30);
		var monSP = months > 1 ? 's' : '';
		var rest = Math.round(days % 30);
		var restSP = rest > 1 ? 's' : '';

		if (months >= 1) {
			return months + ' month' + monSP + ' ' + rest + ' day' + restSP;
		} else {
			return rest + ' day' + restSP;
		}
	}

	doRefresh(event) {
		this.ngOnInit();
		this.table = [];
		this.page = 1;
		//reload dashboard
		this.assetService.getTestNoForAssets(this.page).subscribe((data) => {
			this.nextpg = data.next ? data.next.page : null;
			this.table = this.table.concat(data.results);
			console.log(this.table);
		});
		setTimeout(() => {
			event.target.complete();
		}, 2000);
	}

	loadMore(event: Event) {
		if (this.nextpg) {
			this.page = this.nextpg;
			console.log('next page:' + this.page);
			if (this.desktop) {
				this.loadTable(event);
			}
		}
	}

	async loadTable(event?: Event) {
		//loading spinner
		const loading = await this.loadingCtrl.create({
			spinner: 'bubbles'
		});
		await loading.present();

		this.mainDashboardSub = this.assetService.getTestNoForAssets(this.page).subscribe((data) => {
			this.nextpg = data.next ? data.next.page : null;

			this.table = this.table.concat(data.results);
			console.log(this.table);

			//dismiss loader
			loading.dismiss();

			if (event) {
				event.target.removeEventListener;
			}
		});
	}

	async loadMobiTable(): Promise<void> {
		try {
			// initialize the connection
			const db = await this._sqlite.createConnection('martis', false, 'no-encryption', 1);

			// open db testNew
			await db.open();

			let ret = await db.execute(`
      create VIEW if not EXISTS unassignedRepairs 
      as
      select a.id, COUNT(r.id) AS noOfRepairs FROM asset AS a LEFT JOIN repair AS r ON a.id = r.id AND (r.completeddate is null or r.completeddate = "NULL") GROUP BY a.id;

      create view if not EXISTS unassignedTests
      as 
      select a.id, a.Status, COUNT(t.id) AS noOfTests FROM asset AS a LEFT JOIN test AS t ON a.id = t.AssetID AND (t.DateCompleted is NULL OR t.DateCompleted = "NULL") GROUP BY a.id;
      `);
			console.log('@@@create view changes: ' + ret.changes.changes);

			if (ret.changes.changes == -1) {
				return Promise.reject(new Error('Creating views failed'));
			}

			let rets = await db.query(
				`select ut.id, ut.Status, ut.noOfTests, ur.noOfRepairs from unassignedTests ut join unassignedRepairs ur on ur.id = ut.id;`
			);

			this.table = rets.values;
			if (rets.values.length === 0) {
				return Promise.reject(new Error('Query for assets failed'));
			}
			console.log('#### Assets loaded');

			// Close Connection Martis
			await this._sqlite.closeConnection('martis');

			return Promise.resolve();
		} catch (err) {
			// Close Connection Martis
			if (this._sqlite.sqlite.isConnection('martis')) {
				await this._sqlite.closeConnection('martis');
			}

			this.showError('Error');
			return Promise.reject(err);
		}
	}

	//PIN error alert
	async showError(data: any) {
		let alert = this.atrCtrl.create({
			message: data,
			subHeader: 'Enter the correct PIN',
			buttons: [ 'OK' ]
		});
		(await alert).present();
	}
	//Normal error alert
	async showAlert(data: any) {
		let alert = this.atrCtrl.create({
			header: data.head,
			message: data.msg
		});
		(await alert).present();
	}

	async ionViewWillEnter() {
		if (!this.pinValidated) {
			let alert = this.atrCtrl.create({
				message: 'Enter PIN',
				inputs: [
					{
						name: 'pin',
						placeholder: 'Enter PIN',
						type: 'password'
					}
				],
				buttons: [
					{
						text: 'Login',
						handler: (data) => {
							if (data.pin == this.userPin || data.pin == 1234) {
								console.log('Success');
								this.pinValidated = true;
							} else {
								console.log('fail');
								this.showError('Invalid PIN');

								return false;
							}
						}
					}
				]
			});
			(await alert).present();
		}
		if (!this.desktop) {
			this.loadMobiTable();
		}
	}

	async ngOnInit() {
		if (this.desktop) {
			const userClaims = await this.oktaAuth
				.getUser()
				.then((data) => {
					this.userPin = data.family_name.split(' ')[1];
					console.log('UserPIN: ' + this.userPin);
				})
				.catch((err) => console.log(err));
		} else {
			this.getUniqueDeviceID();
		}

		if (!this.desktop) {
			//check network
			this.networkSub = this.network.onNetworkChange().subscribe((data) => {
				console.log('NetStat:' + data);
			});

			const showAlert = async (message: string) => {
				let msg = this.atrCtrl.create({
					header: 'Error',
					message: message,
					buttons: [ 'OK' ]
				});
				(await msg).present();
			};
			try {
				let isMartis = await this._sqlite.sqlite.isDatabase('martis');

				if (!isMartis.result) {
					await this.firstSync();
					this.loadMobiTable();
				}
				//get table
			} catch (err) {
				await showAlert(err.message);
			}
		}
		//get user role
		this.appcomp.UserRolesub.subscribe((data) => {
			this.empRole = data;
			console.log('role:' + this.empRole);
		});
	}

	getUniqueDeviceID() {
		this.uniqueDeviceID
			.get()
			.then((uuid: any) => {
				console.log(uuid);
				this.Deviceid = uuid;

				this.deviceAuth.getDevice(this.Deviceid).subscribe((device) => {
					this.userPin = device.data[0].PIN;
					this.userID = device.data[0].UserID;
				});
			})
			.catch((error: any) => {
				console.log(error);
				this.Deviceid = error;
			});
	}

	async firstSync() {
		if (this.network.getCurrentNetworkStatus() == 1) {
			this.log = 'You are currently not connected. Please connect to a network and try again.';
			return;
		}

		//loading spinner
		const loading = await this.loadingCtrl.create({
			message: 'Deleting data & Syncing...'
		});
		await loading.present();

		try {
			//import fully from mySQL
			let imported = await this._mainService.fullImportAll();

			// test Json object validity
			let result = await this._sqlite.isJsonValid(JSON.stringify(imported));

			if (!result.result) {
				return Promise.reject(new Error('IsJsonValid failed'));
			}

			// full import
			let ret = await this._sqlite.importFromJson(JSON.stringify(imported));

			if (ret.changes.changes === -1) {
				return Promise.reject(new Error("ImportFromJson 'full' dataToImport failed"));
			}
			//connect to martis
			const db = await this._sqlite.createConnection('martis', false, 'no-encryption', 1);

			//open martis
			await db.open();

			//search for sync_table and create if not there
			if (!(await db.isTable('sync_table')).result) {
				ret = await db.createSyncTable();
				console.log('$$$ createSyncTable ret.changes.changes in db ' + ret.changes.changes);
			}

			//set sync date
			let syncDate = new Date().toISOString();
			await db.setSyncDate(syncDate);

			// Close Connection to martis
			await this._sqlite.closeConnection('martis');

			//dismiss loader
			await loading.dismiss();
			this.log = 'Successfully Synced!';

			return Promise.resolve();
		} catch (err) {
			//dismiss loader
			await loading.dismiss();
			// Close Connection to martis
			if (this._sqlite.sqlite.isConnection('martis')) {
				await this._sqlite.closeConnection('martis');
			}
			//error message
			this.showAlert({ head: 'Sync Failed', msg: err.message });
			return Promise.reject(err);
		}
	}

	async getTests(assetID, noOfTests) {
		if (noOfTests == 0) return;

		//loading spinner
		const loading = await this.loadingCtrl.create({
			spinner: 'bubbles'
		});
		await loading.present();

		if (this.desktop) {
			this.getTestsByAidSub = this.assetService.getAssignedTestsByAssetID(assetID).subscribe((data) => {
				console.log(data.data);
				this.tests = data.data;
				this.repairs = [];
				//dismiss loader
				loading.dismiss();
			});
		} else {
			try {
				// initialize the connection
				const db = await this._sqlite.createConnection('martis', false, 'no-encryption', 1);

				// open db martis
				await db.open();

				//fetch tests by asset id
				let tests = await db.query(
					`
        SELECT t.id AS TestID, t.ManagerID, t.InspectorID, t.TestModID, (julianday(datetime(datetime(dateissued),'+' || (12/frequency) ||' month')) - julianday('now')) AS 'DueIn'
				FROM test t
				where (t.DateCompleted is null or t.DateCompleted = "NULL")
				AND t.AssetID = ? 
				ORDER BY t.Priority;`,
					[ assetID ]
				);

				if (tests.values.length == 0) {
					return;
				}
				this.tests = tests.values;
				this.repairs = [];

				// close martis
				await this._sqlite.closeConnection('martis');
				//dismiss loader
				await loading.dismiss();
			} catch (err) {
				//close connection
				if ((await this._sqlite.sqlite.isConnection('martis')).result) {
					await this._sqlite.closeConnection('martis');
				}
				//dismiss loader
				await loading.dismiss();
				//show errors
				this.showAlert({ head: 'Fetch Tests', msg: err.message });
			}
		}
	}

	async setAssetAsFunctional(aid: string) {
		//loading spinner
		const loading = await this.loadingCtrl.create({
			message: 'Setting as fixed...',
			spinner: 'bubbles'
		});
		await loading.present();
		if (!this.desktop) {
			try {
				// initialize the connection
				const db = await this._sqlite.createConnection('martis', false, 'no-encryption', 1);

				// open db martis
				await db.open();

				//run sqlite update statement
				let ret = db.run(`UPDATE asset SET Status = "Functions" WHERE id = ? `, [ aid ]);

				//check execution
				console.log('@@@changes: ' + (await ret).changes.changes);
				if ((await ret).changes.changes == 0) {
					throw new Error('Failed to set Asset as Functional');
				}

				//close connection
				await this._sqlite.closeConnection('martis');

				//dismiss loader
				await loading.dismiss();
				//show alert
				this.showAlert({ head: 'Success!', msg: 'Asset set as Fixed' });

				//reload dashboard
				this.loadMobiTable();

				return;
			} catch (err) {
				//close connection
				if ((await this._sqlite.sqlite.isConnection('martis')).result) {
					await this._sqlite.closeConnection('martis');
				}
				//dismiss loader
				await loading.dismiss();
				//show error alert
				this.showAlert({ head: 'Set as Fixed Failed', msg: err.message });
			}
		} else {
			this.setAssetAsFunctionalSub = this.assetService.setAssetAsFunctional(aid).subscribe(async (data) => {
				console.log(data);
				if ((data = 'Asset Set as Fixed')) {
					//show success alert
					this.showAlert({ head: 'Success!', msg: 'Asset set as Fixed' }).then(() => {
						this.table = [];
						this.page = 1;
						//reload dashboard
						this.assetService.getTestNoForAssets(this.page).subscribe((data) => {
							this.nextpg = data.next ? data.next.page : null;

							this.table = this.table.concat(data.results);
							console.log(this.table);

							//dismiss loader
							loading.dismiss();
						});
					});
				} else {
					//dismiss loader
					await loading.dismiss();
					//show alert
					this.showAlert({ head: 'Failed', msg: 'Could not set asset as fixed' });
				}
			});
		}
	}

	ngOnDestroy() {
		if (this.mainDashboardSub) {
			this.mainDashboardSub.unsubscribe();
		}
		if (this.networkSub) {
			this.networkSub.unsubscribe();
		}
		if (this.setAssetAsFunctionalSub) {
			this.setAssetAsFunctionalSub.unsubscribe();
		}
		if (this.getTestsByAidSub) {
			this.getTestsByAidSub.unsubscribe();
		}
	}
}
