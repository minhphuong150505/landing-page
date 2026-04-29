package com.app.controller;

import com.app.dto.ApiResponse;
import com.app.dto.PageViewRequest;
import com.app.service.PageViewService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
public class PageViewController {

    private final PageViewService pageViewService;

    @PostMapping("/pageview")
    public ResponseEntity<ApiResponse<Void>> trackPageView(
            @RequestBody PageViewRequest request,
            HttpServletRequest httpRequest) {
        try {
            pageViewService.track(request, httpRequest);
        } catch (Exception ignored) {
            // fail silent — tracking should never break the app
        }
        return ResponseEntity.ok(ApiResponse.success("Tracked"));
    }
}
