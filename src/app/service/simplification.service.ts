import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import {MOCKSIMPLIFICATION} from '../utils/mock_simplification';

@Injectable({
  providedIn: 'root'
})
export class SimplificationService {
  serverData: any;

  constructor(private httpClient: HttpClient) { }

  loadWordAssociation(word: string) {
    var response;
    this.httpClient.get("http://127.0.0.1:5002/association?word=" + word).subscribe(data => {
      response = data as JSON;
      if (response == undefined) {
        console.log("Attribute doesn't exist, error with load data");
        return;
      }
      console.log(response);
    },
    error => {
      console.log("Failed to send request for load word association: " + error)
    });
    return of(response);
  }

  postQuizIdentifiers(guid: string, age: number, email: string, visually_impaired: boolean) {
    let url: string = "http://127.0.0.1:5002/postquizidentifiers?guid=" + guid + "&age=" + 
      + age + "&email=" + email + "&visuallyimpaired=" + visually_impaired;
    return this.httpClient.get(url).subscribe(data => {
      console.log(data)
    });
  }
  
  postQuizResults(guid: string, test: string) {
    let url: string = "http://127.0.0.1:5002/postquizresults?guid=" + guid + "&test=" + 
      test;
    return this.httpClient.get(url).subscribe(data => {
      console.log(data)
    });
  }

  loadStoriesFromDB() {
    return (this.httpClient.get("http://127.0.0.1:5002/stories"));
  }

  loadNationalGeographicFromDB() {
    return (this.httpClient.get("http://127.0.0.1:5002/nationalgeographic"));
  }

  loadStoriesFromMockDB() {
    return of(MOCKSIMPLIFICATION);
  }

  
}
