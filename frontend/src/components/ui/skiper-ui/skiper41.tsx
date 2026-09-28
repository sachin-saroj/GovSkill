type ProgressiveBlurProps = {
  className?: string;
  backgroundColor?: string;
  position?: "top" | "bottom";
  height?: string;
  blurAmount?: string;
};

const ProgressiveBlur = ({
  className = "",
  backgroundColor = "#FAF8F2",
  position = "top",
  height = "80px",
}: ProgressiveBlurProps) => {
  const isTop = position === "top";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 right-0 w-full select-none z-10 ${className}`}
      style={{
        [isTop ? "top" : "bottom"]: 0,
        height,
        background: isTop
          ? `linear-gradient(to bottom, ${backgroundColor} 0%, rgba(250, 248, 242, 0) 100%)`
          : `linear-gradient(to top, ${backgroundColor} 0%, rgba(250, 248, 242, 0) 100%)`,
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    />
  );
};

export { ProgressiveBlur };
