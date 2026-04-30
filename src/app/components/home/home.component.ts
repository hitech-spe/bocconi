import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, inject } from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink, RouterOutlet} from "@angular/router";
import {AboutComponent} from "../about/about.component";
import {ServicesComponent} from "../services/services.component";
import {ContactComponent} from "../contact/contact.component";

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
        RouterOutlet
    ],
  standalone: true
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private host = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  showBackToTop = false;

  ngAfterViewInit(): void {
    const elements = this.host.nativeElement.querySelectorAll('.reveal-on-scroll') as NodeListOf<HTMLElement>;

    this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
