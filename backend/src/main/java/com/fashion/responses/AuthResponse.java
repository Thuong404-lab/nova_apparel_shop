package com.fashion.responses;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class AuthResponse {
    private boolean success;
    private String message;
    private String token;
    private UserResponse user;
}
