import React, { createContext, useState } from 'react';

export const AcilCikisContext = createContext();

export const AcilCikisProvider = ({ children }) => {

  return (
    <AcilCikisContext.Provider value={[
        
        ]}>
      {children}
    </AcilCikisContext.Provider>
  );
};
