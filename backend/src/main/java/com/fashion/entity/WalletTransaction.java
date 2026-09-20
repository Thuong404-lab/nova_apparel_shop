package com.fashion.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "WalletTransactions")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WalletTransaction {

    @Id
    @Column(name = "transactionId", length = 20, nullable = false)
    private String transactionId;

    @ManyToOne
    @JoinColumn(name = "walletId", nullable = false)
    private Wallet wallet;

    @ManyToOne
    @JoinColumn(name = "orderId")
    private Order order;

    @Column(name = "transactionType", length = 30, nullable = false)
    private String transactionType;

    @Column(name = "amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "transactionStatus", length = 30, nullable = false)
    private String transactionStatus = "Pending";

    @Column(name = "externalMethod", length = 30)
    private String externalMethod;

    @Column(name = "description", length = 255)
    private String description;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "createdAt", nullable = false)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "completedAt")
    private Date completedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = new Date();
        }
        if (transactionStatus == null) {
            transactionStatus = "Pending";
        }
    }
}