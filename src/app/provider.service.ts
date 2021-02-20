import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  key: string = 'cea5b33948f8439dae644211202008';

  constructor(public http: HttpClient) {
    this.http = http;
  }


  getCurrentWeather(latitude:String,longitude:String) {
    return this.http.get('https://api.weatherapi.com/v1/current.json?key='+this.key+'&q='+latitude+','+longitude)
           .map(result => result);
  }
  
  getForecastWeather(latitude:String,longitude:String) {
    return this.http.get('https://api.weatherapi.com/v1/forecast.json?key='+this.key+'&q='+latitude+','+longitude+'&days=3')
           .map(result => result);
  }

}
