import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InventoryItem } from '../../inventoryItem';

// These imports are all for Firebase.---------
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../../environments/environment';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
// --------------------------------------------

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent{
  @Input() item: InventoryItem;

  save() {
    this.item.save();
  }
  
  remove() {
    this.item.remove();
  }
}
