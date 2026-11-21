CREATE TABLE admin_notifications (
    id UUID PRIMARY KEY,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(60) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'INFO',
    title VARCHAR(180) NOT NULL,
    message VARCHAR(500) NOT NULL,
    action_url VARCHAR(300),
    entity_key VARCHAR(180),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMPTZ
);

CREATE INDEX idx_admin_notifications_recipient_created
    ON admin_notifications (recipient_id, created_at DESC);
CREATE INDEX idx_admin_notifications_recipient_unread
    ON admin_notifications (recipient_id, read_at) WHERE read_at IS NULL;
CREATE UNIQUE INDEX idx_admin_notifications_recipient_entity
    ON admin_notifications (recipient_id, entity_key) WHERE entity_key IS NOT NULL;
