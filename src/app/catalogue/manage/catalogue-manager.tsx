"use client";

import { useState, type FormEvent } from "react";
import styles from "../catalogue.module.css";

type Catalogue = {
  id: string;
  filename: string;
  uploadedAt: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCatalogueList(
  value: unknown,
): value is { catalogues: Catalogue[] } {
  return (
    isRecord(value) &&
    Array.isArray(value.catalogues) &&
    value.catalogues.every(
      (catalogue) =>
        isRecord(catalogue) &&
        typeof catalogue.id === "string" &&
        typeof catalogue.filename === "string" &&
        typeof catalogue.uploadedAt === "string",
    )
  );
}

function responseError(value: unknown, fallback: string) {
  return isRecord(value) && typeof value.error === "string"
    ? value.error
    : fallback;
}

export function CatalogueManager() {
  const [password, setPassword] = useState("");
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/catalogue", {
        headers: { Authorization: `Bearer ${password}` },
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        throw new Error(
          responseError(result, "Could not load catalogues. Please try again."),
        );
      }
      if (!isCatalogueList(result)) {
        throw new Error("The catalogue list response was invalid.");
      }
      setCatalogues(result.catalogues);
      setIsAuthenticated(true);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Could not load catalogues. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function copyCatalogueLink(id: string) {
    const url = new URL(`/api/catalogue/${id}`, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Share link copied.");
      setError("");
    } catch {
      setStatus("");
      setError("Could not copy the link. Check clipboard permissions and retry.");
    }
  }

  async function deleteCatalogue(catalogue: Catalogue) {
    if (!window.confirm(`Delete "${catalogue.filename}"? This cannot be undone.`)) {
      return;
    }

    setBusyId(catalogue.id);
    setError("");
    setStatus("");
    try {
      const response = await fetch(`/api/catalogue/${catalogue.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${password}` },
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        throw new Error(
          responseError(result, "Could not delete the catalogue."),
        );
      }

      setCatalogues((current) =>
        current.filter((entry) => entry.id !== catalogue.id),
      );
      setStatus(`${catalogue.filename} was deleted.`);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete the catalogue.",
      );
    } finally {
      setBusyId("");
    }
  }

  function logOut() {
    setPassword("");
    setCatalogues([]);
    setIsAuthenticated(false);
    setError("");
    setStatus("");
  }

  return (
    <div className={styles.uploadPanel}>
      <p className={styles.eyebrow}>Private catalogue tools</p>
      <h2 className={styles.panelHeading}>
        Catalogue <em>manager.</em>
      </h2>

      {!isAuthenticated ? (
        <>
          <p className={styles.panelDescription}>
            Enter the admin password to view and manage uploaded catalogues.
          </p>
          <form className={styles.form} onSubmit={handleLogin}>
            <label className={styles.fileField}>
              <span>Admin password</span>
              <input
                autoComplete="current-password"
                onChange={(event) => setPassword(event.currentTarget.value)}
                required
                type="password"
                value={password}
              />
            </label>
            <button
              className={styles.submit}
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Checking..." : "Open catalogue list"}
            </button>
          </form>
        </>
      ) : (
        <>
          <div className={styles.managerHeading}>
            <p className={styles.panelDescription}>
              {catalogues.length}{" "}
              {catalogues.length === 1 ? "catalogue" : "catalogues"} available
            </p>
            <button
              className={styles.textButton}
              onClick={logOut}
              type="button"
            >
              Log out
            </button>
          </div>
          {catalogues.length > 0 ? (
            <ul className={styles.catalogueList}>
              {catalogues.map((catalogue) => (
                <li className={styles.catalogueItem} key={catalogue.id}>
                  <div className={styles.catalogueInfo}>
                    <strong>{catalogue.filename}</strong>
                    <span>
                      Uploaded{" "}
                      {new Date(catalogue.uploadedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.catalogueActions}>
                    <button
                      className={styles.textButton}
                      onClick={() => copyCatalogueLink(catalogue.id)}
                      type="button"
                    >
                      Copy share link
                    </button>
                    <button
                      className={styles.deleteButton}
                      disabled={busyId === catalogue.id}
                      onClick={() => deleteCatalogue(catalogue)}
                      type="button"
                    >
                      {busyId === catalogue.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyState}>No catalogues have been uploaded.</p>
          )}
        </>
      )}

      {error && (
        <p className={styles.uploadError} role="alert">
          {error}
        </p>
      )}
      {status && (
        <p className={styles.managerStatus} aria-live="polite">
          {status}
        </p>
      )}
    </div>
  );
}
