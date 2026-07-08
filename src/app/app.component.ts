import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {RouterOutlet} from "@angular/router";
import {HeaderComponent} from "./shared/header/header.component";
import {SpinnerComponent} from "./shared/spinner/spinner.component";
import {FooterComponent} from "./shared/footer/footer.component";
import { DOCUMENT } from '@angular/common';

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
  private document = inject(DOCUMENT);

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('it');
    translate.use('it');

    // Sincronizza l'attributo lang del tag HTML con la lingua corrente
    this.document.documentElement.setAttribute('lang', translate.currentLang || 'it');
    translate.onLangChange.subscribe((event) => {
      this.document.documentElement.setAttribute('lang', event.lang);
    });
  }
}
