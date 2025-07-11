
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, Bot } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if dark mode is enabled (you can customize this logic)
  const isDarkMode = document.documentElement.classList.contains('dark') || 
                    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const renderMarkdown = (content: string) => {
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert
                   prose-headings:text-gray-900 dark:prose-headings:text-white
                   prose-p:text-gray-700 dark:prose-p:text-gray-300
                   prose-strong:text-gray-900 dark:prose-strong:text-white
                   prose-code:text-pink-600 dark:prose-code:text-pink-400
                   prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                   prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                   prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20
                   prose-ul:text-gray-700 dark:prose-ul:text-gray-300
                   prose-ol:text-gray-700 dark:prose-ol:text-gray-300">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code(props) {
              const { children, className, ...rest } = props;
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              
              if (className && match) {
                return (
                  <div className="relative group">
                    <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 px-4 py-2 rounded-t-lg">
                      <span className="text-xs text-gray-400 font-medium uppercase">
                        {language}
                      </span>
                    </div>
                    <SyntaxHighlighter
                      style={isDarkMode ? oneDark as any : oneLight as any}
                      language={language}
                      PreTag="div"
                      className="!mt-0 !rounded-t-none"
                      {...rest}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                );
              }
              
              return (
                <code className={className} {...rest}>
                  {children}
                </code>
              );
            },
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                {children}
              </h3>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
                {children}
              </blockquote>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex max-w-[85%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 ${message.isUser ? 'space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          message.isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 dark:bg-gray-600 text-white'
        }`}>
          {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}>
          {/* Message Bubble */}
          <div className={`rounded-2xl px-4 py-3 max-w-full ${
            message.isUser
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md'
          }`}>
            {message.isUser ? (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            ) : (
              <div className="markdown-content">
                {renderMarkdown(message.content)}
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
            message.isUser ? 'text-right' : 'text-left'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};
