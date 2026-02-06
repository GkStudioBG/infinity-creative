"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderCard } from "@/components/dashboard/order-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Search, Package, AlertCircle } from "lucide-react";
import type { Order } from "@/types";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

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
      setError(t("noSearchTerm"));
      return;
    }

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOrders([]);

      if (orders.length === 0) {
        setError(t("noOrdersFound"));
      }
    } catch (err) {
      setError(t("searchError"));
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
              {t("title")}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>

          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                {t("findOrder")}
              </CardTitle>
              <CardDescription>
                {t("findOrderDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder={t("searchPlaceholder")}
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
                    t("searchButton")
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
                {t("yourOrders")} ({orders.length})
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
                  {t("noOrdersTitle")}
                </h3>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  {t("noOrdersText")}
                  <br />
                  {t("noOrdersTextLine2")}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          {!hasSearched && (
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="py-6">
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  {t("helpTitle")}
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• {t("helpTip1")}</li>
                  <li>• {t("helpTip2")}</li>
                  <li>• {t("helpTip3")}</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}
