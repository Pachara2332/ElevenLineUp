type Props = {
    role: string;
    x: number;
    y: number;
};

export default function PositionSlot({ role, x, y }: Props) {
    return (
        <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
                left: `${x}%`,
                top: `${y}%`,
            }}
        >
            <div className="w-12 h-12 rounded-full bg-white text-black
                      flex items-center justify-center text-sm font-bold
                      shadow-lg">
                {role}
            </div>
        </div>
    );
}
