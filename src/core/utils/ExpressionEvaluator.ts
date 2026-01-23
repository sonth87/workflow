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
  evaluateExpression(expression: string, context: Record<string, any>): any {
    if (!expression) return true;

    try {
      // Create a function from the expression
      const keys = ["variables", ...Object.keys(context)];
      const values = [context, ...Object.values(context)];

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
  evaluateScript(script: string, context: Record<string, any>): any {
    if (!script) return context;

    try {
      // We wrap the script to allow returning values or modifying the variables object
      const keys = ["variables", ...Object.keys(context)];
      const values = [context, ...Object.values(context)];

      const fn = new Function(...keys, `${script}; return variables;`);
      return fn(...values);
    } catch (error) {
      console.error(`Error executing script`, error);
      return context;
    }
  }
}

export const expressionEvaluator = new ExpressionEvaluator();
