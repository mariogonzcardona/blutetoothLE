import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import {AngularFireAuth} from 'angularfire2/auth';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user={} as User;

  constructor(private afAuth:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
  }

  async register(user:User){
    try{
      const result= this.afAuth.auth.createUserWithEmailAndPassword(user.email,user.password);
      console.log(result);

      if (result) {
        this.navCtrl.setRoot(HomePage); 
      }
    }catch(e)
    {
      console.error(e);
    }
    
  }

}
