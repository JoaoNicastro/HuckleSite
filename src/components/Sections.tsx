import { motion } from "framer-motion"
import { Truck, Users, ShieldCheck, MapPin, ShoppingBag, Leaf } from "lucide-react"

export function ProblemSection() {
    return (
        <section className="py-32 bg-background text-foreground border-b border-white/10">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mb-24">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-widest leading-[1.1] mb-8">
                        THE GROCERY STORE MODEL IS <span className="text-accent italic">BROKEN</span>.
                    </h2>
                    <p className="text-xl text-white/60 tracking-wide font-light max-w-2xl">
                        PRODUCE TRAVELS THOUSANDS OF MILES, SITS IN WAREHOUSES FOR WEEKS, AND COSTS MORE DUE TO ENDLESS SUPPLY CHAIN MARKUPS.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-16">
                    {[
                        { title: "LONG DISTANCES", desc: "AVERAGE PRODUCE TRAVELS 1,500 MILES BEFORE REACHING YOUR PLATE." },
                        { title: "LACK OF TRANSPARENCY", desc: "YOU DON'T KNOW WHO GREW IT, WHEN IT WAS PICKED, OR HOW IT WAS TREATED." },
                        { title: "SUPPLY CHAIN MARKUPS", desc: "MIDDLEMEN TAKE THEIR CUT, MAKING FRESH FOOD HARDER TO AFFORD." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col gap-6 group"
                        >
                            <div className="w-16 h-16 border border-white/20 rounded-none flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-colors duration-500">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold uppercase tracking-widest mb-4">{item.title}</h3>
                                <p className="text-white/50 tracking-wide leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function SolutionSection() {
    return (
        <section className="py-32 bg-background text-foreground border-b border-white/10 overflow-hidden relative">
            {/* Minimal background element */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(41,95,70,0.1),transparent_50%)]" style={{ pointerEvents: "none" }} />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-start gap-24">
                    <div className="flex-1 max-w-2xl">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-widest leading-[1.1] mb-8">
                            THE <span className="text-primary italic">HUCKLE</span> WAY
                        </h2>
                        <p className="text-xl text-white/60 tracking-wide font-light mb-16">
                            WE CONNECT YOU DIRECTLY WITH LOCAL FARMERS. NO WAREHOUSES, NO MIDDLEMEN, NO UNNECESSARY MILES. JUST FRESH, NUTRIENT-DENSE FOOD DELIVERED TO YOUR DOOR.
                        </p>

                        <div className="space-y-12">
                            {[
                                { icon: Leaf, title: "FRESHER FOOD", desc: "OFTEN PICKED SAME-DAY AND DELIVERED WITHIN 24 HOURS." },
                                { icon: ShoppingBag, title: "30% SAVINGS", desc: "LOWER PRICES BY CUTTING OUT THE GROCERY STORE OVERHEAD." },
                                { icon: Users, title: "SUPPORT FARMERS", desc: "DIRECT SUPPORT FOR OVER 50+ LOCAL FARMS IN YOUR COMMUNITY." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                                    className="flex gap-8 group"
                                >
                                    <div className="flex-shrink-0 w-16 h-16 border border-white/20 rounded-none flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors duration-500">
                                        <item.icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-2xl uppercase tracking-widest mb-2">{item.title}</h4>
                                        <p className="text-white/50 tracking-wide leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 w-full lg:sticky lg:top-32">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="aspect-[4/5] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 border border-white/20 relative group"
                        >
                            <img src="/tech-farm.png" alt="Agriculture and Technology" className="w-full h-full object-cover" />

                            {/* Scanning line animation */}
                            <motion.div
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                                className="absolute left-0 right-0 h-[1px] bg-primary shadow-[0_0_15px_rgba(41,95,70,0.8)] z-10"
                            />

                            {/* Overlay grid to give a tech blueprint feel */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-32 bg-background border-b border-white/10">
            <div className="container mx-auto px-6">
                <div className="mb-24">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-widest leading-[1.1] mb-8">
                        HOW IT <span className="text-primary italic">WORKS</span>
                    </h2>
                    <p className="text-xl text-white/60 tracking-wide font-light max-w-2xl">
                        GET YOUR GROCERIES FROM FARM TO TABLE IN THREE SIMPLE STEPS.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                    <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-[1px] bg-white/20 z-0" />

                    {[
                        { step: "01", icon: MapPin, title: "DISCOVER", desc: "BROWSE NEARBY FARMS AND SEE WHAT'S IN SEASON RIGHT NOW." },
                        { step: "02", icon: ShoppingBag, title: "ORDER", desc: "SHOP DIRECTLY FROM MULTIPLE FARMERS IN ONE SIMPLE CHECKOUT." },
                        { step: "03", icon: Truck, title: "DELIVER", desc: "FOOD IS PICKED FRESH AND DELIVERED, OFTEN WITHIN 24 HOURS." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: i * 0.2, duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col relative z-10 group"
                        >
                            <div className="flex items-center gap-6 mb-8">
                                <span className="text-6xl font-black text-white/10 group-hover:text-primary transition-colors duration-500">{item.step}</span>
                                <div className="w-16 h-16 bg-background border border-white/20 flex items-center justify-center text-white group-hover:border-primary transition-colors duration-500">
                                    <item.icon className="w-8 h-8" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold uppercase tracking-widest mb-4">{item.title}</h3>
                            <p className="text-white/50 tracking-wide leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
