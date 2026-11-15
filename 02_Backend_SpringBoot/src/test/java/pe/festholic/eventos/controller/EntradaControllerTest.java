package pe.festholic.eventos.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pe.festholic.eventos.dto.CompraEntradaRequest;
import pe.festholic.eventos.exception.ReglaNegocioException;
import pe.festholic.eventos.exception.UsuarioNoEncontradoException;
import pe.festholic.eventos.model.Entrada;
import pe.festholic.eventos.model.Evento;
import pe.festholic.eventos.model.Rol;
import pe.festholic.eventos.model.Usuario;
import pe.festholic.eventos.service.EntradaService;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@WebMvcTest(EntradaController.class)
@AutoConfigureMockMvc(addFilters = false)
class EntradaControllerTest {

    private static final String CUERPO_VALIDO = """
            {"usuarioId": 1, "eventoId": 1, "cantidad": 3}
            """;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EntradaService entradaService;

    @Test
    void postDebeResponder201CuandoLaCompraEsValida() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Cliente Prueba");
        usuario.setEmail("cliente@festholic.pe");
        Evento evento = new Evento(1L, "Festival Festholic", "Arena Lima",
                LocalDate.now().plusMonths(1), 5000, true);
        Entrada entrada = new Entrada();
        entrada.setId(10L);
        entrada.setUsuario(usuario);
        entrada.setEvento(evento);
        entrada.setCantidad(3);
        when(entradaService.comprar(any(CompraEntradaRequest.class))).thenReturn(entrada);

        mockMvc.perform(post("/api/entradas")
                        .principal(comprador())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(CUERPO_VALIDO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.cantidad").value(3))
                .andExpect(jsonPath("$.estado").value("ACTIVA"));
    }

    @Test
    void postDebeResponder400CuandoFaltanDatosObligatorios() throws Exception {
        mockMvc.perform(post("/api/entradas")
                        .principal(comprador())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"cantidad\": 0}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensaje").value("Datos de entrada inválidos"))
                .andExpect(jsonPath("$.errores.usuarioId").exists())
                .andExpect(jsonPath("$.errores.eventoId").exists())
                .andExpect(jsonPath("$.errores.cantidad").exists());
    }

    @Test
    void postDebeResponder400CuandoNoHayCupo() throws Exception {
        when(entradaService.comprar(any(CompraEntradaRequest.class)))
                .thenThrow(new ReglaNegocioException("Solo quedan 2 entradas disponibles"));

        mockMvc.perform(post("/api/entradas")
                        .principal(comprador())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(CUERPO_VALIDO))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensaje").value("Solo quedan 2 entradas disponibles"));
    }

    @Test
    void postDebeResponder404CuandoElUsuarioNoExiste() throws Exception {
        when(entradaService.comprar(any(CompraEntradaRequest.class)))
                .thenThrow(new UsuarioNoEncontradoException(99L));

        mockMvc.perform(post("/api/entradas")
                        .principal(comprador())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(CUERPO_VALIDO))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.mensaje").value("No se encontró el usuario con ID 99"));
    }

    @Test
    void postDebeResponder400CuandoElJsonEstaMalFormado() throws Exception {
        mockMvc.perform(post("/api/entradas")
                        .principal(comprador())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"usuarioId\": 1,"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.estado").value(400));
    }

    private Authentication comprador() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setRol(Rol.CLIENTE);
        return new UsernamePasswordAuthenticationToken(usuario, null,
                List.of(new SimpleGrantedAuthority("ROLE_CLIENTE")));
    }
}
