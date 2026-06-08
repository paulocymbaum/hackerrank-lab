import { useContentReaderStore } from "../stores/contentReaderStore";

export function closeReaderBeforeNavigate(): void {
  useContentReaderStore.getState().close();
}
