package pe.festholic.eventos.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.festholic.eventos.dto.CompraEntradaRequest;
import pe.festholic.eventos.exception.EventoNoEncontradoException;
import pe.festholic.eventos.exception.ReglaNegocioException;
import pe.festholic.eventos.exception.UsuarioNoEncontradoException;
import pe.festholic.eventos.model.Entrada;
import pe.festholic.eventos.model.Evento;
import pe.festholic.eventos.model.Usuario;
import pe.festholic.eventos.repository.EntradaRepository;
import pe.festholic.eventos.repository.EventoRepository;
import pe.festholic.eventos.repository.UsuarioRepository;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EntradaServiceImplTest {

    @Mock
    private EntradaRepository entradaRepository;
    @Mock
    private EventoRepository eventoRepository;
    @Mock
    private UsuarioRepository usuarioRepository;

    private EntradaServiceImpl entradaService;

    @BeforeEach
    void preparar() {
        entradaService = new EntradaServiceImpl(entradaRepository, eventoRepository, usuarioRepository);
    }

    @Test
    void debeGuardarLaEntradaYMantenerActivoElEventoSiQuedaCupo() {
        Evento evento = nuevoEvento(1L, 100, true, LocalDate.now().plusMonths(1));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(nuevoUsuario()));
        when(eventoRepository.buscarParaActualizar(1L)).thenReturn(Optional.of(evento));
        when(entradaRepository.contarVendidasPorEvento(1L)).thenReturn(10L);
        when(entradaRepository.save(any(Entrada.class))).thenAnswer(inv -> inv.getArgument(0));

        Entrada resultado = entradaService.comprar(new CompraEntradaRequest(1L, 1L, 3));

        assertEquals(3, resultado.getCantidad());
        assertTrue(evento.isActivo());
        verify(eventoRepository, never()).save(any(Evento.class));
    }

    @Test
    void debeCerrarElEventoCuandoLaCompraAgotaElCupo() {
        Evento evento = nuevoEvento(2L, 5, true, LocalDate.now().plusMonths(1));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(nuevoUsuario()));
        when(eventoRepository.buscarParaActualizar(2L)).thenReturn(Optional.of(evento));
        when(entradaRepository.contarVendidasPorEvento(2L)).thenReturn(0L);
        when(entradaRepository.save(any(Entrada.class))).thenAnswer(inv -> inv.getArgument(0));

        entradaService.comprar(new CompraEntradaRequest(1L, 2L, 5));

        assertFalse(evento.isActivo());
        verify(entradaRepository).save(any(Entrada.class));
        verify(eventoRepository).save(evento);
    }

    @Test
    void debeRechazarLaCompraQueExcedeElCupoSinGuardarNada() {
        Evento evento = nuevoEvento(1L, 5, true, LocalDate.now().plusMonths(1));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(nuevoUsuario()));
        when(eventoRepository.buscarParaActualizar(1L)).thenReturn(Optional.of(evento));
        when(entradaRepository.contarVendidasPorEvento(1L)).thenReturn(3L);

        ReglaNegocioException error = assertThrows(ReglaNegocioException.class,
                () -> entradaService.comprar(new CompraEntradaRequest(1L, 1L, 5)));

        assertEquals("Solo quedan 2 entradas disponibles", error.getMessage());
        verify(entradaRepository, never()).save(any(Entrada.class));
        verify(eventoRepository, never()).save(any(Evento.class));
    }

    @Test
    void debeRechazarLaCompraDeUnEventoInactivo() {
        Evento evento = nuevoEvento(1L, 100, false, LocalDate.now().plusMonths(1));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(nuevoUsuario()));
        when(eventoRepository.buscarParaActualizar(1L)).thenReturn(Optional.of(evento));

        assertThrows(ReglaNegocioException.class,
                () -> entradaService.comprar(new CompraEntradaRequest(1L, 1L, 1)));

        verify(entradaRepository, never()).save(any(Entrada.class));
    }

    @Test
    void debeRechazarLaCompraDeUnEventoQueYaPaso() {
        Evento evento = nuevoEvento(1L, 100, true, LocalDate.now().minusDays(1));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(nuevoUsuario()));
        when(eventoRepository.buscarParaActualizar(1L)).thenReturn(Optional.of(evento));

        assertThrows(ReglaNegocioException.class,
                () -> entradaService.comprar(new CompraEntradaRequest(1L, 1L, 1)));

        verify(entradaRepository, never()).save(any(Entrada.class));
    }

    @Test
    void debeRechazarLaCompraDeUnUsuarioInexistente() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(UsuarioNoEncontradoException.class,
                () -> entradaService.comprar(new CompraEntradaRequest(99L, 1L, 1)));

        verify(entradaRepository, never()).save(any(Entrada.class));
    }

    @Test
    void debeRechazarLaCompraDeUnEventoInexistente() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(nuevoUsuario()));
        when(eventoRepository.buscarParaActualizar(99L)).thenReturn(Optional.empty());

        assertThrows(EventoNoEncontradoException.class,
                () -> entradaService.comprar(new CompraEntradaRequest(1L, 99L, 1)));

        verify(entradaRepository, never()).save(any(Entrada.class));
    }

    private Usuario nuevoUsuario() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Cliente Prueba");
        usuario.setEmail("cliente@festholic.pe");
        return usuario;
    }

    private Evento nuevoEvento(Long id, int capacidad, boolean activo, LocalDate fecha) {
        return new Evento(id, "Evento de prueba", "Club Lima", fecha, capacidad, activo);
    }
}