import {Component, OnInit, OnDestroy, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {Location} from "@angular/common";

interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  fullContent: string;
  translations?: {
    [locale: string]: {
      title: string;
      description: string;
      features: string[];
      fullContent: string;
    }
  };
}

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss'],
  imports: [
    RouterLink,
    TranslateModule
  ],
  standalone: true
})
export class ServiceDetailComponent implements OnInit, OnDestroy {
  service: Service | undefined;
  private langChangeSub: Subscription | undefined;

  private services: Service[] = [
    {
      id: 'officina-meccanica',
      title: 'Officina Meccanica',
      icon: '🔧',
      description: 'Interventi meccanici completi su auto, furgoni e veicoli industriali.',
      features: ['Diagnosi elettronica', 'Manutenzione ordinaria e straordinaria', 'Riparazioni motore e trasmissione', 'Assistenza tecnica specializzata'],
      fullContent: 'L’officina meccanica BOCCONI SRL garantisce interventi rapidi, precisi e professionali per mantenere ogni veicolo efficiente e sicuro nel tempo.',
      translations: {
        en: {
          title: 'Mechanical Workshop',
          description: 'Complete mechanical services for cars, vans and industrial vehicles.',
          features: ['Electronic diagnostics', 'Ordinary and extraordinary maintenance', 'Engine and transmission repairs', 'Specialized technical assistance'],
          fullContent: 'BOCCONI SRL mechanical workshop provides fast and professional services to keep each vehicle efficient and safe over time.'
        }
      }
    },
    {
      id: 'officina-carrozzeria',
      title: 'Officina Carrozzeria',
      icon: '🚚',
      description: 'Ripristino carrozzeria e verniciatura con finiture professionali.',
      features: ['Riparazione danni da urto', 'Verniciatura', 'Lucidatura e rifiniture', 'Ripristino estetico completo'],
      fullContent: 'Gestiamo interventi di carrozzeria su mezzi leggeri e pesanti, con attenzione ai dettagli e standard elevati di qualità.',
      translations: {
        en: {
          title: 'Bodywork Workshop',
          description: 'Professional bodywork restoration and painting services.',
          features: ['Crash damage repair', 'Painting', 'Polishing and finishing', 'Complete aesthetic restoration'],
          fullContent: 'We perform bodywork operations for light and heavy vehicles with great attention to detail and high quality standards.'
        }
      }
    },
    {
      id: 'edilizia',
      title: 'Edilizia',
      icon: '🏗️',
      description: 'Supporto operativo e tecnico per attività in ambito edilizio.',
      features: ['Lavori di supporto in cantiere', 'Fornitura mezzi e attrezzature', 'Assistenza operativa', 'Soluzioni su richiesta'],
      fullContent: 'Affianchiamo il settore edilizio con servizi dedicati e risorse adeguate a diverse tipologie di intervento.',
      translations: {
        en: {
          title: 'Construction',
          description: 'Operational and technical support for construction activities.',
          features: ['Site support works', 'Vehicles and equipment supply', 'Operational assistance', 'Custom solutions'],
          fullContent: 'We support construction activities with dedicated services and resources tailored to different project needs.'
        }
      }
    },
    {
      id: 'moto-caravan',
      title: 'Moto - Caravan',
      icon: '🏍️',
      description: 'Interventi e assistenza dedicata a moto e caravan.',
      features: ['Check-up tecnico', 'Manutenzione periodica', 'Riparazioni meccaniche', 'Servizi personalizzati'],
      fullContent: 'Forniamo servizi specifici per moto e caravan, assicurando affidabilità e performance in ogni stagione.',
      translations: {
        en: {
          title: 'Motorbike - Caravan',
          description: 'Dedicated services for motorbikes and caravans.',
          features: ['Technical check-up', 'Periodic maintenance', 'Mechanical repairs', 'Tailored services'],
          fullContent: 'We provide dedicated services for motorbikes and caravans, ensuring reliability and performance in every season.'
        }
      }
    },
    {
      id: 'vendita-veicoli',
      title: 'Vendita Furgoni - Auto - Veicoli Industriali',
      icon: '🚛',
      description: 'Ampia disponibilità di mezzi per privati e aziende.',
      features: ['Furgoni', 'Auto', 'Veicoli industriali', 'Consulenza all’acquisto'],
      fullContent: 'Offriamo soluzioni di vendita per diverse categorie di veicoli, con assistenza nella scelta del mezzo più adatto alle tue esigenze.',
      translations: {
        en: {
          title: 'Vans - Cars - Industrial Vehicles Sales',
          description: 'Wide range of vehicles for private customers and businesses.',
          features: ['Vans', 'Cars', 'Industrial vehicles', 'Purchase consulting'],
          fullContent: 'We offer sales solutions for different vehicle categories, helping you select the best option for your needs.'
        }
      }
    },
    {
      id: 'demolizioni-industriali',
      title: 'Demolizioni Industriali',
      icon: '🏭',
      description: 'Servizi di demolizione industriale in sicurezza e conformità.',
      features: ['Pianificazione interventi', 'Smontaggi industriali', 'Gestione operativa', 'Procedure di sicurezza'],
      fullContent: 'Realizziamo demolizioni industriali con processi controllati e personale qualificato, nel rispetto delle normative vigenti.',
      translations: {
        en: {
          title: 'Industrial Demolition',
          description: 'Safe and compliant industrial demolition services.',
          features: ['Intervention planning', 'Industrial dismantling', 'Operational management', 'Safety procedures'],
          fullContent: 'We carry out industrial demolitions with controlled processes and skilled personnel, in compliance with regulations.'
        }
      }
    },
    {
      id: 'recupero-smaltimento-ferroso',
      title: 'Recupero e Smaltimento Materiale Ferroso',
      icon: '♻️',
      description: 'Raccolta, recupero e corretta gestione del materiale ferroso.',
      features: ['Recupero materiale', 'Selezione e gestione', 'Smaltimento autorizzato', 'Logistica dedicata'],
      fullContent: 'Gestiamo il ciclo del materiale ferroso con processi organizzati e attenzione alla sostenibilità ambientale.',
      translations: {
        en: {
          title: 'Ferrous Material Recovery and Disposal',
          description: 'Collection, recovery and compliant handling of ferrous materials.',
          features: ['Material recovery', 'Selection and handling', 'Authorized disposal', 'Dedicated logistics'],
          fullContent: 'We manage the ferrous material cycle through organized processes and strong environmental focus.'
        }
      }
    },
    {
      id: 'revisioni-collaudi',
      title: 'Revisioni e Collaudi',
      icon: '✅',
      description: 'Controlli tecnici e collaudi per mantenere i mezzi in regola.',
      features: ['Revisioni periodiche', 'Pre-collaudo', 'Verifiche tecniche', 'Supporto documentale'],
      fullContent: 'Offriamo servizi di revisione e collaudo per garantire conformità, sicurezza e continuità operativa dei veicoli.',
      translations: {
        en: {
          title: 'Inspections and Testing',
          description: 'Technical inspections and tests to keep vehicles compliant.',
          features: ['Periodic inspections', 'Pre-testing', 'Technical checks', 'Document support'],
          fullContent: 'We provide inspections and testing services to ensure compliance, safety and operational continuity.'
        }
      }
    },
    {
      id: 'targhe-gialle-atp',
      title: 'Targhe Gialle - Verifiche Periodiche - ATP',
      icon: '🟨',
      description: 'Gestione pratiche e verifiche per targhe gialle e certificazioni ATP.',
      features: ['Pratiche targhe gialle', 'Verifiche periodiche', 'Servizi ATP', 'Assistenza amministrativa'],
      fullContent: 'Seguiamo tutto il processo tecnico e amministrativo per targhe gialle, verifiche periodiche e adempimenti ATP.',
      translations: {
        en: {
          title: 'Yellow Plates - Periodic Checks - ATP',
          description: 'Support for yellow plates, periodic checks and ATP services.',
          features: ['Yellow plate procedures', 'Periodic checks', 'ATP services', 'Administrative support'],
          fullContent: 'We handle technical and administrative processes for yellow plates, periodic checks and ATP requirements.'
        }
      }
    },
    {
      id: 'pneumatici-allestimenti-ricambi',
      title: 'Pneumatici, Allestimento Veicoli e Ricambi',
      icon: '🛞',
      description: 'Vendita e sostituzione pneumatici, allestimenti e ricambi.',
      features: ['Vendita pneumatici', 'Sostituzione pneumatici', 'Allestimento veicoli', 'Vendita ricambi'],
      fullContent: 'Dalla fornitura pneumatici ai ricambi, fino all’allestimento professionale dei veicoli: offriamo un servizio completo e affidabile.',
      translations: {
        en: {
          title: 'Tires, Vehicle Fittings and Spare Parts',
          description: 'Tire sales/replacement, vehicle fitting and spare parts.',
          features: ['Tire sales', 'Tire replacement', 'Vehicle fitting', 'Spare parts sales'],
          fullContent: 'From tire supply and spare parts to professional vehicle fitting, we deliver a complete and reliable service.'
        }
      }
    }
  ];

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.updateService(id);
    });

    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      const id = this.route.snapshot.params['id'];
      this.updateService(id);
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }

  private updateService(id: string): void {
    const rawService = this.services.find(s => s.id === id);
    if (rawService) {
      this.service = this.localizeService(rawService);
    }
  }

  private localizeService(service: Service): Service {
    const currentLang = this.translate.currentLang || 'it';
    if (currentLang === 'en' && service.translations?.['en']) {
      return {
        ...service,
        ...service.translations['en']
      };
    }
    return service;
  }

  closeModal(): void {
    this.location.back();
  }
}
