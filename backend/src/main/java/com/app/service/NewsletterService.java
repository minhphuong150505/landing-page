package com.app.service;

import com.app.dto.NewsletterRequest;
import com.app.entity.Newsletter;
import com.app.repository.NewsletterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NewsletterService {

    private final NewsletterRepository newsletterRepository;

    @Transactional
    public Newsletter subscribe(NewsletterRequest request) {
        if (newsletterRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already subscribed");
        }

        Newsletter newsletter = new Newsletter();
        newsletter.setEmail(request.getEmail());
        newsletter.setActive(true);

        Newsletter saved = newsletterRepository.save(newsletter);
        log.info("New newsletter subscription: {}", request.getEmail());
        return saved;
    }

    @Transactional
    public void unsubscribe(String email) {
        Newsletter newsletter = newsletterRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email not found"));
        newsletter.setActive(false);
        newsletterRepository.save(newsletter);
        log.info("Newsletter unsubscription: {}", email);
    }
}
