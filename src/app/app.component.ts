import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {RouterOutlet} from "@angular/router";
import {HeaderComponent} from "./shared/header/header.component";
import {SpinnerComponent} from "./shared/spinner/spinner.component";
import {FooterComponent} from "./shared/footer/footer.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SpinnerComponent
  ],
  standalone: true
})
export class AppComponent {
  title = 'hi-tech';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('it');
    translate.use('it');
  }
}
