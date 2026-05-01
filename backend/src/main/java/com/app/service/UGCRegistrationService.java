package com.app.service;

import com.app.dto.UGCRegistrationRequest;
import com.app.entity.UGCRegistration;
import com.app.repository.UGCRegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UGCRegistrationService {

    private final UGCRegistrationRepository ugcRegistrationRepository;
    private final EmailService emailService;

    @Transactional
    public UGCRegistration register(UGCRegistrationRequest request) {
        UGCRegistration registration = new UGCRegistration();
        registration.setName(request.getName());
        registration.setEmail(request.getEmail());
        registration.setPlatform(request.getPlatform());
        registration.setStatus("REGISTERED");

        UGCRegistration saved = ugcRegistrationRepository.save(registration);
        log.info("New UGC registration from: {}", request.getEmail());
        try {
            emailService.sendUgcConfirmation(saved.getEmail(), saved.getName());
        } catch (Exception exception) {
            log.warn("Failed to queue UGC confirmation email: {}", exception.getMessage());
        }
        return saved;
    }

    public List<UGCRegistration> getAllRegistrations() {
        return ugcRegistrationRepository.findAllByOrderByCreatedAtDesc();
    }
}
