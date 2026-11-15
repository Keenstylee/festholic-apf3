package pe.festholic.eventos.service;

import pe.festholic.eventos.model.Evento;

import java.time.LocalDate;
import java.util.List;

public interface EventoService {
    List<Evento> listar();
    Evento buscarPorId(Long id);
    Evento registrar(Evento evento);
    Evento actualizar(Long id, Evento evento);
    void eliminar(Long id);
    List<Evento> listarPorFecha(LocalDate fecha);
}