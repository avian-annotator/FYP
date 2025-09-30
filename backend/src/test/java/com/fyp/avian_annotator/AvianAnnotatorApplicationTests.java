package com.fyp.avian_annotator;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootTest
class AvianAnnotatorApplicationTests {
  @Test
  void contextLoads() {}

  @TestConfiguration
  static class MockConfig {
    @Bean
    public WebClient sideCarWebClient() {
      return Mockito.mock(WebClient.class);
    }
  }
}
