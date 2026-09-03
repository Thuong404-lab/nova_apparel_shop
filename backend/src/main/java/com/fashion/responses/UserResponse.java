package com.fashion.responses;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String id;
    private String userName;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String status;
    private String avatar;
}
