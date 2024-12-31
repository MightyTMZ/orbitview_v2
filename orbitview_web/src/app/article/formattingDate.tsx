export function formatDate(dateString: string): string {
  // Parse the date string into a Date object
  const [month, day, year] = dateString.split("/").map(Number);
  const date = new Date(year, month - 1, day);

  // Options for formatting the date
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Use Intl.DateTimeFormat to format the date
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
