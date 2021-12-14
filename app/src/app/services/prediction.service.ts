import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { ApiService } from './api.service';
import { BarchartService } from './barchart.service';
import * as d3 from "d3";
@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  constructor(private dataService: DataService,
    private apiService: ApiService,
    private barChartService: BarchartService) { }

  /**
   * Reads an input file and update the public image url
   * @param event: Input file 
   * @returns 
   */
  fileChange(event: any) {
    this.dataService.imageDisplayUrl = ""
    var selectedFile = event.target.files[0]

    if (selectedFile.length === 0)
      return;

    const mimeType = selectedFile.type;
    if (mimeType.match(/image\/*/) == null) {
      console.log("Only images are supported.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onload = (_event) => {
      this.dataService.imageDisplayUrl = reader.result;
      if (this.dataService.selectedModel != "") {
        this.dataService.postImagePossible = true
      }
    }
  }

  /**
   * Updates the public model from the data service from a dropdown selection 
   * @param model 
   */
  selectModel(model: string) {
    this.dataService.selectedModel = model
    if (this.dataService.imageDisplayUrl != "") {
      this.dataService.postImagePossible = true
    }
  }

  /**
   * Posts a file and model to the api and updates the public image url as well as the information about the
   * image in the data serivce
   */
  async postFileToApi() {
    d3.select("#" + this.dataService.barChartId).html("")
    this.dataService.postImagePossible = false
    var inputImage = this.dataService.imageDisplayUrl

    var data: any = await this.apiService.predictImage(inputImage, this.dataService.selectedModel)

    this.dataService.imageDisplayUrl = ('data:image/png;base64,'
      + data);
    var temp = []
    var prediction = await this.apiService.predictImageInformation(inputImage, this.dataService.selectedModel)
    prediction = prediction['data']['bounding-boxes']

    for (var i in prediction) {
      temp.push({ "ClassId": prediction[i]['ObjectClassId'], "ClassName": prediction[i]['ObjectClassName'], "Confidence": (Math.round(prediction[i]['confidence'] * 100) / 10000) })
    }
    this.dataService.predictionInfo = temp
    this.dataService.predictionComplete = true
    this.dataService.downloadPossible = true

    this.barChartService.updateBarChart("Sum of class names", this.dataService.predictionInfo)
  }

}
