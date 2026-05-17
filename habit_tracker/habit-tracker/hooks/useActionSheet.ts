import { useCallback, useState } from "react";

export function useActionSheet() {
  const [visible, setVisible] = useState(false);

  return {
    visible,
    open: useCallback(() => setVisible(true), []),
    close: useCallback(() => setVisible(false), [])
  };
}
