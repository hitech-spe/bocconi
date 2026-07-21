import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private document = inject(DOCUMENT);

  private currentKeyPrefix = '';
  private readonly baseDomain = 'https://bocconisrl.com';

  constructor() {
    // 1. Aggiorna automaticamente i metadati quando la lingua cambia
    this.translate.onLangChange.subscribe(() => {
      if (this.currentKeyPrefix) {
        this.updateSEO(this.currentKeyPrefix);
      }
    });

    // 2. Ascolta la navigazione per gestire tag Canonical e auto-tracking delle pagine statiche
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.handleNavigation(event.urlAfterRedirects || event.url);
    });

    // 3. Inietta lo Schema JSON-LD Globale dell'attività all'avvio dell'applicazione
    this.injectGlobalSchema();
  }

  /**
   * Gestisce l'aggiornamento automatico dei meta tag per le rotte statiche principali
   * e assicura il ripristino corretto dei tag meta quando si chiudono le modali.
   */
  private handleNavigation(url: string): void {
    const cleanUrl = url.split('#')[0].split('?')[0];

    // Aggiorna sempre il tag Canonical
    this.updateCanonicalUrl(cleanUrl);

    // Mappa le rotte principali ai prefissi delle traduzioni i18n
    if (cleanUrl === '/home' || cleanUrl === '/' || cleanUrl === '') {
      this.trackSEO('SEO.HOME');
    } else if (cleanUrl === '/about') {
      this.trackSEO('SEO.ABOUT');
    } else if (cleanUrl === '/services') {
      this.trackSEO('SEO.SERVICES');
    } else if (cleanUrl === '/contact') {
      this.trackSEO('SEO.CONTACT');
    } else if (cleanUrl === '/login') {
      this.trackSEO('SEO.LOGIN');
    } else if (cleanUrl === '/annunci') {
      this.trackSEO('SEO.ANNOUNCEMENTS');
    } else if (cleanUrl === '/privacy') {
      this.trackSEO('SEO.PRIVACY');
    } else if (cleanUrl === '/terms') {
      this.trackSEO('SEO.TERMS');
    } else {
      // Se si naviga via da pagine con schemi specifici (es. annunci o servizi),
      // e non siamo su un dettaglio servizio (che imposta il suo schema), puliamo lo schema di pagina.
      if (!cleanUrl.includes('/services/')) {
        this.removePageSchema();
      }
    }
  }

  /**
   * Imposta e tiene traccia dei tag SEO basati sulle traduzioni i18n.
   * @param keyPrefix Il prefisso dell'oggetto di traduzione (es. 'SEO.HOME')
   */
  trackSEO(keyPrefix: string): void {
    this.currentKeyPrefix = keyPrefix;
    this.updateSEO(keyPrefix);
  }

  /**
   * Imposta i metadati SEO in modo diretto (per pagine dinamiche o dettagli).
   */
  updateDirectSEO(title: string, description: string, image?: string): void {
    this.currentKeyPrefix = ''; // Rimuove il tracciamento automatico dei file i18n
    this.updateTags(title, description, image);
  }

  /**
   * Aggiorna tutti i tag meta e social (Open Graph e Twitter Card).
   */
  private updateTags(title: string, description: string, image?: string, keywords?: string): void {
    const ogImage = this.getAbsoluteImageUrl(image);
    const cleanPath = this.router.url.split('#')[0].split('?')[0];
    const ogUrl = `${this.baseDomain}${cleanPath === '/' ? '' : cleanPath}`;
    const locale = this.translate.currentLang === 'en' ? 'en_US' : 'it_IT';

    // HTML Standard
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow' });
    
    if (keywords) {
      this.metaService.updateTag({ name: 'keywords', content: keywords });
    } else {
      this.metaService.updateTag({ name: 'keywords', content: 'officina meccanica massafra, carrozzeria massafra, allestimento veicoli, veicoli industriali, demolizioni, edilizia massafra, bocconi srl, soccorso massafra, vendita auto, furgoni, noleggio auto' });
    }

    // Open Graph (Facebook, LinkedIn, Whatsapp, ecc.)
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: ogUrl });
    this.metaService.updateTag({ property: 'og:image', content: ogImage });
    this.metaService.updateTag({ property: 'og:locale', content: locale });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Bocconi Srl' });

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: ogImage });
  }

  /**
   * Aggiorna o crea il tag <link rel="canonical"> nel head dell'HTML.
   */
  private updateCanonicalUrl(cleanPath: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    const path = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    // Evita slash finale doppio su home
    const canonicalHref = `${this.baseDomain}${path === '/' ? '' : path}`;
    link.setAttribute('href', canonicalHref);
  }

  /**
   * Converte percorsi immagine locali in URL assoluti pronti per la scansione.
   */
  private getAbsoluteImageUrl(image?: string): string {
    if (!image) {
      return `${this.baseDomain}/assets/images/logoNew.webp`;
    }
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    if (image.startsWith('assets/')) {
      return `${this.baseDomain}/${image}`;
    }
    if (image.startsWith('/assets/')) {
      return `${this.baseDomain}${image}`;
    }
    return `${this.baseDomain}/assets/images/${image}`;
  }

  private updateSEO(keyPrefix: string): void {
    this.translate.get(`${keyPrefix}.TITLE`).subscribe((title: string) => {
      this.translate.get(`${keyPrefix}.DESCRIPTION`).subscribe((description: string) => {
        this.translate.get(`${keyPrefix}.KEYWORDS`).subscribe((keywords: string) => {
          this.updateTags(title, description, undefined, keywords);
        });
      });
    });
  }

  /* ==========================================
     DATI STRUTTURATI (SCHEMA.ORG JSON-LD)
     ========================================== */

  /**
   * Inietta lo schema globale LocalBusiness / AutoRepair dell'azienda.
   */
  private injectGlobalSchema(): void {
    let script: HTMLScriptElement | null = this.document.getElementById('schema-global') as HTMLScriptElement;
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'schema-global';
      script.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(script);
    }

    const globalSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['AutoRepair', 'AutoDealer', 'LocalBusiness'],
          '@id': `${this.baseDomain}/#organization`,
          'name': 'Bocconi Srl',
          'legalName': 'Bocconi S.r.l.',
          'url': this.baseDomain,
          'logo': `${this.baseDomain}/assets/images/logoNew.webp`,
          'image': `${this.baseDomain}/assets/images/logoNew.webp`,
          'description': 'Bocconi Srl è un’officina meccanica, carrozzeria, allestimento veicoli, edilizia e vendita di veicoli commerciali a Massafra (Taranto).',
          'telephone': '+393761094228',
          'email': 'amministrazionebocconisrl@gmail.com',
          'priceRange': '$$',
          'paymentAccepted': 'Cash, Credit Card, Wire Transfer',
          'vatID': '03109890735',
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': 'Via Chiatona 26',
            'addressLocality': 'Massafra',
            'addressRegion': 'TA',
            'postalCode': '74015',
            'addressCountry': 'IT'
          },
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': 40.5640625,
            'longitude': 17.1263101
          },
          'openingHoursSpecification': [
            {
              '@type': 'OpeningHoursSpecification',
              'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              'opens': '08:00',
              'closes': '13:00'
            },
            {
              '@type': 'OpeningHoursSpecification',
              'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              'opens': '15:00',
              'closes': '18:30'
            },
            {
              '@type': 'OpeningHoursSpecification',
              'dayOfWeek': ['Saturday'],
              'opens': '08:00',
              'closes': '13:00'
            }
          ],
          'sameAs': [
            'https://www.facebook.com/share/1DP2zr846S/?mibextid=wwXIfr',
            'https://www.instagram.com/bocconiservice/'
          ]
        }
      ]
    };

    script.textContent = JSON.stringify(globalSchema, null, 2);
  }

  /**
   * Inietta o aggiorna lo schema specifico per la singola pagina.
   */
  updatePageSchema(schema: any): void {
    let script: HTMLScriptElement | null = this.document.getElementById('schema-page') as HTMLScriptElement;
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'schema-page';
      script.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema, null, 2);
  }

  /**
   * Rimuove lo schema di pagina per evitare conflitti quando si naviga altrove.
   */
  removePageSchema(): void {
    const script = this.document.getElementById('schema-page');
    if (script) {
      script.remove();
    }
  }

  /**
   * Genera e inietta lo schema dinamico per il dettaglio di un servizio specifico.
   */
  updateServiceSchema(service: any): void {
    if (!service) {
      this.removePageSchema();
      return;
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': `${service.title} | Bocconi Srl`,
      'description': service.description,
      'provider': {
        '@type': 'LocalBusiness',
        'name': 'Bocconi Srl',
        'url': this.baseDomain,
        'logo': `${this.baseDomain}/assets/images/logoNew.webp`
      },
      'areaServed': {
        '@type': 'AdministrativeArea',
        'name': 'Puglia'
      },
      'offers': {
        '@type': 'Offer',
        'priceCurrency': 'EUR',
        'availability': 'https://schema.org/InStock',
        'description': service.description
      }
    };

    this.updatePageSchema(schema);
  }

  /**
   * Genera e inietta lo schema dinamico per la lista degli annunci (ItemList & Products).
   */
  updateAnnouncementsSchema(announcements: any[]): void {
    if (!announcements || announcements.length === 0) {
      this.removePageSchema();
      return;
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Veicoli Commerciali e Industriali in Vendita | Bocconi Srl',
      'description': 'Sfoglia gli annunci e le offerte di veicoli industriali e commerciali usati e garantiti da Bocconi Srl a Massafra.',
      'numberOfItems': announcements.length,
      'itemListElement': announcements.slice(0, 15).map((ann, index) => {
        const annImage = ann.imageUrls && ann.imageUrls.length > 0 ? ann.imageUrls[0] : '';
        return {
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'Product',
            'name': ann.name,
            'image': this.getAbsoluteImageUrl(annImage),
            'description': ann.description || `${ann.name} - Anno ${ann.registrationDate || 'N/D'} - Km ${ann.km || 'N/D'}`,
            'offers': {
              '@type': 'Offer',
              'priceCurrency': 'EUR',
              'price': ann.link ? 'Contact for price' : 'Richiedi Prezzo',
              'itemCondition': 'https://schema.org/UsedCondition',
              'availability': 'https://schema.org/InStock',
              'url': `${this.baseDomain}/annunci`
            }
          }
        };
      })
    };

    this.updatePageSchema(schema);
  }
}
