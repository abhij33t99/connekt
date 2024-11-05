package com.abhij33t.connekt.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ConnektController {

    @GetMapping("/")
    public String index() {
        return "index";
    }
}
