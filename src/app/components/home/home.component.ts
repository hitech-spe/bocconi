import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    inject,
    ViewChild,
    OnInit
} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink, RouterOutlet} from "@angular/router";
import {AboutComponent} from "../about/about.component";
import {ServicesComponent} from "../services/services.component";
import {ContactComponent} from "../contact/contact.component";
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [
        TranslateModule,
        RouterLink,
        AboutComponent,
        ServicesComponent,
        ContactComponent,
        RouterOutlet,
        CommonModule
    ],
    standalone: true
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('featureVideo') videoElement?: ElementRef<HTMLVideoElement>;
    private host = inject(ElementRef<HTMLElement>);
    private observer?: IntersectionObserver;

    showBackToTop = false;

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        const elements = this.host.nativeElement.querySelectorAll('.reveal-on-scroll') as NodeListOf<HTMLElement>;
        const featureSection = this.host.nativeElement.querySelector('.features') as HTMLElement;

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');

                        // Se l'elemento è la sezione features, avvia il video
                        if (entry.target === featureSection && this.videoElement?.nativeElement) {
                            const video = this.videoElement.nativeElement;
                            video.muted = true; // Assicuriamoci che sia mutato
                            video.playbackRate = 0.7; // Rallentiamo il video (1.0 è la velocità normale)
                            video.play().then(() => {
                                console.log('Video play iniziato con successo');
                            }).catch(err => {
                                console.warn('Video play fallito inizialmente, riprovo...', err);
                                // Tentativo di play dopo un piccolo delay se fallisce
                                setTimeout(() => {
                                    video.play().catch(pErr => console.error('Video play fallito definitivamente:', pErr));
                                }, 100);
                            });
                        }

                        // Disattiviamo l'unobserve per gli elementi generali se vogliamo che l'animazione
                        // si ripeta o se vogliamo essere sicuri che la logica del video non venga troncata.
                        // In realtà per il video ci basta che parta una volta.
                        this.observer?.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -10% 0px'
            }
        );

        elements.forEach((element) => this.observer?.observe(element));
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
    }

    @HostListener('window:scroll')
    onScroll(): void {
        this.showBackToTop = window.scrollY > 400;
    }

    scrollToTop(): void {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
}
