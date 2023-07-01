import { ReactNode } from "react";
import classNames from "@/pages/helpers/classNames";

interface ButtonProps {
  children: ReactNode;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  children,
  loading = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={loading}
      className={`relative py-2 px-4 border-gray-400 border rounded bg-white select-none ${
        loading ? "text-transparent" : "text-black"
      } transition-all hover:bg-gray-100 flex items-center justify-center text-lg font-bold ${classNames(
        className
      )}`}
      {...props}
    >
      {children}
      <svg
        className={`w-6 aspect-square absolute ${
          loading ? "inset-0 m-auto" : "-left-96"
        }`}
        viewBox="0 0 38 38"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#000"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)" strokeWidth="2">
            <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
            <path d="M36 18c0-9.94-8.06-18-18-18">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </g>
      </svg>
    </button>
  );
}
