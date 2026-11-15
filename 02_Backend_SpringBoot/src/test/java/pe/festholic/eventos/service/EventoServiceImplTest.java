package pe.festholic.eventos.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.festholic.eventos.exception.EventoNoEncontradoException;
import pe.festholic.eventos.model.Evento;
import pe.festholic.eventos.repository.EventoRepository;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EventoServiceImplTest {

    @Mock
    private EventoRepository eventoRepository;

    @Mock
    private pe.festholic.eventos.repository.EntradaRepository entradaRepository;

    private EventoServiceImpl eventoService;

    @BeforeEach
    void preparar() {
        eventoService = new EventoServiceImpl(eventoRepository, entradaRepository);
    }

    @Test
    void debeRegistrarUnEventoActivo() {
        Evento entrada = nuevoEvento(null);
        when(eventoRepository.save(entrada)).thenAnswer(invocacion -> {
            Evento evento = invocacion.getArgument(0);
            evento.setId(1L);
            return evento;
        });

        Evento resultado = eventoService.registrar(entrada);

        assertEquals(1L, resultado.getId());
        assertTrue(resultado.isActivo());
        verify(eventoRepository).save(entrada);
    }

    @Test
    void debeBuscarUnEventoExistente() {
        Evento evento = nuevoEvento(7L);
        when(eventoRepository.findById(7L)).thenReturn(Optional.of(evento));

        Evento resultado = eventoService.buscarPorId(7L);

        assertEquals("Hardwell South America World Tour", resultado.getNombre());
    }

    @Test
    void debeRechazarLaBusquedaDeUnEventoInexistente() {
        when(eventoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EventoNoEncontradoException.class, () -> eventoService.buscarPorId(99L));
    }

    @Test
    void debeEliminarUnEventoExistente() {
        when(eventoRepository.existsById(3L)).thenReturn(true);

        eventoService.eliminar(3L);

        verify(eventoRepository).deleteById(3L);
    }

    @Test
    void debeRechazarCapacidadMenorALoVendido() {
        Evento existente = nuevoEvento(7L);
        Evento cambios = nuevoEvento(7L);
        cambios.setCapacidad(4);
        when(eventoRepository.buscarParaActualizar(7L)).thenReturn(Optional.of(existente));
        when(entradaRepository.contarVendidasPorEvento(7L)).thenReturn(5L);
        assertThrows(pe.festholic.eventos.exception.ReglaNegocioException.class,
                () -> eventoService.actualizar(7L, cambios));
        assertEquals(12000, existente.getCapacidad());
        org.mockito.Mockito.verify(eventoRepository, org.mockito.Mockito.never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void debeMantenerCerradoUnEventoAgotadoAunqueSeIntenteActivar() {
        Evento existente = nuevoEvento(7L);
        Evento cambios = nuevoEvento(7L);
        cambios.setCapacidad(5);
        cambios.setActivo(true);
        when(eventoRepository.buscarParaActualizar(7L)).thenReturn(Optional.of(existente));
        when(entradaRepository.contarVendidasPorEvento(7L)).thenReturn(5L);
        when(eventoRepository.save(existente)).thenReturn(existente);
        org.junit.jupiter.api.Assertions.assertFalse(eventoService.actualizar(7L, cambios).isActivo());
    }

    @Test
    void debePermitirReabrirSiSeAmpliaElAforo() {
        Evento existente = nuevoEvento(7L);
        existente.setActivo(false);
        Evento cambios = nuevoEvento(7L);
        cambios.setCapacidad(8);
        when(eventoRepository.buscarParaActualizar(7L)).thenReturn(Optional.of(existente));
        when(entradaRepository.contarVendidasPorEvento(7L)).thenReturn(5L);
        when(eventoRepository.save(existente)).thenReturn(existente);
        assertTrue(eventoService.actualizar(7L, cambios).isActivo());
    }

    private Evento nuevoEvento(Long id) {
        return new Evento(id, "Hardwell South America World Tour", "Costa 21", LocalDate.now().plusMonths(2), 12000, true);
    }
}
