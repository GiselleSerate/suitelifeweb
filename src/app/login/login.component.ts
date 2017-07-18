import { Component, Output, EventEmitter } from '@angular/core';

// These imports are all for Firebase.---------
import { Observable } from 'rxjs/Observable';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
// --------------------------------------------

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  items: FirebaseListObservable<any[]>;
  currentUser: Observable<firebase.User>;
  handleSubject: Subject<any>;
  currentUserInfo: FirebaseListObservable<any[]>;
  currentUserID: string;
  @Output() loginState = new EventEmitter();

  constructor(db: AngularFireDatabase, public afAuth: AngularFireAuth) {

    this.currentUser = afAuth.authState;
    this.currentUser.subscribe(res => {
      if(res && res.uid) {
        console.log("User logged in.");
        console.log(res.uid);
        this.loginState.emit(res.uid);
      }
      else {
        console.log("User not logged in.")
        this.currentUserInfo = null;
        this.loginState.emit(null);
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
