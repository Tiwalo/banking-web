CREATE TABLE IF NOT EXISTS tiwalo_web.transfer_draft (
  actor text NOT NULL,
  id uuid NOT NULL,
  sealed bytea NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  PRIMARY KEY (actor, id)
);
CREATE INDEX IF NOT EXISTS transfer_draft_expiry ON tiwalo_web.transfer_draft(expires_at);
ALTER TABLE tiwalo_web.transfer_draft
  ADD COLUMN IF NOT EXISTS state text NOT NULL DEFAULT 'review'
    CHECK (state IN ('review', 'uncertain', 'posted', 'declined', 'conflict')),
  ADD COLUMN IF NOT EXISTS claim uuid,
  ADD COLUMN IF NOT EXISTS retry_after timestamptz,
  ADD COLUMN IF NOT EXISTS decline_reason text;
