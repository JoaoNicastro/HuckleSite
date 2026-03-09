import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Instagram, Leaf, CheckCircle2, AlertCircle } from "lucide-react"
import { db } from "../firebase"
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"

export function WaitlistSection() {
    const [email, setEmail] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const q = query(collection(db, "waitlist_signups"), where("email", "==", email.toLowerCase().trim()))
            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {
                setError("You're already on the waitlist! We'll be in touch.")
                setLoading(false)
                return
            }

            await addDoc(collection(db, "waitlist_signups"), {
                email: email.toLowerCase().trim(),
                created_at: serverTimestamp()
            })
            setSubmitted(true)
        } catch (err) {
            console.error("Signup error:", err)
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id="waitlist" className="relative overflow-hidden" style={{ backgroundColor: "#fbf6e2" }}>
            <div className="container mx-auto px-6 py-28">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    {/* Grocery bag illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex-1 flex justify-center"
                    >
                        <img
                            src="/grocery-bag.png"
                            alt="Get started with Huckle"
                            className="w-full max-w-xs"
                        />
                    </motion.div>

                    {/* CTA copy + form */}
                    <div className="flex-1 max-w-lg">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <p className="text-sm font-semibold text-[#295F46] uppercase tracking-widest mb-4">Early Access</p>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] leading-tight mb-6"
                                style={{ fontFamily: "'Playfair Display', serif" }}>
                                Get Started Today
                            </h2>
                            <p className="text-lg text-[#6b6b6b] font-light mb-10">
                                Join the waitlist and be the first to know when Huckle launches in your area.
                                Launching May 1st.
                            </p>

                            {!submitted ? (
                                <div>
                                    <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="flex-1 rounded-full bg-white border border-[#e5ddc8] text-[#1a1a1a] placeholder:text-[#aaa] h-12 px-5 focus-visible:ring-[#295F46]"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <Button
                                            size="lg"
                                            className="h-12 px-7 rounded-full font-semibold bg-[#295F46] text-white hover:bg-[#1f4934] transition-colors"
                                            disabled={loading}
                                        >
                                            {loading ? "..." : "Get Early Access"}
                                        </Button>
                                    </form>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 flex items-center gap-2 text-[#DF7E4C] text-sm"
                                        >
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            <p>{error}</p>
                                        </motion.div>
                                    )}
                                    <p className="mt-5 text-xs text-[#aaa]">
                                        * Limited to the first 1,000 signups for early bird savings.
                                    </p>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col gap-4 py-8"
                                >
                                    <div className="w-16 h-16 rounded-full bg-[#295F46]/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-8 h-8 text-[#295F46]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1a1a1a]"
                                        style={{ fontFamily: "'Playfair Display', serif" }}>You're on the list!</h3>
                                    <p className="text-[#6b6b6b]">Check your email for a confirmation soon.</p>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export function Footer() {
    return (
        <footer className="py-10 border-t" style={{ backgroundColor: "#ffffff", borderColor: "#e5ddc8" }}>
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-[#295F46]" />
                        <span className="text-lg font-bold text-[#1a1a1a]"
                            style={{ fontFamily: "'Playfair Display', serif" }}>Huckle</span>
                    </div>

                    <div className="flex gap-6 text-sm text-[#6b6b6b]">
                        <a href="https://instagram.com/hucklemarket" target="_blank" rel="noreferrer"
                            className="hover:text-[#1a1a1a] transition-colors flex items-center gap-2">
                            <Instagram className="w-4 h-4" />
                            <span>@hucklemarket</span>
                        </a>
                    </div>

                    <p className="text-xs text-[#aaa]">
                        © 2026 Huckle Market. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
