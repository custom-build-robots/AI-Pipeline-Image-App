import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { PredictionService } from '../services/prediction.service';
import { BarchartService } from '../services/barchart.service';
import { DataService } from '../services/data.service';
import { DownloadService } from '../services/download.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public jsonData: any

  constructor(public apiService: ApiService,
    private predictionService: PredictionService,
    private barChartService: BarchartService,
    public dataService: DataService,
    private downloadService: DownloadService) { }

  displayedColumnsEngineTable: string[] = ['ClassId', 'ClassName', 'Confidence'];
  aggregationLevels: any = ["Sum of class names", "Mean of confindence"]

  public selectedTableRow: any

  /**
   * Reads an input file and update the public image url
   * @param event: Input file 
   * @returns 
   */
  onFileChanged(event: any) {
    this.predictionService.fileChange(event)
  }

  /**
   * Selects a model to make a prediction
   * @param model
   */
  selectModel(model: string) {
    this.predictionService.selectModel(model)
  }

  /**
   * Posts a file and model to the api and updates the public image url as well as the information about the
   * image in the data serivce
   */
  async postFile() {
    await this.predictionService.postFileToApi()
  }


  downloadFile() {
    var headers = ["ClassId",
      "ClassName",
      "Confidence"]
  //  var csv = this.downloadService.ConvertToCSV(this.dataService.predictionInfo, headers)
    this.downloadService.downloadFile(this.dataService.predictionInfo, headers)
  }

  /**
   * Updates the barchart based on a dropdown selection 
   * @param aggregationLevel: Dropdown selection value
   */
  updateBarChart(aggregationLevel: any) {
    this.barChartService.updateBarChart(aggregationLevel, this.dataService.predictionInfo)


  }



  async ngOnInit() {
    this.dataService.models = Object.keys(await this.apiService.getModels())

    this.jsonData = [{
      name: 'Berlin',
      age: '45',
      country: 'Spain',
      phone: '896514326'
    },
    {
      name: 'Professor',
      age: '42',
      country: 'spain'
    },
    {
      name: 'Tokyo',
      age: '35',
      phone: '854668244'
    },
    {
      name: 'Helsinki',
      phone: '35863297'
    }];

    let arrHeader = ["name", "age", "country", "phone"];
    //  let csvData = this.ConvertToCSV(this.jsonData, arrHeader);
    // console.log(csvData)
  }

}
