export function sanitizeInput(input: string): string {
  // 移除任何可能的脚本标签
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

  // 移除任何 HTML 标签
  sanitized = sanitized.replace(/<[^>]*>/g, "")

  // 移除多余的空白字符
  sanitized = sanitized.replace(/\s+/g, " ").trim()

  return sanitized
}

