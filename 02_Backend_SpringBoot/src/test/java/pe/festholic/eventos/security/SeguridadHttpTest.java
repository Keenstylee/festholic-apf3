package pe.festholic.eventos.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pe.festholic.eventos.config.SecurityConfig;
import pe.festholic.eventos.controller.AuthController;
import pe.festholic.eventos.controller.EntradaController;
import pe.festholic.eventos.controller.EventoController;
import pe.festholic.eventos.dto.CompraEntradaRequest;
import pe.festholic.eventos.model.Entrada;
import pe.festholic.eventos.model.Evento;
import pe.festholic.eventos.model.Rol;
import pe.festholic.eventos.model.Usuario;
import pe.festholic.eventos.repository.UsuarioRepository;
import pe.festholic.eventos.service.AuthService;
import pe.festholic.eventos.service.EntradaService;
import pe.festholic.eventos.service.EventoService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(value = {AuthController.class, EntradaController.class, EventoController.class},
        properties = {"jwt.secret=clave-de-prueba-con-al-menos-32-caracteres-123456",
                "jwt.expiracion-ms=3600000"})
@Import({SecurityConfig.class, JwtService.class})
class SeguridadHttpTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private JwtService jwtService;
    @MockitoBean private UsuarioRepository usuarioRepository;
    @MockitoBean private AuthService authService;
    @MockitoBean private EntradaService entradaService;
    @MockitoBean private EventoService eventoService;

    private static final String EVENTO_JSON = """
            {"nombre":"Festival","lugar":"Lima","fecha":"2027-05-15","capacidad":5}
            """;

    @Test
    void listadoDeEventosEsPublico() throws Exception {
        when(eventoService.listar()).thenReturn(List.of());
        mockMvc.perform(get("/api/eventos")).andExpect(status().isOk());
    }

    @Test
    void crearEventoSinTokenDevuelve401() throws Exception {
        mockMvc.perform(post("/api/eventos").contentType(MediaType.APPLICATION_JSON)
                .content(EVENTO_JSON)).andExpect(status().isUnauthorized());
    }

    @Test
    void crearEventoComoClienteDevuelve403() throws Exception {
        Usuario cliente = usuario(7L, Rol.CLIENTE);
        when(usuarioRepository.findByEmail(cliente.getEmail())).thenReturn(Optional.of(cliente));
        mockMvc.perform(post("/api/eventos").header("Authorization", bearer(cliente))
                .contentType(MediaType.APPLICATION_JSON).content(EVENTO_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void crearEventoComoAdminDevuelve201() throws Exception {
        Usuario admin = usuario(8L, Rol.ADMIN);
        when(usuarioRepository.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(eventoService.registrar(any(Evento.class)))
                .thenReturn(new Evento(1L, "Festival", "Lima", LocalDate.of(2027, 5, 15), 5, true));
        mockMvc.perform(post("/api/eventos").header("Authorization", bearer(admin))
                .contentType(MediaType.APPLICATION_JSON).content(EVENTO_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    void comprarConLaIdentidadDelClienteDevuelve201() throws Exception {
        Usuario cliente = usuario(7L, Rol.CLIENTE);
        when(usuarioRepository.findByEmail(cliente.getEmail())).thenReturn(Optional.of(cliente));
        Entrada entrada = new Entrada();
        entrada.setId(10L);
        entrada.setUsuario(cliente);
        entrada.setCantidad(1);
        when(entradaService.comprar(any(CompraEntradaRequest.class))).thenReturn(entrada);
        mockMvc.perform(post("/api/entradas").header("Authorization", bearer(cliente))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"usuarioId\":7,\"eventoId\":1,\"cantidad\":1}"))
                .andExpect(status().isCreated());
    }

    @Test
    void clienteNoPuedeComprarParaOtroUsuario() throws Exception {
        Usuario cliente = usuario(7L, Rol.CLIENTE);
        when(usuarioRepository.findByEmail(cliente.getEmail())).thenReturn(Optional.of(cliente));
        mockMvc.perform(post("/api/entradas").header("Authorization", bearer(cliente))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"usuarioId\":99,\"eventoId\":1,\"cantidad\":1}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void clienteNoPuedeListarTodasLasEntradas() throws Exception {
        Usuario cliente = usuario(7L, Rol.CLIENTE);
        when(usuarioRepository.findByEmail(cliente.getEmail())).thenReturn(Optional.of(cliente));
        mockMvc.perform(get("/api/entradas").header("Authorization", bearer(cliente)))
                .andExpect(status().isForbidden());
    }

    @Test
    void tokenInvalidoDevuelve401() throws Exception {
        mockMvc.perform(get("/api/entradas").header("Authorization", "Bearer invalido"))
                .andExpect(status().isUnauthorized());
    }

    private Usuario usuario(Long id, Rol rol) {
        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuario.setNombre("Prueba");
        usuario.setEmail("usuario" + id + "@festholic.pe");
        usuario.setPassword("HASH");
        usuario.setRol(rol);
        return usuario;
    }

    private String bearer(Usuario usuario) {
        return "Bearer " + jwtService.generarToken(usuario);
    }
}
