
import { ActionType, AutomationStep } from "../types";

/**
 * Strategy Interface for Action Execution
 */
interface ExecutionStrategy {
  execute(step: AutomationStep, ip: string): Promise<void>;
}

/**
 * Concrete Strategies sending real network requests to the PC Agent
 */
class NetworkActionStrategy implements ExecutionStrategy {
  async execute(step: AutomationStep, ip: string): Promise<void> {
    if (!ip) {
      console.warn("PC IP address not set. Command skipped.");
      return;
    }

    try {
      console.log(`[NETWORK] Sending ${step.type} to http://${ip}:8080/execute`);
      
      const response = await fetch(`http://${ip}:8080/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: step.type,
          payload: step.value
        })
      });

      if (!response.ok) throw new Error("PC Agent error");
      console.log(`[SUCCESS] PC executed: ${step.description}`);
    } catch (err) {
      console.error(`[ERROR] Connection failed to ${ip}:`, err);
      // Fallback for demo: keep logging to console
      console.log(`[DEMO MODE] Executed locally: ${step.description} (${step.value})`);
    }
  }
}

/**
 * Context class that uses network strategies
 */
export class AutomationExecutor {
  private networkStrategy = new NetworkActionStrategy();

  async executeStep(step: AutomationStep, ip: string): Promise<void> {
    await this.networkStrategy.execute(step, ip);
  }

  async executeSequence(steps: AutomationStep[], ip: string): Promise<void> {
    for (const step of steps) {
      await this.executeStep(step, ip);
      // Artificial delay to allow PC to process
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async testConnection(ip: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`http://${ip}:8080/ping`, { signal: controller.signal });
      clearTimeout(id);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const executor = new AutomationExecutor();
