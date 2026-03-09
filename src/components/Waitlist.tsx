import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Instagram, Leaf, CheckCircle2, AlertCircle } from "lucide-react"
import { db } from "../firebase"
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"

export function WaitlistSection() {
    // ... logic remains the same ...
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
                setError("YOU'RE ALREADY ON THE WAITLIST! WE'LL BE IN TOUCH.")
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
            setError("SOMETHING WENT WRONG. PLEASE TRY AGAIN.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id="waitlist" className="py-40 bg-background relative overflow-hidden flex items-center justify-center min-h-[80vh]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(41,95,70,0.15),transparent_60%)]" style={{ pointerEvents: 'none' }} />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-widest mb-12 leading-[1.1] drop-shadow-2xl">
                        READY FOR GROCERIES TO FEEL <span className="text-primary italic">FRESH</span> AGAIN?
                    </h2>
                    <p className="text-xl md:text-2xl text-white/60 tracking-widest uppercase font-light mb-20">
                        JOIN THE WAITLIST TODAY. LAUNCHING MAY 1ST.
                    </p>

                    {!submitted ? (
                        <div className="w-full max-w-2xl mx-auto">
                            <form
                                className="flex flex-col md:flex-row gap-4 w-full"
                                onSubmit={handleSubmit}
                            >
                                <div className="relative flex-1">
                                    <Input
                                        type="email"
                                        placeholder="ENTER YOUR EMAIL"
                                        className="bg-transparent border-b-2 border-white/20 rounded-none text-white focus-visible:ring-0 focus-visible:border-white h-16 px-0 placeholder:text-white/30 uppercase tracking-widest text-lg"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button
                                    size="lg"
                                    className="h-16 px-10 rounded-none font-bold uppercase tracking-widest bg-white text-black hover:bg-accent hover:text-white transition-colors flex gap-4 items-center"
                                    disabled={loading}
                                >
                                    {loading ? "..." : "GET EARLY ACCESS"} <span className="text-2xl leading-none">↗</span>
                                </Button>
                            </form>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 flex items-center justify-center gap-3 text-accent uppercase tracking-widest font-bold"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                    <p>{error}</p>
                                </motion.div>
                            )}
                            <p className="mt-8 text-sm text-white/30 uppercase tracking-[0.2em]">
                                * LIMITED TO FIRST 1,000 SIGNUPS FOR EARLY BIRD SAVINGS.
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-6 py-12"
                        >
                            <div className="w-24 h-24 border border-primary flex items-center justify-center group">
                                <CheckCircle2 className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h3 className="text-4xl font-black uppercase tracking-widest text-white">YOU'RE ON THE LIST</h3>
                            <p className="text-white/50 tracking-widest uppercase">CHECK YOUR EMAIL FOR A CONFIRMATION SOON.</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    )
}

export function Footer() {
    return (
        <footer className="py-12 bg-background border-t border-white/10 uppercase tracking-widest text-xs font-semibold">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <Leaf className="w-6 h-6 text-primary" />
                        <span className="text-xl tracking-[0.2em] text-white">HUCKLE</span>
                    </div>

                    <div className="flex gap-8">
                        <a href="https://instagram.com/hucklemarket" target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors flex items-center gap-3">
                            <Instagram className="w-5 h-5" />
                            <span>INSTAGRAM.COM/HUCKLEMARKET</span>
                        </a>
                    </div>

                    <p className="text-white/30">
                        © 2026 HUCKLE MARKET. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </div>
        </footer>
    )
}
