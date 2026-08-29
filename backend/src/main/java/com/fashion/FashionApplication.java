package com.fashion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FashionApplication {
    public static void main(String[] args) {
        SpringApplication.run(FashionApplication.class, args);
        System.out.println("⚡ FASHION MANAGEMENT SYSTEM - BACKEND REST API IS RUNNING ON PORT 8080 ⚡");
    }
}
