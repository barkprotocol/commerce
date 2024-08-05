import { useState, useEffect, lazy, Suspense } from "react";
import { useRouter } from "next/router";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Spinner } from "@/components/Spinner";

const ShoppingItemDetail = lazy(() => import("@/components/ShoppingItemDetail"));

export default function Page() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateId = () => {
      if (id) {
        const itemId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);
        if (isNaN(itemId)) {
          setError("Invalid item ID");
          setLoading(false);
          router.push("/404"); // Redirect to a 404 page or another valid route
        } else {
          setLoading(false);
          setError(null);
        }
      }
    };

    validateId();
  }, [id, router]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center">
        <Spinner /> {/* Spinner component to show loading state */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  const itemId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);

  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<Spinner />}>
        <ErrorBoundary>
          <ShoppingItemDetail id={itemId} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}
