package pe.festholic.eventos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pe.festholic.eventos.model.Evento;

import java.time.LocalDate;
import java.util.List;

public interface EventoRepository extends JpaRepository<Evento, Long> {

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM Evento e WHERE e.id = :id")
    java.util.Optional<Evento> buscarParaActualizar(@Param("id") Long id);

    @Query("SELECT e FROM Evento e WHERE e.fecha = :fecha AND e.activo = true ORDER BY e.nombre")
    List<Evento> buscarActivosPorFecha(@Param("fecha") LocalDate fecha);
}