// Secrets that can be found on the site. Each one found is stored in the
// visitor's keyring (their browser only). The keyring shows "N of ?" and
// never the total, so you can add new secrets any time.

export const secrets: Record<string, string> = {
  "two-readings": "the decode toggle",
  "cipher-note": "a cipher note on the entrance",
  "redacted-entrance": "a redacted line, decoded",
  help: "⌘K → help",
  whoami: "whoami",
  console: "the console",
  "frag-1": "key fragment 1 of 3",
  "frag-2": "key fragment 2 of 3",
  "frag-3": "key fragment 3 of 3",
  vault: "/vault",
  "decode-all": "decode --all",
};

// The vault key is assembled from three fragments hidden around the site.
// Stored as a SHA-256 hash so it is not readable in the page source.
export const VAULT_KEY_SHA256 =
  "b5a4de5cb2f1ca2a3c8e6dfe51b03c6a651d32915a4ec10f2a4de39e11b7ef77";

export const fragments = { "frag-1": "ik", "frag-2": "wu", "frag-3": "ano" } as const;
