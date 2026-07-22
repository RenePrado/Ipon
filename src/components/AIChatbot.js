import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

const INITIAL_CHIPS = [
  "How am I doing this month?",
  "What are my top expenses?",
  "Add a new expense",
];

function Chip({ label, index, onClick }) {
  return (
    <button
      onClick={onClick}
      className="self-start px-3 py-1.5 rounded-md border border-border dark:border-dark-border text-text-secondary dark:text-dark-text-secondary text-xs font-medium hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 hover:text-accent-primary transition-colors animate-messageSlideIn"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
    >
      {label}
    </button>
  );
}

function PisoAvatar({ size = "w-7 h-7" }) {
  return (
    <div className={`${size} rounded-md bg-accent-primary/10 text-accent-primary flex items-center justify-center flex-shrink-0 text-xs font-semibold`}>
      P
    </div>
  );
}

export function AIChatbot({ messages, isTyping, isStreaming, showSuggestions, sendMessage, clearChat, isOpen, onToggle }) {
  const setIsOpen = onToggle;
  const [isClosing, setIsClosing] = useState(false);
  const [input, setInput] = useState("");
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (isOpen && !hasWelcomed && messages.length === 0) {
      setHasWelcomed(true);
    }
  }, [isOpen, hasWelcomed, messages.length]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const isMobile = window.innerWidth < 640;
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onToggle();
    }, 200);
  }, [onToggle]);

  const toggleOpen = () => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  };

  const handleClear = () => {
    clearChat();
    setHasWelcomed(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounceOnce">
          <button
            onClick={toggleOpen}
            aria-label="Open Piso chat"
            className="w-10 h-10 rounded-md bg-bg-elevated dark:bg-dark-bg-elevated border border-border dark:border-dark-border text-accent-primary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors flex items-center justify-center"
          >
            <MessageCircle size={18} />
          </button>
        </div>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className={`fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-[60] sm:z-50 w-full sm:w-[360px] sm:max-w-[calc(100vw-3rem)] origin-bottom-right ${isClosing ? "animate-[modalContentOut_0.2s_ease-in]" : "animate-[modalContentIn_0.2s_ease-out]"}`}>
          <div className="bg-bg-elevated dark:bg-dark-bg-elevated sm:rounded-lg border border-border dark:border-dark-border flex flex-col h-dvh sm:h-[480px]">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-border dark:border-dark-border">
              <div className="flex items-center gap-2">
                <PisoAvatar size="w-8 h-8" />
                <div>
                  <div className="text-text-primary dark:text-dark-text-primary font-medium text-sm">Piso</div>
                  <div className="text-text-tertiary dark:text-dark-text-tertiary text-[10px]">Online</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={handleClear}
                    aria-label="Clear chat"
                    className="p-1.5 rounded text-text-tertiary dark:text-dark-text-tertiary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 text-xs transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={toggleOpen}
                  aria-label="Close chat"
                  className="p-1.5 rounded text-text-tertiary dark:text-dark-text-tertiary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesRef} className="flex-1 overflow-y-auto p-3 space-y-3">
              {hasWelcomed && messages.length === 0 && (
                <div className="flex gap-2 animate-messageSlideIn" style={{ animationDelay: "300ms", animationFillMode: "backwards" }}>
                  <PisoAvatar />
                  <div className="bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 rounded-lg rounded-tl-none p-2.5 text-sm text-text-secondary dark:text-dark-text-secondary max-w-[80%] leading-relaxed">
                    Hi! I'm Piso, your personal finance assistant. Ask me anything about your finances, or tell me to add, edit, or delete transactions, budgets, and savings goals.
                  </div>
                </div>
              )}

              {showSuggestions && hasWelcomed && messages.length === 0 && (
                <div className="flex flex-col gap-1.5 pl-9">
                  {INITIAL_CHIPS.map((chip, i) => (
                    <Chip key={chip} label={chip} index={i} onClick={() => sendMessage(chip)} />
                  ))}
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 animate-messageSlideIn ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && <PisoAvatar />}
                  <div
                    className={`rounded-lg p-2.5 text-sm max-w-[80%] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent-primary text-white rounded-tr-none"
                        : "bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 text-text-secondary dark:text-dark-text-secondary rounded-tl-none"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose-chat">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-4 space-y-0.5 mb-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 space-y-0.5 mb-1">{children}</ol>,
                            li: ({ children }) => <li>{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator - only during API wait, not during streaming */}
              {isTyping && !isStreaming && (
                <div className="flex gap-2 animate-messageSlideIn">
                  <PisoAvatar />
                  <div className="bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 rounded-lg rounded-tl-none p-3 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-text-tertiary dark:bg-dark-text-tertiary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-text-tertiary dark:bg-dark-text-tertiary animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-text-tertiary dark:bg-dark-text-tertiary animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border dark:border-dark-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your finances..."
                  disabled={isTyping}
                  className="flex-1 px-3 py-2 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:border-accent-primary transition-colors disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  aria-label="Send message"
                  className="px-3 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
