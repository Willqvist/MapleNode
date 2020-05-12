export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function get(id) {
  return document.getElementById(id);
}
