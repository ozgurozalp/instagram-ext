import { ReactNode } from "react";
import classNames from "@/pages/helpers/classNames";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={`container mx-auto px-4 ${classNames(className)}`}>
      {children}
    </div>
  );
}
