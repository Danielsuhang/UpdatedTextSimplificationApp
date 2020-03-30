import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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

import {FormsModule, ReactiveFormsModule} from '@angular/forms';  
import { HttpClientModule } from '@angular/common/http';
import { SimplificationReadingComponent } from './simplification_reading/simplification-reading/simplification-reading.component';
import { QuizComponent } from './quiz/quiz.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const appRoutes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'quiz/:id', component: QuizComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    SimplificationReadingComponent,
    QuizComponent,
    LandingPageComponent
  ],
  imports: [
    A11yModule, BrowserModule,ReactiveFormsModule,
    BrowserAnimationsModule, MatSliderModule, MatCardModule,
    MatButtonModule, MatIconModule,FormsModule,MatToolbarModule,
    MatInputModule, HttpClientModule, MatChipsModule, MatSidenavModule, MatDividerModule,
    MatSnackBarModule, MatRadioModule, MatCheckboxModule,
    RouterModule.forRoot(
      appRoutes,
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
