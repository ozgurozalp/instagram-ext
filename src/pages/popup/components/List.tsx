import { ReactNode } from "react";

interface ListProps {
  children: ReactNode;
  className?: string;
}

export default function List({ children, ...props }: ListProps) {
  return <ul {...props}>{children}</ul>;
}

List.Item = function ({ children, ...props }: ListProps): JSX.Element {
  return <li {...props}>{children}</li>;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
List.Item.displayName = "List.Item";
