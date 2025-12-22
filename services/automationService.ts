
import { AutomationStep } from "../types";

export class AutomationExecutor {
  async executeSequence(steps: AutomationStep[], ip: string): Promise<void> {
    if (!ip) return;
    
    console.log(`Executing sequence on ${ip}...`);
    for (const step of steps) {
      try {
        await fetch(`http://${ip}:8080/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(step)
        });
        // Her adım arası kısa bekleme
        await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        console.error("Step execution failed:", step.description);
      }
    }
  }

  async ping(ip: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`http://${ip}:8080/ping`, { signal: controller.signal });
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const executor = new AutomationExecutor();
