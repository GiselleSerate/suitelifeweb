import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  items: FirebaseListObservable<any[]>;
  user: FirebaseObjectObservable<any>;
  handleSubject: Subject<any>;
  title = 'app';
  constructor(db: AngularFireDatabase, afAuth: AngularFireAuth) {
  	this.items = db.list('/users');
    // -----
    // this.items = db.list('/items', { preserveSnapshot: true });
    // this.items.subscribe(snapshots => {
    //   snapshots.forEach(snapshot => {
    //     console.log(snapshot.key)
    //     console.log(snapshot.val())
    //   });
    // })
    // -----

    // this.handleSubject = new Subject(); // Goes with filterby.
    // this.items = db.list('/users', {
    //   query: {
    //     orderByChild: 'handle',
    //     equalTo: this.handleSubject
    //   }
    // });

  	this.user = db.object('/users/GjtBrJiPYkZQCnhFV8FwsqUyE6u2/handle');
  	// afAuth.authState;
  }

  // filterBy(size: string) {
  //   this.handleSubject.next(size); 
  // }
}


// import { AngularFireAuth } from 'angularfire2/auth';
// // Do not import from 'firebase' as you'd lose the tree shaking benefits
// import * as firebase from 'firebase/app';
// ...

// user: Observable<firebase.User>;
// constructor(afAuth: AngularFireAuth) {
//   this.user = afAuth.authState; // only triggered on sign-in/out (for old behavior use .idToken)
// }