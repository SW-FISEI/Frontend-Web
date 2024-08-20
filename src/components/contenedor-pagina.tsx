import { ReactNode } from 'react';

export default function ContenedorPagina({ children }: { children: ReactNode }) {
  return (
    <div className="contenedorContenidoPagina">
      {children}
    </div>
  );
}