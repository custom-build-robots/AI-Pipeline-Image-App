import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public isLoading = false

  public baseUrl: string = "http://192.168.178.45:5010/";
  //public baseUrl: string = "http://localhost:5010/"
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
