"use client";

import { isValidElement, Children } from "react";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./code-block";
import { slugify } from "@/lib/extract-headings";

function getTextContent(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) {
    return Children.toArray(children).map(getTextContent).join("");
  }
  if (isValidElement(children)) {
    return getTextContent(
      (children.props as { children?: React.ReactNode }).children
    );
  }
  return "";
}

interface BlogPostContentProps {
  content: string;
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  return (
    <div className="prose max-w-3xl">
      <ReactMarkdown
        components={{
          pre({ children }) {
            return <CodeBlock>{children}</CodeBlock>;
          },
          h2({ children, ...props }) {
            const id = slugify(getTextContent(children));
            return (
              <h2 id={id} {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }) {
            const id = slugify(getTextContent(children));
            return (
              <h3 id={id} {...props}>
                {children}
              </h3>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
