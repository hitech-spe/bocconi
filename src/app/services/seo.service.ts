import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private translate = inject(TranslateService);
  private currentKeyPrefix = '';

  constructor() {
    // Aggiorna automaticamente i metadati quando la lingua cambia
    this.translate.onLangChange.subscribe(() => {
      if (this.currentKeyPrefix) {
        this.updateSEO(this.currentKeyPrefix);
      }
    });
  }

  /**
   * Imposta e tiene traccia dei tag SEO basati sulle traduzioni.
   * @param keyPrefix Il prefisso dell'oggetto di traduzione (es. 'SEO.HOME')
   */
  trackSEO(keyPrefix: string): void {
    this.currentKeyPrefix = keyPrefix;
    this.updateSEO(keyPrefix);
  }

  /**
   * Imposta i metadati SEO in modo diretto (per pagine dinamiche o con dati custom).
   */
  updateDirectSEO(title: string, description: string, image?: string): void {
    this.currentKeyPrefix = ''; // Rimuove il tracciamento automatico dei file i18n
    
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });

    // Open Graph
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    
    const ogImage = image || 'https://bocconi.netlify.app/assets/images/logoNew.webp';
    this.metaService.updateTag({ property: 'og:image', content: ogImage });
  }

  private updateSEO(keyPrefix: string): void {
    this.translate.get(`${keyPrefix}.TITLE`).subscribe((title: string) => {
      this.titleService.setTitle(title);
      this.metaService.updateTag({ property: 'og:title', content: title });
    });

    this.translate.get(`${keyPrefix}.DESCRIPTION`).subscribe((description: string) => {
      this.metaService.updateTag({ name: 'description', content: description });
      this.metaService.updateTag({ property: 'og:description', content: description });
    });

    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://bocconi.netlify.app/assets/images/logoNew.webp' });
  }
}
