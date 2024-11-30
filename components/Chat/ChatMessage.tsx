import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from "@/types";

interface Props {
  message: Message;
}

export const ChatMessage: React.FC<Props> = ({ message }) => {
  const [displayedContent, setDisplayedContent] = useState<string>(
    message.role === "assistant" ? "" : message.content // 初始状态：Bot消息为空，用户消息直接显示
  );

  useEffect(() => {
    if (message.role === "assistant") {
      // 仅对 Bot 消息启用打字机效果
      let index = 0;
      const interval = setInterval(() => {
      if (index < message.content.length) {
        const char = message.content[index];
      if (char !== undefined && char !== null) {
        setDisplayedContent((prev) => prev + char);
      }
      index++;
      } else {
        clearInterval(interval);
      }
  }, 50);

  return () => clearInterval(interval);
    }
  }, [message.role, message.content]);

  const renderMarkdown = (content: string) => {
    return (
      <ReactMarkdown
        className="markdown-content"
        components={{
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-primary" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-gray-700" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code
              className="bg-neutral-100 text-red-600 px-1 py-0.5 rounded-md text-sm"
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-2"
              {...props}
            />
          ),
          h1: ({ node, ...props }) => (
            <h1
              className="text-2xl font-bold text-blue-800 mb-2"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-xl font-semibold text-blue-700 mb-1"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc list-inside marker:text-blue-500 pl-4"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal list-inside marker:text-blue-500 pl-4"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div
      className={`flex flex-col ${message.role === "assistant" ? "items-start" : "items-end"} w-full`}
    >
      <div
        className={`flex-col ${
          message.role === "assistant"
            ? "bg-neutral-200 text-neutral-900"
            : "bg-blue-500 text-white"
        } rounded-2xl px-3 py-2 max-w-[67%]`}
      >
        {renderMarkdown(displayedContent)}
      </div>
    </div>
  );
};
