interface AvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg";
}

const Avatar = ({
  name = "User",
  size = "md",
}: AvatarProps) => {
  const letter =
    name.trim().charAt(0).toUpperCase() || "U";

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <div
      className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-full bg-[#2563EB] font-semibold text-white`}
    >
      {letter}
    </div>
  );
};

export default Avatar;