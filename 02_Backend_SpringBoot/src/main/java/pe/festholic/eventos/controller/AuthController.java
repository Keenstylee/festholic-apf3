package pe.festholic.eventos.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.festholic.eventos.dto.AuthResponse;
import pe.festholic.eventos.dto.LoginRequest;
import pe.festholic.eventos.dto.RegistroRequest;
import pe.festholic.eventos.dto.UsuarioResponse;
import pe.festholic.eventos.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @org.springframework.web.bind.annotation.GetMapping("/me")
    public UsuarioResponse actual(org.springframework.security.core.Authentication authentication) {
        var usuario = (pe.festholic.eventos.model.Usuario) authentication.getPrincipal();
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol());
    }

    @PostMapping("/registro")
    public ResponseEntity<UsuarioResponse> registrar(@Valid @RequestBody RegistroRequest solicitud) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registrar(solicitud));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest solicitud) {
        return authService.login(solicitud);
    }
}