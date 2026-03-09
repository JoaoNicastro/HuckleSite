import { useEffect, useRef, useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { db } from "../firebase"
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"
import { CheckCircle2, AlertCircle } from "lucide-react"

const FRAME_COUNT = 210
// Each frame gets this many pixels of scroll distance (higher = slower/smoother)
const PX_PER_FRAME = 14
// Total scroll travel for the animation section
const SCROLL_HEIGHT = FRAME_COUNT * PX_PER_FRAME

function getFrameUrl(i: number) {
    return `/WatermelonPictures/ezgif-frame-${String(i).padStart(3, "0")}.png`
}

export function AnimatedHero() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imagesRef = useRef<HTMLImageElement[]>([])
    const frameRef = useRef(0)
    const rafRef = useRef<number>(0)
    const [loaded, setLoaded] = useState(false)
    const [loadProgress, setLoadProgress] = useState(0)

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
                if (count === FRAME_COUNT) {
                    setLoaded(true)
                }
            }
            img.onerror = () => {
                // count even on error so we don't hang
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

        // Only resize canvas if dimensions actually changed (avoids full redraws)
        if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
            canvas.width = displayW * dpr
            canvas.height = displayH * dpr
            canvas.style.width = `${displayW}px`
            canvas.style.height = `${displayH}px`
            ctx.scale(dpr, dpr)
        }

        // Fill black background
        ctx.fillStyle = "#000000"
        ctx.fillRect(0, 0, displayW, displayH)

        // "contain" scaling — keep full watermelon visible
        const scale = Math.min(displayW / img.naturalWidth, displayH / img.naturalHeight)
        const w = img.naturalWidth * scale
        const h = img.naturalHeight * scale
        const x = (displayW - w) / 2
        const y = (displayH - h) / 2

        ctx.drawImage(img, x, y, w, h)

        // Cover the Veo watermark (bottom-right corner of the source frames)
        ctx.fillStyle = "#000000"
        ctx.fillRect(displayW - 160, displayH - 60, 160, 60)
    }

    // ── Scroll → frame mapping via rAF ──────────────────────────────────────
    useEffect(() => {
        if (!loaded) return

        // Draw first frame immediately
        drawFrame(0)

        const onScroll = () => {
            const section = sectionRef.current
            if (!section) return
            const rect = section.getBoundingClientRect()
            // scrolled is how far past the top of the section we've gone
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
            {/* ── Loading overlay ─────────────────────────────────── */}
            {!loaded && (
                <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
                    <div className="text-white/40 text-sm font-mono tracking-widest uppercase mb-4">
                        Loading frames…
                    </div>
                    <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-400 rounded-full transition-all duration-75"
                            style={{ width: `${loadProgress}%` }}
                        />
                    </div>
                    <div className="text-white/20 text-xs mt-2 font-mono">{loadProgress}%</div>
                </div>
            )}

            {/*
              The outer section is exactly SCROLL_HEIGHT tall so the browser gives
              us enough scroll runway to step through every frame.
              The inner sticky div pins the canvas + UI to the viewport.
            */}
            <section
                ref={sectionRef}
                style={{ height: `${SCROLL_HEIGHT}px` }}
                className="relative w-full bg-black"
            >
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    {/* Canvas — occupies full viewport */}
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0"
                        style={{ display: "block", background: "#000" }}
                    />

                    {/* UI overlay — fades out after 20% scroll progress */}
                    <div
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6"
                        style={{
                            // Pointer events only active at top (before animation takes over)
                            pointerEvents: "none",
                        }}
                    >
                        {/* Text + form housed in a centered container */}
                        <div
                            className="flex flex-col items-center gap-8 max-w-4xl w-full"
                            style={{ pointerEvents: "auto" }}
                        >
                            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-widest text-white leading-[1.1] drop-shadow-2xl">
                                FRESH FROM THE FARM, <br />
                                <span className="text-primary italic">STRAIGHT TO YOUR DOOR.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-white/60 max-w-2xl font-light tracking-wide">
                                CUT OUT THE MIDDLEMAN. FRESHER PRODUCE, UP TO 30% SAVINGS, AND DIRECT SUPPORT FOR LOCAL FARMERS.
                            </p>

                            {!submitted ? (
                                <div className="w-full max-w-lg mt-8">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="flex flex-col md:flex-row gap-4 w-full"
                                    >
                                        <div className="relative flex-1">
                                            <Input
                                                type="email"
                                                placeholder="ENTER YOUR EMAIL"
                                                className="bg-transparent border-b-2 border-white/20 rounded-none text-white focus-visible:ring-0 focus-visible:border-white h-14 px-0 placeholder:text-white/30 uppercase tracking-widest text-sm"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <Button
                                            size="lg"
                                            className="h-14 px-8 rounded-none font-bold uppercase tracking-widest bg-white text-black hover:bg-accent hover:text-white transition-colors flex gap-2 items-center"
                                            disabled={loading}
                                        >
                                            {loading ? "..." : "JOIN WAITLIST"} <span className="text-xl leading-none">↗</span>
                                        </Button>
                                    </form>
                                    {error && (
                                        <p className="mt-4 text-accent text-sm font-medium flex items-center gap-2 justify-center uppercase tracking-widest">
                                            <AlertCircle className="w-4 h-4" /> {error}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4 mt-8">
                                    <CheckCircle2 className="w-12 h-12 text-primary" />
                                    <span className="text-2xl font-bold uppercase tracking-widest text-white">YOU'RE IN</span>
                                </div>
                            )}
                        </div>

                        {/* Scroll hint */}
                        <div
                            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                            style={{ pointerEvents: "none" }}
                        >
                            <span className="text-white/30 text-xs tracking-[0.4em] uppercase font-bold">SCROLL TO EXPLORE</span>
                            <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
