package com.fyp.avian_annotator.config;

import com.fyp.avian_annotator.exception.BadRequestException;
import com.fyp.avian_annotator.exception.UnownedWorkspaceException;
import com.fyp.avian_annotator.exception.UserNotFoundException;
import com.fyp.avian_annotator.exception.WorkspaceNotFoundException;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Handles the exceptions. TODO: add better response bodies, especially for the autogen */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<String> handleUserNotFoundException(UserNotFoundException e) {
    log.error(e.getMessage());
    return ResponseEntity.badRequest().body(e.getMessage());
  }

  @ExceptionHandler(WorkspaceNotFoundException.class)
  public ResponseEntity<String> handleWorkspaceUserNotFoundException(WorkspaceNotFoundException e) {
    log.error(e.getMessage());
    return ResponseEntity.badRequest().body(e.getMessage());
  }

  @ExceptionHandler(UnownedWorkspaceException.class)
  public ResponseEntity<String> handleUnownedWorkspaceException(UnownedWorkspaceException e) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
  }

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<Void> handleBadRequestException(BadRequestException e) {
    return ResponseEntity.badRequest().build();
  }

  @ExceptionHandler(IllegalAccessException.class)
  public ResponseEntity<String> handleIllegalAccessException(IllegalAccessException e) {
    log.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidationExceptions(
      MethodArgumentNotValidException ex) {

    log.error("Validation error: {}", ex.getMessage());
    Map<String, String> errors = new HashMap<>();

    ex.getBindingResult()
        .getFieldErrors()
        .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

    return ResponseEntity.badRequest().body(errors);
  }

  @ExceptionHandler(EmptyResultDataAccessException.class)
  public ResponseEntity<String> handleUnfoundEntityException(EmptyResultDataAccessException e) {
    log.error(e.getMessage());
    return ResponseEntity.notFound().build();
  }
}
