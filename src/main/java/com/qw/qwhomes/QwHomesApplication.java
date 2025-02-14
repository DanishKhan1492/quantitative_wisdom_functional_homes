package com.qw.qwhomes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class QwHomesApplication {

    public static void main(String[] args) {
        SpringApplication.run(QwHomesApplication.class, args);
    }

    @Controller
    public static class WebController {
        @GetMapping(value = "/{path:[^\\.]*}")
        public String forward() {
            return "forward:/";
        }
    }
}
