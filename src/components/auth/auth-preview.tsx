import Image from "next/image";
import { Stat } from "./stat";

export function AuthPreview() {
    return (
        <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-[2.5rem] bg-black px-12 py-16 text-white">

            {/* Background Pattern */}
            <div className="absolute inset-0">
                <svg viewBox="0 0 640 690" preserveAspectRatio="xMidYMin slice" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full dark:opacity-[0.15]">
                    <g clipPath="url(#zigzag-pattern-left_svg__a)">
                        <path d="m-4 145 93-92 136 137L361 8l135-182 1 1h1l1 2 148 341h1l2-3 39-78c1-3 0-5-1-8l-36-67-55-104-65-123a53726 53726 0 0 0-21-40l-3-4-262 362-4-4-56-70A741167 741167 0 0 0 89-90l-3-3-4 3-48 55L-4 6v139Z" fill="currentColor" className="text-zinc-900 dark:text-white"></path>
                        <mask id="zigzag-pattern-left_svg__b" maskUnits="userSpaceOnUse" x="-4" y="501" width="552" height="630" style={{ maskType: 'alpha' }}>
                            <path d="M-4 502h552v629H-4V502Z" fill="#fff"></path>
                        </mask>
                        <g mask="url(#zigzag-pattern-left_svg__b)">
                            <path d="m-4 567 24 12 82 41 136 68 134 68a18877 18877 0 0 1 32 17l4 2-3 9-65 221-37 124v2h61l2-4 129-236 50-91 3-5-4-3-197-104-175-93A653816 653816 0 0 0-1 503l-3-1v65Z" fill="currentColor" className="text-zinc-900 dark:text-white"></path>
                        </g>
                        <path d="m-4 709 261 136-58 176-42-21-42-22a1561029 1561029 0 0 0-102 89v1l1 1 227 50h2l75-315-3-2-128-65-158-79-33-16v67Zm0-375 72-74 46 37-4 4L-1 440l-3 4 49 30 138-226-114-78-73 71v94Z" fill="currentColor" className="text-zinc-900 dark:text-white"></path>
                        <path d="m126-525-5 18-28 113-34 135v1c-2 5-1 8 2 13l96 142 81 122a2619 2619 0 0 0 11 15l2 3 70-107-3-3a224629 224629 0 0 0-77-77l-52-52-54-52-18-18c-3-3-3-4-1-7l46-91 46-92c2-4 2-4 7-3l106 25 180 42 171 40 12 2c3 1 5 2 7 5l38 61 76 119 29 46c2 3 2 5 1 8L778 9 677 233a43925 43925 0 0 1-24 54l-3 4-57-122-56-123-57-123-3 3-50 76-89 132-56 84-87 129a771479 771479 0 0 1-85 126l-15 23-3 4 4 2 110 55 154 78 101 51 103 52 102 51 103 51 101 52 64 32 4 2 455-716L1178-5c-2 1-79 152-84 163l33 9 32 10 33 9 32 9 33 9a86486 86486 0 0 1-359 656l-5-2-61-36-192-112-203-119-172-101-49-29-5-2 2-5a2493269 2493269 0 0 1 209-347l49-82 4-6 2 4a88347 88347 0 0 1 32 89l63 170 55 152 7 19 2 4 6-13 43-89 68-141 70-148 86-179 12-27c2-2 2-4 0-7l-67-91-136-185a14 14 0 0 0-10-6l-124-21-126-20-119-20-101-16-108-18-4-1Z" fill="currentColor" className="text-zinc-900 dark:text-white"></path>
                        <path d="m1135-211 409-300-54-90c-4 2-72 60-115 98l-114 99-114 99c-4-2-48-48-88-91l-87-91-87-92-96 157 3 5a2246147 2246147 0 0 0 178 245l29 41c3 3 3 6 1 9L875 106l-90 165-136 249-7 13-2 4-272-132c1-4 60-108 63-110l3 5 68 123c1 3 3 4 6 6l80 39h3a2179922 2179922 0 0 0-139-327l-2-4-152 283 364 228 422-791-233-273 58-80h2l1 1 2 2 220 281 1 1Z" fill="currentColor" className="text-zinc-900 dark:text-white"></path>
                    </g>
                    <defs>
                        <clipPath id="zigzag-pattern-left_svg__a">
                            <path fill="#fff" d="M0 0h640v690H0z"></path>
                        </clipPath>
                    </defs>
                </svg>
            </div>

            {/* Decorative gradient blurs */}
            <div className="absolute right-0 top-0 h-125 w-125 translate-x-1/3 -translate-y-1/3 rounded-full bg-zinc-700/20 blur-[120px]" />
            <div className="absolute bottom-0 left-0 h-100 w-100 -translate-x-1/4 translate-y-1/4 rounded-full bg-zinc-800/30 blur-[100px]" />

            {/* Content */}
            <div className="relative z-10 flex w-full flex-col items-center space-y-8">

                {/* Logo Section */}
                <div className="flex flex-col items-center space-y-1">
                    <div className="flex h-32 w-32 items-center justify-center">
                        <svg viewBox="0 0 100 100" className="h-full w-full text-[#e0ff57]">
                            <path
                                d="M50 10 L90 90 L70 90 L50 50 L30 90 L10 90 Z"
                                fill="currentColor"
                            />
                            <path
                                d="M50 30 L70 70 L50 70 L30 70 Z"
                                fill="currentColor"
                                opacity="0.5"
                            />
                        </svg>
                    </div>
                    <span className="text-base font-medium tracking-wide">ALLTIMESCORES</span>
                </div>

                {/* Main Heading */}
                <div className="flex flex-col items-center space-y-4 text-center">
                    <h1 className="text-3xl font-bold leading-tight">
                        Welcome to AllTimeScores
                    </h1>
                    <p className="max-w-md text-sm leading-relaxed text-zinc-400">
                        AllTimeScores gives you everything needed to manage sports content, live matches, communities and developer APIs from one modern platform.
                    </p>
                    <p className="text-sm text-zinc-300">
                        Trusted by editors, developers and sports communities.
                    </p>
                </div>
            </div>

            {/* Bottom Card */}
            <div className="relative z-10 w-full max-w-xl">
                <div className="rounded-3xl bg-zinc-900/80 p-8 backdrop-blur-sm border border-zinc-800">
                    <div className="space-y-3">
                        <h2 className="text-2xl font-semibold leading-snug">
                            Everything you need to run your sports platform.
                        </h2>
                        <p className="text-sm leading-relaxed text-zinc-400">
                            Create content, manage live coverage, monitor users and provide commercial API access with confidence.
                        </p>

                        {/* Avatars */}
                        <div className="mt-6 grid grid-cols-5 gap-4 border-t border-zinc-800 pt-6">
                            <div/> <div/>

                            <Stat
                                value="24/7"
                                label="Live Coverage"
                            />

                            <Stat
                                value="99.9%"
                                label="API Uptime"
                            />

                            <Stat
                                value="Secure"
                                label="Role Access"
                            />

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}