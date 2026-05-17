export function toCsv(
  rows: Array<Record<string, string | number | null | undefined>>,
  columns: string[],
) {
  const header = columns.join(",")
  const body = rows.map((row) => columns.map((column) => escapeCsvValue(row[column])).join(","))
  return [header, ...body].join("\n")
}

function escapeCsvValue(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return ""
  }

  const stringValue = String(value)

  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}
