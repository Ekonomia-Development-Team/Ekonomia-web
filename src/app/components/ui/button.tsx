    import React from "react";

    type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
        children: React.ReactNode;
    };

    export default function Button({ children, className = "", ...props }: ButtonProps) {
        return (
            <button
                className={`px-4 py-2 p-6 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 gap-x-4 max-w-xs ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }