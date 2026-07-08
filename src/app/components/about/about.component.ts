import { Component, OnInit, inject } from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {SEOService} from "../../services/seo.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [
    TranslateModule
  ],
  standalone: true
})
export class AboutComponent implements OnInit {
  private seoService = inject(SEOService);

  ngOnInit(): void {
    this.seoService.trackSEO('SEO.ABOUT');
  }
}
