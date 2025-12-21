import React, { createContext, useContext, useState } from 'react';

const EditModeContext = createContext({
  isEditMode: false,
  setEditMode: () => {},
});

export function EditModeProvider({ children }) {
  const [isEditMode, setEditMode] = useState(false);
  return (
    <EditModeContext.Provider value={{ isEditMode, setEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}


