import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from "angularfire2/auth";
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register'
import { AlertController } from 'ionic-angular';
import { FirebaseAuth } from '@firebase/auth-types';
import * as firebase from 'firebase/app';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  splash = true;
  user = {} as User;

  constructor(private toast: ToastController, private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public storage: Storage) {


  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.splash = false;
    }, 4000);
  }

  async login(user: User) {
    try {
      const result = this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      console.log(result);
      
      if (result) {
      
        var usuario = firebase.auth().currentUser;
        if (usuario != null) this.storage.set('uid', usuario.uid);
        console.log(this.storage.get('uid'));
        this.navCtrl.setRoot(HomePage);
      }
      else {

      }

    }
    catch (e) {
      console.log(e);
      //console.error(e);

      const alert = this.alertCtrl.create({
        title: 'Verifay User and Password',
        subTitle: 'If any of your information is incorrect, please check it and try again.',
        buttons: ['OK']
      });
      alert.present();

    }
  }


  register() {
    this.navCtrl.push("RegisterPage");
  }

}
