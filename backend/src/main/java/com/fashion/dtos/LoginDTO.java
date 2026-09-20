package com.fashion.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginDTO {
    @NotBlank(message = "Username không để trống")
    private String userName;

    @NotBlank(message = "Password không để trống")
    private  String password;
}
