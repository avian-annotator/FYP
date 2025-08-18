package com.fyp.avian_annotator.test;

import org.springframework.web.bind.annotation.*;

@RequestMapping("/test")
@RestController
public class TestController {

    @PostMapping("/{test}/b/{testNumb}")
    public String postTest(@RequestBody RequestBodyDTO requestBody,
                           @PathVariable String test,
                           @PathVariable Integer testNumb,
                           @RequestParam String testParam,
                           @ModelAttribute RequestParamDTO requestParamDTO
    ) {
        return "This is a test POST endpoint";
    }

    @GetMapping("/{test}/b/{testNumb}")
    public String getTest(
            @PathVariable String test,
            @PathVariable Integer testNumb,
            @RequestParam String testParam,
            @ModelAttribute RequestParamDTO requestParamDTO
    ) {
        return "This is a test POST endpoint";
    }
}
