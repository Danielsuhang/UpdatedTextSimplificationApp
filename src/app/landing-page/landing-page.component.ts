import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Router } from "@angular/router";

import {Simplification} from '../types/simplification';

import {SimplificationService} from "../service/simplification.service";

import {LiveAnnouncer} from '@angular/cdk/a11y';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(private router: Router, liveAnnouncer: LiveAnnouncer,
    private simplificationService: SimplificationService) {
    liveAnnouncer.announce(this.welcomeMessage);
  }

  welcomeMessage: string = 
    "Tell us a bit about yourself"
  age = new FormControl('', [Validators.required, Validators.min(0), Validators.max(99)]);
  visuallyimpaired = false;
  ngOnInit() {
  }

  startQuiz() {
    const guid = Guid.newGuid();
    this.saveUser(guid, this.age.value,  this.visuallyimpaired);
    this.router.navigate(['/quiz', guid]);
  }

  startQuizWithoutDetails() {
    const guid = Guid.newGuid();
    this.router.navigate(['/quiz', guid]);
  }

  saveUser(guid: string, age: number, visuallyimpaired: boolean) {
    var email = "default"
    this.simplificationService.postQuizIdentifiers(guid, age, email, visuallyimpaired);
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
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
