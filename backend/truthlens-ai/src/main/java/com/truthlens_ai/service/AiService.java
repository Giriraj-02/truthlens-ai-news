package  com.truthlens_ai.service;

import java.util.Map;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AiService {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String AI_URL = "https://truthlens-ai-news-3.onrender.com";

    // 🔥 Summarization
    public String getSummary(String content) {
        try {
            String url = AI_URL + "/summarize";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = Map.of("content", content);

            HttpEntity<Map<String, String>> request =
                    new HttpEntity<>(body, headers);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(url, request, Map.class);

            return response.getBody().get("summary").toString();

        } catch (Exception e) {
            return "Summary not available";
        }
    }

    // 🔥 Fake News Score
    public double getFakeScore(String content) {
        try {
            String url = AI_URL + "/detect";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = Map.of("content", content);

            HttpEntity<Map<String, String>> request =
                    new HttpEntity<>(body, headers);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(url, request, Map.class);

            return Double.parseDouble(
                    response.getBody().get("score").toString()
            );

        } catch (Exception e) {
            return 0.0;
        }
    }
}