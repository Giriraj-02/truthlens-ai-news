package com.truthlens_ai.repository;

import com.truthlens_ai.model.News;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    List<News> findBySourceIn(List<String> sources);

}