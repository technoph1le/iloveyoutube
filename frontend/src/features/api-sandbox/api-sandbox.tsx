"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, BookOpen, Check, ChevronRight, Copy, Eye, EyeOff, KeyRound, LoaderCircle, Send } from "lucide-react";
import { ExternalLink } from "@/components/ui/external-link";
import { ENDPOINTS, GROUPS, initialValues, validate, type Field, type Values } from "./endpoints";
import { LANGUAGES, errorHint, errorMessage, requestUrl, snippet, type Language } from "./snippets";

const KEY_STORAGE = "iloveyoutube:youtube-api-key";
const KEY_HELP = "https://developers.google.com/youtube/v3/getting-started";

type Result = {
  endpointId: string;
  status: number;
  ok: boolean;
  ms: number;
  bytes: number;
  data: unknown;
  json: string;
  page: number;
};

type Tab = "response" | Language;

export function ApiSandbox() {
  const [endpointId, setEndpointId] = useState(ENDPOINTS[0].id);
  const [valuesById, setValuesById] = useState<Record<string, Values>>({});
  const [apiKey, setApiKey] = useState("");
  const [rememberKey, setRememberKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [tab, setTab] = useState<Tab>("response");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const requestId = useRef(0);

  const endpoint = ENDPOINTS.find((e) => e.id === endpointId)!;
  const values = valuesById[endpointId] ?? initialValues(endpoint);
  const problem = validate(endpoint, values);
  const query = useMemo(() => (problem ? null : endpoint.query(values)), [endpoint, values, problem]);

  // Restore the remembered key and the endpoint in the address (#search-videos).
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- reading browser-only state after hydration */
    try {
      const saved = localStorage.getItem(KEY_STORAGE);
      if (saved) {
        setApiKey(saved);
        setRememberKey(true);
      }
    } catch {
      // Storage blocked; the key just isn't remembered.
    }
    const fromHash = ENDPOINTS.find((e) => e.id === location.hash.slice(1));
    if (fromHash) setEndpointId(fromHash.id);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    try {
      if (rememberKey && apiKey) localStorage.setItem(KEY_STORAGE, apiKey);
      else localStorage.removeItem(KEY_STORAGE);
    } catch {
      // Storage blocked.
    }
  }, [apiKey, rememberKey]);

  function selectEndpoint(id: string) {
    setEndpointId(id);
    setResult(null);
    setNetworkError(null);
    setTab("response");
    history.replaceState(null, "", `#${id}`);
  }

  function setValue(name: string, value: string) {
    setValuesById({ ...valuesById, [endpointId]: { ...values, [name]: value } });
  }

  async function send(pageToken?: string, page = 1) {
    if (!query || !apiKey.trim()) return;
    const id = ++requestId.current;
    setLoading(true);
    setNetworkError(null);
    setTab("response");
    const started = performance.now();
    try {
      const res = await fetch(requestUrl(endpoint.resource, pageToken ? { ...query, pageToken } : query, apiKey.trim()));
      const text = await res.text();
      if (id !== requestId.current) return;
      let data: unknown = text;
      try {
        data = JSON.parse(text);
      } catch {
        // Not JSON; shown as text.
      }
      setResult({
        endpointId,
        status: res.status,
        ok: res.ok,
        ms: Math.round(performance.now() - started),
        bytes: new Blob([text]).size,
        data,
        json: typeof data === "string" ? data : JSON.stringify(data, null, 2),
        page,
      });
    } catch {
      if (id === requestId.current) {
        setResult(null);
        setNetworkError("Couldn't reach YouTube. Check your connection, or turn off any blocker for googleapis.com.");
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const current = result?.endpointId === endpointId ? result : null;
  const code = query && tab !== "response" ? snippet(tab, endpoint.resource, query) : null;
  const copyText = tab === "response" ? current?.json : code;
  const group = GROUPS.find((g) => g.label === endpoint.group)!;

  return (
    <div className="mx-auto grid w-full max-w-7xl items-start gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
      {/* Endpoint list: a menu beside the content on desktop, a select on phones. */}
      <nav aria-label="Endpoints" className="lg:sticky lg:top-6">
        <label className="block lg:hidden">
          <span className="mb-1.5 block text-sm font-medium">Endpoint</span>
          <select
            value={endpointId}
            onChange={(e) => selectEndpoint(e.target.value)}
            className={inputClass}
          >
            {GROUPS.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {ENDPOINTS.filter((e) => e.group === g.label).map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <div className="hidden flex-col gap-5 rounded-2xl border border-border bg-card p-3 lg:flex">
          {GROUPS.map(({ label, icon: Icon }) => (
            <div key={label}>
              <h2 className="flex items-center gap-2 px-2 pb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <Icon className="size-4" />
                {label}
              </h2>
              <ul className="flex flex-col gap-0.5">
                {ENDPOINTS.filter((e) => e.group === label).map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => selectEndpoint(e.id)}
                      aria-current={e.id === endpointId ? "page" : undefined}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[0.95rem] transition-colors ${
                        e.id === endpointId
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      {e.label}
                      {e.cost > 1 && <CostBadge cost={e.cost} />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="flex min-w-0 flex-col gap-6">
        <KeyPanel
          apiKey={apiKey}
          onKey={setApiKey}
          show={showKey}
          onShow={() => setShowKey(!showKey)}
          remember={rememberKey}
          onRemember={setRememberKey}
        />

        <section aria-labelledby="endpoint-title" className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <group.icon className="size-4" />
            {endpoint.group}
            <ChevronRight className="size-3.5" />
          </p>
          <h2 id="endpoint-title" className="mt-1 text-2xl font-bold">
            {endpoint.label}
          </h2>
          <p className="mt-1.5 text-muted-foreground">{endpoint.summary}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
              <span className="font-semibold text-green-500">GET</span> /youtube/v3/{endpoint.resource}
            </span>
            <CostBadge cost={endpoint.cost} long />
            <ExternalLink
              href={endpoint.docs}
              className="inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <BookOpen className="size-4" />
              Official docs
            </ExternalLink>
          </div>

          <form
            className="mt-6"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              void send();
            }}
          >
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Parameters</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {endpoint.fields.map((field) => (
                <FieldInput key={field.name} field={field} value={values[field.name] ?? ""} onChange={setValue} />
              ))}
            </div>

            <div className="mt-6">
              <p className="mb-1.5 text-sm font-medium">Request URL</p>
              <p className="rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-xs leading-relaxed wrap-anywhere text-muted-foreground">
                {query ? requestUrl(endpoint.resource, query) : "Fill in the required fields to build the URL."}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={!query || !apiKey.trim() || loading}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-strong px-5 font-semibold text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
                Send request
              </button>
              {problem ? (
                <p className="text-sm text-brand">{problem}</p>
              ) : (
                !apiKey.trim() && (
                  <p className="text-sm text-muted-foreground">
                    Add your API key above to send. The code tabs work without one.
                  </p>
                )
              )}
            </div>
          </form>
        </section>

        <section aria-label="Response and code" className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
            <div role="tablist" aria-label="Output" className="flex flex-wrap gap-1">
              {[{ id: "response" as Tab, label: "Response" }, ...LANGUAGES].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`h-8 rounded-md px-3 text-sm font-medium ${
                    tab === t.id ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {copyText && (
              <button
                type="button"
                onClick={() => void copy(copyText)}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-foreground px-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied" : tab === "response" ? "Copy JSON" : "Copy code"}
              </button>
            )}
          </div>

          {tab === "response" ? (
            <ResponseView
              result={current}
              loading={loading}
              networkError={networkError}
              onNextPage={(token) => current && void send(token, current.page + 1)}
            />
          ) : code ? (
            <div>
              <p className="border-b border-border px-4 py-2.5 text-sm text-muted-foreground">
                Replace <code className="font-mono text-foreground">YOUR_API_KEY</code> with your key. Keep keys out of
                code you publish.
              </p>
              <pre className="max-h-144 overflow-auto p-4 text-sm leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          ) : (
            <p className="p-6 text-sm text-muted-foreground">Fill in the required fields to generate code.</p>
          )}
        </section>
      </div>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-[1.05rem] outline-none focus:border-muted-foreground";

function KeyPanel({
  apiKey,
  onKey,
  show,
  onShow,
  remember,
  onRemember,
}: {
  apiKey: string;
  onKey: (key: string) => void;
  show: boolean;
  onShow: () => void;
  remember: boolean;
  onRemember: (remember: boolean) => void;
}) {
  const looksWrong = apiKey.trim() !== "" && !/^AIza[\w-]{35}$/.test(apiKey.trim());
  return (
    <section aria-labelledby="key-title" className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="key-title" className="flex items-center gap-2 font-semibold">
          <KeyRound className="size-4" />
          Your YouTube API key
        </h2>
        <ExternalLink
          href={KEY_HELP}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Get a free key
          <ArrowRight className="size-3.5" />
        </ExternalLink>
      </div>
      <div className="mt-3 flex gap-2">
        <input
          type={show ? "text" : "password"}
          value={apiKey}
          onChange={(e) => onKey(e.target.value)}
          placeholder="AIza…"
          autoComplete="off"
          spellCheck={false}
          aria-label="YouTube API key"
          className={`${inputClass} font-mono`}
        />
        <button
          type="button"
          onClick={onShow}
          aria-label={show ? "Hide key" : "Show key"}
          aria-pressed={show}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-border hover:bg-muted"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {looksWrong && (
        <p className="mt-2 text-sm text-amber-500">This doesn&apos;t look like a YouTube API key, which starts with AIza.</p>
      )}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm">
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => onRemember(e.target.checked)}
            className="size-4 accent-brand-strong"
          />
          Remember on this device
        </label>
        <p className="text-muted-foreground">Requests go straight from your browser to Google. We never see your key.</p>
      </div>
    </section>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: string; onChange: (name: string, value: string) => void }) {
  const id = `field-${field.name}`;
  const help = field.help && <span className="mt-1.5 block text-xs font-normal text-muted-foreground">{field.help}</span>;

  if (field.kind === "parts") {
    const selected = new Set(value.split(",").filter(Boolean));
    const toggle = (part: string) => {
      if (selected.has(part)) selected.delete(part);
      else selected.add(part);
      // Keep the documented order.
      onChange(field.name, field.options!.map((o) => o.value).filter((p) => selected.has(p)).join(","));
    };
    return (
      <fieldset className="sm:col-span-2">
        <legend className="mb-1.5 text-sm font-medium">{field.label}</legend>
        <div className="flex flex-wrap gap-2">
          {field.options!.map((o) => (
            <button
              key={o.value}
              type="button"
              aria-pressed={selected.has(o.value)}
              onClick={() => toggle(o.value)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 font-mono text-sm transition-colors ${
                selected.has(o.value)
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {selected.has(o.value) && <Check className="size-3.5" />}
              {o.label}
            </button>
          ))}
        </div>
        {help}
      </fieldset>
    );
  }

  return (
    <label htmlFor={id} className="block text-sm font-medium">
      <span className="mb-1.5 flex gap-1">
        {field.label}
        {field.required && (
          <span aria-hidden className="text-brand">
            *
          </span>
        )}
      </span>
      {field.kind === "select" ? (
        <select id={id} value={value} onChange={(e) => onChange(field.name, e.target.value)} className={inputClass}>
          {field.options!.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={field.kind === "number" ? "number" : "text"}
          inputMode={field.kind === "number" ? "numeric" : undefined}
          min={field.min}
          max={field.max}
          required={field.required}
          value={value}
          placeholder={field.placeholder}
          spellCheck={false}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={inputClass}
        />
      )}
      {help}
    </label>
  );
}

function CostBadge({ cost, long }: { cost: number; long?: boolean }) {
  const expensive = cost > 1;
  return (
    <span
      title="Quota units used per request, out of 10,000 a day"
      className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${
        expensive ? "bg-amber-500/15 text-amber-500" : "bg-muted text-muted-foreground"
      }`}
    >
      {long ? `Costs ${cost} quota ${cost === 1 ? "unit" : "units"}` : `${cost} units`}
    </span>
  );
}

function ResponseView({
  result,
  loading,
  networkError,
  onNextPage,
}: {
  result: Result | null;
  loading: boolean;
  networkError: string | null;
  onNextPage: (token: string) => void;
}) {
  if (networkError) return <p className="p-6 text-sm text-brand">{networkError}</p>;
  if (!result) {
    return (
      <p className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
        {loading && <LoaderCircle className="size-4 animate-spin" />}
        {loading ? "Waiting for YouTube…" : "Send the request to see YouTube's real response here."}
      </p>
    );
  }

  const data = result.data as { items?: unknown[]; pageInfo?: { totalResults?: number }; nextPageToken?: string };
  const message = result.ok ? null : errorMessage(result.data);
  const hint = result.ok ? null : errorHint(result.data);
  const total = data?.pageInfo?.totalResults;

  return (
    <div className={loading ? "opacity-60 transition-opacity" : undefined}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-4 py-2.5 text-sm">
        <span
          className={`rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${
            result.ok ? "bg-green-500/15 text-green-500" : "bg-brand/15 text-brand"
          }`}
        >
          {result.status} {result.ok ? "OK" : "Error"}
        </span>
        <span className="text-muted-foreground">{result.ms} ms</span>
        <span className="text-muted-foreground">{formatBytes(result.bytes)}</span>
        {Array.isArray(data?.items) && (
          <span className="text-muted-foreground">
            {data.items.length} {data.items.length === 1 ? "item" : "items"}
            {total !== undefined && total > data.items.length && ` of ${total.toLocaleString("en-US")}`}
            {result.page > 1 && ` · page ${result.page}`}
          </span>
        )}
        {data?.nextPageToken && (
          <button
            type="button"
            onClick={() => onNextPage(data.nextPageToken!)}
            disabled={loading}
            className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 font-medium hover:bg-muted disabled:opacity-50"
          >
            Next page
            <ArrowRight className="size-4" />
          </button>
        )}
      </div>
      {(message || hint) && (
        <div role="alert" className="border-b border-border bg-brand/10 px-4 py-3 text-sm">
          {message && <p className="font-medium">{message}</p>}
          {hint && <p className="mt-1 text-muted-foreground">{hint}</p>}
        </div>
      )}
      <pre className="max-h-144 overflow-auto p-4 text-sm leading-relaxed whitespace-pre-wrap wrap-anywhere">
        <code>{highlightJson(result.json)}</code>
      </pre>
    </div>
  );
}

function formatBytes(bytes: number) {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

const JSON_TOKEN = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;

// Colors keys, strings, numbers and literals; everything else stays plain.
function highlightJson(json: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of json.matchAll(JSON_TOKEN)) {
    const index = match.index;
    if (index > last) nodes.push(json.slice(last, index));
    const [token, string, colon, literal] = match;
    const className = string
      ? colon
        ? "text-sky-600 dark:text-sky-300"
        : "text-green-700 dark:text-green-400"
      : literal
        ? "text-purple-600 dark:text-purple-400"
        : "text-amber-700 dark:text-amber-400";
    nodes.push(
      <span key={index} className={className}>
        {string ?? token}
      </span>,
    );
    if (colon) nodes.push(colon);
    last = index + token.length;
  }
  if (last < json.length) nodes.push(json.slice(last));
  return nodes;
}
