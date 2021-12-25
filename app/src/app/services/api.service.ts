import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public isLoading = false
  // set the URL where the API Server of the AI Pipeline Image App is running
  public baseUrl: string = "http://192.168.2.174:5010/";
  constructor() { }



  async getModels() {
    this.isLoading = true
    var res: any

    await axios.get(this.baseUrl + "load")
      .then((response) => {
        res = response.data
      })
    this.isLoading = false
    return res
  }



/**
 * Returns an image from a model prediction
 * @param image 
 * @param selectedModel 
 * @returns 
 */
  async predictImage(image: any, selectedModel: any) {
    this.isLoading = true
    var res: any
    image = image.split(",")[1]

    await axios.post(this.baseUrl + "predict_image", {
      "input_data": image,
      "selected_model": selectedModel
    })
      .then((response) => {
        res = response.data
      })
    this.isLoading = false
    return res

  }


  /**
   * Returns a json object with information of an image predition
   * @param image 
   * @param selectedModel 
   * @returns 
   */
  async predictImageInformation(image: any, selectedModel: any) {
    this.isLoading = true
    var res: any
    image = image.split(",")[1]


    await axios.post(this.baseUrl + "predict", {
      "input_data": image,
      "selected_model": selectedModel
    })
      .then((response) => {
        res = response.data
      })

    this.isLoading = false
    return res

  }




}
