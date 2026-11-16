import { Component, effect, input, signal } from "@angular/core";
import { Evento } from "../models/models";
@Component({
  selector: "app-event-poster",
  template: `<div
    class="event-poster"
    [class.poster-missing]="!url() || fallo()"
  >
    @if (url() && !fallo()) {
      <img
        [src]="url()"
        [alt]="'Afiche de ' + evento().nombre"
        loading="lazy"
        (error)="fallo.set(true)"
      />
    } @else {
      <div class="poster-placeholder" aria-hidden="true">
        <span>{{ evento().nombre.slice(0, 1) }}</span>
        <p>{{ evento().nombre }}</p>
      </div>
    }
  </div>`,
})
export class EventPosterComponent {
  evento = input.required<Pick<Evento, "nombre" | "imagenUrl">>();
  fallo = signal(false);
  constructor() {
    effect(() => {
      this.evento();
      this.fallo.set(false);
    });
  }
  url() {
    const value = this.evento().imagenUrl?.trim() ?? "";
    return /^(https?:\/\/[^\s<>]+|\/eventos\/[a-zA-Z0-9._/-]+)$/.test(value)
      ? value
      : "";
  }
}
