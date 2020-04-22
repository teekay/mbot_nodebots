import { run } from "../discoBall"

const port = process.argv[2] || "COM4";
const fps = +(process.argv[3]) || 3;
run(port, fps);