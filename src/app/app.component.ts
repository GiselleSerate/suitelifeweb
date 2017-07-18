import { Component } from '@angular/core';

// These imports are all for Firebase.---------
import { Observable } from 'rxjs/Observable';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
// --------------------------------------------

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  items: FirebaseListObservable<any[]>;
  currentUserData: Observable<any>;

  constructor(db: AngularFireDatabase, public afAuth: AngularFireAuth) {
  	this.items = db.list('/users');
  }

  handleLogin(user) {
    if(user != null) {
      console.log("App is handling login.");
      this.currentUserData = user;
      console.log(this.currentUserData);
    }
    else {
      console.log("App is handling logout.")
      this.currentUserData = null;
    }
  }
}

// user: Observable<firebase.User>;
// constructor(afAuth: AngularFireAuth) {
//   this.user = afAuth.authState; // only triggered on sign-in/out (for old behavior use .idToken)
// }