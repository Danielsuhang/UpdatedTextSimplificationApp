import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSidenav } from '@angular/material/sidenav';

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
  serverData: any;
  chapterIndexes = []; // TODO: Implementation in progress 
  chapterDict = {};
  bookName: string = "Book";

  previewNextText: string;

  constructor(private httpClient: HttpClient) {}

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
    this.paragraphNumber = 0;
    this.textContents = "No Text Detected, navigate to bookshare and fetch the text using the chrome extension."
    this.httpClient.get('http://127.0.0.1:5002/').subscribe(data => {
      console.log("Data Recieved..");
      console.log(data);
      this.serverData = data as JSON;
      this.textContents = this.serverData.books[0].content;
      //Removes weird / from dialogue texts
      this.textContents = this.textContents.replace(/\\/g, "");

      this.paragraphs = this.serverData.books[0].paragraphs;

      for (let i = 0; i < this.paragraphs.length; i++) {
        var paragraph = this.paragraphs[i];
        console.log(paragraph);
        if (paragraph.indexOf("Chapter") && paragraph.length < 10) {
          this.chapterIndexes.push(i);
        }
      }
      console.log(this.chapterIndexes);

       // Skip to text and update selected text with current paragraph.
      while (this.validParagraph() 
        && this.paragraphs[this.paragraphNumber].includes("Chapter") 
        && this.paragraphNumber < this.paragraphs.length - 1) {
        this.paragraphNumber++;
      }
      this.selectedText = this.paragraphs[this.paragraphNumber];
    });
  }

  loadBookFromDB(title: string = "Great Expectations") {
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

  getWordAssociation(word: string) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        console.log(this.responseText);
      }
    });

    xhr.open("GET", "https://twinword-word-graph-dictionary.p.rapidapi.com/association/?entry="+word);
    xhr.setRequestHeader("x-rapidapi-host", "twinword-word-graph-dictionary.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "884694c9f9msh86ce774b80786dcp191e83jsn6a5e6c22dd3f");

    xhr.send(word);
  }

  reset() {
    this.paragraphNumber = 0;
    this.skipIrrelevantParagraphAndUpdate();
  }

}
