export default function PaySuccessPage() {
  return (
    <div className="min-h-screen bg-canvas-soft flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="bg-canvas rounded-lg border border-hairline p-8 text-center" style={{ boxShadow: 'rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px' }}>
          <p className="text-ink mb-2" style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.22px' }}>
            Payment received
          </p>
          <p className="text-ink-mute text-sm">
            Thank you. Your payment has been processed successfully.
          </p>
        </div>
        <p className="text-center text-ink-mute text-xs mt-6">Powered by TinyCRM · Secured by Stripe</p>
      </div>
    </div>
  )
}
