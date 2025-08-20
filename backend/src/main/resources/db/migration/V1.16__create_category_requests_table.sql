-- CategoryRequest tablosunu oluştur
CREATE TABLE category_requests (
    id VARCHAR(36) PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    seller_id BIGINT NOT NULL,
    admin_id BIGINT,
    
    -- Foreign key constraints
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_category_requests_seller (seller_id),
    INDEX idx_category_requests_status (status),
    INDEX idx_category_requests_created_at (created_at),
    INDEX idx_category_requests_category_name (category_name)
);

-- Status enum değerleri için check constraint
ALTER TABLE category_requests 
ADD CONSTRAINT chk_category_request_status 
CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'));
