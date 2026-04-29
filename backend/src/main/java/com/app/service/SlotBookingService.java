package com.app.service;

import com.app.dto.SlotBookingRequest;
import com.app.entity.SlotBooking;
import com.app.repository.SlotBookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SlotBookingService {

    private final SlotBookingRepository slotBookingRepository;

    @Transactional
    public SlotBooking bookSlot(SlotBookingRequest request) {
        SlotBooking booking = new SlotBooking();
        booking.setName(request.getName());
        booking.setPhone(request.getPhone());
        booking.setStatus("BOOKED");

        SlotBooking saved = slotBookingRepository.save(booking);
        log.info("New slot booking from: {}", request.getPhone());
        return saved;
    }

    public List<SlotBooking> getAllBookings() {
        return slotBookingRepository.findAllByOrderByCreatedAtDesc();
    }

    public long getBookedCount() {
        return slotBookingRepository.countByStatus("BOOKED");
    }

    @Transactional
    public SlotBooking updateStatus(Long id, String status) {
        SlotBooking booking = slotBookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Slot booking not found: " + id));
        booking.setStatus(status);
        return slotBookingRepository.save(booking);
    }
}
