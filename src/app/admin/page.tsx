"use client";

import { useSession } from "next-auth/react";

export default function AdminHome() {

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  console.log(session);

  return (
    <div className="contenedorPagina">
      <h1 className="d">Home</h1>
      <pre>
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
    </div>
  );
}
