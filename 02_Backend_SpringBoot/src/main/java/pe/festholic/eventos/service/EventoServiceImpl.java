package pe.festholic.eventos.service;

import org.springframework.stereotype.Service;
import pe.festholic.eventos.exception.EventoNoEncontradoException;
import pe.festholic.eventos.model.Evento;
import pe.festholic.eventos.repository.EventoRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class EventoServiceImpl implements EventoService {

    private final EventoRepository eventoRepository;
    private final pe.festholic.eventos.repository.EntradaRepository entradaRepository;

    public EventoServiceImpl(EventoRepository eventoRepository, pe.festholic.eventos.repository.EntradaRepository entradaRepository) {
        this.eventoRepository = eventoRepository;
        this.entradaRepository = entradaRepository;
    }

    @Override
    public List<Evento> listar() {
        return eventoRepository.findAll();
    }

    @Override
    public Evento buscarPorId(Long id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new EventoNoEncontradoException(id));
    }

    @Override
    public Evento registrar(Evento evento) {
        evento.setId(null);
        evento.setActivo(true);
        return eventoRepository.save(evento);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(isolation = org.springframework.transaction.annotation.Isolation.READ_COMMITTED)
    public Evento actualizar(Long id, Evento nuevosDatos) {
        Evento existente = eventoRepository.buscarParaActualizar(id)
                .orElseThrow(() -> new EventoNoEncontradoException(id));
        long vendidas = entradaRepository.contarVendidasPorEvento(id);
        if (nuevosDatos.getCapacidad() < vendidas) {
            throw new pe.festholic.eventos.exception.ReglaNegocioException("La capacidad no puede ser menor a las " + vendidas + " entradas vendidas");
        }
        existente.setNombre(nuevosDatos.getNombre());
        existente.setLugar(nuevosDatos.getLugar());
        existente.setFecha(nuevosDatos.getFecha());
        existente.setCapacidad(nuevosDatos.getCapacidad());
        existente.setActivo(nuevosDatos.isActivo() && nuevosDatos.getCapacidad() > vendidas);
        return eventoRepository.save(existente);
    }

    @Override
    public void eliminar(Long id) {
        if (!eventoRepository.existsById(id)) {
            throw new EventoNoEncontradoException(id);
        }
        eventoRepository.deleteById(id);
    }

    @Override
public List<Evento> listarPorFecha(LocalDate fecha) {
    return eventoRepository.buscarActivosPorFecha(fecha);
}
}
