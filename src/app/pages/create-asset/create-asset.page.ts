import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
//import { Observable } from "rxjs";
import { AssetService } from "src/app/services/asset-service.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";

@Component({
  selector: "app-create-asset",
  templateUrl: "./create-asset.page.html",
  styleUrls: ["./create-asset.page.scss"],
})
export class CreateAssetPage implements OnInit {
  results: object[]; //for all the objects that come along commentsAPI

  opost = new Posts();

  createAssetForm = this.formBuilder.group({
    AssetID: [""],
    Status: "Functions",
    NearestMilePost: [""],
    Division: [""],
    SubDivision: [""],
    Region: [""],
    GPSLongitude: [""],
    GPSLatitude: [""],
    LastTestedDate: "",
  });

  constructor(
    private formBuilder: FormBuilder,
    private assetService: AssetService,
    private geolocation: Geolocation
  ) {}

  ngOnInit() {}

  onSave() {
    this.opost = this.createAssetForm.value;

    console.log("Page Saved", this.opost);

    this.assetService.post(this.opost).subscribe((data) => {
      console.log("Post method success?: ", data);
    });
  }

  getCoords() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.createAssetForm['GPSLatitude'] = resp.coords.latitude;
        this.createAssetForm['GPSLongitude'] = resp.coords.longitude;
        console.log("asset form:"+this.createAssetForm['GPSLatitude']);
      })
      .catch((error) => {
        console.log("Error getting location", error);
      });
  }
}

export class Posts {
  AssetID: string;
  Status: string;
  NearestMilePost: string;
  Sivision: string;
  SubDivision: string;
  Region: string;
  GPSLongitude: string;
  GPSLatitude: string;
  LastTestedDate: string;
}
