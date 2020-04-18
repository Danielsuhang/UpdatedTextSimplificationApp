import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {SimplificationService} from '../service/simplification.service';

import {Simplification} from '../types/simplification';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  private sub: any;
  guid: string;

  simplification_list: Simplification[];
  article_names: string[];

  questionNumber: number = 0;
  question: string[] = [
    "Click on the text that is easier to read",
    "Click on the text that makes more sense",
    "Click on the text that I enjoyed reading more"
  ];

  // Question combination displayed on screen
  currentTitle: string;
  currentQuestion: string;
  currentOriginalText: string;
  currentSimplifiedText: string;

  constructor(private route: ActivatedRoute, private router: Router,
     private simplificationService: SimplificationService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (!this.idIsValid(params['id'])) {
        this.router.navigate([''])
      } else {
        this.guid = params['id'];
        this.getSimplification();
      }
    });
  }

  idIsValid(id: string): boolean {
    const idMatches = id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    return idMatches !== null;
  }

  getSimplification() {
    this.simplificationService.loadArticlesFromFirebase().subscribe(data => {
      var raw_simplification_list: Simplification[] = data.map(e => {
        return <Simplification>{
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Simplification
        }
      });
      this.simplification_list = raw_simplification_list;
      this.article_names = this.simplification_list
           .map(article => article.name.substring(0, article.name.length - 1));
      this.getNextQuestion();
    });
  }

  saveQuizAnswer(answer: string) {
    this.simplificationService.postQuizResults(
      this.guid, 
      this.currentTitle,
      this.currentQuestion,
      answer
    );
    this.getNextQuestion();
  }

  getNextQuestion() {
    if (this.questionNumber < (this.simplification_list.length * this.question.length)) {
      this.updateQuestion();
      this.questionNumber++;
    } else {
      this.exitQuiz();
    }
  }

  updateQuestion() {
    var simplification_index = Math.floor(this.questionNumber / this.question.length);
    var question_index = Math.floor(this.questionNumber % this.question.length)
    this.currentTitle = this.article_names[simplification_index];
    this.currentQuestion = this.question[question_index];
    this.currentOriginalText = this.simplification_list[simplification_index].original_text;
    this.currentSimplifiedText = this.simplification_list[simplification_index].simplified_text;
  }

  exitQuiz() {
    console.log("end");
    this.router.navigate(['/thankyou']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
