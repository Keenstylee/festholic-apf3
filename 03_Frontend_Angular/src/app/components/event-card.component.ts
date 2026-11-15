import { Component, input, output } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Evento } from "../models/models";
@Component({
  selector: "app-event-card",
  imports: [DatePipe],
  template: `<article class="event-card">
    <div class="poster" [class.alt]="evento().id % 2 === 0">
      <span>F / LIVE</span>
      <div class="orb"></div>
      <b
        >{{ evento().fecha | date: "dd"
        }}<small>{{ evento().fecha | date: "MMM" }}</small></b
      >
    </div>
    <div class="card-body">
      <span class="eyebrow">{{
        evento().activo ? "PRÓXIMO ENCUENTRO" : "VENTA CERRADA"
      }}</span>
      <h3>{{ evento().nombre }}</h3>
      <p>{{ evento().lugar }}</p>
      <div class="card-bottom">
        <span>{{ evento().fecha | date: "dd MMM yyyy" }}</span
        ><button class="secondary" (click)="seleccionar.emit(evento())">
          Ver evento ↗
        </button>
      </div>
    </div>
  </article>`,
})
export class EventCardComponent {
  evento = input.required<Evento>();
  seleccionar = output<Evento>();
}
