package com.app.controller;

import com.app.dto.ApiResponse;
import com.app.dto.NewsletterRequest;
import com.app.entity.Newsletter;
import com.app.service.NewsletterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
public class NewsletterController {

    private final NewsletterService newsletterService;

    @PostMapping("/subscribe")
    public ResponseEntity<ApiResponse<Newsletter>> subscribe(@Valid @RequestBody NewsletterRequest request) {
        Newsletter newsletter = newsletterService.subscribe(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Successfully subscribed to newsletter!", newsletter));
    }

    @DeleteMapping("/unsubscribe/{email}")
    public ResponseEntity<ApiResponse<Void>> unsubscribe(@PathVariable String email) {
        newsletterService.unsubscribe(email);
        return ResponseEntity.ok(ApiResponse.success("Successfully unsubscribed from newsletter."));
    }
}
