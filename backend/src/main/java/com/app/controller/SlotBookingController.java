package com.app.controller;

import com.app.dto.ApiResponse;
import com.app.dto.SlotBookingRequest;
import com.app.entity.SlotBooking;
import com.app.service.SlotBookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/slot")
@RequiredArgsConstructor
public class SlotBookingController {

    private final SlotBookingService slotBookingService;

    @PostMapping("/book")
    public ResponseEntity<ApiResponse<SlotBooking>> bookSlot(@Valid @RequestBody SlotBookingRequest request) {
        SlotBooking booking = slotBookingService.bookSlot(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Slot soi da đã được đặt thành công! Hẹn gặp bạn ở đích.", booking));
    }
}
