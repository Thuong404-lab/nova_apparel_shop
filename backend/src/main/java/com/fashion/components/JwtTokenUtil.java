package com.fashion.components;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtTokenUtil {
    @Value("${jwt.secret}")
    private String secretKey;
    @Value("${jwt.expiration}")
    private long expirationTime;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String userId, String username, String role) {
        return Jwts.builder()
                .subject(username)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey())
                .compact();
    }

    // 1. Trích xuất toàn bộ dữ liệu (Claims) bên trong Token
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey()) // Dùng secretKey để mở khóa xác minh
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // 2. Lấy username từ Token
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // 3. Lấy quyền (Role) từ Token
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // 4. Kiểm tra Token còn hạn sử dụng hay không
    public boolean isTokenValid(String token) {
        try {
            Date expiration = extractAllClaims(token).getExpiration();
            return expiration.after(new Date()); // Còn hạn nếu thời gian hết hạn sau thời điểm hiện tại
        } catch (Exception e) {
            return false; // Token giả mạo hoặc hết hạn
        }
    }



}