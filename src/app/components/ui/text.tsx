
type TextProps = React.HTMLAttributes<HTMLParagraphElement>; 

export default function Text({ className = "", ...props }: TextProps) {
    return (
        <p
            className={`text-gray-800 ${className}`}
            {...props}
        />
    );
}