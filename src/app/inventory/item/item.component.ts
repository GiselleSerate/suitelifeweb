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

import * as $ from 'jquery';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent{
  @Input() item: InventoryItem;

  ngAfterViewInit() {
    // ($('.price') as any).number( true, 2 ); // Should format to 2 decimal places. 
  }

  save() {
    // ($('.price') as any).number( true, 2 ); // Should format to 2 decimal places. 
    this.item.save();
  }
  
  remove() {
    this.item.remove();
  }
}
