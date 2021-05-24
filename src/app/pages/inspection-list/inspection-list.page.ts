import { Component, OnInit } from "@angular/core";
import { AlertController, LoadingController, Platform } from "@ionic/angular";
import { SegmentChangeEventDetail } from "@ionic/core";
import { inspectionListService } from "src/app/services/inspection-list.service";
import { SqliteService } from "src/app/services/sqlite.service";
import { Geolocation } from "@capacitor/geolocation";

import { AppComponent } from "src/app/app.component";

@Component({
  selector: "app-inspection-list",
  templateUrl: "./inspection-list.page.html",
  styleUrls: ["./inspection-list.page.scss"],
})
export class InspectionListPage implements OnInit {
<<<<<<< HEAD
  constructor(
    private _inspectionListService: inspectionListService,
    private _sqlite: SqliteService,
    private plt: Platform,
    private alertCtrl: AlertController,
    private loadingctrl: LoadingController,
    private appcomp: AppComponent
  ) {}

  lst: any = [];
  lest = [];
  desktop: boolean = true;
  empLocation: Coords;
  empId;
  empRole;

  ////
  log: string;
  ////

  filterOption = "priority";

  async ngOnInit() {
    this.appcomp.UserIDsub.subscribe((data) => {
      this.empId = data;
    });
    this.appcomp.UserRolesub.subscribe((data) => {
      this.empRole = data;
    });
    const showAlert = async (message: string) => {
      let msg = this.alertCtrl.create({
        header: "Error",
        message: message,
        buttons: ["OK"],
      });
      (await msg).present();
    };
    if (this.plt.is("mobile") || this.plt.is("android") || this.plt.is("ios")) {
      this.desktop = false;
      try {
        await this.fetchTest(true);
      } catch (err) {
        this.log += "\n " + err.message;
        await showAlert(err.message);
      }
    } else if (this.plt.is("desktop")) {
      this.loadingctrl
        .create({
          message: "Loading",
        })
        .then((loadingEl) => {
          loadingEl.present();
          setTimeout(() => {
            loadingEl.dismiss();
          }, 5000);
          if (this.empRole == "Manage") {
            this._inspectionListService
              .sortInspectionsByPriority()
              .subscribe((inspections) => {
                loadingEl.dismiss();
                this.lst = Array.of(inspections.data);
              });
          } else {
          }
        });
    }
  }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.empLocation = new Coords(
      coordinates.coords.latitude,
      coordinates.coords.longitude
    );
  }

  async onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    this.filterOption = event.detail.value;

    if (!this.desktop) {
      if (this.filterOption === "priority") {
        await this.fetchTest(true);
      } else {
        await this.getCurrentPosition();
        await this.fetchTest(false);
      }
      return;
    }

    if (this.filterOption === "priority") {
      this.loadingctrl
        .create({
          message: "Loading",
        })
        .then((loadingEl) => {
          loadingEl.present();
          setTimeout(() => {
            loadingEl.dismiss();
          }, 5000);
          this._inspectionListService
            .sortInspectionsByPriority()
            .subscribe((inspections) => {
              loadingEl.dismiss();
              this.lst = Array.of(inspections.data);
            });
        });
    } else {
      this.loadingctrl
        .create({
          message: "Loading",
        })
        .then((loadingEl) => {
          loadingEl.present();
          setTimeout(() => {
            loadingEl.dismiss();
          }, 5000);
          this._inspectionListService
            .sortInspectionsByDistance()
            .subscribe((inspections) => {
              if (inspections.data.length === 0) {
                console.log("There was an error");
              }
              loadingEl.dismiss();
              this.lst = Array.of(inspections.data);
              console.log(this.lst);
            });
        });
    }
  }

  async fetchTest(priority: boolean): Promise<void> {
    try {
      let nearByAssets = [];
      // initialize the connection
      const db = await this._sqlite.createConnection(
        "martis",
        false,
        "no-encryption",
        1
      );

      // open db martis
      await db.open();

      // select tests from db
      let ret = priority
        ? await db.query(
            `SELECT * from test where DateCompleted is NULL or DateCompleted = "0000-00-00 00:00:00" ORDER by Priority ASC`
          )
        : await db.query(`SELECT t.InspectorID, a.GPSLatitude, a.GPSLongitude, t.AssetID, t.id, t.TestModID
      from test t, asset a
      where t.AssetID = a.id
      AND t.InspectorID = 'EMP101'`);

      this.lest = ret.values;

      //sorting by distance
      if (!priority) {
        this.lest.forEach((e) => {
          let assetLoc = new Coords(e.GPSLatitude, e.GPSLongitude);
          this.log +=
            "\n assetloc: " +
            assetLoc.latitude +
            ", emploc: " +
            this.empLocation.latitude;
          const distance = Math.round(
            this._sqlite.haversine(assetLoc, this.empLocation)
          );
          if (distance) {
            nearByAssets.push({
              distance: distance,
              AssetID: e.AssetID,
              InspectorID: e.InspectorID,
              id: e.id,
              TestModID: e.TestModID,
            });
          }
        });

        this.lest = nearByAssets.sort((a, b) => a.distance - b.distance);
      }

      if (ret.values.length === 0) {
        return Promise.reject(new Error("getTests query failed"));
      }

      // Close Connection MyDB
      await this._sqlite.closeConnection("martis");

      return Promise.resolve();
    } catch (err) {
      // Close Connection MyDB
      await this._sqlite.closeConnection("martis");

      //error message
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
=======
	constructor(
		private _inspectionListService: inspectionListService,
		private _sqlite: SqliteService,
		private plt: Platform,
		private alertCtrl: AlertController,
		private loadingctrl: LoadingController
	) {}
	lst: any = [];
	lest = [];
	desktop: boolean = true;
	empLocation: Coords;

	////
	log: string;
	////

	filterOption = 'priority';
	async ngOnInit() {
		const showAlert = async (message: string) => {
			let msg = this.alertCtrl.create({
				header: 'Error',
				message: message,
				buttons: [ 'OK' ]
			});
			(await msg).present();
		};
		if (this.plt.is('mobile') || this.plt.is('android') || this.plt.is('ios')) {
			this.desktop = false;
			try {
				await this.fetchTest(true);
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
					this._inspectionListService.sortInspectionsByPriority().subscribe((inspections) => {
						loadingEl.dismiss();
						this.lst = Array.of(inspections.data);
					});
				});
		}
	}

	async getCurrentPosition() {
		const coordinates = await Geolocation.getCurrentPosition();
		this.empLocation = new Coords(coordinates.coords.latitude, coordinates.coords.longitude);
	}

	async onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
		this.filterOption = event.detail.value;
		if (!this.desktop) {
			if (this.filterOption === 'priority') {
				await this.fetchTest(true);
			} else {
				await this.getCurrentPosition();
				await this.fetchTest(false);
			}
			return;
		}
		if (this.filterOption === 'priority') {
			this.loadingctrl
				.create({
					message: 'Loading'
				})
				.then((loadingEl) => {
					loadingEl.present();
					setTimeout(() => {
						loadingEl.dismiss();
					}, 5000);
					this._inspectionListService.sortInspectionsByPriority().subscribe((inspections) => {
						loadingEl.dismiss();
						this.lst = Array.of(inspections.data);
					});
				});
		} else {
			this.loadingctrl
				.create({
					message: 'Loading'
				})
				.then((loadingEl) => {
					loadingEl.present();
					setTimeout(() => {
						loadingEl.dismiss();
					}, 5000);
					this._inspectionListService.sortInspectionsByDistance().subscribe((inspections) => {
						if (inspections.data.length === 0) {
							console.log('There was an error');
						}
						loadingEl.dismiss();
						this.lst = Array.of(inspections.data);
						console.log(this.lst);
					});
				});
		}
	}

	async fetchTest(priority: boolean): Promise<void> {
		try {
			let nearByAssets = [];

			// initialize the connection
			const db = await this._sqlite.createConnection('martis', false, 'no-encryption', 1);

			// open db martis
			await db.open();

			// select tests from db
			let ret = priority
				? await db.query(
						`SELECT * from test where DateCompleted is NULL or DateCompleted = "0000-00-00 00:00:00" ORDER by Priority ASC`
					)
				: await db.query(`SELECT t.InspectorID, a.GPSLatitude, a.GPSLongitude, t.AssetID, t.id, t.TestModID
      from test t, asset a
      where t.AssetID = a.id
      AND t.InspectorID = 'EMP101'`);
			this.lest = ret.values;

			//sorting by distance
			if (!priority) {
				this.lest.forEach((e) => {
					let assetLoc = new Coords(e.GPSLatitude, e.GPSLongitude);
					this.log += '\n assetloc: ' + assetLoc.latitude + ', emploc: ' + this.empLocation.latitude;
					const distance = Math.round(this._sqlite.haversine(assetLoc, this.empLocation));
					if (distance) {
						nearByAssets.push({
							distance: distance,
							AssetID: e.AssetID,
							InspectorID: e.InspectorID,
							id: e.id,
							TestModID: e.TestModID
						});
					}
				});
				this.lest = nearByAssets.sort((a, b) => a.distance - b.distance);
			}

			if (ret.values.length === 0) {
				return Promise.reject(new Error('getTests query failed'));
			}

			// Close Connection MyDB
			await this._sqlite.closeConnection('martis');
			return Promise.resolve();
		} catch (err) {
			// Close Connection MyDB
			await this._sqlite.closeConnection('martis');

			//error message
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
>>>>>>> b51908667ad13e5a2164fd3dd5441a86b1f6c89f
}
