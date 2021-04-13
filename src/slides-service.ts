import * as marked from "marked";
import * as cheerio from "cheerio";
import * as vscode from "vscode";
import { Slide } from "./slide";
import { ConfigService } from "./config-service";

const mdToHtml = (md: string) => {
  return `
  <head>
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,600;1,400&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,600;1,400;1,600&display=swap');


  body {
    font-family: 'Nunito', sans-serif;
    font-family: 'Rubik', sans-serif;
  }
  .invisible {
    opacity: 0;
  }
  .grid {
    display: grid;
    height: 100vh;
    place-items: center;
  }
  h1 {
    font-size: 7vh;
  }
  p, ul li, ol li {
    font-size: 3vh;
    line-height: 5vh;
  }
  </style>
  </head>
  <body>
  <div class="grid">
    <div class="content">
      ${marked(md)}
    </div>
  </div>
  </body>
  `;
};

export class SlidesService {
  steps: Slide[] = [];
  currentStepNumber = -1;

  configService = ConfigService.getInstance();

  constructor(private textContent: string, private mdPath?: string) {
    const mdSlides = textContent.split("---");
    if (mdSlides.length < 1) throw Error("Invalid markdown content");
    this.steps = [];
    let slideNum = 0;
    let stepNumber = 0;

    for (let i = 0; i < mdSlides.length; i++) {
      const mdSlide = mdSlides[i];
      slideNum++;

      const html = mdToHtml(mdSlide);

      const $ = cheerio.load(html);

      // If saved file, fix image URLs with vscode-remote URLs
      if (mdPath?.indexOf("/") !== -1) {
        const mdPathFragments = ("" + mdPath).split("/");
        mdPathFragments.pop();
        const mdLocation = mdPathFragments.join("/");
        const imageElements = $("img");
        for (let j = 0; j < imageElements.length; j++) {
          const imageUrl = $(imageElements[j]).attr("src");
          $(imageElements[j]).attr(
            "src",
            `vscode-resource:${mdLocation}/${imageUrl}`
          );
        }
      }

      // Should bullets be staggered?
      const liElements = $("li");
      if (this.configService.isBulletsStagered && liElements.length) {
        $("li").addClass("invisible");
        this.steps.push(new Slide(mdSlide, $.html(), slideNum, ++stepNumber));
        for (let j = 0; j < liElements.length; j++) {
          $(`li:nth-child(${j + 1})`).removeClass("invisible");
          this.steps.push(new Slide(mdSlide, $.html(), slideNum, ++stepNumber));
        }
      } else {
        stepNumber++;
        this.steps.push(new Slide(mdSlide, $.html(), slideNum, ++stepNumber));
      }
    }
    this.currentStepNumber = 0;
  }

  get currentSlide() {
    return this.steps[this.currentStepNumber];
  }

  moveToNextSlide() {
    //TODO: Implement wrap around as a setting
    if (this.currentStepNumber < this.steps.length - 1) {
      this.currentStepNumber++;
    }
    return this.currentSlide;
  }

  moveToPrevSlide() {
    //TODO: Implement wrap around as a setting
    if (this.currentStepNumber > 0) {
      this.currentStepNumber--;
    }
    return this.currentSlide;
  }
}
