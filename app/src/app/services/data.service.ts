import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  //// Navigation Elements ////
  public postImagePossible: boolean = false
  public predictionComplete: boolean = false
  public downloadPossible: boolean = false

  //// Prediction Data ////
  public predictionInfo: any = [{}]
  public models: any = []
  public imageDisplayUrl: any = ""
  public selectedModel: string = "";

  //// Functions ////
  public sleep = (m: any) => new Promise(r => setTimeout(r, m))

  //// SVG IDs ////
  public barChartId = "classDistribution"

}
