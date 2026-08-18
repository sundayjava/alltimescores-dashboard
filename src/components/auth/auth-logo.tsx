import Image from "next/image";
import Link from "next/link";

export function AuthLogo() {
    return (
        <Link
            href="/"
            className="inline-flex flex-col items-start gap-2"
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black dark:bg-white/10 p-2">
                <Image
                    src="/logo2.png"
                    alt="AllTimeScores" 
                    width={32}
                    height={32}
                    className="h-8 w-8"
                />
            </div>
        </Link>
    );
}