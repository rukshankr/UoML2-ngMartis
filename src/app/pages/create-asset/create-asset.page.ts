import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AssetService } from "src/app/services/asset-service.service";
import { AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

@Component({
  selector: "app-create-asset",
  templateUrl: "./create-asset.page.html",
  styleUrls: ["./create-asset.page.scss"],
})
export class CreateAssetPage implements OnInit {

  opost = new Posts();

  get assetID(){
    return this.createAssetForm.get('AssetID');
  };
  get gpsLat(){
    return this.createAssetForm.get('GPSLatitude');
  };
  get gpsLong(){
    return this.createAssetForm.get('GPSLongitude');
  };

  public errorMessage = {
    assetID: [
      {type: 'required', message: 'Asset ID is required'},
      {type: 'maxlength', message: 'Can\'t be longer than 4 characters'},
      {type: 'pattern', message: 'Should start with an A'}
    ],
    gps:[
      {type: 'pattern', message: 'Please enter a valid number only'}
    ]
  };

  createAssetForm = this.formBuilder.group({
    AssetID: ["",[Validators.required,Validators.pattern('^A[0-9]{3}'),Validators.maxLength(4)]],
    AssetType: [""],
    Status: "Functions",
    NearestMilePost: ["",[Validators.pattern('^MP[0-9]{3}'),Validators.maxLength(5)]],
    Division: [""],
    SubDivision: [""],
    Region: [""],
    GPSLongitude: ["",[Validators.pattern('^[0-9]+.?[0-9]*')]],
    GPSLatitude: ["",[Validators.pattern('^[0-9]+.?[0-9]*')]],
    LastTestedDate: "",
  });

  constructor(
    private formBuilder: FormBuilder,
    private assetService: AssetService,
    private alertCtrl: AlertController
  ) {}

 

  ngOnInit() {}

  onSave() {
    this.opost = this.createAssetForm.value;

    console.log("Page Saved", this.opost);

     this.assetService.post(this.opost).subscribe((data) => {
      console.log("Post method success?: ", data);
      if(data){
        this.showAlert(true);
      }else{
        this.showAlert(false);
      }
    });

    

  }

  async showAlert(val){
    await this.alertCtrl.create({
      header: "Result",
      message: val ? "Test added Sucessfully": "Error",
      buttons: [{
        text: "OK",
        handler: () =>{
          this.createAssetForm.reset();
        }
      }]
    }).then(res => res.present())
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
  Sivision: string;
  SubDivision: string;
  Region: string;
  GPSLongitude: string;
  GPSLatitude: string;
  LastTestedDate: string;
}
