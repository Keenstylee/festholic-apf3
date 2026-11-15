import { Component, inject, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ApiService } from "../services/api.service";
import { AuthService } from "../services/auth.service";
import { Evento, Entrada } from "../models/models";
import { mensajeError } from "../shared/http";
@Component({
  imports: [DatePipe, ReactiveFormsModule, RouterLink],
  template: `<section class="page detail-page">
    <a class="back-link" routerLink="/eventos">← Volver a cartelera</a>
    @if (error()) {
      <p class="alert error" role="alert">{{ error() }}</p>
    }
    @if (evento(); as e) {
      <div class="event-banner">
        <div class="banner-beams" aria-hidden="true"></div>
        <div class="event-banner-content">
          <span class="pill-label">FESTHOLIC / EN VIVO</span>
          <h1>{{ e.nombre }}</h1>
          <div class="event-facts">
            <span>◷ {{ e.fecha | date: "fullDate" }}</span
            ><span>◇ {{ e.lugar }}</span>
          </div>
        </div>
        <span class="banner-star" aria-hidden="true">✦</span>
      </div>
      <div class="detail-layout">
        <div class="event-info">
          <span class="eyebrow">QUE NO TE LO CUENTEN</span>
          <h2>Prepárate para vivirlo<span class="accent">.</span></h2>
          <p>
            Hay momentos que se sienten mejor en persona. Elige cuántas entradas
            necesitas y asegura tu lugar en este encuentro.
          </p>
          <div class="info-grid">
            <div>
              <small>FECHA</small
              ><strong>{{ e.fecha | date: "dd MMM yyyy" }}</strong>
            </div>
            <div>
              <small>LUGAR</small><strong>{{ e.lugar }}</strong>
            </div>
            <div>
              <small>CAPACIDAD TOTAL</small
              ><strong>{{ e.capacidad }} personas</strong>
            </div>
            <div>
              <small>ESTADO DE VENTA</small
              ><strong>{{
                e.activo && e.fecha >= hoy ? "Abierta" : "Cerrada"
              }}</strong>
            </div>
          </div>
          <div class="event-note">
            <b>Tu entrada, siempre a mano.</b>
            <p>Después de confirmar, encontrarás tu compra en Mis entradas.</p>
          </div>
          <a class="secondary" routerLink="/eventos">Seguir explorando →</a>
        </div>
        <aside id="compra" class="form-panel purchase-panel">
          <span class="eyebrow">ELIGE TU EXPERIENCIA</span>
          <h2>Consigue tus entradas</h2>
          <p>Disponibilidad confirmada al comprar.</p>
          @if (compra(); as c) {
            <div class="alert success" role="status">
              ¡Compra confirmada! Entrada #{{ c.id }} ·
              {{ c.cantidad }} persona(s).
            </div>
            <a class="primary full" routerLink="/entradas"
              >Ver mis entradas →</a
            >
          } @else if (!e.activo || e.fecha < hoy) {
            <p class="alert">Este evento no está disponible para la venta.</p>
          } @else if (auth.usuario()) {
            <form [formGroup]="form" (ngSubmit)="comprar()">
              <div class="ticket-option">
                <div class="ticket-option-main">
                  <span class="event-status"><i></i>VENTA ABIERTA</span>
                  <h3>Acceso al evento</h3>
                  <p>{{ e.nombre }}</p>
                  <small>Selecciona la cantidad</small>
                </div>
                <div class="ticket-option-stub">
                  <label for="ticket-quantity">Cantidad</label>
                  <div class="quantity-stepper">
                    <button
                      type="button"
                      aria-label="Disminuir cantidad"
                      [disabled]="busy() || form.controls.cantidad.value <= 1"
                      (click)="cambiarCantidad(-1)"
                    >
                      −</button
                    ><input
                      id="ticket-quantity"
                      type="number"
                      min="1"
                      [max]="e.capacidad"
                      step="1"
                      formControlName="cantidad"
                    /><button
                      type="button"
                      aria-label="Aumentar cantidad"
                      [disabled]="
                        busy() || form.controls.cantidad.value >= e.capacidad
                      "
                      (click)="cambiarCantidad(1)"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              @if (form.controls.cantidad.touched && form.invalid) {
                <small class="field-error"
                  >Ingresa una cantidad entera entre 1 y
                  {{ e.capacidad }}.</small
                >
              }
              <div class="purchase-summary">
                <span>Tus entradas</span
                ><strong>{{ form.controls.cantidad.value }} persona(s)</strong>
              </div>
              <p class="muted">
                Compra para {{ auth.usuario()?.nombre }}. Esta compra registra
                tu entrada; no se realiza un cobro en línea.
              </p>
              <button class="primary full" [disabled]="busy()">
                {{ busy() ? "Confirmando…" : "Confirmar compra →" }}
              </button>
            </form>
          } @else {
            <div class="ticket-option guest-ticket">
              <div>
                <span class="eyebrow">ACCESO AL EVENTO</span>
                <h3>Tu lugar te espera.</h3>
                <p>Inicia sesión para elegir tus entradas.</p>
              </div>
            </div>
            <a
              class="primary full"
              routerLink="/login"
              [queryParams]="{ returnUrl: '/eventos/' + e.id }"
              >Iniciar sesión →</a
            >
          }
        </aside>
      </div>
    } @else if (!error()) {
      <p role="status">Cargando evento…</p>
    }
  </section>`,
})
export class DetailPage {
  api = inject(ApiService);
  auth = inject(AuthService);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  evento = signal<Evento | null>(null);
  compra = signal<Entrada | null>(null);
  error = signal("");
  busy = signal(false);
  hoy = new Date().toLocaleDateString("en-CA");
  form = this.fb.nonNullable.group({
    cantidad: [
      1,
      [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
    ],
  });
  constructor() {
    void this.cargar();
  }
  async cargar() {
    try {
      const e = await this.api.evento(
        Number(this.route.snapshot.paramMap.get("id")),
      );
      this.evento.set(e);
      this.form.controls.cantidad.addValidators(Validators.max(e.capacidad));
      this.form.controls.cantidad.updateValueAndValidity();
    } catch (e) {
      this.error.set(mensajeError(e));
    }
  }
  cambiarCantidad(delta: number) {
    if (this.busy()) return;
    const control = this.form.controls.cantidad;
    const actual = Number(control.value);
    const base = Number.isInteger(actual) ? actual : 1;
    control.setValue(
      Math.max(1, Math.min(this.evento()?.capacidad ?? 1, base + delta)),
    );
    control.markAsTouched();
  }
  async comprar() {
    if (this.busy()) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const e = this.evento(),
      u = this.auth.usuario();
    if (!e || !u || !this.auth.token()) {
      this.error.set("Inicia sesión nuevamente para comprar.");
      return;
    }
    this.busy.set(true);
    this.error.set("");
    try {
      this.compra.set(
        await this.api.comprar(u.id, e.id, this.form.getRawValue().cantidad),
      );
      await this.cargar();
    } catch (e) {
      this.error.set(mensajeError(e));
    } finally {
      this.busy.set(false);
    }
  }
}
