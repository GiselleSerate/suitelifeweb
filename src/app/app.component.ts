import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  items: FirebaseListObservable<any[]>;
  user: FirebaseObjectObservable<any>;
  title = 'app';
  constructor(db: AngularFireDatabase, afAuth: AngularFireAuth) {
  	this.items = db.list('/users/AGGv3AEbBuV52vhG1f1a5dd2NcQ2/debts');
  	this.user = db.object('/users/GjtBrJiPYkZQCnhFV8FwsqUyE6u2/handle');
  	// afAuth.authState;
  }
}


// import { AngularFireAuth } from 'angularfire2/auth';
// // Do not import from 'firebase' as you'd lose the tree shaking benefits
// import * as firebase from 'firebase/app';
// ...

// user: Observable<firebase.User>;
// constructor(afAuth: AngularFireAuth) {
//   this.user = afAuth.authState; // only triggered on sign-in/out (for old behavior use .idToken)
// }