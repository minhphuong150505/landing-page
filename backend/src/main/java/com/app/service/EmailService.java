package com.app.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class EmailService {

    private static final String RESEND_EMAILS_URL = "https://api.resend.com/emails";

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${resend.api-key:}")
    private String resendApiKey;

    @Value("${resend.from-email:onboarding@resend.dev}")
    private String resendFromEmail;

    private String ugcConfirmationTemplate;

    @PostConstruct
    public void loadTemplate() {
        try {
            ClassPathResource resource = new ClassPathResource("templates/ugc-confirmation.html");
            ugcConfirmationTemplate = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
        } catch (Exception exception) {
            ugcConfirmationTemplate = "";
            log.warn("Failed to load UGC confirmation email template: {}", exception.getMessage());
        }
    }

    @Async
    public void sendUgcConfirmation(String toEmail, String name) {
        try {
            if (resendApiKey == null || resendApiKey.isBlank()) {
                log.warn("Skipping UGC confirmation email because resend.api-key is not configured");
                return;
            }

            if (ugcConfirmationTemplate == null || ugcConfirmationTemplate.isBlank()) {
                log.warn("Skipping UGC confirmation email because template is empty");
                return;
            }

            String html = ugcConfirmationTemplate.replace("{{first_name}}", name);

            String text = "BABÉ Laboratorios — CONFIRMED\n\n" +
                    "Thân chào " + name + " 👋\n\n" +
                    "Cảm ơn bạn đã đăng ký tham gia The Running Babes 2026 cùng BABÉ.\n\n" +
                    "=== 3-STEP JOURNEY ===\n\n" +
                    "BƯỚC 01 — 7-DAY RUNNING CHALLENGE (03/05 → 27/06)\n" +
                    "Đăng tải tối thiểu 6 social post/story ghi lại khoảnh khắc vận động ngoài trời kèm hashtag, trên Instagram · Facebook · TikTok.\n\n" +
                    "BƯỚC 02 — THE RUNNING BABES MARATHON (28/06)\n" +
                    "Tham gia trực tiếp chặng marathon 6km tại Thủ Đức · TP.HCM.\n\n" +
                    "BƯỚC 03 — TRADE-IN TẠI FINISH LINE (28/06 · Tại đích)\n" +
                    "Mang vỏ chai sản phẩm rỗng để đổi lấy BABÉ Stop AKN Sample + Soi da miễn phí.\n\n" +
                    "=== PHẦN THƯỞNG ===\n" +
                    "🏅 Finish UGC + Marathon: Full bộ sản phẩm BABÉ Stop AKN + Voucher 1 năm\n" +
                    "🏆 Top 3 Best Entries: Gift box đặc biệt + Voucher soi da\n" +
                    "🎽 Tại Finish Line: Sample full collection BABÉ Stop AKN\n\n" +
                    "=== CÁCH HOẠT ĐỘNG ===\n" +
                    "1. Từ 3/5–27/6: đăng tối thiểu 6 social post/story vận động ngoài trời.\n" +
                    "2. Dùng 4 hashtag: #HustleCrew_DC26 #DigitalCreatory #LaboratoriosBaBé #TheRunningBabes\n" +
                    "3. Tham gia marathon 28/6 tại Thủ Đức.\n" +
                    "4. Tại đích: mang sản phẩm cũ để trade-in + soi da miễn phí.\n\n" +
                    "KHÁM PHÁ THÊM: https://ugc-web.com/\n\n" +
                    "---\n" +
                    "Laboratorios BaBé · Digital Creatory · HustleCrew DC26\n" +
                    "Facebook: https://www.facebook.com/laboratoriosbabevietnam.official/\n";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(resendApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = Map.of(
                    "from", resendFromEmail,
                    "to", List.of(toEmail),
                    "subject", "Xác nhận đăng ký The Running Babes 2026 ✨",
                    "html", html,
                    "text", text
            );

            restTemplate.postForEntity(RESEND_EMAILS_URL, new HttpEntity<>(body, headers), String.class);
            log.info("Sent UGC confirmation email to: {}", toEmail);
        } catch (Exception exception) {
            log.warn("Failed to send email via Resend: {}", exception.getMessage());
        }
    }
}
