import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SEOService } from '../../services/seo.service';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent implements OnInit {
  private seoService = inject(SEOService);

  ngOnInit(): void {
    this.seoService.trackSEO('SEO.TERMS');
  }
}
