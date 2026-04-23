import { Component, HostListener, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
    imports: [
        TranslateModule,
        RouterLink,
        NgOptimizedImage
    ],
  standalone: true
})
export class ServicesComponent implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const cards = this.el.nativeElement.querySelectorAll('.service-card') as NodeListOf<HTMLElement>;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target as HTMLElement;
            const index = Number(card.dataset['index'] ?? 0);
            card.style.setProperty('--stagger-delay', `${index * 80}ms`);
            card.classList.add('is-visible');
            this.observer?.unobserve(card);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px 0px 0px' }
    );

    cards.forEach((card, i) => {
      card.dataset['index'] = String(i);
      this.observer?.observe(card);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const cards = this.el.nativeElement.querySelectorAll('.service-card');
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    }
  }
}
