import { Component } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  providers: [NativeGeocoder]
})
export class Tab3Page {
  public latitude:any;
  public longitude:any;
  public latitudeFixed:any;
  public longitudeFixed:any;
  public reverseGeo:any;
  public showReversGeo:boolean=true;
  
  constructor(private geolocation: Geolocation,private nativeGeocoder: NativeGeocoder,    private platform: Platform,) {
    if(this.platform.is('desktop') || this.platform.is('mobileweb')) {
      this.showReversGeo = false;
    } else {
      this.showReversGeo = true;
    }
  }
  ngOnInit() {
    this.getCurrentLocation();
 }
  getCurrentLocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude= resp.coords.latitude;
      this.longitude= resp.coords.longitude;
      this.latitudeFixed= this.latitude.toFixed(2);
      this.longitudeFixed=this.longitude.toFixed(2);
      this.getReverseGeo(resp.coords.latitude, resp.coords.longitude);
     }).catch((error) => {
       console.log('Error getting location', error);
     });

  }

  getReverseGeo(latitude, longitude){
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
   this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
   .then((result: NativeGeocoderResult[]) => {
     console.log("Reverse GEO code")
     console.log(JSON.stringify(result[0]))
     this.reverseGeo = result[0];
   })
   .catch((error: any) => console.log('Error getting reverse GEO', error));
  }
}
