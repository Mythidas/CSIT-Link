export default class Time {
  date: Date;
  is_invalid: boolean = false;

  constructor(date: string) {
    if (date.length === 0) this.is_invalid = true;
    this.date = new Date(date);
  }

  is_older_than_30_days() {
    const today = new Date();
    const difference_in_ms = today.getTime() - this.date.getTime();
    const difference_in_days = Math.ceil(difference_in_ms / (1000 * 60 * 60 * 24));
    return difference_in_days > 30;
  }

  get_time_since(): string {
    if (this.is_invalid) return "Never"

    // Parse the ISO string into a Date object
    const then: Date = this.date;

    // Get the current time
    const now: Date = new Date();

    // Calculate the difference in milliseconds
    const difference: number = now.getTime() - then.getTime();

    // Calculate days, hours, and minutes
    const days: number = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours: number = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes: number = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    // Build the output string
    let output: string = "";
    if (days > 0) {
      output += `${days}d, `;
    }
    if (hours > 0) {
      output += `${hours}h, `;
    }
    if (minutes > 0) {
      output += `${minutes}m`;
    }

    return output ? `${output} ago` : "Just now";
  }
}