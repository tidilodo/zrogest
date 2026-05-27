-- ZroGest v3: Project Metrics Templates
-- Adiciona suporte a métricas pré-configuradas por projeto

-- Project Metrics Templates
CREATE TABLE IF NOT EXISTS project_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  metric_id TEXT NOT NULL,
  label TEXT NOT NULL,
  table_name TEXT NOT NULL,
  filter JSONB,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, metric_id)
);

-- Indexes
CREATE INDEX idx_project_metrics_project ON project_metrics(project_id);
CREATE INDEX idx_project_metrics_order ON project_metrics(project_id, "order");

-- RLS
ALTER TABLE project_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project owner can manage metrics" ON project_metrics FOR ALL
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    OR project_id IN (
      SELECT project_id FROM project_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'manager')
    )
  );

CREATE POLICY "Project members can view metrics" ON project_metrics FOR SELECT
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    OR project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
  );
