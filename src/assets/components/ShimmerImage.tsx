import { useState } from "react";
import { cn } from "@/lib/utils";

interface ShimmerImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  shimmerClassName?: string;
}

const ShimmerImage = ({ className, shimmerClassName, onLoad, ...props }: ShimmerImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", shimmerClassName)}>
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
        </div>
      )}
      <img
        {...props}
        className={cn(className, "transition-opacity duration-300", loaded ? "opacity-100" : "opacity-0")}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </div>
  );
};

export default ShimmerImage;
