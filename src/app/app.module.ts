import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestore } from 'angularfire2/firestore';
import { environment } from '../environments/environment';

import { RouterModule, Routes } from '@angular/router';
import {A11yModule} from '@angular/cdk/a11y';
import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';  
import { HttpClientModule } from '@angular/common/http';
import { QuizComponent } from './quiz/quiz.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AcknowledgePageComponent } from './acknowledge-page/acknowledge-page.component';

const appRoutes: Routes = [
  {path: '', component: AcknowledgePageComponent},
  {path: 'info', component: LandingPageComponent},
  {path: 'quiz/:id', component: QuizComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    LandingPageComponent,
    AcknowledgePageComponent
  ],
  imports: [
    A11yModule, BrowserModule,ReactiveFormsModule,
    BrowserAnimationsModule, MatSliderModule, MatCardModule,
    MatButtonModule, MatIconModule,FormsModule,MatToolbarModule,
    MatInputModule, HttpClientModule, MatChipsModule, MatSidenavModule, MatDividerModule,
    MatSnackBarModule, MatRadioModule, MatCheckboxModule, MatListModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    RouterModule.forRoot(
      appRoutes,
    )
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
