import { Component, input, output } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Evento } from "../models/models";
@Component({
  selector: "app-event-card",
  imports: [DatePipe],
  template: `<article class="event-card" [class.closed]="!evento().activo">
    <div class="poster" [class.alt]="evento().id % 2 === 0">
      <span class="poster-tag">FESTHOLIC / LIVE</span>
      <div class="poster-beams" aria-hidden="true"></div>
      <div class="poster-title" aria-hidden="true">
        FEEL<br />THE NIGHT<span>✦</span>
      </div>
      <div class="date-stamp">
        <b>{{ evento().fecha | date: "dd" }}</b
        ><small>{{ evento().fecha | date: "MMM" }}</small>
      </div>
    </div>
    <div class="card-body">
      <span class="event-status"
        ><i></i>{{ evento().activo ? "VENTA ABIERTA" : "VENTA CERRADA" }}</span
      >
      <h3>{{ evento().nombre }}</h3>
      <p class="venue">◇ {{ evento().lugar }}</p>
      <div class="card-bottom">
        <span>{{ evento().fecha | date: "dd MMM yyyy" }}</span
        ><button class="secondary" (click)="seleccionar.emit(evento())">
          Ver evento →
        </button>
      </div>
    </div>
  </article>`,
})
export class EventCardComponent {
  evento = input.required<Evento>();
  seleccionar = output<Evento>();
}
