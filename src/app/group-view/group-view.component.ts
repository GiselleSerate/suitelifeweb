import { Component, OnInit, Input } from '@angular/core';

// These imports are all for Firebase.---------
import { Observable } from 'rxjs/Observable';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
// --------------------------------------------

import { Group } from '../group'

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.css']
})
export class GroupViewComponent implements OnInit {

  @Input() group: Group;
  visible: boolean;
  localName: string;

  constructor() { 
    this.visible = false;
  }

  ngOnInit() {
  }

  toggleVisible() {
    this.visible = !this.visible;
    this.localName = this.group.name;

  }

  updateName() {
    this.group.name = this.localName;
  }

}
