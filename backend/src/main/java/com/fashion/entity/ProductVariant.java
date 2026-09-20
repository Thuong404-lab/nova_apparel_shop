package com.fashion.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "ProductVariants")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductVariant {

    @Id
    @Column(name = "variantId", length = 20, nullable = false)
    private String variantId;

    @ManyToOne
    @JoinColumn(name = "productId", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "sizeId", nullable = false)
    private Size size;

    @ManyToOne
    @JoinColumn(name = "colorId", nullable = false)
    private Color color;

    @Column(name = "sku", length = 50, unique = true)
    private String sku;

    @Column(name = "stockQty", nullable = false)
    private Integer stockQty = 0;

    @Column(name = "reservedQty", nullable = false)
    private Integer reservedQty = 0;

    @Column(name = "priceOverride", precision = 12, scale = 2)
    private BigDecimal priceOverride;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "createdAt", nullable = false)
    private Date createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = new Date();
        }
        if (stockQty == null) {
            stockQty = 0;
        }
        if (reservedQty == null) {
            reservedQty = 0;
        }
    }
}