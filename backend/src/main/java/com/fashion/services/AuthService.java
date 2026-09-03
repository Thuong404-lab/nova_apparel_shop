package com.fashion.services;

import com.fashion.dtos.LoginDTO;
import com.fashion.responses.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginDTO loginDTO);
}
