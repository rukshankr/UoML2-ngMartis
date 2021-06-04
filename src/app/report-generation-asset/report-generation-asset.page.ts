import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController, Platform } from '@ionic/angular';
import { CreateReportEmpidService } from 'src/app/services/create-report-empid.service';
import { DatePipe } from '@angular/common';
import { SqliteService } from 'src/app/services/sqlite.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Subscription } from 'rxjs';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
	selector: 'app-report-generation-asset',
	templateUrl: './report-generation-asset.page.html',
	styleUrls: [ './report-generation-asset.page.scss' ]
})
export class ReportGenerationAssetPage implements OnInit {
	opost = new Aposts();
	desktop: boolean = true;
	log: string = '';
	pdfObj = null;
	photoPreview = null;
	logoData = null;

	GetReportSub: Subscription;
	GetAssetSub: Subscription;
	ReaderSub: Subscription;

	createReportForm = this.formBuilder.group({
		assetID: [
			'',
			[ Validators.required, Validators.pattern('^A[0-9]{3}'), Validators.maxLength(4), Validators.minLength(4) ]
		],
		initialDate: [ '', [ Validators.required ] ],
		finalDate: [ '', [ Validators.required ] ]
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
			this.GetReportSub = this.createReport.getAssetReport(this.opost).subscribe((data) => {
				console.log('Post method success?: ', data);
				if (data) {
					this.lst = data;
					this.lst = Array.of(this.lst.data);
					this.showAlert(true);
				} else {
					this.showAlert(false);
				}
			});
			this.loadLocalAssetToBase64();
		} else {
			try {
				//connect
				const db = await this._sqlite.createConnection('martis', false, 'no-encryption', 1);

				//open
				await db.open();

				this.log += 'martis opened // ';
				//search
				const sqlcmd: string = `SELECT a.Status,a.Region, t.Result,a.GPSLatitude, a.GPSLongitude, 
				t.id as 'TestID', t.InspectorID, t.DateCompleted, a.Division, a.SubDivision, a.NearestMilePost, 
				t.comments 
				FROM asset a, test t 
				WHERE a.id = t.AssetID AND t.AssetID = ? 
				AND t.DateIssued BETWEEN ? AND ? 
				AND (t.DateCompleted != '0000-00-00 00:00:00' AND t.DateCompleted IS NOT NULL)`;
				var p = this.opost;
				let postableChanges = [ p.assetID, p.initialDate, p.finalDate ];
				let ret: any = await db.query(sqlcmd, postableChanges);

				//fetch the results
				this.lst = ret.values;
				this.log += this.lst[0].TestID + ' // ';

				//disconnect
				await this._sqlite.closeConnection('martis');

				//check search
				if (this.lst.length == 0) {
					await this.showAlert('No results', 'no matches within given period');
					return Promise.resolve();
				}
				await this.showAlert('Success', 'report fetched.');
				return Promise.resolve();
			} catch (err) {
				// Close Connection MyDB
				await this._sqlite.closeConnection('martis');

				//error message
				return await this.showAlert('Error', err.message);
			}
		}
	}

	doRefresh(event) {
		window.location.reload();
		this.ngOnInit();
		setTimeout(() => {
			event.target.complete();
		}, 2000);
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
			this.GetAssetSub = this.createReport.getAssets().subscribe((data) => {
				this.assets = Array.of(data.data);
			});
		}
	}

	loadLocalAssetToBase64() {
		this.ReaderSub = this.http
			.get('./assets/1200px-Wabtec_Logo.svg.png', { responseType: 'blob' })
			.subscribe((res) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					this.logoData = reader.result;
				};
				reader.readAsDataURL(res);
			});
	}

	downloadPdf() {
		let logo = { image: this.logoData, width: 100 };
		const docDefinition = {
			watermark: { text: 'M.A.R.T.I.S', color: 'blue', opacity: 0.1, bold: true },
			content: [
				{
					columns: [
						logo,
						{
							text: new Date(),
							alignemnet: 'right'
						}
					]
				},
				{ text: 'Report', style: 'header' },
				{
					columns: [
						{
							width: '50%',
							text: 'Asset Details',
							style: 'subheader'
						},

						{
							width: '50%',
							text: '        '
						}
					]
				},
				{
					columns: [
						{
							width: '20%',
							text: 'Region :'
						},
						{
							width: '10%',
							text: this.lst[0][0].Region
						}
					]
				},
				{
					columns: [
						{
							width: '20%',
							text: 'GPS Latitude:'
						},
						{
							width: '11%',
							text: this.lst[0][0].GPSLatitude
						},

						{
							width: '20%',
							text: '  GPS Longitude:'
						},
						{
							width: '12%',
							text: this.lst[0][0].GPSLongitude
						}
					]
				},
				{
					columns: [
						{
							width: '20%',
							text: 'Asset Status:'
						},
						{
							width: '11%',
							text: this.lst[0][0].Status
						}
					]
				},
				{ text: '----------------------------------------------------------------------', style: 'header' },
				{
					columns: [
						{
							width: '50%',
							text: 'Inspection Details',
							style: 'subheader'
						},

						{
							width: '50%',
							text: '       '
						}
					]
				},
				{
					columns: [
						{
							width: '20%',
							text: 'Test No ',
							style: 'topic'
						},
						{
							width: '40%',
							text: 'Test description',
							style: 'topic'
						},
						{
							width: '15%',
							text: 'Employee ID',
							style: 'topic'
						},
						{
							width: '20%',
							text: 'Status',
							style: 'topic'
						}
					]
				},
				this.lst[0].map(function(item) {
					return {
						columns: [
							{
								width: '20%',

								text: item.TestID
							},
							{
								width: '40%',
								text: item.comments
							},

							{
								width: '15%',
								text: item.InspectorID
							},
							{
								width: '20%',
								text: item.Result
							}
						]
					};
				})
			],
			styles: {
				header: {
					fontSize: 18,
					bold: true,
					margin: [ 0, 15, 0, 0 ]
				},
				subheader: {
					fontSize: 14,
					bold: true,
					margin: [ 0, 15, 0, 0 ]
				},
				topic: {
					bold: true
				}
			}
		};

		this.pdfObj = pdfMake.createPdf(docDefinition);
		console.log(this.pdfObj);

		this.pdfObj.download();
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
			let ret = await db.query("SELECT id as 'AssetID', Region FROM asset;");
			this.assets = ret.values;

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

	ngOnDestroy(): void {
		if (this.GetAssetSub) {
			this.GetAssetSub.unsubscribe();
			console.log('Done');
		}
		if (this.GetReportSub) {
			this.GetReportSub.unsubscribe();
			console.log('Done');
		}
		if (this.ReaderSub) {
			this.ReaderSub.unsubscribe();
			console.log('Done');
		}
	}
}
export class Aposts {
	initialDate: string;
	finalDate: string;
	assetID: string;
}
