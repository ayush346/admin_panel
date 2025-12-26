import React, { createContext, useContext, useMemo, useState } from 'react';

const EditModeContext = createContext({
  isEditMode: false,
  setEditMode: () => {},
  visibilityMode: false,
  toggleVisibilityMode: () => {},
  isDisabled: () => false,
  disableContent: () => {},
  enableContent: () => {},
});

export function EditModeProvider({ children }) {
  const [isEditMode, setEditMode] = useState(false);
  const [visibilityMode, setVisibilityMode] = useState(false);
  const [disabledKeys, setDisabledKeys] = useState(() => new Set());

  const toggleVisibilityMode = () => setVisibilityMode((v) => !v);

  const isDisabled = (key) => disabledKeys.has(key);
  const disableContent = (key) => {
    setDisabledKeys((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };
  const enableContent = (key) => {
    setDisabledKeys((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const contextValue = useMemo(
    () => ({
      isEditMode,
      setEditMode,
      visibilityMode,
      toggleVisibilityMode,
      isDisabled,
      disableContent,
      enableContent,
    }),
    [isEditMode, visibilityMode, disabledKeys]
  );

  return (
    <EditModeContext.Provider value={contextValue}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}




