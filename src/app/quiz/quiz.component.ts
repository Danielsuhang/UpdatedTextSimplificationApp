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
    this.simplificationService.loadNationalGeographicFromDB()
      .subscribe(response => {
        var unprocessedResponse = response;
        this.simplification_list =
          this.processResponseToSimplification(unprocessedResponse);
        this.article_names = this.simplification_list
          .map(article => article.name.substring(0, article.name.length - 1));
        this.getNextQuestion();
      });
  }

  processResponseToSimplification(response: any): Simplification[] {
    if (response === undefined || response.article_names === undefined 
      || response.content === undefined) { 
        return null;
    }
    let article_names: string[] = 
      this.convertArticleNamesToArray(response.article_names);
    let content = JSON.parse(response.content);
    return article_names.map(name => 
      <Simplification> {
        name: name,
        original_text: content[name][0],
        simplified_text: content[name][1],
      }
    );
  }

  convertArticleNamesToArray(unprocessed_article_names: string): string[] {
    var article_names = unprocessed_article_names;
    var regex_remove_left_brackets = (/\[/);
    var regex_remove_right_brackets = (/\]/);
    var regex_remove_quotes = (/"/);
    article_names = article_names.split(regex_remove_left_brackets).join("");
    article_names = article_names.split(regex_remove_right_brackets).join("");
    article_names = article_names.split(regex_remove_quotes).join("");
    return article_names.split(",").map(name => name.trim());
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
    this.simplificationService.postQuizResults(this.guid, "Test");
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
