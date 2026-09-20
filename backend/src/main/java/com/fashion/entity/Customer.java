package com.fashion.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "Customers")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Customer {

    @Id
    @Column(name = "customerId", length = 20, nullable = false)
    private String customerId;

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

    @Column(name = "status", length = 20, nullable = false)
    private String status;

    @Column(name = "avatar", length = 500)
    private String avatar;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "createdAt", nullable = false)
    private Date createdAt;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Comment> comments;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = new Date();
        }
        if (status == null) {
            status = "Active";
        }
    }
}