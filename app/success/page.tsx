export default function SuccessPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-cyan/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                <div className="w-20 h-20 bg-brand-brand-cyan/20 border border-brand-cyan/50 rounded-full flex items-center justify-center text-4xl mb-4 text-brand-cyan">
                    ✓
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Payment Successful!</h1>
                <p className="text-xl text-zinc-400 max-w-xl">
                    We've received your ₹999 investment. You've officially taken the first critical step towards business clarity.
                </p>

                <div className="w-full glass-card p-6 md:p-10 rounded-3xl mt-8">
                    <h2 className="text-2xl font-bold mb-6 text-white">Schedule Your Spark Call</h2>
                    <p className="text-zinc-400 mb-8">
                        Please pick a time below for your 30-minute 1:1 strategy session.
                    </p>

                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center relative">
                        {/* Embed Calendly here. Using iframe for quick embed. */}
                        <iframe
                            src="https://calendly.com/nexversestudios/spark-call-clarity-session"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            className="absolute inset-0 w-full h-full"
                        />
                        {/* Fallback visual if iframe fails/takes time */}
                        <div className="text-zinc-600 text-sm absolute -z-10">Loading Calendar...</div>
                    </div>
                </div>

            </div>
        </div>
    );
}
