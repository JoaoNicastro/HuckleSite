import { Leaf } from "lucide-react"

export function Header() {
    return (
        <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-white/5 uppercase tracking-widest text-xs font-semibold">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-primary" />
                    <span className="text-lg tracking-[0.2em] text-white">HUCKLE</span>
                </div>
                <nav className="hidden md:flex gap-8">
                    <a href="#how-it-works" className="text-white/70 hover:text-white transition-colors">HOW IT WORKS</a>
                    <a href="#why-huckle" className="text-white/70 hover:text-white transition-colors">WHY HUCKLE</a>
                </nav>
                <div className="flex items-center gap-4">
                    <a href="#waitlist" className="flex items-center gap-1 text-accent hover:text-white transition-colors">
                        JOIN WAITLIST <span className="text-lg leading-none">↗</span>
                    </a>
                </div>
            </div>
        </header>
    )
}
