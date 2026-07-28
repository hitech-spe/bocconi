import { Context } from "@netlify/edge-functions";
import { HTMLRewriter } from "https://ghuc.cc/worker-tools/html-rewriter/index.ts";

interface SEOMetadata {
  title: string;
  desc: string;
  keywords: string;
  image?: string;
  htmlContent: string;
}

const BASE_DOMAIN = "https://bocconisrl.com";

const SERVICES_DATA: Record<string, SEOMetadata> = {
  "officina-meccanica": {
    title: "Officina Meccanica e Gomme | Bocconi Srl Massafra",
    desc: "Servizi di manutenzione e riparazione auto e furgoni a Massafra (TA). Tagliando in garanzia, pastiglie freni, cambio e equilibratura gomme, diagnosi elettronica Bosch.",
    keywords: "officina meccanica massafra, riparazione auto taranto, cambio gomme massafra, tagliando auto massafra, diagnosi elettronica bosch, gommista massafra",
    image: "assets/images/officinaMeccanica.webp",
    htmlContent: `
      <div class="seo-snapshot">
        <h1>Officina Meccanica - Bocconi Srl Massafra</h1>
        <h2>Manutenzione e riparazione professionale per auto, furgoni e veicoli commerciali</h2>
        <p>BOCCONI SRL offre un servizio di officina meccanica all'avanguardia a Massafra (TA) in Via Chiatona 26. Ci occupiamo della sicurezza e delle prestazioni del tuo veicolo a 360 gradi.</p>
        <h3>I nostri servizi di officina meccanica includono:</h3>
        <ul>
          <li><strong>Tagliando e Manutenzione programmata:</strong> Manutenzione professionale che preserva la garanzia del costruttore. Sostituzione olio, filtri e controllo 40 punti.</li>
          <li><strong>Freni e Sicurezza:</strong> Controllo e sostituzione di pastiglie, dischi, liquido freni e sistemi ABS.</li>
          <li><strong>Gomme e Assetto (Gommista):</strong> Vendita e montaggio pneumatici estivi, invernali e 4 stagioni. Servizio di convergenza computerizzata, equilibratura e deposito gomme stagionale.</li>
          <li><strong>Diagnosi Elettronica:</strong> Lettura centralina con computer diagnostico Bosch avanzato per individuare con precisione qualsiasi guasto.</li>
          <li><strong>Aria Condizionata:</strong> Sanificazione dell'abitacolo, ricarica gas refrigerante (R1234yf e R134a) e controllo perdite dell'impianto di climatizzazione.</li>
          <li><strong>Altri interventi:</strong> Cinghia di distribuzione, frizione, marmitte, batterie, e assistenza specialistica per auto elettriche ed ibride.</li>
        </ul>
        <p>Vuoi saperne di più o richiedere un preventivo gratuito? <a href="/contact">Contatta la nostra officina a Massafra</a>.</p>
      </div>
    `
  },
  "officina-carrozzeria": {
    title: "Carrozzeria e Ripristino Danni Auto | Bocconi Srl Massafra",
    desc: "Riparazione carrozzeria e raddrizzatura post-incidente a Massafra (TA). Levabolli da grandine (tecnica PDR), verniciatura a forno e detailing professionale.",
    keywords: "carrozzeria massafra, verniciatura forno massafra, riparazione grandine taranto, levabolli massafra, lucidatura auto massafra, carrozzeria auto puglia",
    image: "assets/images/officinaCarrozzeria.webp",
    htmlContent: `
      <div class="seo-snapshot">
        <h1>Officina Carrozzeria - Bocconi Srl Massafra</h1>
        <h2>Ripristino estetico e strutturale della carrozzeria con tecnologie all'avanguardia</h2>
        <p>La carrozzeria di BOCCONI SRL unisce artigianalità e tecnologia moderna per rimettere a nuovo il tuo veicolo. Offriamo un servizio completo che include anche la gestione diretta dei sinistri con le assicurazioni (RC Auto).</p>
        <h3>I nostri interventi di carrozzeria:</h3>
        <ul>
          <li><strong>Riparazione post-incidente:</strong> Servizi di raddrizzatura scocche su banco di riscontro, stuccatura millimetrica e riverniciatura completa o localizzata.</li>
          <li><strong>Verniciatura a forno:</strong> Cabine di verniciatura moderne con vernici ecologiche all'acqua per una finitura brillante e duratura pari al nuovo.</li>
          <li><strong>Tecnica PDR (Levabolli):</strong> Rimozione rapida di ammaccature e danni da grandine senza rovinare la vernice originale. Risparmi fino al 40% rispetto alla riparazione tradizionale!</li>
          <li><strong>Rigenerazione fari e plastiche:</strong> Saldatura di componenti in plastica e lucidatura di fari ingialliti o opacizzati dal tempo.</li>
          <li><strong>Auto Detailing e Lucidatura:</strong> Trattamento protettivo in 3 step per eliminare i micrograffi e far risplendere la vernice.</li>
        </ul>
        <p>Siamo a Massafra in Via Chiatona 26. <a href="/contact">Richiedi un preventivo per riparare la tua auto</a>.</p>
      </div>
    `
  },
  "edilizia": {
    title: "Impresa Edile e Ristrutturazioni Chiavi in Mano | Bocconi Srl",
    desc: "Progetti di ristrutturazione e lavori edili civili o industriali a Massafra e Taranto. Preventivi chiari, rispetto dei tempi e gestione bonus fiscali.",
    keywords: "edilizia massafra, ditta edile taranto, ristrutturazioni appartamenti massafra, bonus edilizia puglia, lavori edili taranto, ristrutturare casa",
    image: "assets/images/edilizia.jpeg",
    htmlContent: `
      <div class="seo-snapshot">
        <h1>Impresa Edile e Ristrutturazioni - Bocconi Srl</h1>
        <h2>Lavori edili civili e industriali con qualità certificata e trasparenza</h2>
        <p>Scegliere BOCCONI SRL per l'edilizia significa affidarsi a un partner serio e organizzato. Gestiamo l'intero cantiere, dalla progettazione burocratica alle finiture, offrendoti la serenità del servizio chiavi in mano.</p>
        <h3>Perché scegliere i nostri servizi edili:</h3>
        <ul>
          <li><strong>Preventivo dettagliato e fisso:</strong> Ogni singola voce di spesa è scritta e concordata in anticipo, escludendo sorprese o costi extra a fine lavori.</li>
          <li><strong>Cronoprogramma vincolante:</strong> Fissiamo per iscritto le date di inizio e fine cantiere e le rispettiamo rigorosamente.</li>
          <li><strong>Gestione detrazioni e Bonus Fiscali:</strong> Assistenza completa per accedere a Ecobonus, Bonus Ristrutturazioni e recupero fiscale in conformità con le leggi in vigore.</li>
          <li><strong>Materiali certificati:</strong> Utilizziamo esclusivamente materiali delle migliori marche del settore, offrendo una garanzia di 10 anni sulla struttura.</li>
          <li><strong>Pulizia del cantiere:</strong> Ci occupiamo della rimozione quotidiana di polvere e macerie per ridurre al minimo il disagio durante i lavori.</li>
        </ul>
        <p>Vuoi ristrutturare la tua casa o il tuo ufficio? <a href="/contact">Chiedi un sopralluogo gratuito a Massafra</a>.</p>
      </div>
    `
  },
  "vendita-veicoli": {
    title: "Vendita Auto e Furgoni Usati Garantiti | Bocconi Srl Massafra",
    desc: "Showroom di auto nuove, aziendali, Km 0 e furgoni commerciali usati a Massafra (Strada Statale Appia). IVA esposta per P.IVA e finanziamenti su misura.",
    keywords: "vendita furgoni massafra, veicoli commerciali usati taranto, furgoni usati puglia, auto km 0 puglia, auto usate garantite massafra, concessionario massafra",
    image: "assets/images/venditaIndustriali.jpeg",
    htmlContent: `
      <div class="seo-snapshot">
        <h1>Vendita Auto e Furgoni Usati e Km 0 - Bocconi Srl</h1>
        <h2>Ampia esposizione di autoveicoli e veicoli commerciali a Massafra</h2>
        <p>La nostra esposizione di veicoli si trova a Massafra (TA) in Contrada San Sergio snc, sulla Strada Statale Appia. Offriamo una selezione rigorosa di auto e furgoni commerciali ideali per privati, artigiani e aziende.</p>
        <h3>Il nostro parco auto e furgoni commerciali offre:</h3>
        <ul>
          <li><strong>Auto Usate Garantite:</strong> Utilitarie, berline e SUV plurimarca sottoposti a oltre 80 controlli meccanici prima della consegna.</li>
          <li><strong>Auto Aziendali e Km 0:</strong> Vetture recenti con sconti fino al 25% rispetto al listino del nuovo, con garanzia ufficiale ancora attiva.</li>
          <li><strong>Furgoni e Veicoli Commerciali:</strong> Doblò, Fiorino, Transit, Ducato, furgonati e cassonati con IVA esposta e interamente deducibili per possessori di Partita IVA.</li>
          <li><strong>Veicoli Elettrici e Ibridi:</strong> Soluzioni moderne ed ecologiche a basse emissioni con ecobonus e vantaggi fiscali.</li>
          <li><strong>Finanziamenti e Permute:</strong> Valutiamo il tuo usato e strutturiamo finanziamenti personalizzati a tassi agevolati.</li>
        </ul>
        <p>Vieni a trovarci o scopri le nostre offerte online! <a href="/annunci">Sfoglia il nostro catalogo annunci</a>.</p>
      </div>
    `
  },
  "demolizioni-industriali": {
    title: "Demolizioni Industriali, Civili e Bonifiche | Bocconi Srl",
    desc: "Servizi di demolizione controllata di capannoni, strutture in ferro e impianti industriali complessi in tutta Italia con smaltimento e recupero materiali.",
    keywords: "demolizioni industriali taranto, smantellamento capannoni puglia, demolizione strutture acciaio, bonifica siti industriali, ditta demolizioni italia",
    image: "assets/images/demolizioni.jpeg",
    htmlContent: `
      <div class="seo-snapshot">
        <h1>Demolizioni Industriali e Civili - Bocconi Srl</h1>
        <h2>Interventi di demolizione sicuri, rapidi e certificati in tutta Italia</h2>
        <p>BOCCONI SRL dispone di un parco macchine specializzato e di personale altamente qualificato per eseguire demolizioni civili, industriali e strutturali di qualsiasi complessità tecnica.</p>
        <h3>I nostri servizi in ambito industriale:</h3>
        <ul>
          <li><strong>Demolizione di strutture complesse:</strong> Abbattimento controllato di capannoni industriali, impianti chimici dismessi, serbatoi, ciminiere e strutture in acciaio.</li>
          <li><strong>Operatività su tutto il territorio nazionale:</strong> Organizziamo cantieri ed eseguiamo demolizioni in tutta Italia, garantendo tempi rapidi ed efficienza.</li>
          <li><strong>Gestione rifiuti e rottami:</strong> Ci occupiamo direttamente della separazione, del carico e del trasporto di tutti i materiali risultanti, avviandoli a smaltimento o recupero.</li>
          <li><strong>Sicurezza certificata:</strong> Tutte le operazioni sono programmate nei minimi dettagli e svolte nel pieno rispetto delle norme di sicurezza nei cantieri.</li>
          <li><strong>Bonifica aree:</strong> Ripristino e livellamento del terreno post-demolizione per preparare l'area a nuovi progetti edilizi.</li>
        </ul>
        <p>Hai un progetto di demolizione strutturale? <a href="/contact">Richiedi un sopralluogo tecnico gratuito</a>.</p>
      </div>
    `
  },
  "recupero-smaltimento-ferroso": {
    title: "Recupero Rottami e Autodemolizione | Bocconi Srl Massafra",
    desc: "Raccolta e smaltimento metalli ferrosi e non (rame, alluminio, ottone) a Massafra e Taranto. Centro autodemolizioni autorizzato con pratiche PRA/ACI gratuite.",
    keywords: "recupero rottami massafra, smaltimento metalli taranto, vendita rame usato, autodemolizione massafra, rottamazione auto tarantola, smaltimento ferroso",
    image: "assets/images/recuperoSmaltimento.jpeg",
    htmlContent: `
      <div class="seo-snapshot">
        <h1>Recupero Rottami Metalli e Autodemolizione - Bocconi Srl</h1>
        <h2>Sostenibilità e valore per i tuoi scarti metallici e veicoli fuori uso</h2>
        <p>Il recupero dei metalli è un'attività fondamentale per la tutela dell'ambiente e l'economia circolare. Offriamo ad aziende ed officine tariffe competitive e tracciabilità totale per ogni tipologia di scarto ferroso e metallico.</p>
        <h3>I nostri servizi per il recupero metalli e rottamazione:</h3>
        <ul>
          <li><strong>Ritiro Rottami Ferrosi:</strong> Raccolta di lamiere, travi in ferro, macchinari obsoleti e residui di lavorazione industriale con valutazione al chilo basata sui listini giornalieri.</li>
          <li><strong>Metalli Non Ferrosi:</strong> Quotazioni massime di mercato per rame (cavi elettrici, tubature), alluminio, ottone, bronzo, acciaio inossidabile e batterie esauste.</li>
          <li><strong>Smontaggio impianti:</strong> Squadre attrezzate per la dismissione di linee di produzione industriali direttamente in loco.</li>
          <li><strong>Autodemolizione autorizzata:</strong> Centro di raccolta autorizzato per la rottamazione di veicoli incidentati o vecchi. Offriamo il recupero del veicolo a domicilio con carroattrezzi e la gestione completa delle pratiche di radiazione PRA/ACI.</li>
        </ul>
        <p>Massimizza il valore dei tuoi scarti metallici. <a href="/contact">Contattaci per una quotazione dei tuoi metalli</a>.</p>
      </div>
    `
  },
  "revisioni-collaudi": {
    title: "Centro Revisioni Ministeriali Auto, Moto e Furgoni | Bocconi Srl",
    desc: "Revisione periodica ufficiale MCTC per auto, motocicli, scooter e veicoli commerciali a Massafra. Servizio di pre-revisione e gestione collaudi gancio traino.",
    keywords: "centro revisioni massafra, revisione auto taranto, revisione moto massafra, collaudo mctc massafra, pre-revisione gratuita, rinnovo libretto auto",
    image: "assets/images/revisione.jpeg",
    htmlContent: `
      <div class="seo-snapshot">
        <h1>Centro Revisioni e Collaudi MCTC - Bocconi Srl</h1>
        <h2>Controlli tecnici e collaudi ufficiali per viaggiare in totale sicurezza</h2>
        <p>Il centro revisioni di BOCCONI SRL a Massafra in Via Chiatona 26 è autorizzato dal Ministero dei Trasporti per l'effettuazione dei controlli periodici obbligatori su veicoli fino a 35 quintali.</p>
        <h3>Tutti i servizi del nostro centro tecnico:</h3>
        <ul>
          <li><strong>Revisione Auto e Furgoni:</strong> Controllo ufficiale dei parametri di sicurezza (freni, fari, gas di scarico, stato pneumatici) previsto dalla legge a 4 anni dalla prima immatricolazione e successivamente ogni 2 anni.</li>
          <li><strong>Revisione Moto e Scooter:</strong> Linea di controllo dedicata alle due ruote per ogni cilindrata e modello.</li>
          <li><strong>Pre-Revisione Gratuita:</strong> Un controllo preventivo gratuito eseguito dai nostri meccanici nei giorni precedenti la revisione ufficiale. Ideale per risolvere piccoli problemi (lampadine bruciate, freni logori) ed evitare l'esito 'Ripetere'.</li>
          <li><strong>Collaudi Speciali:</strong> Assistenza burocratica e tecnica per l'installazione del gancio traino, installazione impianti GPL, collaudi di veicoli di importazione e duplicazione libretti di circolazione.</li>
        </ul>
        <p>Non rischiare sanzioni, verifica la scadenza della tua revisione! <a href="/contact">Prenota un appuntamento nel nostro centro</a>.</p>
      </div>
    `
  },
  "targhe-gialle-atp": {
    title: "Targhe Gialle Ripetitrici e Rinnovi Certificato ATP | Bocconi Srl",
    desc: "Pratiche per targhe gialle e rinnovo certificazioni ATP per autoveicoli frigoriferi e trasporto merci deperibili a temperatura controllata a Massafra.",
    keywords: "targhe gialle massafra, rinnovo certificato atp taranto, trasporti frigoriferi puglia, pratiche motorizzazione massafra, targa ripetitrice rimorchio",
    image: "assets/images/targheGialle.jpeg",
    htmlContent: `
      <div class="seo-snapshot">
        <h1>Targhe Gialle e Certificazioni ATP - Bocconi Srl</h1>
        <h2>Consulenza professionale e gestione pratiche per autotrasporto speciale</h2>
        <p>La burocrazia legata ai veicoli commerciali e ai trasporti speciali richiede competenze precise. BOCCONI SRL supporta trasportatori ed aziende fornendo soluzioni rapide per le certificazioni obbligatorie.</p>
        <h3>I nostri servizi per i trasporti speciali:</h3>
        <ul>
          <li><strong>Emissione Targhe Gialle:</strong> Gestione delle pratiche presso la Motorizzazione Civile per l'assegnazione e l'emissione delle targhe gialle ripetitrici destinate a carrelli appendice, rimorchi e porta biciclette.</li>
          <li><strong>Certificazioni e Rinnovi ATP:</strong> Il certificato ATP è obbligatorio per i veicoli isotermici e frigoriferi che trasportano alimenti deperibili. Ci occupiamo dei controlli e del rinnovo periodico dell'attestazione (scadenze a 6, 9 e 12 anni).</li>
          <li><strong>Verifiche periodiche:</strong> Assistenza tecnica per i controlli obbligatori di sicurezza sui mezzi speciali e allestiti.</li>
          <li><strong>Archivio Scadenze Clienti:</strong> Teniamo traccia delle scadenze dei tuoi certificati ATP e ti avvisiamo noi in tempo utile per effettuare il rinnovo, evitando fermi amministrativi.</li>
        </ul>
        <p>Mantieni in regola la tua flotta frigorifera o il tuo rimorchio. <a href="/contact">Chiedi informazioni sui tempi e costi delle pratiche</a>.</p>
      </div>
    `
  },
  "pneumatici-allestimenti-ricambi": {
    title: "Ricambi, Accessori Auto e Moto e Allestimenti | Bocconi Srl",
    desc: "Magazzino ricambi auto multimarca a Massafra. Allestimento personalizzato di furgoni, veicoli industriali e commerciali con componenti certificati.",
    keywords: "ricambi auto massafra, allestimento furgoni taranto, ricambi moto massafra, accessori veicoli commerciali, kit tagliando auto massafra",
    image: "assets/images/logoNew.webp",
    htmlContent: `
      <div class="seo-snapshot">
        <h1>Allestimento Veicoli Commerciali e Ricambi - Bocconi Srl</h1>
        <h2>Componenti di qualità e personalizzazioni su misura per privati e professionisti</h2>
        <p>Il nostro reparto ricambi ed accessori a Massafra offre componenti originali o di qualità equivalente per qualsiasi marca e modello di auto, moto o furgone, garantendo durata ed affidabilità nel tempo.</p>
        <h3>Cosa offriamo nel nostro magazzino ed officina allestimenti:</h3>
        <ul>
          <li><strong>Ricambi Meccanici e Motore:</strong> Filtri olio, aria e carburante, cinghie di trasmissione, pompe dell'acqua, kit frizione delle migliori marche come Bosch, Magneti Marelli, SKF.</li>
          <li><strong>Impianto Frenante e Sospensioni:</strong> Dischi freno, pastiglie Brembo e TRW, ammortizzatori e bracci oscillanti per garantire una tenuta di strada ottimale.</li>
          <li><strong>Allestimenti Personalizzati:</strong> Progettiamo e realizziamo allestimenti per furgoni commerciali e camioncini, installando scaffalature, pianali in legno marino, protezioni interne, ganci traino e sponde idrauliche.</li>
          <li><strong>Kit Tagliando Completi:</strong> Pacchetti convenienza con olio motore certificato (Castrol, Selenia) e filtri con uno sconto speciale del 15% sul totale.</li>
          <li><strong>Componentistica per Moto e Scooter:</strong> Catene, corone, pignoni, batterie e pastiglie freno per scooter Honda, Piaggio, Yamaha, Vespa.</li>
        </ul>
        <p>Cerchi un pezzo di ricambio specifico o vuoi allestire il tuo furgone da lavoro? <a href="/contact">Richiedi un preventivo dettagliato</a>.</p>
      </div>
    `
  }
};

const PAGES_DATA: Record<string, Omit<SEOMetadata, "htmlContent"> & { htmlContent?: string }> = {
  "home": {
    title: "Bocconi Srl - Officina Meccanica, Carrozzeria e Veicoli Industriali Massafra",
    desc: "Bocconi Srl a Massafra (TA) è un'officina meccanica, carrozzeria e centro assistenza specializzato. Vendita auto usate, Km 0 e furgoni commerciali, edilizia e demolizioni.",
    keywords: "officina meccanica massafra, carrozzeria massafra, allestimento veicoli, veicoli commerciali massafra, demolizioni industriali, edilizia massafra, bocconi srl, soccorso stradale, furgoni usati",
    htmlContent: `
      <div class="seo-snapshot">
        <h1>Bocconi Srl - Concessionaria, Officina, Edilizia e Servizi Industriali</h1>
        <h2>Esperienza e professionalità al servizio del tuo veicolo e della tua azienda a Massafra (TA)</h2>
        <p>Benvenuto sul sito ufficiale di BOCCONI SRL. Siamo un punto di riferimento nella provincia di Taranto per una vasta gamma di servizi dedicati ad automobilisti, artigiani e grandi aziende. Operiamo in due sedi strategiche a Massafra:</p>
        <ul>
          <li><strong>Showroom Vendita Veicoli:</strong> Contrada San Sergio snc, Strada Statale Appia - Massafra (TA).</li>
          <li><strong>Officina Meccanica e Carrozzeria:</strong> Via Chiatona 26 - Massafra (TA).</li>
        </ul>
        
        <h3>I Nostri Servizi Principali:</h3>
        <ul>
          <li><a href="/services/officina-meccanica">Officina Meccanica e Gomme</a> - Manutenzione, tagliandi e pneumatici.</li>
          <li><a href="/services/officina-carrozzeria">Carrozzeria e Verniciatura</a> - Levabolli PDR, lucidatura e raddrizzatura post-incidente.</li>
          <li><a href="/services/edilizia">Impresa Edile e Ristrutturazioni</a> - Interventi edili chiavi in mano con detrazioni fiscali.</li>
          <li><a href="/services/vendita-veicoli">Vendita Auto e Furgoni</a> - Veicoli commerciali usati e auto Km 0 garantite.</li>
          <li><a href="/services/demolizioni-industriali">Demolizioni Industriali</a> - Smantellamento capannoni e impianti in tutta Italia.</li>
          <li><a href="/services/recupero-smaltimento-ferroso">Recupero Rottami e Autodemolizione</a> - Ritiro ferro, rame e rottamazione veicoli con pratiche PRA.</li>
          <li><a href="/services/revisioni-collaudi">Centro Revisioni MCTC</a> - Revisioni auto, moto e furgoni con pre-revisione gratuita.</li>
          <li><a href="/services/targhe-gialle-atp">Targhe Gialle e ATP</a> - Consulenza per trasporti frigoriferi e immatricolazioni speciali.</li>
          <li><a href="/services/pneumatici-allestimenti-ricambi">Allestimenti e Ricambi</a> - Componenti originali ed allestimenti furgoni da lavoro.</li>
        </ul>

        <h3>Perché scegliere Bocconi Srl?</h3>
        <p>Grazie ad un team multidisciplinare di esperti, attrezzature di ultima generazione e una consolidata esperienza nel settore automobilistico e industriale, BOCCONI SRL garantisce interventi rapidi, preventivi chiari e massima serietà professionale.</p>
        <p>Hai bisogno di informazioni o vuoi richiedere un preventivo gratuito? Visita la nostra pagina dei <a href="/contact">Contatti Bocconi Srl</a> o chiamaci subito.</p>
      </div>
    `
  },
  "about": {
    title: "Chi Siamo | Bocconi Srl Massafra - Riparazioni e Servizi Industriali",
    desc: "La storia, la mission e l'eccellenza di Bocconi Srl a Massafra (TA). Oltre 30 anni di esperienza in meccanica, carrozzeria, edilizia, allestimento veicoli e demolizioni.",
    keywords: "chi siamo bocconi srl, officina massafra, azienda bocconi srl, storia bocconi srl, ditta fiduciaria massafra",
    htmlContent: `
      <div class="seo-snapshot">
        <h1>Chi Siamo - La Storia e la Mission di Bocconi Srl</h1>
        <p>BOCCONI SRL è una realtà solida e dinamica specializzata in servizi per il settore automotive e industriale, con sede principale a Massafra (Taranto).</p>
        <p>Nata come officina meccanica e carrozzeria, l'azienda ha costantemente ampliato il proprio raggio d'azione investendo in tecnologie all'avanguardia e nella formazione di un team altamente qualificato. Oggi offriamo un pacchetto integrato di soluzioni che spaziano dalla manutenzione dei veicoli privati e commerciali alla vendita di furgoni, fino a importanti interventi di edilizia, demolizioni industriali e recupero metalli.</p>
        <h3>I nostri valori fondanti:</h3>
        <ul>
          <li><strong>Professionalità ed Onestà:</strong> Operiamo con la massima trasparenza, formulando preventivi realistici e scritti prima di ogni intervento.</li>
          <li><strong>Sicurezza e Certificazione:</strong> Tutti i nostri lavori sono eseguiti a regola d'arte in piena conformità con le leggi in vigore, utilizzando componenti certificati e garantiti.</li>
          <li><strong>Rispetto dell'Ambiente:</strong> Promuoviamo l'ecologia attraverso un centro autorizzato di autodemolizioni e la valorizzazione quotidiana dei rottami metallici ferrosi e non ferrosi.</li>
        </ul>
        <p>Siamo pronti ad assisterti per qualsiasi esigenza. Scopri l'elenco completo dei nostri <a href="/services">Servizi Bocconi Srl</a>.</p>
      </div>
    `
  },
  "services": {
    title: "Servizi e Assistenza | Bocconi Srl Massafra",
    desc: "Tutti i servizi di Bocconi Srl a Massafra (TA): officina meccanica, carrozzeria, allestimenti, vendita veicoli industriali, edilizia, demolizioni e pratiche ATP/Targhe Gialle.",
    keywords: "servizi bocconi srl, carrozzeria massafra, demolizioni taranto, targhe gialle atp, collaudi mctc, soccorso massafra, gommista massafra, ristrutturazioni taranto",
    htmlContent: `
      <div class="seo-snapshot">
        <h1>Servizi Professionali e Assistenza Specialistica - Bocconi Srl</h1>
        <h2>Soluzioni integrate per privati e aziende: officina, commercio e industria</h2>
        <p>BOCCONI SRL offre una gamma completa di servizi professionali suddivisi in tre grandi macro-aree per rispondere con precisione a qualsiasi esigenza:</p>
        
        <h3>1. Reparto Automotive (Officine e Centro Servizi)</h3>
        <p>Nelle nostre officine di Via Chiatona 26 a Massafra offriamo manutenzione completa:</p>
        <ul>
          <li><a href="/services/officina-meccanica">Officina Meccanica</a>: manutenzione ordinaria, tagliandi, freni, diagnosi centraline Bosch.</li>
          <li><a href="/services/officina-carrozzeria">Carrozzeria e Verniciatura</a>: eliminazione graffi, verniciatura a forno, levabolli da grandine PDR.</li>
          <li><a href="/services/revisioni-collaudi">Centro Revisioni</a>: collaudi MCTC, controlli gas scarico e sicurezza, pre-revisione gratuita.</li>
          <li><a href="/services/pneumatici-allestimenti-ricambi">Gommista, Ricambi e Allestimenti</a>: pneumatici delle migliori marche, ricambi originali e accessori furgoni.</li>
        </ul>

        <h3>2. Settore Commercio e Logistica</h3>
        <ul>
          <li><a href="/services/vendita-veicoli">Vendita Auto e Furgoni</a>: showroom di veicoli commerciali usati con IVA esposta e automobili Km 0.</li>
          <li><a href="/services/targhe-gialle-atp">Pratiche Targhe Gialle e ATP</a>: gestione burocratica per targhe ripetitrici e certificati frigoriferi ATP.</li>
        </ul>

        <h3>3. Area Edilizia, Industria e Ambiente</h3>
        <ul>
          <li><a href="/services/edilizia">Impresa Edile</a>: ristrutturazioni edili civili e industriali chiavi in mano con agevolazioni fiscali.</li>
          <li><a href="/services/demolizioni-industriali">Demolizioni Industriali</a>: abbattimento controllato di capannoni e impianti in acciaio in tutta Italia.</li>
          <li><a href="/services/recupero-smaltimento-ferroso">Recupero Metalli e Rottami</a>: stoccaggio e acquisto di ferro, rame, ottone, alluminio e autodemolizioni.</li>
        </ul>
        <p>Hai domande sui nostri servizi? <a href="/contact">Contattaci subito per un preventivo gratuito</a>.</p>
      </div>
    `
  },
  "contact": {
    title: "Contatti e Preventivi Gratuiti | Bocconi Srl Massafra",
    desc: "Contatta Bocconi Srl a Massafra (TA) per informazioni e preventivi gratuiti per riparazioni meccaniche, carrozzeria, allestimenti o vendita furgoni commerciali usati.",
    keywords: "contatti bocconi srl, telefono officina massafra, preventivo carrozzeria massafra, indirizzo concessionario massafra, mail bocconi srl",
    htmlContent: `
      <div class="seo-snapshot">
        <h1>Contatti e Richiesta Preventivi - Bocconi Srl Massafra</h1>
        <h2>Siamo a tua completa disposizione per informazioni, appuntamenti e preventivi gratuiti</h2>
        <p>Hai bisogno di riparare la tua auto, allestire il tuo furgone, richiedere un sopralluogo edile o vendere scarti metallici? Il team di BOCCONI SRL è pronto a risponderti in tempi rapidissimi.</p>
        
        <h3>Informazioni di Contatto e Sedi Operative:</h3>
        <ul>
          <li><strong>Showroom Vendita Veicoli Commerciali e Auto:</strong><br>
              Contrada San Sergio snc, Strada Statale Appia - 74015 Massafra (TA)<br>
              Telefono Showroom: +39 376 1094228
          </li>
          <li><strong>Officina Meccanica, Carrozzeria e Centro Revisioni MCTC:</strong><br>
              Via Chiatona 26 - 74015 Massafra (TA)<br>
              Telefono Officina: +39 376 1094228
          </li>
          <li><strong>Contatti Email Generali:</strong><br>
              E-mail: amministrazionebocconisrl@gmail.com
          </li>
        </ul>

        <h3>Orari di Apertura:</h3>
        <p>Dal Lunedì al Venerdì: 08:30 - 13:00 | 15:30 - 19:30<br>
           Sabato: 08:30 - 13:00 | Pomeriggio Chiuso<br>
           Domenica: Chiuso</p>

        <p>Se preferisci inviarci una richiesta scritta per un preventivo di carrozzeria, officina o lavori edili, compila il modulo contatti presente sul nostro portale. Ti ricontatteremo entro 24 ore lavorative.</p>
      </div>
    `
  },
  "annunci": {
    title: "Veicoli Commerciali e Camion Usati Garantiti | Bocconi Srl",
    desc: "Sfoglia gli annunci e le offerte di furgoni, veicoli commerciali usati e camion garantiti da Bocconi Srl a Massafra (TA). Occasioni imperdibili per la tua attività.",
    keywords: "vendita camion usati massafra, furgoni usati taranto, veicoli commerciali usati puglia, furgoni usati massafra, vendita furgoni puglia, occasioni furgoni",
    htmlContent: `
      <div class="seo-snapshot">
        <h1>Annunci e Vendita Veicoli Commerciali Usati - Bocconi Srl</h1>
        <h2>Scopri le nostre migliori offerte su furgoni, autocarri e veicoli aziendali garantiti</h2>
        <p>BOCCONI SRL dispone di un ampio stock di veicoli commerciali usati pronti all'uso e revisionati per supportare il lavoro quotidiano di ditte, artigiani e commercianti a Massafra, Taranto e in tutta la Puglia.</p>
        <h3>Perché acquistare un veicolo commerciale da Bocconi Srl:</h3>
        <ul>
          <li><strong>Trasparenza totale:</strong> Chilometraggio certificato in fattura e storico dei tagliandi di manutenzione sempre disponibile.</li>
          <li><strong>IVA Esposta:</strong> Gran parte dei nostri furgoni usati dispone di IVA esposta al 22%, ideale per la detrazione fiscale da parte di ditte e Partite IVA.</li>
          <li><strong>Garanzia di Conformità:</strong> Tutti i mezzi usati sono coperti da garanzia legale di conformità di 12 mesi, estendibile a 24 mesi.</li>
          <li><strong>Controllo 80 Punti:</strong> Prima della messa in vendita, ogni autocarro viene provato su strada e controllato dai meccanici della nostra officina interna.</li>
        </ul>
        <p>Hai trovato un furgone di tuo interesse? Contattaci subito tramite telefono o WhatsApp per prenotare un test drive gratuito presso il nostro salone in Strada Statale Appia a Massafra. <a href="/contact">Chiedi informazioni sui finanziamenti disponibili</a>.</p>
      </div>
    `
  },
  "privacy": {
    title: "Informativa sulla Privacy | Bocconi Srl",
    desc: "Informativa completa sul trattamento dei dati personali e sulla privacy per gli utenti del sito web di Bocconi Srl, in piena conformità con il GDPR.",
    keywords: "privacy policy bocconi srl, trattamento dati personali gdpr"
  },
  "terms": {
    title: "Termini e Condizioni di Servizio | Bocconi Srl",
    desc: "Termini e condizioni generali d'uso per il portale web e per i servizi professionali offerti da Bocconi Srl ad aziende, ditte e privati.",
    keywords: "termini condizioni d'uso bocconi srl"
  }
};

export default async function handler(request: Request, context: Context) {
  const response = await context.next();

  // Elabora solo richieste HTML per evitare overhead su immagini, JS, CSS, ecc.
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("text/html")) {
    return response;
  }

  try {
    const url = new URL(request.url);
    const cleanPath = url.pathname.toLowerCase().split("#")[0].split("?")[0];

    let seo: SEOMetadata | null = null;
    let canonicalUrl = `${BASE_DOMAIN}${cleanPath === "/" ? "" : cleanPath}`;

    // 1. Identifica se la rotta fa parte dei dettagli dei servizi
    // Supportiamo sia /services/:id che /home/services/:id (apertura in modale)
    let serviceId = "";
    if (cleanPath.startsWith("/services/") && cleanPath.length > 10) {
      serviceId = cleanPath.substring(10);
    } else if (cleanPath.startsWith("/home/services/") && cleanPath.length > 15) {
      serviceId = cleanPath.substring(15);
    }

    if (serviceId && SERVICES_DATA[serviceId]) {
      seo = SERVICES_DATA[serviceId];
    } else {
      // 2. Altrimenti mappa le pagine principali statiche
      const routeKey = cleanPath === "/" || cleanPath === "" ? "home" : cleanPath.substring(1);
      if (PAGES_DATA[routeKey]) {
        const pageData = PAGES_DATA[routeKey];
        seo = {
          title: pageData.title,
          desc: pageData.desc,
          keywords: pageData.keywords,
          image: pageData.image,
          htmlContent: pageData.htmlContent || ""
        };
      }
    }

    // Se non troviamo una corrispondenza esatta per la rotta, usiamo i fallback di default della Home
    if (!seo) {
      seo = {
        title: PAGES_DATA["home"].title,
        desc: PAGES_DATA["home"].desc,
        keywords: PAGES_DATA["home"].keywords,
        image: PAGES_DATA["home"].image,
        htmlContent: PAGES_DATA["home"].htmlContent || ""
      };
    }

    const titleText = seo.title;
    const descText = seo.desc;
    const keywordsText = seo.keywords;
    const imageUrl = `${BASE_DOMAIN}/${seo.image || "assets/images/logoNew.webp"}`;

    // 3. Utilizza HTMLRewriter per iniettare i meta tag e il contenuto semantico all'Edge
    const rewriter = new HTMLRewriter()
      // Titolo pagina
      .on("title", {
        element(element) {
          element.setInnerContent(titleText);
        }
      })
      // Meta description
      .on("meta[name='description']", {
        element(element) {
          element.setAttribute("content", descText);
        }
      })
      // Meta keywords
      .on("meta[name='keywords']", {
        element(element) {
          element.setAttribute("content", keywordsText);
        }
      })
      // Open Graph Title
      .on("meta[property='og:title']", {
        element(element) {
          element.setAttribute("content", titleText);
        }
      })
      // Open Graph Description
      .on("meta[property='og:description']", {
        element(element) {
          element.setAttribute("content", descText);
        }
      })
      // Open Graph URL
      .on("meta[property='og:url']", {
        element(element) {
          element.setAttribute("content", canonicalUrl);
        }
      })
      // Open Graph Image
      .on("meta[property='og:image']", {
        element(element) {
          element.setAttribute("content", imageUrl);
        }
      })
      // Twitter Title
      .on("meta[name='twitter:title']", {
        element(element) {
          element.setAttribute("content", titleText);
        }
      })
      // Twitter Description
      .on("meta[name='twitter:description']", {
        element(element) {
          element.setAttribute("content", descText);
        }
      })
      // Twitter Image
      .on("meta[name='twitter:image']", {
        element(element) {
          element.setAttribute("content", imageUrl);
        }
      })
      // Iniezione tag Canonical dinamico sul server
      .on("head", {
        element(element) {
          element.append(`<link rel="canonical" href="${canonicalUrl}">`, { html: true });
        }
      })
      // Iniezione di contenuto HTML semantico all'interno di <app-root> per favorire i crawler no-JS
      .on("app-root", {
        element(element) {
          if (seo?.htmlContent) {
            element.setInnerContent(seo.htmlContent, { html: true });
          }
        }
      });

    return rewriter.transform(response);
  } catch (error) {
    console.error("Errore nell'esecuzione della Edge Function SEO:", error);
    return response;
  }
}

// Configura la Edge Function affinché venga eseguita su tutte le rotte HTML
export const config = {
  path: "/*"
};
