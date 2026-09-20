package com.fashion.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "WarehouseImports")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WarehouseImport {

    @Id
    @Column(name = "importId", length = 20, nullable = false)
    private String importId;

    @Column(name = "importPrice", precision = 12, scale = 2, nullable = false)
    private BigDecimal importPrice;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variantId", nullable = false)
    private ProductVariant variant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employeeId", nullable = false)
    private Employee employee;


    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "importedAt", nullable = false)
    private Date importedAt;

    @PrePersist
    protected void onCreate() {
        if (importedAt == null) {
            importedAt = new Date();
        }
    }
}