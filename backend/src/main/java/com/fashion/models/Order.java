package com.fashion.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "Orders")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    @Id
    @Column(name = "orderId", length = 20, nullable = false)
    private String orderId;

    @ManyToOne
    @JoinColumn(name = "customerId", nullable = false)
    private Customer customer;

    @Column(name = "orderStatus", length = 30, nullable = false)
    private String orderStatus = "Pending";

    @Column(name = "shippingAddress", length = 255)
    private String shippingAddress;

    @Column(name = "shippingPhone", length = 15)
    private String shippingPhone;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "placedAt", nullable = false)
    private Date placedAt;

    @Column(name = "totalAmount", precision = 12, scale = 2, nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "paymentMethod", length = 30)
    private String paymentMethod;

    @Column(name = "paymentStatus", length = 30, nullable = false)
    private String paymentStatus = "Pending";

    @Column(name = "paidAmount", precision = 12, scale = 2, nullable = false)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "issuedDate", nullable = false)
    private Date issuedDate;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    @PrePersist
    protected void onCreate() {
        Date now = new Date();
        if (placedAt == null) {
            placedAt = now;
        }
        if (issuedDate == null) {
            issuedDate = now;
        }
        if (orderStatus == null) {
            orderStatus = "Pending";
        }
        if (paymentStatus == null) {
            paymentStatus = "Pending";
        }
        if (totalAmount == null) {
            totalAmount = BigDecimal.ZERO;
        }
        if (paidAmount == null) {
            paidAmount = BigDecimal.ZERO;
        }
    }
}