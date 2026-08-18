interface StatProps {
    value: string;
    label: string;
}

export function Stat({ value, label }: StatProps) {
    return (
        <div className="space-y-1">
            <h3 className="text-2xl font-semibold tracking-tight text-white">
                {value}
            </h3>

            <p className="text-xs leading-5 text-[#FF2D55]/80">
                {label}
            </p>
        </div>
    );
}