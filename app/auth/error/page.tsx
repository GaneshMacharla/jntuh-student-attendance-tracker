import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_description?: string }>
}) {
  const params = await searchParams
  const error = params?.error
  const errorDescription = params?.error_description

  const getErrorMessage = (error: string | undefined) => {
    switch (error) {
      case "access_denied":
        return "Access was denied. You may have cancelled the authentication process."
      case "server_error":
        return "A server error occurred. Please try again later."
      case "temporarily_unavailable":
        return "The service is temporarily unavailable. Please try again in a few minutes."
      case "invalid_request":
        return "The authentication request was invalid."
      case "unauthorized_client":
        return "The application is not authorized to perform this request."
      case "unsupported_response_type":
        return "The authorization server does not support this response type."
      case "invalid_scope":
        return "The requested scope is invalid or unknown."
      default:
        return errorDescription || "An unexpected error occurred during authentication."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Error Icon */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-red-700">Authentication Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">{getErrorMessage(error)}</p>
                {error && <p className="text-xs text-red-600 mt-2 font-mono">Error Code: {error}</p>}
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">What can you do?</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Try signing in again with correct credentials
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Check your internet connection
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Contact support if the problem persists
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button asChild variant="outline" className="flex-1 bg-transparent">
                  <Link href="/auth/login">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>
                  Need help?{" "}
                  <Link
                    href="mailto:support@jntuh.ac.in"
                    className="text-blue-600 hover:text-blue-800 underline underline-offset-4"
                  >
                    Contact Support
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
