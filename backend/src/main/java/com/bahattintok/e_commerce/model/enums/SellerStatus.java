package com.bahattintok.e_commerce.model.enums;

/**
 * Satıcı durumları
 */
public enum SellerStatus {
    PENDING("Beklemede"),
    APPROVED("Onaylandı"),
    REJECTED("Reddedildi"),
    ACTIVE("Aktif"),
    INACTIVE("Pasif");

    private final String displayName;

    SellerStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
