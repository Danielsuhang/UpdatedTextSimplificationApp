import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

import { MOCKSIMPLIFICATION } from '../utils/mock_simplification';
import { DOCUMENT } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class SimplificationService {
  private static RESULTS = "QuestionResults";
  private static PARTICIPANTS = "participants";
  private static SIMPLIFICATION = "simplification";

  private static ADD_USER_SUCCESS_MESSAGE = "Simplification Service: Successfully added user.";

  serverData: any;
  curUser: any;
  allResults: any;

  constructor(private db: AngularFirestore) { }

  loadArticlesFromFirebase() {
    return this.db.collection(SimplificationService.SIMPLIFICATION).snapshotChanges();
  }

  postQuizIdentifiers(guid: string, age: number, student: boolean, visually_impaired: boolean) {
    this.db.collection(SimplificationService.PARTICIPANTS).doc(guid).set({
      guid: guid,
      age: age,
      student: student,
      visually_impaired: visually_impaired
    })
      .then(() => console.log(SimplificationService.ADD_USER_SUCCESS_MESSAGE))
      .catch((error) => console.log("Simplification Service: Error adding user: " + error));
  }

  postQuizResults(guid: string, articleName: string,
    question: string, answer: string) {
    this.db.collection(SimplificationService.PARTICIPANTS).get()
      .subscribe(res => {
        const curUser: any = res.docs.map(e => e.data())
        .find(e => e.guid === guid);
        this.db.collection(SimplificationService.RESULTS).doc(this.getDocumentNameFromArticleQuestionPair(articleName, question)).update({
          [guid]: {
            age: curUser.age,
            student: curUser.student,
            visually_impaired: curUser.visually_impaired,
            answer: answer
          }
        }).then(() => console.log(SimplificationService.ADD_USER_SUCCESS_MESSAGE));
      });
  }

  getDocumentNameFromArticleQuestionPair(articleName: string, question: string): string {
    const articleQuestion = articleName + " - " + this.getQuestionType(question);
    const questionToDocumentName = {
      "Shirley Chishol - easier": 'ShirleyChrisholEasierToRead',
      "Shirley Chishol - sense": 'ShirleyChrisholMakesMoreSense',
      "Shirley Chishol - enjoyed": 'ShirleyChrisholEnjoyment',
      "The Salem Witch Trial - easier": 'SalemWitchEasierToRead',
      "The Salem Witch Trial - sense": 'SalemWitchMakesMoreSense',
      "The Salem Witch Trial - enjoyed": 'SalemWitchEnjoyment',
    }
    if (questionToDocumentName[articleQuestion] === undefined) {
      console.log("Simplification Service: Mismatch in article question and document name: " + articleQuestion);
      return "";
    }
    console.log(questionToDocumentName[articleQuestion]);
    return questionToDocumentName[articleQuestion];
  }

  getQuestionType(question: string): string {
    if (question.includes('easier')) {
      return 'easier';
    }
    if (question.includes('sense')) {
      return 'sense';
    }
    if (question.includes('enjoyed')) {
      return 'enjoyed';
    }
    console.log("Simplification Service: Question Type Not Found")
    return '';
  }

  loadStoriesFromMockDB() {
    return of(MOCKSIMPLIFICATION);
  }


}
