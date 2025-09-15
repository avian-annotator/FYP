package com.fyp.avian_annotator.controller;

import com.fyp.avian_annotator.dto.websocket.AnnotationActionPayload;
import com.fyp.avian_annotator.dto.websocket.AnnotationPresencePayload;
import com.fyp.avian_annotator.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class AnnotationController {
  private final SimpMessagingTemplate messagingTemplate;

  @MessageMapping("/workspace/{workspaceId}/image/{imageId}/annotate")
  @SendTo("/topic/workspace/{workspaceId}/image/{imageId}/annotate")
  public AnnotationActionPayload annotate(
      @DestinationVariable String workspaceId,
      @DestinationVariable String imageId,
      @Valid AnnotationActionPayload message,
      @AuthenticationPrincipal CustomUserDetails userDetails) {

    // TODO: validation, in particular ensuring workspaceId and imageId are valid. Cache this.

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
}
