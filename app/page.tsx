import { ApiDebug } from "@/components/api-debug"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 gradient-bg flex flex-col items-center justify-center text-primary-foreground p-4 text-center bg-background">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Binomena Blockchain</h1>
        <p className="text-xl md:text-2xl max-w-3xl mb-8 text-muted-foreground">
          The next generation blockchain platform with fast transactions, smart contracts, and a deflationary token model.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
        <a
            href="/wallet"
             className="bg-primary text-[#333333] hover:bg-primary/80 transition-colors px-6 py-3 rounded-md font-medium shadow"
          >
             Wallet Dashboard
            </a>

          <a
            href="/wallet/create"
            className="border border-primary text-primary hover:bg-primary/10 transition-colors px-6 py-3 rounded-md font-medium"
          >
            Create Wallet
          </a>
          <a
            href="/explorer"
            className="border border-primary text-primary hover:bg-primary/10 transition-colors px-6 py-3 rounded-md font-medium"
          >
            Explore Blockchain
          </a>
        </div>
      </div>

      <section className="py-16 px-4 bg-background text-foreground">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <p className="text-center text-muted-foreground mb-12">Discover what makes Binomena Blockchain unique</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "NodeSwift Consensus",
                description:
                  "Our custom Proof of Stake consensus mechanism designed for security and fast transaction validation.",
                icon: (
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                ),
              },
              {
                title: "Binom Token (BNM)",
                description:
                  "Native token with a maximum supply of 1 billion and a deflationary mechanism.",
                icon: (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                    <path d="M12 18V6" />
                  </>
                ),
              },
              {
                title: "Fast Transactions",
                description:
                  "Optimized for quick validation and confirmation with minimal fees.",
                icon: (
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                ),
              },
            ].map(({ title, description, icon }, i) => (
              <div
                key={i}
                className="card-hover p-6 border rounded-xl shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1 bg-card text-card-foreground"
              >
                <div className="flex justify-center mb-4 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-12 h-12"
                  >
                    {icon}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
                <p className="text-center text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Debug */}
      <div className="container mx-auto py-8">
        <ApiDebug />
      </div>
    </main>
  )
}
