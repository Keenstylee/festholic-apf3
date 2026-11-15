package pe.festholic.eventos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pe.festholic.eventos.model.Entrada;

public interface EntradaRepository extends JpaRepository<Entrada, Long> {

    java.util.List<Entrada> findByUsuarioIdOrderByFechaCompraDesc(Long usuarioId);

    @Query("SELECT COALESCE(SUM(en.cantidad), 0) FROM Entrada en "
            + "WHERE en.evento.id = :eventoId "
            + "AND en.estado = pe.festholic.eventos.model.EstadoEntrada.ACTIVA")
    long contarVendidasPorEvento(@Param("eventoId") Long eventoId);
}