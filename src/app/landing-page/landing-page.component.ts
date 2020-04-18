import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router";

import { Simplification } from '../types/simplification';

import { SimplificationService } from "../service/simplification.service";

import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {

  constructor(private router: Router, liveAnnouncer: LiveAnnouncer,
    private simplificationService: SimplificationService) {
    liveAnnouncer.announce(this.screenReaderMessage);
  }

  screenReaderMessage: string =
    "Thank you for using our screen reader accessable information page. To continue to the game, please type your age, indicate if you are visually impaired, and press the start quiz button."
  age = new FormControl('', [Validators.required, Validators.min(0), Validators.max(99)]);
  visuallyimpaired = false;

  startQuiz() {
    const guid = Guid.newGuid();
    this.saveUser(guid, this.age.value, true, this.visuallyimpaired);
    this.router.navigate(['/quiz', guid]);
  }

  startQuizWithoutDetails() {
    const guid = Guid.newGuid();
    this.router.navigate(['/quiz', guid]);
  }

  saveUser(guid: string, age: number, isStudent: boolean, visuallyimpaired: boolean) {
    this.simplificationService.postQuizIdentifiers(guid, age, isStudent, visuallyimpaired);
  }

  submitIsValid() {
    return !this.age.invalid;
  }

  getErrorMessage(formControl: FormControl, errorMessage?: string) {
    if (formControl.hasError('required')) {
      return 'You must enter a value';
    } else {
      return errorMessage === undefined ? "Invalid value" : errorMessage;
    }
  }
}

class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
