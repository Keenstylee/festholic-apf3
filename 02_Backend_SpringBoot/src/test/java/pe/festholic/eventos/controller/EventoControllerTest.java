package pe.festholic.eventos.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pe.festholic.eventos.exception.EventoNoEncontradoException;
import pe.festholic.eventos.model.Evento;
import pe.festholic.eventos.service.EventoService;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@WebMvcTest(EventoController.class)
@AutoConfigureMockMvc(addFilters = false)
class EventoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EventoService eventoService;

    @Test
    void postDebeResponder201CuandoLosDatosSonValidos() throws Exception {
        Evento guardado = new Evento(1L, "Festival Festholic", "Arena Lima", LocalDate.now().plusMonths(1), 5000, true);
        when(eventoService.registrar(any(Evento.class))).thenReturn(guardado);

        mockMvc.perform(post("/api/eventos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(cuerpoValido()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Festival Festholic"));
    }

    @Test
    void postDebeResponder400CuandoFaltanDatosObligatorios() throws Exception {
        mockMvc.perform(post("/api/eventos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nombre": "",
                                  "capacidad": 0
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensaje").value("Datos de entrada inválidos"))
                .andExpect(jsonPath("$.errores.nombre").exists())
                .andExpect(jsonPath("$.errores.lugar").exists());
    }

    @Test
    void putDebeResponder200CuandoElEventoExiste() throws Exception {
        Evento actualizado = new Evento(1L, "Festival Festholic", "Arena Lima", LocalDate.now().plusMonths(1), 5000, true);
        when(eventoService.actualizar(eq(1L), any(Evento.class))).thenReturn(actualizado);

        mockMvc.perform(put("/api/eventos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(cuerpoValido()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.lugar").value("Arena Lima"));
    }

    @Test
    void putDebeResponder404CuandoElEventoNoExiste() throws Exception {
        when(eventoService.actualizar(eq(99L), any(Evento.class)))
                .thenThrow(new EventoNoEncontradoException(99L));

        mockMvc.perform(put("/api/eventos/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(cuerpoValido()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.mensaje").value("No se encontró el evento con ID 99"));
    }

    @Test
    void getPorIdDebeResponder404CuandoElEventoNoExiste() throws Exception {
        when(eventoService.buscarPorId(99L)).thenThrow(new EventoNoEncontradoException(99L));

        mockMvc.perform(get("/api/eventos/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.estado").value(404));
    }

    @Test
    void getPorIdDebeResponder400CuandoElIdNoEsNumerico() throws Exception {
        mockMvc.perform(get("/api/eventos/abc"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.estado").value(400));
    }

    @Test
    void deleteDebeResponder409CuandoElEventoTieneEntradasVendidas() throws Exception {
        doThrow(new DataIntegrityViolationException("fk"))
                .when(eventoService).eliminar(1L);

        mockMvc.perform(delete("/api/eventos/1"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.estado").value(409));
    }

    private String cuerpoValido() {
        return """
                {
                  "nombre": "Festival Festholic",
                  "lugar": "Arena Lima",
                  "fecha": "%s",
                  "capacidad": 5000,
                  "activo": true
                }
                """.formatted(LocalDate.now().plusMonths(1));
    }
}