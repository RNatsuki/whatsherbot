import { FlowImp } from "./flow";
import { Flow } from "./types";

export function createFlow(id: string): Flow {
  return new FlowImp(id);
}
