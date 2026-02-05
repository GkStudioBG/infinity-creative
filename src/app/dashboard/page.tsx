"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderCard } from "@/components/dashboard/order-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Search, Package, AlertCircle } from "lucide-react";
import type { Order } from "@/types";

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Check if there's an order ID in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");
    if (orderId) {
      setSearchTerm(orderId);
      handleSearch(orderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (term?: string) => {
    const searchValue = term || searchTerm;

    if (!searchValue.trim()) {
      setError("Please enter an order ID or email address");
      return;
    }

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      // TODO: Replace with actual Supabase query
      // For now, we'll simulate a mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data for demonstration
      // In production, this will query Supabase:
      // const { data, error } = await supabase
      //   .from('orders')
      //   .select('*')
      //   .or(`id.eq.${searchValue},email.eq.${searchValue}`)
      //   .order('created_at', { ascending: false })

      // For now, return empty array
      setOrders([]);

      if (orders.length === 0) {
        setError("No orders found. Please check your order ID or email address.");
      }
    } catch (err) {
      setError("An error occurred while searching. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <Container>
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Order Dashboard
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Track your design projects and download your files
            </p>
          </div>

          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                Find Your Order
              </CardTitle>
              <CardDescription>
                Enter your order ID or the email address you used when placing the order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Order ID or email address"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSearching}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSearch()}
                  disabled={isSearching || !searchTerm.trim()}
                  className="min-w-[100px]"
                >
                  {isSearching ? (
                    <LoadingSpinner className="h-4 w-4" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-500" />
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {isSearching && (
            <div className="flex justify-center py-12">
              <LoadingSpinner className="h-8 w-8" />
            </div>
          )}

          {!isSearching && orders.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Your Orders ({orders.length})
              </h2>
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}

          {!isSearching && hasSearched && orders.length === 0 && !error && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  No Orders Found
                </h3>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  We couldn&apos;t find any orders matching your search.
                  <br />
                  Please check your order ID or email address and try again.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          {!hasSearched && (
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="py-6">
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  Need Help Finding Your Order?
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Your order ID was sent to your email after purchase</li>
                  <li>• You can also search using the email address you used to order</li>
                  <li>• Order IDs are 8-character codes (e.g., A1B2C3D4)</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}
