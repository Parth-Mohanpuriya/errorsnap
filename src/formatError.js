/**
 * formatError - Formats an error into a readable terminal message.
 * Useful for debugging and logging errors in the console.
 * @param {Error} error - The error object to format.
 * @returns {string} - The formatted error message.
 */
function formatError(error) {
  // Get the current time formatted as HH:MM:SS
  const now = new Date();
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Build the formatted error message
  const formatted = `
-------------------------------
          ERROR SNAP
-------------------------------
Error: ${error.message}
Status Code: ${error.statusCode}
Time: ${time}
-------------------------------`;

  return formatted;
}

module.exports = formatError;