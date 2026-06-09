import { useCallback, useEffect, useState } from "react";
import { useProjectDeliveryStore } from "../stores/projectDeliveryStore";
import { loadProjectDeliveries } from "../usecases/projectDeliveries";

export function useProjectDelivery(input: {
  courseId: string;
  projectId: string;
  rootPath: string;
  enabled: boolean;
}) {
  const { courseId, projectId, rootPath, enabled } = input;
  const deliveries = useProjectDeliveryStore((s) => s.getDeliveries(courseId, projectId));
  const meta = useProjectDeliveryStore((s) => s.getMeta(courseId, projectId));
  const submitDelivery = useProjectDeliveryStore((s) => s.submitDelivery);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!enabled || !courseId || !projectId || !rootPath) return;
    void loadProjectDeliveries(courseId, projectId, rootPath);
  }, [enabled, courseId, projectId, rootPath]);

  const save = useCallback(async () => {
    if (!draft.trim()) return false;
    setSaving(true);
    try {
      const ok = await submitDelivery(courseId, projectId, rootPath, draft);
      if (ok) setDraft("");
      return ok;
    } finally {
      setSaving(false);
    }
  }, [courseId, projectId, rootPath, draft, submitDelivery]);

  return {
    draft,
    setDraft,
    deliveries,
    loading: meta.loading,
    error: meta.error,
    saving,
    save,
    canSave: draft.trim().length > 0 && !saving,
  };
}
