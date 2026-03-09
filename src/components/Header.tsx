import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"

export function Header() {
    const { scrollY } = useScroll()
    const [hidden, setHidden] = useState(false)
    const [isTop, setIsTop] = useState(true)

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0
        if (latest > 50 && latest > previous) {
            setHidden(true)
        } else {
            setHidden(false)
        }
        setIsTop(latest < 50)
    })

    return (
        <motion.header
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" }
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isTop ? "bg-transparent border-transparent" : "bg-[#fbf6e2]/90 backdrop-blur-md border-b border-[#e5ddc8]"
                }`}
        >
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}>
                        Huckle
                    </span>
                </div>

                {/* Nav */}
                <nav className="hidden md:flex gap-8 text-sm font-medium text-[#6b6b6b]">
                    <a href="#how-it-works" className="hover:text-[#1a1a1a] transition-colors">How it works</a>
                    <a href="#why-huckle" className="hover:text-[#1a1a1a] transition-colors">Why Huckle</a>
                </nav>

                {/* CTA */}
                <a
                    href="#waitlist"
                    className="text-sm font-semibold px-5 py-2 rounded-full bg-[#295F46] text-white hover:bg-[#1f4934] transition-colors"
                >
                    Join Waitlist
                </a>
            </div>
        </motion.header>
    )
}
