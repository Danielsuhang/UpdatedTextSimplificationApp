import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AngularFirestore } from '@angular/fire/firestore';


import {MOCKSIMPLIFICATION} from '../utils/mock_simplification';

@Injectable({
  providedIn: 'root'
})
export class SimplificationService {
  serverData: any;

  constructor(private httpClient: HttpClient, private firestore : AngularFirestore) { }

  loadArticlesFromFirebase() {
    return this.firestore.collection('simplification').snapshotChanges();
  }

  loadWordAssociation(word: string) {
    var response;
    this.httpClient.get("https://flask-env.eba-yimrhp5p.us-east-2.elasticbeanstalk.com/association?word=" + word).subscribe(data => {
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
      let url: string = "http://flask-env.eba-yimrhp5p.us-east-2.elasticbeanstalk.com/postquizidentifiers?guid=" + guid + "&age=" + 
      + age + "&email=" + email + "&visuallyimpaired=" + visually_impaired;
    return this.httpClient.get(url).subscribe(data => {
      console.log(data)
    });
  }
  
  postQuizResults(guid: string, test: string) {
    let url: string = "http://flask-env.eba-yimrhp5p.us-east-2.elasticbeanstalk.com/postquizresults?guid=" + guid + "&test=" + 
      test;
    return this.httpClient.get(url).subscribe(data => {
      console.log(data)
    });
  }

  loadStoriesFromDB() {
    return (this.httpClient.get("http://flask-env.eba-yimrhp5p.us-east-2.elasticbeanstalk.com/stories"));
  }

  loadNationalGeographicFromDB() {
    return (this.httpClient.get("http://flask-env.eba-yimrhp5p.us-east-2.elasticbeanstalk.com/nationalgeographic"));
  }

  loadStoriesFromMockDB() {
    return of(MOCKSIMPLIFICATION);
  }

  
}
