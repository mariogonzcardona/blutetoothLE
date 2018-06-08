import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { HTTP } from '@ionic-native/http';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';


declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  posts: any;
  arrayCharts: any[] = [["Tiempo", "Temperatura", "Humedad"]];
  arrayLuz: any[] = [["Tiempo", "Luz"]];

  constructor(public storage: Storage, private toast: ToastController, private afAuth: AngularFireAuth, public navCtrl: NavController, public http: Http) {
    this.storage.get('uid').then(value => {
      this.http.get('https://telecom-203523.appspot.com/posts/last?uid=' + value).map(res => res.json()).subscribe(data => {
        this.posts = data;
        console.log(this.posts)
      });
      //console.log("aqui")
    });
  }

  ionViewWillLoad() { 
    
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.initCharts();
        this.toast.create({
          
          message: "Welcome to Data House: " + data.email,
          duration: 3000
        }).present();
      }
      else {
        this.toast.create({
          message: 'Could not find authentication details',
          duration: 3000
        }).present();
      }
    });
  }

  initCharts()
  {
    this.arrayCharts[0] = ["Tiempo", "Temperatura", "Humedad"];
    this.arrayLuz[0] = ["Tiempo", "Luz"];
    this.arrayCharts[1]=[0,0,0];
    this.arrayLuz[1]=[1,1];
  }

  async itemSelected(item: string) {
    console.log("Selected Item", item);
    const stor =  await this.storage.get('uid')
    let query = "https://telecom-203523.appspot.com/posts/hist?uid=" + stor + "&_id_device=" + item;
    const espera = await this.http.get(query).map(res => res.json()).subscribe(data => {
      this.arrayCharts = [];
      this.arrayLuz = [];
      this.arrayCharts[0] = ["Tiempo", "Temperatura", "Humedad"];
      this.arrayLuz[0] = ["Tiempo", "Luz"];
      data.forEach(element => {
        try {
          this.arrayCharts.push([element.date, element._DHT11T, element._DHT11H]);
          this.arrayLuz.push([element.date, element._LDR]);

        } catch (error) {
          console.log(error);
        }
      })
    });
    this.showLineChart();
    this.showLineChartLuz();
  }

  showLineChart() {
    //console.log("Inicia LineChart");
    try {
      console.log(this.arrayCharts)
      var data = google.visualization.arrayToDataTable(this.arrayCharts);
    } catch (error) {
      //console.log(error);
      //console.log(this.arrayCharts);
      //console.log(data);
    }

    var options = {
      title: 'BluetoothLE Data House',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
  }

  showLineChartLuz() {
   // console.log("Inicia LineChart LUZ");
    try {
      var data = google.visualization.arrayToDataTable(this.arrayLuz);

    } catch (error) {
      //console.log(error);
      //console.log(this.arrayLuz);
      //console.log(data);
    }

    var options = {
      title: 'BluetoothLE Data House Luz',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chartLuz'));
    chart.draw(data, options);
  }

}
