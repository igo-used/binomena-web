import { ApiDebug } from "@/components/api-debug"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 gradient-bg flex flex-col items-center justify-center text-white p-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Binomena Blockchain</h1>
        <p className="text-xl md:text-2xl max-w-3xl mb-8">
          The next generation blockchain platform with fast transactions, smart contracts, and a deflationary token
          model.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/wallet/create"
            className="bg-white text-blue-600 hover:bg-blue-100 transition-colors px-6 py-3 rounded-md font-medium"
          >
            Create Wallet
          </a>
          <a
            href="/explorer"
            className="bg-transparent border border-white hover:bg-white/10 transition-colors px-6 py-3 rounded-md font-medium"
          >
            Explore Blockchain
          </a>
        </div>
      </div>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <p className="text-center text-gray-600 mb-12">Discover what makes Binomena Blockchain unique</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-hover p-6 border rounded-lg shadow-sm">
              <div className="flex justify-center mb-4 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-12 h-12"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">NodeSwift Consensus</h3>
              <p className="text-gray-600 text-center">
                Our custom Proof of Stake consensus mechanism designed for security and fast transaction validation.
              </p>
            </div>

            <div className="card-hover p-6 border rounded-lg shadow-sm">
              <div className="flex justify-center mb-4 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-12 h-12"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                  <path d="M12 18V6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Binom Token (BNM)</h3>
              <p className="text-gray-600 text-center">
                Native token with a maximum supply of 1 billion and a deflationary mechanism.
              </p>
            </div>

            <div className="card-hover p-6 border rounded-lg shadow-sm">
              <div className="flex justify-center mb-4 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-12 h-12"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Fast Transactions</h3>
              <p className="text-gray-600 text-center">
                Optimized for quick validation and confirmation with minimal fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Add the API Debug component */}
      <div className="container mx-auto py-8">
        <ApiDebug />
      </div>
    </main>
  )
}
