import { motion, useInView, useScroll, useTransform, type Transition } from "framer-motion"
import { useRef } from "react"
import { Truck, ShoppingBag, MapPin, Leaf, Zap } from "lucide-react"

// ── Type-safe transition builder ─────────────────────────────────────────────
const t = (delay = 0): Transition => ({ delay, duration: 0.8, ease: "easeOut" })

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" } as const,
    transition: t(delay),
})

const fadeLeft = (delay = 0) => ({
    initial: { opacity: 0, x: -40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-60px" } as const,
    transition: t(delay),
})

const fadeRight = (delay = 0) => ({
    initial: { opacity: 0, x: 40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-60px" } as const,
    transition: t(delay),
})

// ── Problem Section — White background with gradient exit ────────────────────
export function ProblemSection() {
    return (
        <section className="relative bg-[#fbf6e2]">
            <div className="container mx-auto px-6 py-28">
                <div className="max-w-3xl mb-20">
                    <motion.p
                        {...fadeUp(0)}
                        className="inline-block text-xs font-semibold text-[#295F46] uppercase tracking-[0.18em] mb-5 px-3 py-1 rounded-full border border-[#295F46]/20 bg-[#295F46]/5"
                    >
                        The Problem
                    </motion.p>
                    <motion.h2
                        {...fadeUp(0.1)}
                        className="text-4xl md:text-5xl font-bold leading-tight text-[#1a1a1a]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        The grocery store model<br />
                        <em>is broken.</em>
                    </motion.h2>
                    <motion.p {...fadeUp(0.2)} className="mt-6 text-lg text-[#6b6b6b] font-light max-w-xl">
                        Produce travels thousands of miles, sits in warehouses for weeks, and costs more
                        due to endless supply chain markups.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-[#e5ddc8] pt-12">
                    {[
                        { icon: Truck, title: "Long Distances", desc: "Average produce travels 1,500 miles before reaching your plate." },
                        { icon: Zap, title: "Lack of Transparency", desc: "You don't know who grew it, when it was picked, or how it was treated." },
                        { icon: ShoppingBag, title: "Supply Chain Markups", desc: "Middlemen take their cut, making fresh food harder to afford." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            {...fadeUp(i * 0.1 + 0.2)}
                            whileHover={{ y: -6 }}
                            className="flex flex-col gap-4 p-7 rounded-2xl bg-white cursor-default"
                            style={{ boxShadow: "0 2px 24px 0 rgba(41,95,70,0.06)" }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                                className="w-12 h-12 rounded-xl bg-[#fbf6e2] flex items-center justify-center text-[#295F46] shadow-sm"
                            >
                                <item.icon className="w-6 h-6" />
                            </motion.div>
                            <h3 className="text-xl font-semibold text-[#1a1a1a]"
                                style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
                            <p className="text-[#6b6b6b] text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ── Parallax floating orb ───────────────────────────────────────────────────
function FloatingOrb({ className }: { className: string }) {
    return (
        <motion.div
            className={`absolute rounded-full opacity-25 blur-3xl pointer-events-none ${className}`}
            animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
    )
}

// ── Solution Section — Cream background ─────────────────────────────────────
export function SolutionSection() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
    const imgY = useTransform(scrollYProgress, [0, 1], [30, -30])

    return (
        <section id="why-huckle" ref={sectionRef} className="relative py-28 overflow-hidden" style={{ backgroundColor: "#fbf6e2" }}>
            <FloatingOrb className="w-96 h-96 bg-[#295F46] -top-20 -right-20" />
            <FloatingOrb className="w-64 h-64 bg-[#DF7E4C] bottom-10 left-10" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    {/* Text side */}
                    <div className="flex-1 max-w-xl">
                        <motion.p
                            {...fadeLeft(0)}
                            className="inline-block text-xs font-semibold text-[#295F46] uppercase tracking-[0.18em] mb-5 px-3 py-1 rounded-full border border-[#295F46]/20 bg-white/60"
                        >
                            The Huckle Solution
                        </motion.p>
                        <motion.h2
                            {...fadeLeft(0.1)}
                            className="text-4xl md:text-5xl font-bold leading-tight text-[#1a1a1a] mb-6"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Food that goes from<br />
                            <em className="text-[#295F46]">farm to you</em>
                        </motion.h2>
                        <motion.p {...fadeLeft(0.2)} className="text-[#6b6b6b] font-light mb-4">
                            Imagine wanting really fresh food, but your only option is a grocery store where you don't know how long it's been sitting there.
                        </motion.p>
                        <motion.p {...fadeLeft(0.25)} className="text-[#1a1a1a] font-medium mb-10 text-[15px]">
                            Huckle connects you directly to local farmers and farmers markets — so your food goes from farm to you.
                        </motion.p>

                        <div className="space-y-5">
                            {[
                                "Picked fresh, often same-day",
                                "Delivered directly to you",
                                "Lower prices, no markup",
                                "Supports real local farmers",
                            ].map((text, i) => (
                                <motion.div
                                    key={i}
                                    {...fadeLeft(i * 0.08 + 0.3)}
                                    className="flex items-center gap-3"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.08 + 0.3, type: "spring", stiffness: 300 }}
                                        className="w-5 h-5 rounded-full bg-[#295F46] flex items-center justify-center flex-shrink-0"
                                    >
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                    <span className="text-[#1a1a1a] text-sm font-medium">{text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Parallax stats card */}
                    <motion.div {...fadeRight(0.2)} className="flex-1 flex justify-center">
                        <motion.div
                            style={{ y: imgY }}
                            className="w-full max-w-sm bg-white rounded-3xl p-8"
                            animate={{
                                boxShadow: [
                                    "0 8px 40px rgba(41,95,70,0.10)",
                                    "0 16px 60px rgba(41,95,70,0.18)",
                                    "0 8px 40px rgba(41,95,70,0.10)"
                                ]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {/* Farm → Home journey */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-xl bg-[#295F46]/10 flex items-center justify-center">
                                        <Leaf className="w-6 h-6 text-[#295F46]" />
                                    </div>
                                    <span className="text-xs text-[#6b6b6b] font-medium">Local Farm</span>
                                </div>

                                <div className="flex-1 mx-3 relative h-[2px] bg-[#e5ddc8] overflow-hidden rounded-full">
                                    <motion.div
                                        className="absolute inset-y-0 left-0 bg-[#295F46] rounded-full"
                                        animate={{ x: ["-100%", "200%"] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        style={{ width: "40%" }}
                                    />
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-xl bg-[#DF7E4C]/10 flex items-center justify-center">
                                        <ShoppingBag className="w-6 h-6 text-[#DF7E4C]" />
                                    </div>
                                    <span className="text-xs text-[#6b6b6b] font-medium">Your Home</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 border-t border-[#f0ebe0] pt-6">
                                {[
                                    { value: "24h", label: "From pick to door" },
                                    { value: "30%", label: "Avg. savings" },
                                    { value: "50+", label: "Local farms" },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        {...fadeUp(i * 0.1 + 0.4)}
                                        className="flex flex-col items-center gap-1 text-center"
                                    >
                                        <span className="text-2xl font-bold text-[#DF7E4C]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                            {stat.value}
                                        </span>
                                        <span className="text-[10px] text-[#6b6b6b] leading-tight">{stat.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

// ── How It Works — Cream to slightly deeper cream ───────────────────────────
export function HowItWorks() {
    const inViewRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(inViewRef, { once: true, margin: "-100px" })

    return (
        <section id="how-it-works" ref={inViewRef} className="relative py-28 overflow-hidden"
            style={{ background: "linear-gradient(to bottom, #fbf6e2 0%, #f0e9cc 100%)" }}>
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#fbf6e2] to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.p
                        {...fadeUp(0)}
                        className="inline-block text-xs font-semibold text-[#DF7E4C] uppercase tracking-[0.18em] mb-5 px-3 py-1 rounded-full border border-[#DF7E4C]/20 bg-[#DF7E4C]/5"
                    >
                        How It Works
                    </motion.p>
                    <motion.h2
                        {...fadeUp(0.1)}
                        className="text-4xl md:text-5xl font-bold text-[#1a1a1a]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Three simple steps to{" "}
                        <em className="text-[#DF7E4C]">fresher food</em>
                    </motion.h2>
                    <motion.p {...fadeUp(0.2)} className="mt-4 text-[#6b6b6b] font-light max-w-md mx-auto">
                        Getting farm-fresh produce has never been easier.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Animated connector line */}
                    <div className="hidden md:block absolute top-12 left-[calc(16.66%+3rem)] right-[calc(16.66%+3rem)] h-[2px] bg-[#e5ddc8] overflow-hidden rounded-full z-0">
                        <motion.div
                            className="h-full bg-[#DF7E4C] rounded-full"
                            initial={{ width: "0%" }}
                            animate={isInView ? { width: "100%" } : { width: "0%" }}
                            transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                        />
                    </div>

                    {[
                        { step: "01", icon: MapPin, title: "Discover nearby farms", desc: "Browse local farms and farmers markets in your area. See what's fresh and in season." },
                        { step: "02", icon: ShoppingBag, title: "Order directly from farmers", desc: "Pick the produce you want and order straight from the source. No middlemen." },
                        { step: "03", icon: Truck, title: "Get fresh food delivered", desc: "Your order is picked fresh and delivered right to your door, often same-day." },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            {...fadeUp(i * 0.15 + 0.2)}
                            whileHover={{ y: -8 }}
                            className="flex flex-col items-center text-center p-8 rounded-3xl bg-white relative z-10 cursor-default"
                            style={{ boxShadow: "0 4px 32px rgba(41,95,70,0.08)" }}
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -10 }}
                                whileInView={{ scale: 1, rotate: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 + 0.1, type: "spring", stiffness: 300, damping: 20 }}
                                className="absolute -top-4 w-9 h-9 rounded-full bg-[#DF7E4C] flex items-center justify-center text-white text-xs font-bold shadow-md"
                            >
                                {item.step}
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400 }}
                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-[#295F46] mb-5 mt-2"
                                style={{ backgroundColor: "rgba(41,95,70,0.08)" }}
                            >
                                <item.icon className="w-8 h-8" />
                            </motion.div>
                            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3"
                                style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
                            <p className="text-[#6b6b6b] text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
