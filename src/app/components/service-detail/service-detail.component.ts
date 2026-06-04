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
      description: 'Servizi completi di manutenzione e riparazione per auto e furgoni.',
      features: [
        'Tagliando e Manutenzione: Olio, filtri, liquidi.',
        'Freni e Sicurezza: Pastiglie, dischi, liquido freni, ABS. Controllo gratuito spessore pastiglie.',
        'Gomme e Assetto: Vendita e montaggio estive/invernali/4 stagioni. Convergenza, equilibratura, deposito gomme.',
        'Diagnosi Elettronica: Lettura centralina con computer per trovare il guasto reale.',
        'Aria Condizionata: Sanificazione, ricarica gas R1234yf/R134a, controllo perdite.',
        'Altri interventi: Distribuzione, frizione, motore, marmitte, batteria, tagliandi elettriche/ibride.'
      ],
      fullContent: 'BOCCONI SRL offre un servizio di officina all’avanguardia. Dalla manutenzione programmata che preserva la garanzia del costruttore alla diagnosi elettronica avanzata con sistemi Bosch, ci prendiamo cura della tua sicurezza e delle prestazioni del tuo veicolo.',
      translations: {
        en: {
          title: 'Mechanical Workshop',
          description: 'Complete maintenance and repair services for cars and vans.',
          features: [
            'Service & Maintenance: Oil, filters, fluids, 40-point checks. Manufacturer warranty maintained. From €89 for petrol cars.',
            'Brakes & Safety: Pads, discs, brake fluid, ABS. Free pad thickness check.',
            'Tires & Alignment: Summer/winter/4-season tires. Balancing, alignment, storage. Tires from €49 + VAT.',
            'Electronic Diagnostics: Bosch computer diagnostics to find the real fault. €39 (waived if repaired with us).',
            'Air Conditioning: Sanitization, R1234yf/R134a gas recharge, leak check.',
            'Other Interventions: Timing belt, clutch, engine, exhaust, battery, electric/hybrid service.'
          ],
          fullContent: 'BOCCONI SRL offers a state-of-the-art workshop service. From scheduled maintenance that preserves the manufacturer’s warranty to advanced electronic diagnostics with Bosch systems, we take care of your safety and vehicle performance.'
        }
      }
    },
    {
      id: 'officina-carrozzeria',
      title: 'Officina Carrozzeria',
      icon: '✨',
      description: 'Ripristino estetico e strutturale della carrozzeria con tecnologie all’avanguardia.',
      features: [
        'Riparazione post-incidente: Raddrizzatura, stuccatura e riverniciatura. Gestione diretta RC Auto.',
        'Eliminazione graffi: Lucidatura o riverniciatura localizzata senza aloni.',
        'Tecnica PDR (Levabolli): Rimozione ammaccature e danni da grandine senza toccare la vernice originale. Risparmio fino al 40%.',
        'Riverniciatura completa: Smontaggio, preparazione e verniciatura a forno per un effetto showroom.',
        'Plastiche e Fari: Saldatura plastiche e rigenerazione fari ingialliti/opachi.',
        'Detailing e Lucidatura: Trattamento 3 step + cera protettiva per far brillare la tua auto.'
      ],
      fullContent: 'La nostra carrozzeria combina artigianalità e tecnologia. Dalla gestione delle pratiche assicurative post-incidente alla cura dei minimi dettagli estetici con trattamenti di detailing, garantiamo un risultato eccellente e duraturo.',
      translations: {
        en: {
          title: 'Bodywork Workshop',
          description: 'Aesthetic and structural bodywork restoration with cutting-edge technologies.',
          features: [
            'Post-accident repair: Straightening, filling, and repainting. Direct insurance claim management.',
            'Scratch removal: Polishing or localized repainting without halos.',
            'PDR Technique (Paintless Dent Repair): Hail and dent removal without touching the original paint. Up to 40% cheaper.',
            'Full Respray: Complete disassembly, preparation, and oven painting for a showroom effect.',
            'Plastics & Headlights: Plastic welding and regeneration of yellowed/opaque headlights.',
            'Detailing & Polishing: 3-step treatment + protective wax to make your car shine.'
          ],
          fullContent: 'Our body shop combines craftsmanship and technology. From managing insurance claims to the finest aesthetic details with detailing treatments, we guarantee an excellent and lasting result.'
        }
      }
    },
    {
      id: 'edilizia',
      title: 'Edilizia',
      icon: '🏗️',
      description: 'Ristrutturazioni e interventi edilizi con trasparenza e qualità certificata.',
      features: [
        'Preventivo dettagliato: Ogni voce di costo è scritta, senza extra a sorpresa.',
        'Bonus e Detrazioni: Gestione pratiche 70%, Ecobonus e Ristrutturazioni per recupero fiscale in 10 anni.',
        'Cronoprogramma: Data inizio e fine lavori scritte e rispettate.',
        'Cantiere pulito: Ordine quotidiano e gestione immediata di polvere e macerie.',
        'Materiali certificati: Utilizzo esclusivo di prodotti di marca con garanzia 10 anni sulla struttura.'
      ],
      fullContent: 'Affidarsi a BOCCONI SRL per l’edilizia significa scegliere la serenità. Gestiamo l’intero processo, dalle pratiche burocratiche per i bonus fiscali alla consegna di un cantiere pulito e finito a regola d’arte.',
      translations: {
        en: {
          title: 'Construction',
          description: 'Renovations and construction interventions with transparency and certified quality.',
          features: [
            'Detailed Quote: Every cost item is written down, no surprise extras.',
            'Bonuses & Tax Deductions: We manage 70% Bonus, Ecobonus, and Renovation practices for tax recovery.',
            'Schedule: Written and respected start and end dates.',
            'Clean Site: Daily order and immediate management of dust and debris.',
            'Certified Materials: Exclusive use of brand-name products with a 10-year structural warranty.'
          ],
          fullContent: 'Relying on BOCCONI SRL for construction means choosing peace of mind. We manage the entire process, from bureaucratic procedures for tax bonuses to the delivery of a clean and professionally finished site.'
        }
      }
    },
    {
      id: 'moto-caravan',
      title: 'Noleggio Veicoli',
      icon: '🚗',
      description: 'Soluzioni di mobilità flessibili per ogni esigenza, dal breve al lungo termine.',
      features: [
        'City Car / Utilitarie: Fiat Panda, Toyota Yaris. Perfette per la città, consumi bassi. Assicurazione e soccorso inclusi.',
        'SUV e Station Wagon: Jeep Renegade, Fiat 500X, Skoda Octavia. Comfort e spazio per la famiglia.',
        'Furgoni Merci: Doblò, Ducato, Transit. Da 3 a 12mq, anche con gancio traino e ribaltabile.',
        'Furgoni Frigo e Speciali: Per catering, fioristi e trasporti specifici. Preventivo personalizzato.',
        'Noleggio Lungo Termine (12-60 mesi): Tutto incluso (bollo, assicurazione, manutenzione, gomme) a canone fisso.'
      ],
      fullContent: 'Che ti serva una piccola auto per la città o un furgone per il tuo lavoro, il nostro servizio di noleggio offre mezzi recenti, sicuri e con pacchetti tutto incluso per eliminare ogni pensiero.',
      translations: {
        en: {
          title: 'Vehicle Rental',
          description: 'Flexible mobility solutions for every need, from short to long term.',
          features: [
            'City Cars / Hatchbacks: Fiat Panda, Toyota Yaris. Perfect for the city, low consumption. Insurance and recovery included.',
            'SUVs & Station Wagons: Jeep Renegade, Fiat 500X, Skoda Octavia. Comfort and space for the family.',
            'Cargo Vans: Doblò, Ducato, Transit. From 3 to 12sqm, also with tow hook and tipper.',
            'Fridge & Special Vans: For catering, florists, and specific transports. Personalized quote.',
            'Long Term Rental (12-60 months): All-inclusive (tax, insurance, maintenance, tires) at a fixed rate.'
          ],
          fullContent: 'Whether you need a small car for the city or a van for your work, our rental service offers recent, safe vehicles with all-inclusive packages to eliminate all worries.'
        }
      }
    },
    {
      id: 'vendita-veicoli',
      title: 'Vendita Auto e Furgoni',
      icon: '🏷️',
      description: 'Vendita di veicoli nuovi, usati e aziendali con garanzia e risparmio.',
      features: [
        'Auto Usate Garantite: Utilitarie, SUV e berline controllate e certificate.',
        'Auto Km 0 e Aziendali: Sconti fino al 25% sul listino. Garanzia casa madre ancora valida.',
        'Furgoni e Veicoli Commerciali: Doblò, Transit, Ducato. IVA esposta, scaricabile per P.IVA. Prezzi da 9.900€ + IVA.',
        'Auto Elettriche e Ibride: Tesla, Fiat 500e, Toyota Hybrid. Incentivi statali e bassi costi di gestione.',
        'Permuta e Finanziamenti: Valutiamo il tuo usato e offriamo piani di finanziamento su misura.'
      ],
      fullContent: 'Il nostro showroom offre una selezione accurata di veicoli. Ogni auto o furgone viene sottoposto a rigorosi controlli prima della vendita per garantire affidabilità e massima trasparenza sul prezzo.',
      translations: {
        en: {
          title: 'Car and Van Sales',
          description: 'Sales of new, used, and corporate vehicles with warranty and savings.',
          features: [
            'Guaranteed Used Cars: Checked and certified hatchbacks, SUVs, and sedans.',
            'Km 0 & Corporate Cars: Up to 25% discount off list price. Manufacturer warranty still valid.',
            'Vans & Commercial Vehicles: Doblò, Transit, Ducato. VAT exposed, deductible for businesses. From €9,900 + VAT.',
            'Electric & Hybrid Cars: Tesla, Fiat 500e, Toyota Hybrid. State incentives and low running costs.',
            'Trade-in & Financing: We value your used car and offer tailored financing plans.'
          ],
          fullContent: 'Our showroom offers a carefully selected range of vehicles. Every car or van undergoes rigorous checks before sale to ensure reliability and maximum price transparency.'
        }
      }
    },
    {
      id: 'demolizioni-industriali',
      title: 'Demolizioni Industriali',
      icon: '🏗️',
      description: 'Demolizioni sicure, rapide e certificate per strutture complesse.',
      features: [
        'Demolizione Strutture: Capannoni, strutture in acciaio, impianti industriali e interni.',
        'Interventi in tutta Italia: Squadre specializzate pronte a operare su tutto il territorio nazionale.',
        'Smaltimento e Recupero: Gestione completa dei materiali di scarto e avvio al recupero.',
        'Sicurezza Certificata: Operazioni eseguite nel rispetto delle più stringenti norme di sicurezza.',
        'Bonifica Aree: Ripristino del sito post-demolizione pronto per nuovi utilizzi.'
      ],
      fullContent: 'Eseguiamo demolizioni industriali di ogni scala, utilizzando macchinari moderni e tecniche che massimizzano il recupero dei materiali, riducendo l’impatto ambientale e i costi per il cliente.',
      translations: {
        en: {
          title: 'Industrial Demolition',
          description: 'Safe, fast, and certified demolition for complex structures.',
          features: [
            'Structural Demolition: Warehouses, steel structures, industrial plants, and interiors.',
            'Nationwide Interventions: Specialized teams ready to operate across the country.',
            'Disposal & Recovery: Complete management of waste materials and start of recovery.',
            'Certified Safety: Operations performed in compliance with the strictest safety standards.',
            'Site Remediation: Post-demolition site restoration ready for new uses.'
          ],
          fullContent: 'We perform industrial demolitions of any scale, using modern machinery and techniques that maximize material recovery, reducing environmental impact and costs for the client.'
        }
      }
    },
    {
      id: 'recupero-smaltimento-ferroso',
      title: 'Sostenibilità e Recupero Metalli',
      icon: '♻️',
      description: 'Trasformiamo i tuoi scarti ferrosi in valore per l’ambiente e per te.',
      features: [
        'Rottame Ferroso: Ritiro travi, lamiere, scarti di lavorazione. Valutazione giornaliera al kg.',
        'Rottame Non Ferroso: Rame (fino a 8€/kg), alluminio, ottone, inox, cavi elettrici. Valutazione a parte.',
        'Demolizione Impianti: Smontaggio linee produttive e macchinari con recupero del valore del metallo.',
        'Cavi e Rame Rigenerato: Ritiro e spellatura cavi elettrici (interrati/sottomarini) con pagamento rame nudo.',
        'Autodemolizione: Ritiro veicoli da rottamare, pratiche ACI/PRA gratuite e carroattrezzi incluso.'
      ],
      fullContent: 'Il recupero dei metalli è il cuore della nostra visione sostenibile. Offriamo alle aziende un servizio tracciato e rapido, garantendo la massima quotazione di mercato per ogni tipologia di rottame.',
      translations: {
        en: {
          title: 'Sustainability and Metal Recovery',
          description: 'We transform your ferrous waste into value for the environment and for you.',
          features: [
            'Ferrous Scrap: Collection of beams, sheets, processing waste. Daily price per kg.',
            'Non-Ferrous Scrap: Copper (up to €8/kg), aluminum, brass, stainless steel, electric cables.',
            'Plant Dismantling: Disassembly of production lines and machinery with metal value recovery.',
            'Cables & Regenerated Copper: Collection and stripping of electric cables (underground/submarine).',
            'Car Demolition: Collection of vehicles to be scrapped, free ACI/PRA procedures, and towing included.'
          ],
          fullContent: 'Metal recovery is the heart of our sustainable vision. We offer companies a tracked and fast service, guaranteeing the highest market price for every type of scrap.'
        }
      }
    },
    {
      id: 'revisioni-collaudi',
      title: 'Revisioni e Collaudi',
      icon: '✅',
      description: 'Controlli tecnici ufficiali per viaggiare in totale sicurezza e regola.',
      features: [
        'Revisione Auto e Furgoni: Controllo ufficiale MCTC (freni, luci, emissioni) fino a 35q.',
        'Revisione Moto e Scooter: Per ogni cilindrata (50cc, 125cc, moto da strada/enduro).',
        'Collaudi Speciali: Importazione, cambio uso, montaggio gancio traino, duplicato libretto.',
        'Gestione Pratiche MCTC: Ci occupiamo noi di tutta la burocrazia con tempi certi.',
        'Pre-Revisione Gratuita: Controllo preventivo 7 giorni prima per evitare bocciature.'
      ],
      fullContent: 'Il nostro centro revisioni è autorizzato MCTC. Grazie alla pre-revisione gratuita, identifichiamo eventuali problemi prima del controllo ufficiale, facendoti risparmiare tempo e garantendo l’esito positivo.',
      translations: {
        en: {
          title: 'Inspections and Testing',
          description: 'Official technical checks to travel in total safety and compliance.',
          features: [
            'Car & Van Inspection: Official MCTC check (brakes, lights, emissions) up to 3.5t.',
            'Motorbike & Scooter Inspection: For every displacement (50cc, 125cc, road/enduro).',
            'Special Testing: Import, change of use, tow hook installation, duplicate logbook.',
            'MCTC Procedure Management: We handle all the bureaucracy with fixed times.',
            'Free Pre-Inspection: Preventive check 7 days before to avoid failure.'
          ],
          fullContent: 'Our inspection center is MCTC authorized. Thanks to the free pre-inspection, we identify any problems before the official check, saving you time and guaranteeing a positive outcome.'
        }
      }
    },
    {
      id: 'targhe-gialle-atp',
      title: 'Targhe Gialle - ATP',
      icon: '📋',
      description: 'Consulenza e gestione pratiche per trasporti speciali e verifiche periodiche.',
      features: [
        'Pratiche Targhe Gialle: Gestione completa per veicoli immatricolati con targhe ripetitrici.',
        'Certificazioni ATP: Rinnovi e verifiche per il trasporto di merci deperibili a temperatura controllata.',
        'Verifiche Periodiche: Assistenza per controlli obbligatori su attrezzature e veicoli speciali.',
        'Consulenza Normativa: Supporto per l’adeguamento ai regolamenti di trasporto vigenti.',
        'Archivio Scadenze: Ti avvisiamo noi quando è il momento di rinnovare le tue certificazioni.'
      ],
      fullContent: 'Gestiamo la complessità burocratica dei trasporti speciali. Dalle certificazioni ATP per la catena del freddo alle targhe gialle, assicuriamo che la tua flotta sia sempre in regola con le normative.',
      translations: {
        en: {
          title: 'Yellow Plates - ATP',
          description: 'Consulting and procedure management for special transports and periodic checks.',
          features: [
            'Yellow Plate Procedures: Complete management for vehicles registered with repeater plates.',
            'ATP Certifications: Renewals and checks for controlled temperature perishable goods transport.',
            'Periodic Checks: Assistance for mandatory checks on equipment and special vehicles.',
            'Regulatory Consulting: Support for compliance with current transport regulations.',
            'Deadline Archive: We notify you when it is time to renew your certifications.'
          ],
          fullContent: 'We manage the bureaucratic complexity of special transports. From ATP certifications for the cold chain to yellow plates, we ensure your fleet is always compliant with regulations.'
        }
      }
    },
    {
      id: 'pneumatici-allestimenti-ricambi',
      title: 'Ricambi e Accessori',
      icon: '📦',
      description: 'Vasto assortimento di componenti per la manutenzione e personalizzazione del tuo veicolo.',
      features: [
        'Meccanica e Motore: Filtri, cinghie, pompe, frizioni. Bosch, Magneti Marelli, SKF.',
        'Freni e Sospensioni: Dischi, pastiglie (kit da 39€), ammortizzatori Brembo, TRW.',
        'Carrozzeria e Luci: Paraurti, fari LED, specchietti anche per modelli recenti.',
        'Elettrico e Clima: Batterie, alternatori, compressori A/C. Test batteria gratuito.',
        'Kit Tagliando: Olio (Selenia, Castrol) + filtri con risparmio del 15% a pacchetto.',
        'Ricambi Moto: Catene, carene, batterie per Honda, Yamaha, Piaggio, Vespa.'
      ],
      fullContent: 'Il nostro magazzino ricambi offre componenti originali o di qualità equivalente per ogni marca e modello. Dalla meccanica all’estetica, trovi tutto il necessario per mantenere il tuo mezzo come nuovo.',
      translations: {
        en: {
          title: 'Spare Parts and Accessories',
          description: 'Wide range of components for the maintenance and customization of your vehicle.',
          features: [
            'Mechanics & Engine: Filters, belts, pumps, clutches. Bosch, Magneti Marelli, SKF.',
            'Brakes & Suspensions: Discs, pads (kits from €39), Brembo, TRW shock absorbers.',
            'Bodywork & Lights: Bumpers, LED headlights, mirrors also for recent models.',
            'Electric & Climate: Batteries, alternators, A/C compressors. Free battery test.',
            'Service Kit: Oil (Selenia, Castrol) + filters with 15% package savings.',
            'Motorbike Parts: Chains, fairings, batteries for Honda, Yamaha, Piaggio, Vespa.'
          ],
          fullContent: 'Our spare parts warehouse offers original or equivalent quality components for every make and model. From mechanics to aesthetics, you find everything needed to keep your vehicle like new.'
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
