package com.app.dto;

import lombok.Data;

@Data
public class PageViewRequest {
    private String path;
    private String referrer;
    private String sessionId;
}
