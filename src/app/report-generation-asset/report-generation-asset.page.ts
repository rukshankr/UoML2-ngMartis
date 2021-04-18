import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FileSharer } from '@byteowls/capacitor-filesharer';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController, Platform } from '@ionic/angular';

import { CreateReportEmpidService } from 'src/app/services/create-report-empid.service';
import { DatePipe } from '@angular/common';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
	selector: 'app-report-generation-asset',
	templateUrl: './report-generation-asset.page.html',
	styleUrls: [ './report-generation-asset.page.scss' ]
})
export class ReportGenerationAssetPage implements OnInit {
	opost = new Aposts();
	desktop: boolean = true;
	log: string = '';

	createReportForm = this.formBuilder.group({
		assetID: [
			'',
			[ Validators.required, Validators.pattern('^A[0-9]{3}'), Validators.maxLength(6), Validators.minLength(6) ]
		],
		initialDate: [ '' ],
		finalDate: [ '' ]
	});

	constructor(
		private formBuilder: FormBuilder,
		private createReport: CreateReportEmpidService,
		private _sqlite: SqliteService,
		private alertCtrl: AlertController,
		private datePipe: DatePipe,
		private http: HttpClient,
		private plt: Platform
	) {}

	lst: any = [];
	assets = [];
	users: any = [];

	async onSave() {
		this.opost = this.createReportForm.value;
		if (this.desktop) {
			this.opost.initialDate = this.datePipe
				.transform(this.opost.initialDate, 'yyyy-MM-dd HH:mm:ss', 'utc')
				.toString();
			this.opost.finalDate = this.datePipe
				.transform(this.opost.finalDate, 'yyyy-MM-dd HH:mm:ss', 'utc')
				.toString();

			console.log('Page Saved', this.opost);

			this.createReport.getAssetReport(this.opost).subscribe((data) => {
				console.log('Post method success?: ', data);
				if (data) {
					this.lst = data;
					this.lst = Array.of(this.lst.data);
					this.showAlert(true);
				} else {
					this.showAlert(false);
				}
			});
		}
	}
	async showAlert(val, Message?) {
		await this.alertCtrl
			.create({
				header: 'Result',
				message: val ? 'Report retrieved   Successfully' : 'Error: ' + Message,
				buttons: [
					{
						text: 'OK',
						handler: () => {
							this.createReportForm.reset();
						}
					}
				]
			})
			.then((res) => res.present());
	}
	async ngOnInit() {
		if (this.plt.is('mobile') || this.plt.is('android') || this.plt.is('ios')) {
			this.desktop = false;
			await this.getEmpsAssets();
		} else if (this.plt.is('desktop')) {
			this.desktop = true;
			this.createReport.getAssets().subscribe((data) => {
				this.assets = Array.of(data.data);
			});
		}
	}

	async getEmpsAssets() {
		try {
			// initialize the connection
			const db = await this._sqlite.createConnection('martis', false, 'no-encryption', 1);
			this.log += '\ndb connected ' + db;

			// open db testNew
			await db.open();
			this.log += '\ndb opened';

			// select all assets in db
			let ret = await db.query("SELECT id as 'UserID', Name FROM user;");
			this.users = ret.values;

			if (ret.values.length === 0) {
				return Promise.reject(new Error('Query 2 emps failed'));
			}
			this.log += '\nquery done.';

			// Close Connection martis
			await this._sqlite.closeConnection('martis');

			return Promise.resolve();
		} catch (err) {
			// Close Connection martis
			await this._sqlite.closeConnection('martis');
			//error message
			await this.showAlert(false, err.message);
			return Promise.reject(err);
		}
	}
}
export class Aposts {
	initialDate: string;
	finalDate: string;
	assetID: string;
}
