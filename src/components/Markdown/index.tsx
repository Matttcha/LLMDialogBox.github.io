import { Children, FC, ReactNode, useEffect, useMemo, useState } from "react";
import pkg from "react-copy-to-clipboard";
import ReactMarkdown from "react-markdown";
import reactNodeToString from "react-node-to-string";
import rehypeHighlight from "rehype-highlight";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import supersub from "remark-supersub";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import "./highlight.scss";
import "./markdown.scss";
import React from "react";
const { CopyToClipboard } = pkg;

function CustomCode(props: { children: ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);

  const code = useMemo(
    () => reactNodeToString(props.children),
    [props.children]
  );

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 1000);
    }
  }, [copied]);

  // 检查 children 是否为单个文本节点（这种方法不是 100% 可靠的）
  const isSingleTextNode =
    typeof (React.Children.toArray(props.children)[0] as any)?.props
      ?.children === "string";

  return (
    <div
      className="flex flex-col"
      style={{ display: !isSingleTextNode ? "inline-block" : "block" }}
    >
      {isSingleTextNode && (
        <div className="text-xs p-2 flex justify-end">
          <CopyToClipboard text={code} onCopy={() => setCopied(true)}>
            <div
              className="flex flex-row items-center gap-2 cursor-pointer w-fit ml-1"
              style={{ display: "flex", height: "25px" }}
            >
              <ClipboardDocumentIcon width={20} />
              <span
                style={{ alignContent: "center", justifyContent: "center" }}
              >
                {copied ? "copied" : "copy code"}
              </span>
            </div>
          </CopyToClipboard>
        </div>
      )}

      {/* <div>{ props.children}</div> */}
      <code className={props.className} style={{ overflow: "hidden" }}>
        {props.children}
      </code>
    </div>
  );
}

const Markdown: FC<{ children: string }> = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, supersub, remarkBreaks, remarkGfm]}
      rehypePlugins={[
        [rehypeHighlight, { detect: false, ignoreMissing: true }],
      ]}
      className={`markdown-body markdown-custom-styles !text-base font-normal`}
      components={{
        a: ({
          children,
          href,
          ...props
        }: {
          children: ReactNode;
          href?: string;
        }) => {
          return href?.includes("s.coze.cn") ? (
            <img className="rounded-xl my-3" src={href} alt="s.coze.cn" />
          ) : (
            <a href={href} {...props} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          );
        },
        code: ({ inline, className, children, ...props }) => {
          if (inline) {
            return (
              <code
                style={{ marginInline: "8px" }}
                className={className}
                {...props}
              >
                {children}
              </code>
            );
          }
          return <CustomCode className={className}>{children}</CustomCode>;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
