-- Performance indexes for orders and related tables
-- Run this migration in Supabase SQL Editor

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_is_admin_deleted ON orders(is_admin_deleted);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_composite_admin ON orders(is_admin_deleted, created_at DESC);

-- Comments table index
CREATE INDEX IF NOT EXISTS idx_comments_product_id ON comments(product_id);

-- Support messages table index
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);
