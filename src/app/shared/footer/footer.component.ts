import { Component } from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
    imports: [
        TranslateModule,
        NgOptimizedImage,
        RouterLink
    ],
  standalone: true
})
export class FooterComponent {

}
