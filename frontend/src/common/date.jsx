let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const getDay = (timestamp) => {
    let date = new Date(timestamp);

    return `${date.getDate()} ${months[date.getMonth()]}`
}

export const getFullDay = (timestamp) => {
    let date = new Date(timestamp);

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export const getDateWithTime = (timestamp) => {
    let date = new Date(timestamp);

    // Get the date, month, and time
    let day = date.getDate();
    let month = months[date.getMonth()];
    let hours = date.getHours().toString().padStart(2, '0'); // Ensure two-digit format for hours
    let minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure two-digit format for minutes

    // Construct the formatted string
    return `${day}. ${month} at ${hours}:${minutes}`;
};