package com.app.controller;

// TODO: Bảo vệ bằng Spring Security (Basic Auth hoặc JWT) trước khi deploy production.

import com.app.dto.ApiResponse;
import com.app.dto.DashboardStatsResponse;
import com.app.dto.StatusUpdateRequest;
import com.app.dto.VisitorStatsResponse;
import com.app.entity.Contact;
import com.app.entity.Newsletter;
import com.app.entity.SlotBooking;
import com.app.entity.UGCRegistration;
import com.app.service.ContactService;
import com.app.service.NewsletterService;
import com.app.service.PageViewService;
import com.app.service.SlotBookingService;
import com.app.service.UGCRegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ContactService contactService;
    private final NewsletterService newsletterService;
    private final SlotBookingService slotBookingService;
    private final UGCRegistrationService ugcRegistrationService;
    private final PageViewService pageViewService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboard() {
        VisitorStatsResponse stats = pageViewService.getStats();
        DashboardStatsResponse dashboard = new DashboardStatsResponse(
            contactService.getAllContacts().size(),
            newsletterService.countActiveSubscribers(),
            slotBookingService.getAllBookings().size(),
            ugcRegistrationService.getAllRegistrations().size(),
            stats.getTotalViews(),
            stats.getUniqueVisitors()
        );
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats", dashboard));
    }

    @GetMapping("/contacts")
    public ResponseEntity<ApiResponse<List<Contact>>> getContacts() {
        return ResponseEntity.ok(ApiResponse.success("Contacts", contactService.getAllContacts()));
    }

    @PutMapping("/contacts/{id}/status")
    public ResponseEntity<ApiResponse<Contact>> updateContactStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        Contact updated = contactService.updateStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Status updated", updated));
    }

    @GetMapping("/newsletter")
    public ResponseEntity<ApiResponse<List<Newsletter>>> getNewsletterSubscribers() {
        return ResponseEntity.ok(ApiResponse.success("Newsletter subscribers", newsletterService.getAllSubscribers()));
    }

    @GetMapping("/slots")
    public ResponseEntity<ApiResponse<List<SlotBooking>>> getSlotBookings() {
        return ResponseEntity.ok(ApiResponse.success("Slot bookings", slotBookingService.getAllBookings()));
    }

    @PutMapping("/slots/{id}/status")
    public ResponseEntity<ApiResponse<SlotBooking>> updateSlotStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        SlotBooking updated = slotBookingService.updateStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Status updated", updated));
    }

    @GetMapping("/ugc")
    public ResponseEntity<ApiResponse<List<UGCRegistration>>> getUgcRegistrations() {
        return ResponseEntity.ok(ApiResponse.success("UGC registrations", ugcRegistrationService.getAllRegistrations()));
    }

    @GetMapping("/visitor-stats")
    public ResponseEntity<ApiResponse<VisitorStatsResponse>> getVisitorStats() {
        return ResponseEntity.ok(ApiResponse.success("Visitor stats", pageViewService.getStats()));
    }
}
