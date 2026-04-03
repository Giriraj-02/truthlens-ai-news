package com.truthlens_ai.service;

import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ExternalNewsService {

    private final String API_KEY = "65242756a36d419abc3a5c1c51b2eac5";

    // 🔥 HOME NEWS (India focused)
    public List<Map<String, Object>> fetchNews() {

        String url = "https://newsapi.org/v2/everything?q=india"
                + "&sortBy=publishedAt"
                + "&language=en"
                + "&apiKey=" + API_KEY;

        return fetchFromUrl(url);
    }

    // 🔥 CATEGORY NEWS
    public List<Map<String, Object>> fetchByKeyword(String keyword) {

        String query = keyword;

        // 🔥 SPORTS
        if (keyword.equalsIgnoreCase("sports")) {
            query = "(cricket OR IPL OR BCCI OR ICC OR match OR tournament) AND India";
        }

        // 🔥 WAR (global conflicts)
        else if (keyword.equalsIgnoreCase("war")) {
            query = "(Russia Ukraine war OR Israel Iran OR Hamas Israel OR US war OR military conflict)";
        }

        // 🔥 INDIAN POLITICS
        else if (keyword.equalsIgnoreCase("politics")) {
            query = "(Indian politics OR BJP OR Congress OR Parliament India OR elections India)";
        }

        String url = "https://newsapi.org/v2/everything?q="
                + query
                + "&sortBy=publishedAt"
                + "&language=en"
                + "&apiKey=" + API_KEY;

        return fetchFromUrl(url);
    }

    // 🔥 COMMON FILTER METHOD
    private List<Map<String, Object>> fetchFromUrl(String url) {

        RestTemplate restTemplate = new RestTemplate();
        Map response = restTemplate.getForObject(url, Map.class);

        List<Map<String, Object>> articles =
                (List<Map<String, Object>>) response.get("articles");

        List<Map<String, Object>> filtered = new ArrayList<>();

        int count = 0;

        for (Map<String, Object> article : articles) {

            if (count >= 10) break;

            String title = article.get("title") != null ? article.get("title").toString() : "";
            String description = article.get("description") != null ? article.get("description").toString() : "";

            String text = title + " " + description;
            String lower = text.toLowerCase();

            // =========================
            // 🔥 CATEGORY BASED FILTERS
            // =========================

            // ✅ SPORTS FILTER
            if (url.contains("cricket") || url.contains("sports")) {

                boolean isSportsRelated =
                        lower.contains("cricket") ||
                        lower.contains("ipl") ||
                        lower.contains("match") ||
                        lower.contains("bcci") ||
                        lower.contains("icc");

                if (!isSportsRelated) continue;
            }

            // ✅ POLITICS FILTER
            if (url.contains("politics")) {

                boolean isPoliticsRelated =
                        lower.contains("politics") ||
                        lower.contains("government") ||
                        lower.contains("bjp") ||
                        lower.contains("congress") ||
                        lower.contains("parliament") ||
                        lower.contains("minister") ||
                        lower.contains("election") ||
                        lower.contains("india");

                if (!isPoliticsRelated) continue;
            }

            // ✅ WAR FILTER
            if (url.contains("war")) {

                boolean isWarRelated =
                        lower.contains("war") ||
                        lower.contains("russia") ||
                        lower.contains("ukraine") ||
                        lower.contains("israel") ||
                        lower.contains("iran") ||
                        lower.contains("hamas") ||
                        lower.contains("military") ||
                        lower.contains("army");

                if (!isWarRelated) continue;
            }

            // =========================
            // 🔥 GENERAL CLEANING
            // =========================

            if (text.trim().length() < 30) continue;

            boolean isHindi = text.matches(".*[\\u0900-\\u097F]+.*");

            int englishChars = text.replaceAll("[^a-zA-Z]", "").length();
            int totalChars = text.length();

            double ratio = totalChars == 0 ? 0 : (double) englishChars / totalChars;

            boolean looksIrrelevant =
                    lower.contains("appointment") ||
                    lower.contains("board notice") ||
                    lower.contains("official notice");

            if ((isHindi || ratio > 0.65) && !looksIrrelevant) {
                filtered.add(article);
                count++;
            }
        }

        return filtered;
    }
}