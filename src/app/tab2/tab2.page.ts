import { Component } from '@angular/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
//import { NavController, NavParams, AlertController } from "ionic-angular";
import {  NavController, NavParams, AlertController  } from '@ionic/angular';
import { ProviderService } from '../provider.service';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import {Platform} from '@ionic/angular';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  providers: [AndroidPermissions,NavController, NavParams, AlertController,LocationAccuracy ]
})
export class Tab2Page {
  public latitude: any;
  public longitude: any;
  public item: any;
  public currentWeather:any;
  public forecastWeather:any;
  public currentLocation:any;

  constructor(  private geolocation: Geolocation,
    private params: NavParams,
    private alertCtrl: AlertController,
    private weatherAPI:ProviderService,
    private androidPermissions: AndroidPermissions,
    private platform: Platform,
    private locationAccuracy: LocationAccuracy) {
    //this.item = params.data.item;
    this.item = [];
  }

  // not assignable to parameter of type '"ipad" | "iphone" | "ios" | "android" | "phablet" | "tablet" | 
  //"cordova" | "capacitor" | "electron" | "pwa" | "mobile" | "mobileweb" | "desktop" | "hybrid"


  ngOnInit() {
    // this.getLocationPermission();
    // this.getGeoLocation();
    if(this.platform.is('desktop') || this.platform.is('mobileweb')) {
      this.getLocationCoordinates();
    } else {
      this.checkGPSPermission();
    }
   
  }

    //Check if application having GPS access permission  
    checkGPSPermission() {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
        result => {
          if (result.hasPermission) {
  
            //If having permission show 'Turn On GPS' dialogue
            this.askToTurnOnGPS();
          } else {
  
            //If not having permission ask for permission
            this.requestGPSPermission();
          }
        },
        err => {
          this.showPrompt("Error in GPS location permission: "+err);
        }
      );
    }

    requestGPSPermission() {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if (canRequest) {
          console.log("4");
        } else {
          //Show 'GPS Permission Request' dialogue
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
            .then(
              () => {
                // call method to turn on GPS
                this.askToTurnOnGPS();
              },
              error => {
                //Show alert if user click on 'No Thanks'
                this.showPrompt('requestPermission Error requesting location permissions ' + error)
              }
            );
        }
      });
    }

    askToTurnOnGPS() {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {
          // When GPS Turned ON call method to get Accurate location coordinates
          this.getLocationCoordinates()
        },
        error => this.showPrompt('Error requesting location permissions ' + JSON.stringify(error))
      );
    }

      // Methos to get device accurate coordinates using device GPS
  getLocationCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      if(!!resp){
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        this.getForecastWeather(resp.coords.latitude,resp.coords.longitude);
      }
    }).catch((error) => {
      this.showPrompt("Error in getting location coordinates: "+error);
    });
  }

  getLocationPermission(): void {
    this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
      )
      .then(
        (result) => {
          console.log("Has permission?", result.hasPermission);
          this.getGeoLocation();
        },
        (err) =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
          )
      );
    this.androidPermissions.requestPermissions([
      this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
    ]);
  }

  getGeoLocation(): void {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.getForecastWeather(resp.coords.latitude,resp.coords.longitude);
      })
      .catch((error) => {
        console.log("Error getting location", error);
       // this.showPrompt();
      });
  }

  getForecastWeather(lat,lon){
    this.weatherAPI.getForecastWeather(lat,lon).subscribe((response)=>{
      console.log(response);
      if(!!response){
        let responseShow:any= response;
        if(!!responseShow && !!responseShow.error){
          this.showPrompt(responseShow.message);
        }else{
          this.currentWeather = responseShow.current;
          this.forecastWeather =  responseShow.forecast.forecastday;
          this.currentLocation = responseShow.location;
        }
        
      }
    })
  }

  returnWeatherImage(item){
    console.log(item.day.condition.icon);
    let icon = item.day.condition.icon;
    return icon;
  }
  async showPrompt(error) {
    const alert = await this.alertCtrl.create({
      cssClass: 'popupClass',
      header: 'Weather',
      message: error,
      buttons: ['OK']
    });

    await alert.present();
  }
  

}
