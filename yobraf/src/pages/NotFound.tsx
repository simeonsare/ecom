import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col justify-center items-center min-h-full px-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 self-start container mx-auto">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span>404 Error</span>
      </div>

      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-8">404 Not Found</h1>
        <p className="text-muted-foreground mb-8">
          Your visited page not found. You may go home page.
        </p>
        <Button asChild className="bg-destructive hover:bg-destructive/90">
          <Link to="/">Back to home page</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
