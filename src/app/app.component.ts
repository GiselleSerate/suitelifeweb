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

import { InventoryComponent } from './inventory/inventory.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  items: FirebaseListObservable<any[]>;
  currentUser: Observable<firebase.User>;
  handleSubject: Subject<any>;
  currentUserInfo: FirebaseListObservable<any[]>;
  currentUserID: string;

  constructor(db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    this.currentUser = afAuth.authState;
    this.currentUser.subscribe(res => {
      if(res && res.uid) {
        console.log("User logged in.");
        console.log(res.uid);
        this.currentUserInfo = db.list('/users/'.concat(res.uid, '/list'));
      }
      else {
        console.log("User not logged in.")
        this.currentUserInfo = null;
      }
    })
  	this.items = db.list('/users');
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}

// user: Observable<firebase.User>;
// constructor(afAuth: AngularFireAuth) {
//   this.user = afAuth.authState; // only triggered on sign-in/out (for old behavior use .idToken)
// }