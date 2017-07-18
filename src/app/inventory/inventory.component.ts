import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// These imports are all for Firebase.---------
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
// --------------------------------------------

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {

  @Input() loginState;
  currentUserData: FirebaseListObservable<any[]>;

  constructor(db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    this.currentUserData = db.list('/users/'.concat(this.loginState, '/list'));
  }
}