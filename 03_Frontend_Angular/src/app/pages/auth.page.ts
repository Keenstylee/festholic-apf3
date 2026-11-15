import { Component, inject, signal } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { mensajeError } from "../shared/http";
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  template: `<section class="auth-layout">
    <div class="auth-story">
      <span class="eyebrow">TU PRÓXIMA HISTORIA EMPIEZA AQUÍ</span>
      <h1>Hay noches<br />que se quedan<br /><em>contigo.</em></h1>
      <p>Encuentra tu evento. Reúne a tu gente.<br />Vívelo con Festholic.</p>
      <div class="story-symbol">✦</div>
    </div>
    <div class="form-panel">
      <span class="eyebrow">FESTHOLIC / MI CUENTA</span>
      <h2>{{ registro ? "Sé parte del encuentro" : "Qué bueno verte" }}</h2>
      <p>
        {{
          registro
            ? "Crea tu cuenta para comprar entradas."
            : "Ingresa para vivir tu próximo evento."
        }}
      </p>
      @if (error()) {
        <p class="alert error" role="alert">{{ error() }}</p>
      }
      @if (ok()) {
        <p class="alert success" role="status">{{ ok() }}</p>
      }
      <form [formGroup]="form" (ngSubmit)="enviar()" novalidate>
        @if (registro) {
          <label
            >Nombre<input
              formControlName="nombre"
              autocomplete="name"
              maxlength="100"
          /></label>
          @if (invalido("nombre")) {
            <small class="field-error"
              >Ingresa tu nombre (máximo 100 caracteres).</small
            >
          }
        }
        <label
          >Correo electrónico<input
            type="email"
            formControlName="email"
            autocomplete="email"
            maxlength="120"
            placeholder="tu@correo.com"
        /></label>
        @if (invalido("email")) {
          <small class="field-error"
            >Ingresa un correo válido (máximo 120 caracteres).</small
          >
        }
        <label
          >Contraseña<input
            type="password"
            formControlName="password"
            [autocomplete]="registro ? 'new-password' : 'current-password'"
            maxlength="72"
        /></label>
        @if (invalido("password")) {
          <small class="field-error">{{
            registro ? "Usa entre 8 y 72 caracteres." : "Ingresa tu contraseña."
          }}</small>
        }
        <button class="primary full" [disabled]="busy()">
          {{
            busy()
              ? "Procesando…"
              : registro
                ? "Crear mi cuenta →"
                : "Iniciar sesión →"
          }}
        </button>
      </form>
      <p class="muted">
        {{ registro ? "¿Ya tienes cuenta?" : "¿Primera vez por aquí?" }}
        <a [routerLink]="registro ? '/login' : '/registro'">{{
          registro ? "Inicia sesión" : "Crea tu cuenta"
        }}</a>
      </p>
    </div>
  </section>`,
})
export class AuthPage {
  auth = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  registro = this.route.snapshot.routeConfig?.path === "registro";
  busy = signal(false);
  error = signal("");
  ok = signal("");
  form = this.fb.nonNullable.group({
    nombre: [
      "",
      this.registro
        ? [
            Validators.required,
            Validators.pattern(/\S/),
            Validators.maxLength(100),
          ]
        : [],
    ],
    email: [
      "",
      [Validators.required, Validators.email, Validators.maxLength(120)],
    ],
    password: [
      "",
      this.registro
        ? [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(72),
          ]
        : [Validators.required],
    ],
  });
  invalido(k: "nombre" | "email" | "password") {
    const c = this.form.controls[k];
    return c.touched && c.invalid;
  }
  async enviar() {
    if (this.busy()) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.busy.set(true);
    this.error.set("");
    const { nombre, email, password } = this.form.getRawValue();
    try {
      if (this.registro) {
        await this.auth.registrar(nombre.trim(), email.trim(), password);
        this.ok.set("Cuenta creada. Ya puedes iniciar sesión.");
        this.form.reset();
      } else {
        await this.auth.login(email.trim(), password);
        const dest = this.route.snapshot.queryParamMap.get("returnUrl");
        await this.router.navigateByUrl(
          dest?.startsWith("/") && !dest.startsWith("//") ? dest : "/eventos",
        );
      }
    } catch (e) {
      this.error.set(mensajeError(e));
    } finally {
      this.busy.set(false);
    }
  }
}
