import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController, Platform } from '@ionic/angular';
import { SetresultGroundsService } from '../services/setresult-grounds.service';
import { CreateReportEmpidService } from 'src/app/services/create-report-empid.service';
import { ActivatedRoute } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';
import { DatePipe } from '@angular/common';
import { delay, throwIfEmpty } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';

@Component({
	selector: 'app-grounds-test',
	templateUrl: './grounds-test.page.html',
	styleUrls: [ './grounds-test.page.scss' ]
})
export class GroundsTestPage implements OnInit {
	opost = new Posts();

	assetid: String;
	testid: String;
	desktop: boolean;
	EmpID: string;

	assets = [];

	SetResultSub: Subscription;
	GetLatestTest: Subscription;
	GetAssetSub: Subscription;
	GetEmpID: Subscription;

	//scheduled or out of schedule
	nonScheduleTest: boolean = false;

	//logging
	log: string = '';

	createTestForm = this.formBuilder.group({
		AssetID: [ '', [ Validators.required, Validators.pattern('^A[0-9]{3}'), Validators.maxLength(4) ] ],
		TestID: [ '', [ Validators.required, Validators.pattern('^T[0-9]{3}'), Validators.maxLength(4) ] ],
		comments: [ '' ],
		Result: [ '', [ Validators.required ] ],
		DateCompleted: [ '', [ Validators.required ] ],
		InspectorID: [ Validators.required ]
	});

	constructor(
		private formBuilder: FormBuilder,
		private setresult: SetresultGroundsService,
		private createReport: CreateReportEmpidService,
		private alertCtrl: AlertController,
		public route: ActivatedRoute,
		private plt: Platform,
		private _sqlite: SqliteService,
		private datePipe: DatePipe,
		private appcomp: AppComponent
	) {}

	get assetID() {
		return this.createTestForm.get('AssetID');
	}
	get testID() {
		return this.createTestForm.get('TestID');
	}
	get comment() {
		return this.createTestForm.get('comments');
	}
	get result() {
		return this.createTestForm.get('Result');
	}
	get date() {
		return this.createTestForm.get('DateCompleted');
	}

	ngOnInit() {
		this.GetAssetSub = this.createReport.getAssets().subscribe((data) => {
			this.assets = Array.of(data.data);
		});
		this.GetEmpID = this.appcomp.UserIDsub.subscribe((data) => {
			this.EmpID = data;
		});
		if (this.route.snapshot.params.testid) {
			this.testid = this.route.snapshot.params.testid;
			this.assetid = this.route.snapshot.params.assetid;
		}
		if (this.plt.is('mobile') || this.plt.is('android') || this.plt.is('ios')) {
			this.desktop = false;
		} else if (this.plt.is('desktop')) {
			this.desktop = true;
		}
		if (this.testid == null) {
			this.getLatestTestIncrement();
		}
	}

	async onSave() {
		this.opost = this.createTestForm.value;
		this.opost.DateCompleted = this.datePipe.transform(this.opost.DateCompleted, 'yyyy-MM-dd HH:mm:ss');
		this.opost.TestModID = 'TM101';
		console.log('Page Saved', this.opost);
		if (this.desktop) {
			if (this.nonScheduleTest == false) {
				this.SetResultSub = this.setresult.patch(this.opost).subscribe((data) => {
					console.log('Post method success?: ', data);
					if (data) {
						this.showAlert(true);
					} else {
						this.showAlert(false);
					}
				});
			} else if (this.nonScheduleTest == true) {
				this.opost.DateIssued = this.opost.DateCompleted;
				this.opost.SupervisorID = this.opost.InspectorID;
				this.opost.comments = this.opost.comments + '(OSS)';
				console.log('Page Saved', this.opost);
				const data1 = await this.setresult.post(this.opost).toPromise();
				console.log(data1);
				this.SetResultSub = this.setresult.patch(this.opost).subscribe((data) => {
					console.log('Post method 2 success?: ', data);
					if (data) {
						this.showAlert(true);
					} else {
						this.showAlert(false);
					}
				});
			}
		} else {
			try {
				//connect
				const db = await this._sqlite.createConnection('martis', false, 'no-encryption', 1);
				this.log += 'connected // '; //+ JSON.stringify(this.opost);
				//open
				await db.open();

				//insert
				//	>>Out of Schedule testing
				console.log('>>>OSS value: ' + this.nonScheduleTest);

				if (this.nonScheduleTest) {
					console.log('Page Saved', this.opost);
					try {
						//create a new test in DB
						let sqlcmd: string = `INSERT INTO test (id, DateIssued, AssetID, InspectorID, SupervisorID, Frequency, TestModID, Priority, last_modified) VALUES (?,?,?,?,?,?,?,?, (strftime('%s', 'now')))`;
						var p = this.opost;
						let postableChanges = [
							p.TestID,
							this.date.value,
							p.AssetID,
							p.InspectorID,
							p.InspectorID,
							0,
							p.TestModID,
							0
						];
						let ret: any = await db.run(sqlcmd, postableChanges);
						this.log += 'insertion run for OSS: ' + ret.changes.changes;

						//check insertion
						if (ret.changes.changes === 0) {
							return Promise.reject(new Error('Execution failed'));
						}
						console.log('OSS insertion complete.');
					} catch (e) {
						// Close Connection Martis
						await this._sqlite.closeConnection('martis');
						await this.showAlert(false);
						return;
					}
				}
				let sqlcmd: string = `UPDATE test SET Result = ?, DateCompleted = ?, comments = ?, last_modified = (strftime('%s', 'now')) WHERE id = ?`;
				var p = this.opost;
				this.log += ' // dC: ' + this.date.value + ' ';
				let postableChanges = [ p.Result, this.date.value, p.comments, p.TestID ];
				let ret: any = await db.run(sqlcmd, postableChanges);
				this.log += 'query run // ' + ret.changes.changes;
				//check update
				if (ret.changes.changes === 0) {
					return Promise.reject(new Error('Execution failed'));
				}
				this.log += ' // query updates //';
				// Close Connection Martis
				await this._sqlite.closeConnection('martis');
				await this.showAlert(true);
				return Promise.resolve();
			} catch (err) {
				// Close Connection Martis
				await this._sqlite.closeConnection('martis');
				await this.showAlert(false, err.message);
			}
		}
	}
	async showAlert(val, msg?, reset?: boolean) {
		await this.alertCtrl
			.create({
				header: 'Result',
				message: val ? 'Test info added Successfully' : 'Error: ' + msg,
				buttons: [
					{
						text: 'OK',
						handler: () => {
							if (!reset) {
								this.createTestForm.reset();
								this.getLatestTestIncrement();
							}
						}
					}
				]
			})
			.then((res) => res.present());
	}

	async getLatestTestIncrement() {
		if (!this.desktop) {
			try {
				//connect
				const db = await this._sqlite.createConnection('martis', false, 'no-encryption', 1);

				//open
				await db.open();

				//query
				let sqlcmd: string = 'SELECT id FROM test ORDER BY id DESC limit 1;';
				let ret: any = await db.query(sqlcmd);

				//check insert
				if (ret.values.length === 0) {
					return Promise.reject(new Error('Query failed'));
				}

				console.log('last asset: ' + ret.values[0].id);

				//disconnect
				await this._sqlite.closeConnection('martis');

				this.testid = ret.values[0].id;
				let num = parseInt(this.testid[1] + this.testid[2] + this.testid[3]) + 1;
				this.testid = this.testid[0] + num.toString();

				return Promise.resolve();
			} catch (err) {
				//disconnect martis
				if (this._sqlite.sqlite.isConnection('martis')) {
					await this._sqlite.closeConnection('martis');
				}
				return Promise.reject();
			}
		} else {
			this.GetLatestTest = this.setresult.getLatestTest().subscribe((data) => {
				this.testid = data.data[0].TestID;
				let num = parseInt(this.testid[1] + this.testid[2] + this.testid[3]) + 1;
				this.testid = this.testid[0] + num.toString();
				console.log(this.testid);
			});
		}
	}

	ngOnDestroy(): void {
		if (this.GetAssetSub) {
			this.GetAssetSub.unsubscribe();
		}
		if (this.GetLatestTest) {
			this.GetLatestTest.unsubscribe();
		}
		if (this.SetResultSub) {
			this.SetResultSub.unsubscribe();
		}
		if (this.GetEmpID) {
			this.GetEmpID.unsubscribe();
		}
	}
	unschedule() {
		this.nonScheduleTest = true;
	}
	schedule() {
		this.nonScheduleTest = false;
	}
}

export class Posts {
	AssetID: string;
	DateIssued: string;
	TestID: string;
	InspectorID: string;
	TestModID: string;
	SupervisorID: string;
	DateCompleted: string;
	comments: string;
	Result: string;
}
