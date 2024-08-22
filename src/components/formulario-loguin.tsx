"use client";

import { signIn } from "next-auth/react";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import '@/styles/formulario-loguin.scss';
import toast from "react-hot-toast";

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
            toast.error("Error al iniciar sesión. Verifica tus credenciales.");
            return;
        }

        toast.success("Inicio de sesión exitoso. Redirigiendo...");
        return router.push("/admin");
    }

    return (
        <div className="contenedorFormLoguin">
            <div className="encabezado">
                <div className="logo">
                    <Image src="/logo.png" alt="Logo" width={150} height={50} /> {/* Usa Image en lugar de img */}
                </div>
                <h1 className="uppercase font-semibold">Bienvenido</h1>
                <h2 className="uppercase font-bold">Sistema De Horarios FISEI</h2>
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
