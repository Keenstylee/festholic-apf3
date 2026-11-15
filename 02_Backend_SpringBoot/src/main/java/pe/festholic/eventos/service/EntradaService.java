package pe.festholic.eventos.service;

import pe.festholic.eventos.dto.CompraEntradaRequest;
import pe.festholic.eventos.model.Entrada;

import java.util.List;

public interface EntradaService {
    Entrada comprar(CompraEntradaRequest solicitud);
    List<Entrada> listar();
    List<Entrada> listarPropias(Long usuarioId);
}