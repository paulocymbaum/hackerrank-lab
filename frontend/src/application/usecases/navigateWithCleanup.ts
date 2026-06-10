import { useContentReaderStore } from "../stores/legacy/contentReaderStore";

export function closeReaderBeforeNavigate(): void {
  useContentReaderStore.getState().close();
}
