package com.fashion.services;

import com.fashion.dtos.LoginDTO;
import com.fashion.dtos.SocialLoginDTO;
import com.fashion.responses.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginDTO loginDTO);
    AuthResponse loginWithSocial(SocialLoginDTO socialLoginDTO);

}
