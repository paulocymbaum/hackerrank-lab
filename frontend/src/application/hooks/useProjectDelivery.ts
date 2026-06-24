import { useCallback, useEffect, useMemo, useState } from "react";
import { useProjectDeliveryStore } from "../stores/projectDeliveryStore";
import { loadProjectDeliveries } from "../usecases/projectDeliveries";
import { lessonIdFromRootPath } from "../../presentation/shared/utils/pathUtils";

export function useProjectDelivery(input: {
  courseId: string;
  projectId: string;
  rootPath: string;
  enabled: boolean;
}) {
  const { courseId, projectId, rootPath, enabled } = input;
  const lessonId = useMemo(() => lessonIdFromRootPath(rootPath), [rootPath]);
  const deliveries = useProjectDeliveryStore((s) => s.getDeliveries(courseId, projectId, lessonId));
  const meta = useProjectDeliveryStore((s) => s.getMeta(courseId, projectId, lessonId));
  const submitDelivery = useProjectDeliveryStore((s) => s.submitDelivery);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!enabled || !courseId || !projectId || !rootPath) return;
    void loadProjectDeliveries(courseId, projectId, rootPath, lessonId);
  }, [enabled, courseId, projectId, rootPath, lessonId]);

  const save = useCallback(async () => {
    if (!draft.trim()) return false;
    setSaving(true);
    try {
      const ok = await submitDelivery(courseId, projectId, rootPath, draft, lessonId);
      if (ok) setDraft("");
      return ok;
    } finally {
      setSaving(false);
    }
  }, [courseId, projectId, rootPath, draft, lessonId, submitDelivery]);

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
