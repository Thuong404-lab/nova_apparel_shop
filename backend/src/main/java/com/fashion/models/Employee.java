package com.fashion.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "Employees")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Employee {

    @Id
    @Column(name = "employeeId", length = 20, nullable = false)
    private String employeeId;

    @Column(name = "username", length = 100, nullable = false, unique = true)
    private String username;

    @Column(name = "fullName", length = 100, nullable = false)
    private String fullName;

    @Column(name = "email", length = 100, nullable = false, unique = true)
    private String email;

    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "passwordHash", length = 255, nullable = false)
    private String passwordHash;

    @Column(name = "role", length = 20, nullable = false)
    private String role = "Staff";

    @Column(name = "salary", precision = 12, scale = 2, nullable = false)
    private BigDecimal salary = BigDecimal.ZERO;

    @Column(name = "status", length = 20, nullable = false)
    private String status = "Active";

    @Column(name = "avatar", length = 500)
    private String avatar;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "createdAt", nullable = false)
    private Date createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = new Date();
        }
        if (status == null) {
            status = "Active";
        }
        if (role == null) {
            role = "Staff";
        }
        if (salary == null) {
            salary = BigDecimal.ZERO;
        }
    }
}