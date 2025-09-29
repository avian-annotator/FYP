package com.fyp.avian_annotator.controller;

import com.fyp.avian_annotator.dto.websocket.AnnotationActionPayload;
import com.fyp.avian_annotator.dto.websocket.AnnotationPresencePayload;
import com.fyp.avian_annotator.security.CustomUserDetails;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Controller
@RequiredArgsConstructor
public class AnnotationController {
  private final Map<String, List<Long>> activeSessions = new ConcurrentHashMap<>();
  private final Environment environment;

  @MessageMapping("/workspace/{workspaceId}/image/{imageId}/annotate")
  @SendTo("/topic/workspace/{workspaceId}/image/{imageId}/annotate")
  public AnnotationActionPayload annotate(
      @DestinationVariable String workspaceId,
      @DestinationVariable String imageId,
      @Valid AnnotationActionPayload message,
      Principal principal) {

    Long userId =
        ((CustomUserDetails) ((UsernamePasswordAuthenticationToken) principal).getPrincipal())
            .getId();

    // TODO: validation, in particular ensuring workspaceId and imageId are valid. Cache this.
    if (Objects.equals(message.actionType(), "join")) {
      List<Long> users =
          activeSessions.getOrDefault(workspaceId + "/" + imageId, new ArrayList<>());

      if (users.isEmpty()) {
        webClient()
            .post()
            .uri(
                uriBuilder ->
                    uriBuilder
                        .path("/session/workspace/{workspaceId}/image/{imageId}")
                        .build(workspaceId, imageId))
            .retrieve()
            .bodyToMono(String.class)
            .block();
      }

      if (!users.contains(userId)) {
        users.add(userId);
      }
      activeSessions.put(workspaceId + "/" + imageId, users);

    } else if (Objects.equals(message.actionType(), "leave")) {
      var users = activeSessions.getOrDefault(workspaceId + "/" + imageId, new ArrayList<>());

      // Check needed as react runs cleanup, so it will always send a leave at the initial mount
      if (users.contains(userId)) {
        users.remove(userId);
        if (users.isEmpty()) {
          webClient()
              .delete()
              .uri(
                  uriBuilder ->
                      uriBuilder
                          .path("/session/workspace/{workspaceId}/image/{imageId}")
                          .build(workspaceId, imageId))
              .retrieve()
              .bodyToMono(String.class)
              .block();
        }
      }

      activeSessions.put(workspaceId + "/" + imageId, users);
    }
    return message;
  }

  @MessageMapping("/workspace/{workspaceId}/image/{imageId}/presence")
  @SendTo("/topic/workspace/{workspaceId}/image/{imageId}/presence")
  public AnnotationPresencePayload presence(
      @DestinationVariable String workspaceId,
      @DestinationVariable String imageId,
      @Valid AnnotationPresencePayload message,
      @AuthenticationPrincipal CustomUserDetails userDetails) {

    return message;
  }

  @Bean(name = "sideCarWebClient")
  private WebClient webClient() {
    return WebClient.builder()
        .baseUrl(Objects.requireNonNull(environment.getProperty("SIDECAR_URL")))
        .build();
  }
}
