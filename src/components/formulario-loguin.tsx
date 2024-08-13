"use client";

import { signIn } from "next-auth/react";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import '@/styles/formulario-loguin.scss';

export default function FormularioLoguin() {
    const [errors, setErrors] = useState<string[]>([]);
    const [email, setEmail] = useState<string>("");
    const [contrasenia, setContrasenia] = useState<string>("");
    const router = useRouter();

    const handleForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors([]);

        const responseNextAuth = await signIn("credentials", {
            email,
            contrasenia,
            redirect: false,
        });

        if (responseNextAuth?.error) {
            setErrors(responseNextAuth.error.split(","));
            return;
        }

        return router.push("/admin");
    }

    return (
        <div className="contenedorFormLoguin">
            <div className="encabezado">
                <div className="logo">
                    <img src="/logo.png" alt="Logo" />
                </div>
                <h1>Bienvenido</h1>
                <h2>Sistema De Horarios FISEI</h2>
            </div>
            <form onSubmit={handleForm} className="formularioLoguin">
                <div className="contenedorIngreso">
                    <input
                        className="ingreso"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className="ingreso"
                        type="password"
                        placeholder="Contraseña"
                        value={contrasenia}
                        onChange={(e) => setContrasenia(e.target.value)}
                    />
                </div>
                <button type="submit" className="boton">
                    Iniciar sesión
                </button>
            </form>
        </div>
    );
}