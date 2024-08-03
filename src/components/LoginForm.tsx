"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import '@/styles/LoginForm.scss';

export default function LoginForm() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();

    const handleForm = async (event: FormEvent) => {
        event.preventDefault();
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="boton">
                    Iniciar sesión
                </button>
            </form>
        </div>
    );
}