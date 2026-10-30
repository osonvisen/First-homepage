import { useState } from "react";

interface Props { user: string; domain: string; showLabel: string; copyLabel: string; copiedLabel: string }

// The address is assembled only after a click, so it never appears in the HTML for scrapers.
export function EmailReveal({ user, domain, showLabel, copyLabel, copiedLabel }: Props) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const address = `${user}@${domain}`;

  if (!visible) {
    return (
      <button type="button" className="button outline" onClick={() => setVisible(true)}>
        {showLabel}
      </button>
    );
  }
  return (
    <span className="email">
      <a href={`mailto:${address}`}>{address}</a>
      <button
        type="button"
        className="button small outline"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch { /* ignore */ }
        }}
      >
        {copied ? copiedLabel : copyLabel}
      </button>
    </span>
  );
}
