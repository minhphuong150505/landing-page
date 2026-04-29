package com.app.repository;

import com.app.entity.SlotBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SlotBookingRepository extends JpaRepository<SlotBooking, Long> {
    List<SlotBooking> findAllByOrderByCreatedAtDesc();
    List<SlotBooking> findByPhone(String phone);
    long countByStatus(String status);
}
