package com.stkivv.webquiz.backend.API;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


//todo!! delete this later.

@RestController
public class TestController {
    
    @GetMapping("/test")
    public String getTestValue() {
        return "it works!";
    }
    
}
