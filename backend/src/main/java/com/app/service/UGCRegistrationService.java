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

    @Transactional
    public UGCRegistration register(UGCRegistrationRequest request) {
        UGCRegistration registration = new UGCRegistration();
        registration.setName(request.getName());
        registration.setPhone(request.getPhone());
        registration.setHandle(request.getHandle());
        registration.setStatus("REGISTERED");

        UGCRegistration saved = ugcRegistrationRepository.save(registration);
        log.info("New UGC registration from: {}", request.getPhone());
        return saved;
    }

    public List<UGCRegistration> getAllRegistrations() {
        return ugcRegistrationRepository.findAllByOrderByCreatedAtDesc();
    }
}
