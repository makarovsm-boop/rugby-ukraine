"use client";

import { trackEvent } from "@/lib/analytics";

type TrackedSearchFormProps = {
  className: string;
  inputClassName: string;
  buttonClassName: string;
  defaultValue?: string;
  placeholder?: string;
  eventSource: "header" | "search_page";
};

export function TrackedSearchForm({
  className,
  inputClassName,
  buttonClassName,
  defaultValue,
  placeholder,
  eventSource,
}: TrackedSearchFormProps) {
  return (
    <form
      action="/search"
      className={className}
      onSubmit={(event) => {
        const formData = new FormData(event.currentTarget);
        const query = String(formData.get("q") ?? "").trim();

        if (!query) {
          return;
        }

        trackEvent("search_submit", {
          event_category: "engagement",
          event_label: eventSource,
          query_length: query.length,
        });
      }}
    >
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-label="Пошуковий запит"
        className={inputClassName}
      />
      <button type="submit" className={buttonClassName}>
        Шукати
      </button>
    </form>
  );
}
