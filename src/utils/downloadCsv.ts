/** Download tabular data as a spreadsheet-friendly CSV file. */
export function downloadCsv(
  filename: string,
  headers: string[],
  rows: Array<Array<string | number>>,
): void {
  const escapeCell = (value: string | number): string => {
    let cell = String(value);

    // Prevent spreadsheet applications from evaluating user supplied formulas.
    if (/^[\s]*[=+\-@]/.test(cell)) {
      cell = `'${cell}`;
    }

    return `"${cell.replace(/"/g, '""')}"`;
  };

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCell).join(","))
    .join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
