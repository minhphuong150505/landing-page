package com.app.controller;

import com.app.dto.ApiResponse;
import com.app.dto.UGCRegistrationRequest;
import com.app.entity.UGCRegistration;
import com.app.service.UGCRegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ugc")
@RequiredArgsConstructor
public class UGCRegistrationController {

    private final UGCRegistrationService ugcRegistrationService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UGCRegistration>> register(@Valid @RequestBody UGCRegistrationRequest request) {
        UGCRegistration registration = ugcRegistrationService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Đăng ký UGC thành công! Hành trình bắt đầu từ 03/05.", registration));
    }
}
