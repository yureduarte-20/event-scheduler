export const iso_to_datetime = (date: string) => {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}