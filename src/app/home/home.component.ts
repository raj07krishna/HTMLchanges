import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
declare const htmldiff: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  htmlValue: string = '';
  htmlValueFormcontrol = new FormControl('');
  counter: number = 1;
  fileNames: string[] = ['htmlVersion1'];
  html: SafeHtml | null = null;
  firstFileName: string;
  secondFileName: string;
  selectedCount = 0

  constructor(private domSanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  update(value: any) {
    this.htmlValue = value.target.value;
  }

  saveHtml() {
    localStorage.setItem(
      'htmlVersion' + this.counter,
      JSON.stringify(this.htmlValue)
    );
    if (this.counter !== 1) {
      this.fileNames.push('htmlVersion' + this.counter);
    }
    this.counter++;
    localStorage.setItem('fileName', JSON.stringify(this.fileNames));
    // this.counter++
  }

  render() {
    this.html = this.domSanitizer.bypassSecurityTrustHtml(this.htmlValue);
  }

  showChanges() {
    this.checkFileNameSequence()

    let output = htmldiff(
      JSON.parse(localStorage.getItem(this.firstFileName)),
      JSON.parse(localStorage.getItem(this.secondFileName))
    );
    this.html = this.domSanitizer.bypassSecurityTrustHtml(output);
  }

  setComparison(event: any, filename: string) {
    if (event) {
      this.selectedCount++
      if (this.firstFileName) {
        if(this.firstFileName === filename){
          return
        }
        else {
          this.secondFileName = filename;
        }
      } else {
        this.firstFileName = filename;
      }
    } else {
      this.selectedCount--;
      if(this.firstFileName === filename){
        this.firstFileName = ''
      }
      if(this.secondFileName === filename){
        this.secondFileName = ''
      }
    }
  }

  checkFileNameSequence(){
    if (
      this.firstFileName.slice(this.firstFileName.length - 1) >
      this.secondFileName.slice(this.secondFileName.length - 1)
    ) {
      let temp = this.secondFileName
      this.secondFileName = this.firstFileName;
      this.firstFileName = temp
    }
  }
}
