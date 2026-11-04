package com.homechart.backend.contractor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ContractorRepository extends JpaRepository<Contractor, Long> {

    @Query("""
            SELECT contractor FROM Contractor contractor
            JOIN FETCH contractor.category
            JOIN FETCH contractor.user
            WHERE contractor.user.id = :userId
            ORDER BY contractor.name, contractor.id
            """)
    List<Contractor> findAllForUser(@Param("userId") Long userId);
}
