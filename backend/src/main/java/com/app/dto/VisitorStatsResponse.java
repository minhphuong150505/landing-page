package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VisitorStatsResponse {
    private long totalViews;
    private long uniqueVisitors;
    private Map<String, Long> viewsByPath;
    private Map<String, Long> viewsByDay;
}
