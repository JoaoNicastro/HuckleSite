import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Leaf, RefreshCcw, Download } from "lucide-react"
import { db } from "../firebase"
import { collection, query, orderBy, getDocs } from "firebase/firestore"

export function AdminDashboard() {
    const [emails, setEmails] = useState<{ id: string, email: string, created_at: any }[]>([])
    const [loading, setLoading] = useState(true)

    const fetchSignups = async () => {
        setLoading(true)
        try {
            const q = query(collection(db, "waitlist_signups"), orderBy("created_at", "desc"))
            const querySnapshot = await getDocs(q)
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as any[]
            setEmails(data)
        } catch (err) {
            console.error("Error fetching signups:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSignups()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b h-16 flex items-center px-8 justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <span className="font-bold">Huckle Admin</span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h1 className="text-xl font-bold">Waitlist Signups</h1>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                                {emails.length} Total
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-sm font-medium">
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Email Address</th>
                                        <th className="px-6 py-4">Signed Up At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-gray-400">Loading waitlist...</td>
                                        </tr>
                                    ) : emails.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-gray-400">No signups yet.</td>
                                        </tr>
                                    ) : (
                                        emails.map((row) => (
                                            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs text-gray-400">{row.id}</td>
                                                <td className="px-6 py-4 font-medium">{row.email}</td>
                                                <td className="px-6 py-4 text-gray-500">{new Date(row.created_at).toLocaleString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
