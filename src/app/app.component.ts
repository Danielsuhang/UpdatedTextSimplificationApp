import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  UP_ARROW = 38
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  //Allows innerHTML to accept classes
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements OnInit {
  textContents: string;
  paragraphNumber: number;
  paragraphs: string[];
  selectedText: string = '';
  allSelectedWords: string[] = []
  serverData: any;
  chapterIndexes = []; // TODO: Implementation in progress 
  chapterDict = {};
  bookName: string = "Book";
  previewNextText: string;

  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.nextParagraph();
    }
    if (event.keyCode === KEY_CODE.UP_ARROW) {
      this.reset();
    }
    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.prevParagraph();
    }
  }

  ngOnInit() {
  }

  loadBookFromDB(title: string) {
    this.bookName = title;
    this.textContents = "Loading....";
    this.httpClient.get("http://127.0.0.1:5002/book?title=" + title).subscribe(data => {
      this.serverData = data as JSON;
      if (this.serverData.books == undefined) {
        console.log("Books attribute doesn't exist, error with load data");
        return;
      }
      this.chapterDict = this.serverData.chapters;
      var content = this.serverData.books;
      console.log(content);
      this.textContents = content;
      this.paragraphs = content;
      this.skipIrrelevantParagraphAndUpdate();    
    },
    error => {
      this.textContents = "Couldn't connect to server."
      this.paragraphs = error;
    });
  }

  loadStoriesFromDB() {
    this.textContents = "Loading...";
    this.httpClient.get("http://127.0.0.1:5002/stories").subscribe(data => {
      this.serverData = data as JSON;
      this.textContents = "Successfully Loaded!"
      if (this.serverData == undefined) {
        console.log("Attribute doesn't exist, error with load data");
        return;
      }
      console.log(this.serverData)

    },
    error => {
      this.textContents = "Couldn't connect to server."
      this.paragraphs = error;
    });
  }

  loadStory(simplified_text_pair) {
    console.log(simplified_text_pair)
    this.textContents = simplified_text_pair[0];
    this.selectedText = simplified_text_pair[1];
    this.allSelectedWords = this.selectedText.split(" ");
    console.log(this.allSelectedWords);
  }

  loadSampleText() {
    this.bookName = "Test Book - Instructions";
    this.textContents = "Use your arrow keys to navigate the book. \n" + 
      "Use the right arrow to move to the next paragraph, the left arrow to go back a paragraph, and the up arrow to restart the book."
  }

  nextParagraph() {
    if (this.paragraphNumber < this.paragraphs.length - 1) {
      this.paragraphNumber++;
      this.updateDisplayedText();
    } else {
      console.log("End of book hit.");
    }
  }

  prevParagraph() {
    if (this.paragraphNumber != 0) {
      --this.paragraphNumber;
      this.updateDisplayedText();
    } else {
      console.log("Beginning of book hit.");
    }
  }

  navigateToChapter(index: number) {
    if (index < 0 || index >= this.paragraphs.length) {
      console.log("Invalid Chapter Index");
      return;
    }
    this.paragraphNumber = index;
    this.updateDisplayedText();
  } 

  skipIrrelevantParagraphAndUpdate() {
    while (this.validParagraph() 
      && this.paragraphs[this.paragraphNumber].includes("Chapter") 
      && this.paragraphNumber < this.paragraphs.length - 1) {
      this.paragraphNumber++;
    }
    this.updateDisplayedText();
  }

  validParagraph() {
    return !(this.paragraphNumber < 0 
      || this.paragraphNumber >= this.paragraphs.length);
  }

  updateDisplayedText() {
    if (!this.validParagraph()) return false;
    this.selectedText = this.paragraphs[this.paragraphNumber];
    if (this.paragraphNumber < this.paragraphs.length - 1) {
      this.previewNextText = this.paragraphs[this.paragraphNumber + 1];
    }
  }

  loadWordAssociation(word: string) {
    this.httpClient.get("http://127.0.0.1:5002/association?word=" + word).subscribe(data => {
      var response = data as JSON;
      if (response == undefined) {
        console.log("Attribute doesn't exist, error with load data");
        return;
      }
      console.log(response)
    },
    error => {
      console.log("Failed to send request for load word association: " + error)
    });
  }

  extractWordAssociation(xhr: any) {
    if (xhr !== undefined) {
      var responseText = JSON.parse(xhr.target.responseText);
      var associatedWords = responseText.assoc_word;
      var originalWord = responseText.entry;
      if (associatedWords !== undefined && associatedWords.length !== 0) {
        console.log(this.bookName);
        this.allSelectedWords = this.allSelectedWords.map((x) => {
          if (x === originalWord) {
            return associatedWords[0];
          } else {
            return originalWord;
          }
        });
        console.log("Hit");

      }
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  reset() {
    this.paragraphNumber = 0;
    this.skipIrrelevantParagraphAndUpdate();
  }

}
