import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
// import { TIMEOUT } from 'dns';
// import { type } from 'os';
// import { timer } from 'rxjs';

@Component({
	selector: 'app-selection',
	templateUrl: './selection.page.html',
	styleUrls: [ './selection.page.scss' ]
})
export class SelectionPage implements OnInit {
	constructor(public atrCtrl: AlertController) {}

	async ionViewWillEnter() {
		let alert = this.atrCtrl.create({
			message: 'Enter PIN',
			inputs: [
				{
					name: 'pin',
					placeholder: 'Enter PIN',
					type: 'password',
					min: '0000',
					max: '9999'
				}
			],
			buttons: [
				{
					text: 'Forgot password',
					role: 'cancel',
					handler: async (data) => {
						console.log('You forgot password');
						let alert = this.atrCtrl.create({
							message: 'Forgot Password?',
							subHeader: 'Enter the email',
							inputs: [
								{
									name: 'email',
									placeholder: 'Enter email'
								}
							],
							buttons: [ 'OK' ]
						});
						(await alert).present();
					}
				},
				{
					text: 'Login',
					handler: async (data) => {
						if (data.pin == '1234') {
							console.log('Success');
							// login is valid
						} else {
							console.log('fail');
							let alert = this.atrCtrl.create({
								message: 'Invalid',
								subHeader: 'Enter the correct PIN',
								buttons: [ 'OK' ]
							});
							(await alert).present();

							//this.ionViewWillEnter();
							return false;
						}
					}
				}
			]
		});
		(await alert).present();
	}

	async showPromptAlert() {
		let alert = this.atrCtrl.create({
			message: 'Enter PIN',
			inputs: [
				{
					name: 'pin',
					placeholder: 'Enter Username'
				}
			],
			buttons: [
				{
					text: 'Forgot password',
					role: 'cancel',
					handler: async (data) => {
						console.log('You Clicked on Cancel');
						let alert = this.atrCtrl.create({
							message: 'Forgot Password?',
							subHeader: 'Enter the email',
							buttons: [ 'OK' ]
						});
						(await alert).present();
					}
				},
				{
					text: 'Login',
					handler: async (data) => {
						if (data.pin == '1234') {
							console.log('Success');
							// login is valid
						} else {
							console.log('fail');
							let alert = this.atrCtrl.create({
								message: 'Invalid',
								subHeader: 'Enter the correct PIN',
								buttons: [ 'OK' ]
							});
							(await alert).present();
							return false;
						}
					}
				}
			]
		});
		(await alert).present();
	}

	ngOnInit() {}
}
