package com.app.service;

import com.app.dto.PageViewRequest;
import com.app.dto.VisitorStatsResponse;
import com.app.entity.PageView;
import com.app.repository.PageViewRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PageViewService {

    private final PageViewRepository pageViewRepository;

    @Transactional
    public void track(PageViewRequest request, HttpServletRequest httpRequest) {
        if (request.getPath() == null || request.getPath().isBlank()) {
            return;
        }

        String ip = httpRequest.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) {
            ip = httpRequest.getRemoteAddr();
        } else {
            ip = ip.split(",")[0].trim();
        }

        PageView pageView = new PageView();
        pageView.setPath(request.getPath());
        pageView.setReferrer(request.getReferrer());
        pageView.setSessionId(request.getSessionId());
        pageView.setIpAddress(ip);
        pageView.setUserAgent(httpRequest.getHeader("User-Agent"));

        pageViewRepository.save(pageView);
        log.info("Page view tracked: {} session={}", request.getPath(), request.getSessionId());
    }

    public VisitorStatsResponse getStats() {
        long totalViews = pageViewRepository.count();
        long uniqueVisitors = pageViewRepository.countDistinctSessions();

        List<Object[]> pathRows = pageViewRepository.countGroupByPath();
        Map<String, Long> viewsByPath = new LinkedHashMap<>();
        for (Object[] row : pathRows) {
            viewsByPath.put((String) row[0], (Long) row[1]);
        }

        LocalDateTime since = LocalDateTime.now().minusDays(30);
        List<Object[]> dayRows = pageViewRepository.countGroupByDay(since);
        Map<String, Long> viewsByDay = new LinkedHashMap<>();
        for (Object[] row : dayRows) {
            viewsByDay.put(row[0].toString(), (Long) row[1]);
        }

        return new VisitorStatsResponse(totalViews, uniqueVisitors, viewsByPath, viewsByDay);
    }
}
