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
  private autoScrollInterval?: ReturnType<typeof setInterval>;
  private resumeTimeout?: ReturnType<typeof setTimeout>;
  private animationFrameId?: number;
  private grid?: HTMLElement;
  currentIndex = 0;
  dotsArray: number[] = [];
  private isHovered = false;
  private isManualScrolling = false;
  private readonly AUTO_SCROLL_DELAY = 1000;
  private readonly RESUME_AFTER_SCROLL_DELAY = 3000;
  private readonly SCROLL_DURATION = 700;
  private readonly onManualScrollBound = this.onManualScroll.bind(this);

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      const cards = this.el.nativeElement.querySelectorAll('.service-card') as NodeListOf<HTMLElement>;
      this.grid = this.el.nativeElement.querySelector('.services-grid') as HTMLElement;
      this.dotsArray = Array.from({ length: cards.length }, (_, i) => i);

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

      this.grid.addEventListener('scroll', this.onManualScrollBound, { passive: true });
      this.startAutoScroll();
    }, 0);
  }

  private startAutoScroll(): void {
    this.autoScrollInterval = setInterval(() => {
      if (!this.isHovered && !this.isManualScrolling) {
        this.scrollToNext();
      }
    }, this.AUTO_SCROLL_DELAY);
  }

  // ── Animazione custom con easing cubico (non tocca il page scroll) ──────────

  private getCardScrollLeft(index: number): number {
    if (!this.grid) return 0;
    const cards = this.el.nativeElement.querySelectorAll('.service-card') as NodeListOf<HTMLElement>;
    const card = cards[index] as HTMLElement;
    return (
      card.getBoundingClientRect().left -
      this.grid.getBoundingClientRect().left +
      this.grid.scrollLeft
    );
  }

  private smoothScroll(targetScrollLeft: number): void {
    if (!this.grid) return;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

    const start = this.grid.scrollLeft;
    const distance = targetScrollLeft - start;
    if (Math.abs(distance) < 1) return;

    // Disabilita scroll-snap durante l'animazione per evitare conflitti/jitter
    this.grid.style.scrollSnapType = 'none';

    const startTime = performance.now();
    const duration = this.SCROLL_DURATION;

    // Ease-in-out cubic
    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      this.grid!.scrollLeft = start + distance * ease(progress);
      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.animationFrameId = undefined;
        // Riattiva snap a fine animazione
        this.grid!.style.scrollSnapType = '';
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  // ── Navigazione pubblica ──────────────────────────────────────────────────

  scrollToNext(): void {
    const cards = this.el.nativeElement.querySelectorAll('.service-card') as NodeListOf<HTMLElement>;
    if (!cards.length) return;
    this.currentIndex = (this.currentIndex + 1) % cards.length;
    this.smoothScroll(this.getCardScrollLeft(this.currentIndex));
  }

  scrollToPrev(): void {
    const cards = this.el.nativeElement.querySelectorAll('.service-card') as NodeListOf<HTMLElement>;
    if (!cards.length) return;
    this.currentIndex = (this.currentIndex - 1 + cards.length) % cards.length;
    this.smoothScroll(this.getCardScrollLeft(this.currentIndex));
  }

  scrollToCard(index: number): void {
    const cards = this.el.nativeElement.querySelectorAll('.service-card') as NodeListOf<HTMLElement>;
    if (!cards.length || index < 0 || index >= cards.length) return;
    this.currentIndex = index;
    this.smoothScroll(this.getCardScrollLeft(this.currentIndex));
  }

  // ── Scroll manuale ────────────────────────────────────────────────────────

  private onManualScroll(): void {
    // Ignora gli scroll generati dall'animazione custom
    if (this.animationFrameId) return;
    this.isManualScrolling = true;
    clearTimeout(this.resumeTimeout);
    this.resumeTimeout = setTimeout(() => {
      this.isManualScrolling = false;
      this.syncCurrentIndex();
    }, this.RESUME_AFTER_SCROLL_DELAY);
  }

  private syncCurrentIndex(): void {
    if (!this.grid) return;
    const cards = this.el.nativeElement.querySelectorAll('.service-card') as NodeListOf<HTMLElement>;
    const gridRect = this.grid.getBoundingClientRect();
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs((card as HTMLElement).getBoundingClientRect().left - gridRect.left);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    this.currentIndex = closest;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    clearInterval(this.autoScrollInterval);
    clearTimeout(this.resumeTimeout);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.grid?.removeEventListener('scroll', this.onManualScrollBound);
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.isHovered = true;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.isHovered = false;
    this.syncCurrentIndex();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    const cards = this.el.nativeElement.querySelectorAll('.service-card');
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    }
  }
}
