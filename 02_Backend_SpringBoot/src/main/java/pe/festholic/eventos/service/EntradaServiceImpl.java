package pe.festholic.eventos.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
import java.util.List;

@Service
public class EntradaServiceImpl implements EntradaService {

    private final EntradaRepository entradaRepository;
    private final EventoRepository eventoRepository;
    private final UsuarioRepository usuarioRepository;

    public EntradaServiceImpl(EntradaRepository entradaRepository,
                              EventoRepository eventoRepository,
                              UsuarioRepository usuarioRepository) {
        this.entradaRepository = entradaRepository;
        this.eventoRepository = eventoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional(isolation = org.springframework.transaction.annotation.Isolation.READ_COMMITTED)
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated() and (hasRole('ADMIN') or principal.id == #solicitud.usuarioId())")
    public Entrada comprar(CompraEntradaRequest solicitud) {
        Usuario usuario = usuarioRepository.findById(solicitud.usuarioId())
                .orElseThrow(() -> new UsuarioNoEncontradoException(solicitud.usuarioId()));
        Evento evento = eventoRepository.buscarParaActualizar(solicitud.eventoId())
                .orElseThrow(() -> new EventoNoEncontradoException(solicitud.eventoId()));

        if (!evento.isActivo()) {
            throw new ReglaNegocioException("El evento no está disponible para la venta");
        }
        if (evento.getFecha().isBefore(LocalDate.now())) {
            throw new ReglaNegocioException("El evento ya se realizó y no admite más ventas");
        }

        long vendidas = entradaRepository.contarVendidasPorEvento(evento.getId());
        long disponibles = evento.getCapacidad() - vendidas;
        if (solicitud.cantidad() > disponibles) {
            throw new ReglaNegocioException("Solo quedan " + disponibles + " entradas disponibles");
        }

        Entrada entrada = new Entrada();
        entrada.setUsuario(usuario);
        entrada.setEvento(evento);
        entrada.setCantidad(solicitud.cantidad());
        Entrada guardada = entradaRepository.save(entrada);

        if (solicitud.cantidad() == disponibles) {
            evento.setActivo(false);
            eventoRepository.save(evento);
        }
        return guardada;
    }

    @Override
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated() and principal.id == #usuarioId")
    public List<Entrada> listarPropias(Long usuarioId) {
        return entradaRepository.findByUsuarioIdOrderByFechaCompraDesc(usuarioId);
    }

    @Override
    public List<Entrada> listar() {
        return entradaRepository.findAll();
    }
}