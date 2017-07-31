import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

// These imports are all for Firebase.----------
import { Observable } from 'rxjs/Observable';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import * as firebase from 'firebase/app';
//----------------------------------------------

import { InventoryComponent } from './inventory/inventory.component';
import { LoginComponent } from './login/login.component';
import { ItemComponent } from './inventory/item/item.component';
import { IousComponent } from './ious/ious.component';
import { PersonViewComponent } from './person-view/person-view.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { SearchUsersComponent } from './search-users/search-users.component';
import { SafePipe } from './safe.pipe';
import { SettingsComponent } from './settings/settings.component';
import { GroupsEditComponent } from './groups-edit/groups-edit.component';
import { GroupViewComponent } from './group-view/group-view.component';
import { UserViewComponent } from './user-view/user-view.component'
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';
import { DragulaModule } from 'ng2-dragula';


@NgModule({
  declarations: [
    AppComponent,
    InventoryComponent,
    LoginComponent,
    ItemComponent,
    IousComponent,
    PersonViewComponent,
    UserSettingsComponent,
    SafePipe,
    SettingsComponent,
    GroupsEditComponent,
    GroupViewComponent,
    SearchUsersComponent,
    UserViewComponent

  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'angular2fb'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule, 
    AngularFontAwesomeModule,
    DragulaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
