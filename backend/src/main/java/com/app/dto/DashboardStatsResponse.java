package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalContacts;
    private long activeSubscribers;
    private long totalSlotBookings;
    private long totalUgcRegistrations;
    private long totalPageViews;
    private long uniqueVisitors;
}
