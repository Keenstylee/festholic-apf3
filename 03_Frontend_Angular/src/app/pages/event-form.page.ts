import { Component, inject, signal } from "@angular/core";
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ApiService } from "../services/api.service";
import { mensajeError } from "../shared/http";
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  template: `<section class="page narrow">
    <a routerLink="/admin/eventos">← Volver a administración</a>
    <h1>{{ id ? "Editar evento" : "Nuevo evento" }}</h1>
    @if (error()) {
      <p class="alert error" role="alert">{{ error() }}</p>
    }
    <form
      class="form-panel"
      [formGroup]="form"
      (ngSubmit)="guardar()"
      novalidate
    >
      <fieldset [disabled]="loading() || busy()">
        <label
          >Nombre del evento<input formControlName="nombre" maxlength="120"
        /></label>
        @if (invalido("nombre")) {
          <small class="field-error"
            >El nombre es obligatorio (máximo 120 caracteres).</small
          >
        }
        <label>Lugar<input formControlName="lugar" maxlength="160" /></label>
        @if (invalido("lugar")) {
          <small class="field-error"
            >El lugar es obligatorio (máximo 160 caracteres).</small
          >
        }
        <label
          >Afiche del evento<input
            formControlName="imagenUrl"
            maxlength="1000"
            placeholder="https://... o /eventos/afiche.jpg"
        /></label>
        @if (invalido("imagenUrl")) {
          <small class="field-error"
            >Usa una URL http/https o una imagen local de /eventos/ (máximo 1000
            caracteres).</small
          >
        }
        <p class="field-hint">
          Puedes usar el enlace del afiche original. Si queda vacío, se mostrará
          el nombre del evento.
        </p>
        <div class="form-row">
          <div>
            <label
              >Fecha<input type="date" formControlName="fecha" [min]="hoy"
            /></label>
            @if (invalido("fecha")) {
              <small class="field-error">Elige hoy o una fecha futura.</small>
            }
          </div>
          <div>
            <label
              >Capacidad<input
                type="number"
                formControlName="capacidad"
                min="1"
                max="2147483647"
                step="1"
            /></label>
            @if (invalido("capacidad")) {
              <small class="field-error"
                >Ingresa un entero positivo hasta 2147483647.</small
              >
            }
          </div>
        </div>
        @if (id) {
          <label class="check"
            ><input type="checkbox" formControlName="activo" /> Venta
            activa</label
          >
          <p class="muted">
            El backend mantendrá cerrada la venta si ya no quedan cupos.
          </p>
        }
        <button class="primary" [disabled]="busy() || loading()">
          {{ busy() ? "Guardando…" : "Guardar evento →" }}
        </button>
        <a routerLink="/admin/eventos">Cancelar</a>
      </fieldset>
    </form>
  </section>`,
})
export class EventFormPage {
  api = inject(ApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  id = Number(this.route.snapshot.paramMap.get("id")) || undefined;
  hoy = new Date().toLocaleDateString("en-CA");
  error = signal("");
  busy = signal(false);
  loading = signal(false);
  form = this.fb.nonNullable.group({
    nombre: [
      "",
      [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.maxLength(120),
      ],
    ],
    lugar: [
      "",
      [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.maxLength(160),
      ],
    ],
    fecha: [
      "",
      [
        Validators.required,
        (c: AbstractControl) =>
          c.value && c.value < this.hoy ? { pasado: true } : null,
      ],
    ],
    capacidad: [
      100,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(2147483647),
        Validators.pattern(/^\d+$/),
      ],
    ],
    imagenUrl: [
      "",
      [
        Validators.maxLength(1000),
        Validators.pattern(
          /^(https?:\/\/[^\s<>]+|\/eventos\/[a-zA-Z0-9._/-]+)?$/,
        ),
      ],
    ],
    activo: [true],
  });
  constructor() {
    if (this.id) void this.cargar();
  }
  invalido(k: "nombre" | "lugar" | "fecha" | "capacidad" | "imagenUrl") {
    const c = this.form.controls[k];
    return c.touched && c.invalid;
  }
  async cargar() {
    this.loading.set(true);
    try {
      const evento = await this.api.evento(this.id!);
      this.form.patchValue({ ...evento, imagenUrl: evento.imagenUrl ?? "" });
    } catch (e) {
      this.error.set(mensajeError(e));
      this.form.disable();
    } finally {
      this.loading.set(false);
    }
  }
  async guardar() {
    if (this.busy() || this.form.disabled) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.busy.set(true);
    this.error.set("");
    try {
      const v = this.form.getRawValue();
      await this.api.guardar(
        { ...v, nombre: v.nombre.trim(), lugar: v.lugar.trim() },
        this.id,
      );
      await this.router.navigateByUrl("/admin/eventos");
    } catch (e) {
      this.error.set(mensajeError(e));
    } finally {
      this.busy.set(false);
    }
  }
}
