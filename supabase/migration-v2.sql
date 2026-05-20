-- ZroGest v2: Team members, invites, ClickUp integration

-- Project members (users with access to a project)
CREATE TABLE IF NOT EXISTS project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'manager', 'viewer')),
  invited_by UUID REFERENCES profiles(id),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Pending invites (before user creates account)
CREATE TABLE IF NOT EXISTS project_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('manager', 'viewer')),
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT now() + INTERVAL '7 days',
  accepted_at TIMESTAMPTZ,
  UNIQUE(project_id, email)
);

-- Add clickup to integrations type
ALTER TABLE integrations DROP CONSTRAINT IF EXISTS integrations_type_check;
ALTER TABLE integrations ADD CONSTRAINT integrations_type_check
  CHECK (type IN ('vercel', 'supabase', 'mercadopago', 'clickup', 'custom'));

-- Indexes
CREATE INDEX idx_members_project ON project_members(project_id);
CREATE INDEX idx_members_user ON project_members(user_id);
CREATE INDEX idx_invites_token ON project_invites(token);
CREATE INDEX idx_invites_email ON project_invites(email);

-- RLS
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_invites ENABLE ROW LEVEL SECURITY;

-- Members: visible to project owner or the member themselves
CREATE POLICY "Members visible to project owner or self" ON project_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Owner can manage members" ON project_members FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- Invites: visible to project owner
CREATE POLICY "Owner can manage invites" ON project_invites FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- Allow anyone to read invite by token (for accept flow)
CREATE POLICY "Anyone can read invite by token" ON project_invites FOR SELECT
  USING (true);

-- Update project policies to include members
DROP POLICY IF EXISTS "Users can CRUD own projects" ON projects;

CREATE POLICY "Owner can CRUD own projects" ON projects FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Members can view shared projects" ON projects FOR SELECT
  USING (
    auth.uid() = user_id
    OR id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
  );

-- Update integrations/metrics/health to also allow members
DROP POLICY IF EXISTS "Users can CRUD own integrations" ON integrations;
DROP POLICY IF EXISTS "Users can view own metrics" ON metrics;
DROP POLICY IF EXISTS "Users can view own health checks" ON health_checks;

CREATE POLICY "Project access for integrations" ON integrations FOR ALL
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    OR project_id IN (
      SELECT project_id FROM project_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'manager')
    )
  );

CREATE POLICY "Project access for metrics" ON metrics FOR ALL
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    OR project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Project access for health checks" ON health_checks FOR ALL
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    OR project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
  );
