package com.fashion.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Sizes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Size {

    @Id
    @Column(name = "sizeId", length = 20, nullable = false)
    private String sizeId;

    @Column(name = "sizeName", length = 20, nullable = false)
    private String sizeName;

    @ManyToOne
    @JoinColumn(name = "categoryId", nullable = false)
    private Category category;
}