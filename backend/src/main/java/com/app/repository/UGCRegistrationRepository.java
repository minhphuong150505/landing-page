package com.app.repository;

import com.app.entity.UGCRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UGCRegistrationRepository extends JpaRepository<UGCRegistration, Long> {
    List<UGCRegistration> findAllByOrderByCreatedAtDesc();
    List<UGCRegistration> findByPhone(String phone);
}
