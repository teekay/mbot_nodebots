import { run } from "../scared";

const port = process.argv[2] || "COM4";
run(port);