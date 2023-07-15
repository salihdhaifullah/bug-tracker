export default function formatDate(date: Date | string, time?: boolean): string {
    if (time) return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: "2-digit", minute: "2-digit" })
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
