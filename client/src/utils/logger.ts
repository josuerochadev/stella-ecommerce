// client/src/utils/logger.ts
// Centralized logging service for the application

import * as Sentry from "@sentry/react";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
  context?: string;
}

/**
 * Logger service that provides centralized logging
 * In production, logs can be sent to monitoring services (Sentry, LogRocket, etc.)
 */
class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 100;

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, data?: unknown, context?: string): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG]${context ? ` [${context}]` : ""} ${message}`, data || "");
    }
    this.addToBuffer("debug", message, data, context);
  }

  /**
   * Log an informational message
   */
  info(message: string, data?: unknown, context?: string): void {
    if (this.isDevelopment) {
      console.info(`[INFO]${context ? ` [${context}]` : ""} ${message}`, data || "");
    }
    this.addToBuffer("info", message, data, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: unknown, context?: string): void {
    if (this.isDevelopment) {
      console.warn(`[WARN]${context ? ` [${context}]` : ""} ${message}`, data || "");
    }
    this.addToBuffer("warn", message, data, context);
    this.sendToMonitoring("warn", message, data, context);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: unknown, context?: string): void {
    if (this.isDevelopment) {
      console.error(`[ERROR]${context ? ` [${context}]` : ""} ${message}`, error || "");
    }
    this.addToBuffer("error", message, error, context);
    this.sendToMonitoring("error", message, error, context);
  }

  private sendToMonitoring(
    level: LogLevel,
    message: string,
    data?: unknown,
    context?: string,
  ): void {
    if (this.isDevelopment) return;

    try {
      if (level === "error" && data instanceof Error) {
        Sentry.captureException(data, {
          extra: { message, context },
        });
      } else {
        Sentry.captureMessage(message, {
          level: level === "warn" ? "warning" : level,
          extra: { context, data },
        });
      }
    } catch {
      // Monitoring failure must never break the app
    }
  }

  /**
   * Add log entry to buffer
   */
  private addToBuffer(level: LogLevel, message: string, data?: unknown, context?: string): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      context,
    };

    this.logBuffer.push(entry);

    // Keep buffer size under control
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }
  }

  /**
   * Get recent logs (useful for debugging)
   */
  getRecentLogs(count = 50): LogEntry[] {
    return this.logBuffer.slice(-count);
  }

  /**
   * Clear log buffer
   */
  clearLogs(): void {
    this.logBuffer = [];
  }

  /**
   * Export logs (for debugging or support)
   */
  exportLogs(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export class for testing
export { Logger };
