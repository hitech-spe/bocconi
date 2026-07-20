import { TestBed } from '@angular/core/testing';
import { SEOService } from './seo.service';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('SEOService', () => {
  let service: SEOService;
  let titleService: Title;
  let metaService: Meta;
  let translateService: TranslateService;
  let router: Router;

  const mockTranslateService = {
    onLangChange: of({ lang: 'it' }),
    currentLang: 'it',
    get: (key: string) => {
      if (key.endsWith('TITLE')) return of('Mock Title');
      if (key.endsWith('DESCRIPTION')) return of('Mock Description');
      if (key.endsWith('KEYWORDS')) return of('Mock Keywords');
      return of(key);
    }
  };

  const mockRouter = {
    events: of(),
    url: '/'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SEOService,
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: Router, useValue: mockRouter },
        Title,
        Meta
      ]
    });

    service = TestBed.inject(SEOService);
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
    translateService = TestBed.inject(TranslateService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set title and description directly', () => {
    spyOn(titleService, 'setTitle');
    spyOn(metaService, 'updateTag');

    service.updateDirectSEO('Direct Title', 'Direct Description');

    expect(titleService.setTitle).toHaveBeenCalledWith('Direct Title');
    expect(metaService.updateTag).toHaveBeenCalledWith({ name: 'description', content: 'Direct Description' });
  });
});
