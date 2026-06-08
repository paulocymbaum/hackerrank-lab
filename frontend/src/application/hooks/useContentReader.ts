import { useContentReaderStore } from "../stores/contentReaderStore";

export function useContentReader() {
  const isOpen = useContentReaderStore((s) => s.isOpen);
  const item = useContentReaderStore((s) => s.item);
  const tab = useContentReaderStore((s) => s.tab);
  const cwd = useContentReaderStore((s) => s.cwd);
  const selectedFilePath = useContentReaderStore((s) => s.selectedFilePath);
  const open = useContentReaderStore((s) => s.open);
  const close = useContentReaderStore((s) => s.close);
  const setTab = useContentReaderStore((s) => s.setTab);
  const setCwd = useContentReaderStore((s) => s.setCwd);
  const selectFile = useContentReaderStore((s) => s.selectFile);

  return {
    isOpen,
    item,
    tab,
    cwd,
    selectedFilePath,
    open,
    close,
    setTab,
    setCwd,
    selectFile,
  };
}
