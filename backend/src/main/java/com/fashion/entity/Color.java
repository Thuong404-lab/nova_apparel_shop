package com.fashion.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Colors")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Color {

    @Id
    @Column(name = "colorId", length = 20, nullable = false)
    private String colorId;

    @Column(name = "colorName", length = 50, nullable = false)
    private String colorName;

    @Column(name = "hexCode", length = 10)
    private String hexCode;

}