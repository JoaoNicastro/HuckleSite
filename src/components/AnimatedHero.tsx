import { useEffect, useRef, useState } from "react"
import { useScroll, useTransform, motion as m } from "framer-motion"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { db } from "../firebase"
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"
import { CheckCircle2, AlertCircle } from "lucide-react"

const FRAME_COUNT = 165
// Each frame gets this many pixels of scroll distance
const PX_PER_FRAME = 14
// Total scroll travel for the animation section
const SCROLL_HEIGHT = FRAME_COUNT * PX_PER_FRAME

function getFrameUrl(i: number) {
    return `/videozip/ezgif-frame-${String(i).padStart(3, "0")}.jpg`
}

export function AnimatedHero() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imagesRef = useRef<HTMLImageElement[]>([])
    const frameRef = useRef(0)
    const rafRef = useRef<number>(0)
    const [loaded, setLoaded] = useState(false)
    const [loadProgress, setLoadProgress] = useState(0)

    // Scroll-driven UI fade — hero text fades as user scrolls in
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] })
    const overlayOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0])
    const overlayY = useTransform(scrollYProgress, [0, 0.18], [0, -30])

    const endOverlayOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1])
    const endOverlayY = useTransform(scrollYProgress, [0.3, 0.5], [30, 0])

    // Email form state
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")

    // ── Preload all frames ──────────────────────────────────────────────────
    useEffect(() => {
        const imgs: HTMLImageElement[] = new Array(FRAME_COUNT)
        let count = 0

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image()
            img.src = getFrameUrl(i + 1)
            img.onload = () => {
                count++
                setLoadProgress(Math.round((count / FRAME_COUNT) * 100))
                if (count === FRAME_COUNT) setLoaded(true)
            }
            img.onerror = () => {
                count++
                setLoadProgress(Math.round((count / FRAME_COUNT) * 100))
                if (count === FRAME_COUNT) setLoaded(true)
            }
            imgs[i] = img
        }
        imagesRef.current = imgs
    }, [])

    // ── Draw one frame onto canvas ──────────────────────────────────────────
    const drawFrame = (index: number) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        const img = imagesRef.current[index]
        if (!img || !img.complete) return

        const dpr = window.devicePixelRatio || 1
        const displayW = window.innerWidth
        const displayH = window.innerHeight

        if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
            canvas.width = displayW * dpr
            canvas.height = displayH * dpr
            canvas.style.width = `${displayW}px`
            canvas.style.height = `${displayH}px`
            ctx.scale(dpr, dpr)
        }

        // Fill cream background to match site palette
        ctx.fillStyle = "#fbf6e2"
        ctx.fillRect(0, 0, displayW, displayH)

        // "cover" scaling — fill whole screen
        const scale = Math.max(displayW / img.naturalWidth, displayH / img.naturalHeight)
        const w = img.naturalWidth * scale
        const h = img.naturalHeight * scale
        const x = (displayW - w) / 2
        const y = (displayH - h) / 2

        ctx.drawImage(img, x, y, w, h)
    }

    // ── Scroll → frame mapping via rAF ──────────────────────────────────────
    useEffect(() => {
        if (!loaded) return

        drawFrame(0)

        const onScroll = () => {
            const section = sectionRef.current
            if (!section) return
            const rect = section.getBoundingClientRect()
            const scrolled = -rect.top
            const progress = Math.max(0, Math.min(1, scrolled / (SCROLL_HEIGHT - window.innerHeight)))
            frameRef.current = Math.min(FRAME_COUNT - 1, Math.floor(progress * (FRAME_COUNT - 1)))
        }

        const loop = () => {
            drawFrame(frameRef.current)
            rafRef.current = requestAnimationFrame(loop)
        }

        window.addEventListener("scroll", onScroll, { passive: true })
        rafRef.current = requestAnimationFrame(loop)

        const onResize = () => drawFrame(frameRef.current)
        window.addEventListener("resize", onResize)

        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onResize)
            cancelAnimationFrame(rafRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded])

    // ── Submit handler ──────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const q = query(
                collection(db, "waitlist_signups"),
                where("email", "==", email.toLowerCase().trim())
            )
            const snap = await getDocs(q)
            if (!snap.empty) {
                setError("You're already on the list!")
                setLoading(false)
                return
            }
            await addDoc(collection(db, "waitlist_signups"), {
                email: email.toLowerCase().trim(),
                created_at: serverTimestamp(),
            })
            setSubmitted(true)
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* ── Loading overlay — matches app splash screen ────────── */}
            {!loaded && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ backgroundColor: "#fbf6e2" }}>
                    <span className="text-4xl font-bold mb-8 text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Huckle
                    </span>
                    <div className="w-48 h-[2px] bg-[#e5ddc8] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#295F46] rounded-full transition-all duration-75"
                            style={{ width: `${loadProgress}%` }}
                        />
                    </div>
                    <div className="text-[#6b6b6b] text-xs mt-3 font-mono">{loadProgress}%</div>
                </div>
            )}

            {/*
              Outer section is SCROLL_HEIGHT tall so the browser gives
              us enough scroll runway to step through all frames.
              The inner sticky div pins the canvas + UI to the viewport.
            */}
            <section
                ref={sectionRef}
                style={{ height: `${SCROLL_HEIGHT}px` }}
                className="relative w-full"
            >
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    {/* Canvas — occupies full viewport */}
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0"
                        style={{ display: "block", background: "#fbf6e2" }}
                    />

                    {/* Bottom gradient blends hero into next section */}
                    <div className="absolute bottom-0 left-0 right-0 h-48 z-20 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #fbf6e2)" }} />

                    {/* UI overlay — fades out as user scrolls into animation */}
                    <m.div
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6"
                        style={{ opacity: overlayOpacity, y: overlayY, pointerEvents: "none" }}
                    >
                        <div
                            className="flex flex-col items-center gap-6 max-w-3xl w-full"
                            style={{ pointerEvents: "auto" }}
                        >
                            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] text-[#1a1a1a] drop-shadow-sm"
                                style={{ fontFamily: "'Playfair Display', serif" }}>
                                Support your local farms.<br />
                                <em className="text-[#295F46]">Get better ingredients.</em>
                            </h1>

                            {!submitted ? (
                                <div className="w-full max-w-md mt-2">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="flex flex-col sm:flex-row gap-3 w-full"
                                    >
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
                                            {loading ? "..." : "Join Waitlist"}
                                        </Button>
                                    </form>
                                    {error && (
                                        <p className="mt-3 text-[#DF7E4C] text-sm flex items-center gap-1 justify-center">
                                            <AlertCircle className="w-4 h-4" /> {error}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3 mt-2">
                                    <CheckCircle2 className="w-10 h-10 text-[#295F46]" />
                                    <span className="text-xl font-semibold text-[#1a1a1a]">You're on the list!</span>
                                </div>
                            )}
                        </div>

                        {/* Scroll hint */}
                        <div
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                            style={{ pointerEvents: "none" }}
                        >
                            <span className="text-[#6b6b6b] text-xs tracking-widest">Scroll to explore</span>
                            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#295F46]/50 to-transparent" />
                        </div>
                    </m.div>

                    {/* Middle sequence overlay — fades in while scrolling down */}
                    <m.div
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pb-24"
                        style={{ opacity: endOverlayOpacity, y: endOverlayY, pointerEvents: "none" }}
                    >
                        <h2
                            className="text-xl md:text-2xl font-bold text-[#1a1a1a] max-w-sm tracking-tight drop-shadow-sm"
                            style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.4 }}
                        >
                            We source the highest<br />
                            quality local produce, and<br />
                            deliver it to your doorstep
                        </h2>
                    </m.div>
                </div>
            </section>
        </>
    )
}
