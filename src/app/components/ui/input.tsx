import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: InputProps) {
    return (
        <input
            className={`px-4 py-2 p-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
            {...props}
        />
    );
}
