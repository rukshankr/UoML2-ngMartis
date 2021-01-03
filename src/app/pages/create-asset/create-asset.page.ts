import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AssetService} from 'src/app/services/asset-service.service';

@Component({
  selector: 'app-create-asset',
  templateUrl: './create-asset.page.html',
  styleUrls: ['./create-asset.page.scss'],
})
export class CreateAssetPage implements OnInit {
  
  results : object[]; //for all the objects that come along commentsAPI

  opost = new Posts();

  createAssetForm = this.formBuilder.group({
    AssetID : [''],
    Satus : "Functions",
    NearestMilePost :[''],
    Division : [''],
    SubDivision : [''],
    Region : [''],
    GPSLongitude : [''],
    GPSLatitude : ['']
  });

  constructor(private formBuilder: FormBuilder, private assetService: AssetService) { }

  ngOnInit() {
    this.assetService.getComments()
    .subscribe
    (
      data =>
      {
        this.results = data;
        console.log(this.results);
      }
    )

    this.assetService.getCommentsByParam()
    .subscribe
    (
      data =>
      {
        this.results = data;
        console.log("Comments by params:", this.results);
      }
    );

  }


  onSave(){

    this.opost = this.createAssetForm.value;

    console.log(
      "Page Saved", this.opost
    );

    this.assetService.post(this.opost)
    .subscribe
    (
      data =>
      {
        console.log("Post method success?: ", data);
      }
    );
  }
}

export class Posts {
  AssetID : string;
    Satus : string;
    NearestMilePost :string;
    Sivision : string;
    SubDivision : string;
    Region : string;
    GPSLongitude : string;
    GPSLatitude : string;
}
