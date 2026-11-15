package pe.festholic.eventos.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.festholic.eventos.dto.CompraEntradaRequest;
import pe.festholic.eventos.model.Entrada;
import pe.festholic.eventos.model.Rol;
import pe.festholic.eventos.model.Usuario;
import pe.festholic.eventos.service.EntradaService;

import java.util.List;

@RestController
@RequestMapping("/api/entradas")
public class EntradaController {

    private final EntradaService entradaService;

    public EntradaController(EntradaService entradaService) {
        this.entradaService = entradaService;
    }

    @PostMapping
    public ResponseEntity<Entrada> comprar(@Valid @RequestBody CompraEntradaRequest solicitud,
                                           Authentication autenticacion) {
        if (autenticacion == null || !(autenticacion.getPrincipal() instanceof Usuario usuario)
                || (usuario.getRol() != Rol.ADMIN && !usuario.getId().equals(solicitud.usuarioId()))) {
            throw new AccessDeniedException("No puedes comprar entradas para otro usuario");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(entradaService.comprar(solicitud));
    }

    @GetMapping("/mis")
    public List<Entrada> propias(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return entradaService.listarPropias(usuario.getId());
    }

    @GetMapping
    public List<Entrada> listar() {
        return entradaService.listar();
    }
}
