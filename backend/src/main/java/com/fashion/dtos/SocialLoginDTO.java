package com.fashion.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SocialLoginDTO {
    @NotBlank(message = "Provider không được bỏ trống (Face, Google, Github)")
    private String provider;

    @NotBlank(message = "Token xác thực không để bỏ trống")
    private String token;

}
