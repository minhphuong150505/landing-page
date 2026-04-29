package com.app.controller;

import com.app.dto.ApiResponse;
import com.app.dto.ContactRequest;
import com.app.entity.Contact;
import com.app.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ApiResponse<Contact>> submitContact(@Valid @RequestBody ContactRequest request) {
        Contact contact = contactService.submitContact(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Your message has been sent successfully!", contact));
    }
}
