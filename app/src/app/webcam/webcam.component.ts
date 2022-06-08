import { Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.css']
})
export class WebcamComponent implements OnInit {

  constructor(public dataService: DataService) { }

  stream: any = null;
  trigger: Subject<void> = new Subject();
  previewImage: string = "";
  get $trigger(): Observable<void> {
    return this.trigger.asObservable();
  }

  snapshot(event: WebcamImage) {
    console.log(event)
    this.previewImage = event.imageAsDataUrl;
  }

  openWebcam() {
    navigator.mediaDevices.getUserMedia({
      video: {
        width: 100,//this.cameraWidth,
        height: 100//this.cameraHeigth
      }
    }).then((res) => {
      console.log("response: ", res);
      this.stream = res;
    }).catch(err => {
      console.log(err);
    })

  }

  takeImage() {
    this.trigger.next();
  }

  saveImage() {

    this.dataService.imageDisplayUrl = this.previewImage;
  
  }

  ngOnInit(): void {
    this.openWebcam()

  }

}
