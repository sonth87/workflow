/**
 * Expression Evaluator
 * Utility to evaluate simple JavaScript expressions safely
 */

export class ExpressionEvaluator {
  /**
   * Evaluates an expression against a context
   * @param expression The JS expression string (e.g. "amount > 100")
   * @param context The context object containing variables
   * @returns The result of the expression
   */
  static evaluate(expression: string, context: Record<string, any>): any {
    if (!expression) return true;

    try {
      // Create a function from the expression
      // We use the keys of the context as arguments
      const keys = Object.keys(context);
      const values = Object.values(context);

      const fn = new Function(...keys, `return (${expression})`);
      return fn(...values);
    } catch (error) {
      console.error(`Error evaluating expression: ${expression}`, error);
      return false;
    }
  }

  /**
   * Executes a script against a context
   * @param script The JS script string
   * @param context The context object
   * @returns The modified context or result
   */
  static execute(script: string, context: Record<string, any>): any {
    if (!script) return context;

    try {
      const keys = Object.keys(context);
      const values = Object.values(context);

      const fn = new Function(...keys, script);
      return fn(...values);
    } catch (error) {
      console.error(`Error executing script`, error);
      return context;
    }
  }
}
