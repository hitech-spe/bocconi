import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent {}
