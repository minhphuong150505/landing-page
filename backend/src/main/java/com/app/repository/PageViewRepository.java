package com.app.repository;

import com.app.entity.PageView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PageViewRepository extends JpaRepository<PageView, Long> {

    @Query("SELECT COUNT(DISTINCT p.sessionId) FROM PageView p WHERE p.sessionId IS NOT NULL")
    long countDistinctSessions();

    @Query("SELECT p.path, COUNT(p) FROM PageView p GROUP BY p.path ORDER BY COUNT(p) DESC")
    List<Object[]> countGroupByPath();

    @Query("SELECT FUNCTION('DATE', p.visitedAt), COUNT(p) FROM PageView p WHERE p.visitedAt >= :since GROUP BY FUNCTION('DATE', p.visitedAt) ORDER BY FUNCTION('DATE', p.visitedAt)")
    List<Object[]> countGroupByDay(@Param("since") LocalDateTime since);
}
