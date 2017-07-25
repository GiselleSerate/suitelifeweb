// Component handles login behavior. 

import { Component, OnInit, HostBinding } from '@angular/core';

// These imports are all for Firebase.---------
import { Observable } from 'rxjs/Observable';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
// --------------------------------------------

import { Router } from '@angular/router';
// import { moveIn } from '../router.animations'; // tutorial hasn't written this yet. 


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  currentUser: Observable<firebase.User>;
  loggedIn: boolean;

  constructor(db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    this.currentUser = afAuth.authState;

    this.currentUser.subscribe(res => {
      if(res && res.uid) {
        console.log("User logged in with id:".concat(res.uid));
        this.loggedIn = true;
      }
      else {
        console.log("User not logged in.");
        this.loggedIn = false;
      }
    })
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}
