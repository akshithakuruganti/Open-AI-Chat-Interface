import { css } from "@emotion/css";
import { useMemo } from "react";
import { useTheme, type Theme } from "@mui/material/styles";
import type { CSSObject } from "@emotion/react";

type PlainObject = CSSObject;
type StyleObject = PlainObject;
type StyleEntry<TProps, TTheme> =
  | StyleObject
  | ((props: TProps, theme: TTheme) => StyleObject);

type Styles<TProps, TTheme> = Record<string, StyleEntry<TProps, TTheme>>;

const isPlainObject = (v: any): v is PlainObject =>
  v != null && typeof v === "object" && !Array.isArray(v);

const DEV = import.meta?.env?.DEV === true;

function walkObject(
  obj: StyleObject,
  fn: (
    key: string,
    value: any,
    parent: StyleObject,
  ) => { key: string; value: any } | null,
): StyleObject {
  const out: StyleObject = {};
  for (const k of Object.keys(obj ?? {})) {
    const v = obj[k];
    const next = fn(k, v, obj);
    if (next === null) continue;
    const { key: nk, value: nv } = next;
    if (isPlainObject(nv)) {
      out[nk] = walkObject(nv, fn);
    } else {
      out[nk] = nv;
    }
  }
  return out;
}

function collectDollarRefs(style: StyleObject, bucket: Set<string>) {
  const re = /\$([a-zA-Z0-9_-]+)/g;
  function visit(obj: StyleObject) {
    for (const k of Object.keys(obj ?? {})) {
      const v = obj[k];
      let m: RegExpExecArray | null;
      while ((m = re.exec(k))) bucket.add(m[1]);
      if (isPlainObject(v)) visit(v);
    }
  }
  visit(style);
}

function replaceDollarRefs(
  style: StyleObject,
  resolver: (ref: string) => string | undefined,
): StyleObject {
  const re = /\$([a-zA-Z0-9_-]+)/g;
  return walkObject(style, (key, value) => {
    if (!key.includes("$")) return { key, value };
    let hadUnknown = false;
    const newKey = key.replace(re, (_m, ref) => {
      const rep = resolver(ref);
      if (!rep) {
        hadUnknown = true;
        return "__DROP__";
      }
      return rep.startsWith(".") ? rep : `.${rep}`;
    });
    if (hadUnknown || newKey.includes("__DROP__")) {
      if (DEV)
        console.warn("[makeStyles] Dropping selector with unknown $ref:", key);
      return null;
    }
    return { key: newKey, value };
  });
}

function compileStyles(
  resolvedStyles: Record<string, StyleObject>,
): Record<string, string> {
  const keys = Object.keys(resolvedStyles);
  const deps: Record<string, Set<string>> = {};
  keys.forEach((k) => {
    const s = resolvedStyles[k] ?? {};
    const set = new Set<string>();
    collectDollarRefs(s, set);
    deps[k] = set;
  });

  const classes: Record<string, string> = {};
  const done = new Set<string>();

  let progress = true;
  let iterations = 0;
  const maxIterations = keys.length * 2;

  while (progress && iterations++ < maxIterations) {
    progress = false;

    for (const k of keys) {
      if (done.has(k)) continue;
      const allDepsKnown = Array.from(deps[k]).every((d) => classes[d]);

      if (deps[k].size === 0) {
        try {
          classes[k] = css(resolvedStyles[k] || {});
        } catch (e) {
          if (DEV)
            console.error("[makeStyles] Failed to compile style for", k, e);
          classes[k] = css({});
        }
        done.add(k);
        progress = true;
      } else if (allDepsKnown) {
        const replaced = replaceDollarRefs(
          resolvedStyles[k] || {},
          (ref) => classes[ref],
        );
        try {
          classes[k] = css(replaced);
        } catch (e) {
          if (DEV)
            console.error(
              "[makeStyles] Failed to compile (with $refs) for",
              k,
              e,
            );
          classes[k] = css({});
        }
        done.add(k);
        progress = true;
      }
    }
  }

  for (const k of keys) {
    if (done.has(k)) continue;
    const replaced = replaceDollarRefs(
      resolvedStyles[k] || {},
      (ref) => classes[ref],
    );
    try {
      classes[k] = css(replaced);
    } catch (e) {
      if (DEV) console.error("[makeStyles] Fallback compile failed for", k, e);
      classes[k] = css({});
    }
    done.add(k);
  }

  return classes;
}

/** ✅ Strongly typed makeStyles */
export function makeStyles<
  TProps = any,
  TTheme = Theme,
  TStyles extends Styles<TProps, TTheme> = Styles<TProps, TTheme>,
>(
  styles: (theme: TTheme) => TStyles,
): (props?: TProps) => { [K in keyof TStyles]: string } {
  return (props?: TProps) => {
    const theme = useTheme<TTheme>();

    return useMemo(() => {
      let styleMap: TStyles;
      try {
        styleMap = styles(theme) || ({} as TStyles);
      } catch (e) {
        if (DEV) console.error("[makeStyles] styles(theme) threw:", e);
        return {} as { [K in keyof TStyles]: string };
      }

      const resolved = {} as Record<keyof TStyles, StyleObject>;
      for (const key of Object.keys(styleMap) as (keyof TStyles)[]) {
        const entry = styleMap[key];
        try {
          const style =
            typeof entry === "function"
              ? (entry as any)(props ?? ({} as TProps), theme)
              : entry;
          resolved[key] = isPlainObject(style) ? style : {};
        } catch (e) {
          if (DEV)
            console.error(
              `[makeStyles] style "${String(key)}" resolver threw:`,
              e,
            );
          resolved[key] = {};
        }
      }

      try {
        return compileStyles(resolved as Record<string, StyleObject>) as {
          [K in keyof TStyles]: string;
        };
      } catch (e) {
        if (DEV) console.error("[makeStyles] compileStyles threw:", e);
        const empty = css({});
        const fallback = {} as { [K in keyof TStyles]: string };
        for (const k of Object.keys(resolved) as (keyof TStyles)[]) {
          fallback[k] = empty;
        }
        return fallback;
      }
    }, [theme, props]);
  };
}

// Version 4

/* This hook is limited some ways to apply styles might not work like mui makestyles */
