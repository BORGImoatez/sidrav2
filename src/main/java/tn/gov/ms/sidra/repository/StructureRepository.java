package tn.gov.ms.sidra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.gov.ms.sidra.entity.Structure;
import tn.gov.ms.sidra.entity.TypeStructure;

import java.util.List;

@Repository
public interface StructureRepository extends JpaRepository<Structure, Long> {

    List<Structure> findByActifTrue();

    List<Structure> findByType(TypeStructure type);

    List<Structure> findByGouvernoratId(Long gouvernoratId);

    @Query("SELECT COUNT(s) FROM Structure s WHERE s.actif = true")
    long countActiveStructures();

    @Query("SELECT COUNT(s) FROM Structure s WHERE s.type = :type")
    long countStructuresByType(@Param("type") TypeStructure type);

    boolean existsByNom(String nom);
}