package com.fyp.avian_annotator.dto.response;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

public record PageWrapper<T>(
    @NotNull List<T> content,
    @NotNull Integer number,
    @NotNull Integer size,
    @NotNull Long totalElements,
    @NotNull Integer totalPages,
    @NotNull Boolean first,
    @NotNull Boolean last,
    @NotNull Integer numberOfElements,
    @NotNull SortDTO sort) {

  public PageWrapper(Page<T> page) {
    this(
        page.getContent(),
        page.getNumber(),
        page.getSize(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.isFirst(),
        page.isLast(),
        page.getNumberOfElements(),
        new SortDTO(page.getSort()));
  }

  public record SortDTO(
      @NotNull Boolean sorted, @NotNull Boolean unsorted, @NotNull Boolean empty) {
    public SortDTO(Sort sort) {
      this(sort.isSorted(), sort.isUnsorted(), sort.isEmpty());
    }
  }
}
