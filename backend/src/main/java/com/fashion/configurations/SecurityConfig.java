package com.fashion.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Tắt CSRF vì ta đang viết REST API (dùng JWT Token chứ không dùng Cookie/Session cũ)
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Chế độ STATELESS: Máy chủ không lưu phiên đăng nhập trên RAM, mỗi request gửi lên phải tự kèm JWT
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 3. Phân quyền các đường dẫn API:
                .authorizeHttpRequests(auth -> auth
                        // Cho phép TỰ DO truy cập (permitAll) vào các API đăng nhập và tài liệu Swagger mà không cần Token
                        .requestMatchers("/api/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // Các API còn lại tạm thời cũng cho phép để bạn test dễ dàng
                        .anyRequest().permitAll()
                );

        return http.build();
    }


}
