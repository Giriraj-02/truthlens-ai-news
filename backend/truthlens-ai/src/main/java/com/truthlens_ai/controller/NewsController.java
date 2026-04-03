package com.truthlens_ai.controller;

import com.truthlens_ai.model.News;
import com.truthlens_ai.service.NewsService;
import com.truthlens_ai.service.AiService;
import com.truthlens_ai.service.ExternalNewsService;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/news")
@CrossOrigin("*")
public class NewsController {

    @Autowired
    private NewsService newsService;

    @Autowired
    private AiService aiService;

    @Autowired
    private ExternalNewsService externalNewsService;

    // ✅ HOME (Latest India News)
    @GetMapping("/external")
    public List<Map<String, Object>> getExternalNews() {
        return processNews(externalNewsService.fetchNews());
    }

    // ✅ WAR NEWS
    @GetMapping("/war")
    public List<Map<String, Object>> getWarNews() {
        return processNews(externalNewsService.fetchByKeyword("war"));
    }

    // ✅ CRICKET NEWS
    @GetMapping("/sports")
    public List<Map<String, Object>> getCricketNews() {
        return processNews(externalNewsService.fetchByKeyword("cricket"));
    }

    // ✅ POLITICS NEWS
    @GetMapping("/politics")
    public List<Map<String, Object>> getPoliticsNews() {
        return processNews(externalNewsService.fetchByKeyword("politics"));
    }

    // 🔥 COMMON AI PROCESSING METHOD
    private List<Map<String, Object>> processNews(List<Map<String, Object>> articles) {

        List<Map<String, Object>> finalList = new ArrayList<>();

        for (Map<String, Object> article : articles) {

            String content = article.get("description") != null
                    ? article.get("description").toString()
                    : "";

             String summary = aiService.getSummary(content);

           // 🔥 CLEAN unwanted text
                  if (summary != null) {
                   summary = summary.replace("summary:", "")
                     .replace("summarize:", "")
                     .trim();
}            double score = aiService.getFakeScore(content);

            Map<String, Object> newArticle = new HashMap<>();
            newArticle.put("title", article.get("title"));
            newArticle.put("source", ((Map) article.get("source")).get("name"));
            newArticle.put("summary", summary);
            newArticle.put("score", score);
            newArticle.put("fake", score < 0.5);
            newArticle.put("date", article.get("publishedAt"));

               newArticle.put("url", article.get("url"));
               newArticle.put("image", article.get("urlToImage"));

            finalList.add(newArticle);
        }

        return finalList;
    }

    // ✅ Stored news (DB)
    @GetMapping("/latest")
    public List<News> getLatestNews() {
        return newsService.getLatestNews();
    }

    // 🔥 Manual add + AI
    @PostMapping("/add")
    public News addNews(@RequestBody News news) {

        String summary = aiService.getSummary(news.getContent());
        double score = aiService.getFakeScore(news.getContent());

        news.setSummary(summary);
        news.setCredibilityScore(score);
        news.setFake(score < 0.5);

        return newsService.saveNews(news);
    }
}