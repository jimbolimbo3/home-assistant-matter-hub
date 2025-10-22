import { Transaction, Logger } from "@matter/general";

/**
 * Safely applies a patch to state, handling transaction contexts properly.
 *
 * Wraps the state update in Transaction.act() to properly acquire locks
 * asynchronously, avoiding "synchronous-transaction-conflict" errors when
 * called from within reactors or other transaction contexts.
 */
export async function applyPatchState<T extends object>(
  state: T,
  patch: Partial<T>,
): Promise<Partial<T>> {
  // Use Transaction.act to properly handle lock acquisition
  return Transaction.act("applyPatchState", async (tx) => {
    await tx.begin();
    const result = applyPatch(state, patch);
    await tx.commit();
    return result;
  });
}

function applyPatch<T extends object>(state: T, patch: Partial<T>): Partial<T> {
  // Only include values that need to be changed
  const actualPatch: Partial<T> = {};

  for (const key in patch) {
    if (Object.hasOwn(patch, key)) {
      const patchValue = patch[key];

      if (patchValue !== undefined) {
        const stateValue = state[key];

        if (!deepEqual(stateValue, patchValue)) {
          actualPatch[key] = patchValue;
        }
      }
    }
  }

  // Set properties individually to avoid transaction conflicts. If a single
  // property assignment triggers validation (for example a Matter constraint)
  // we log a warning and skip that property instead of failing the whole
  // transaction. This avoids crashing the process when an entity reports
  // invalid attributes (see issue: invalid color temp bounds from some devices).
  const logger = Logger.get("applyPatchState");
  const appliedPatch: Partial<T> = {};

  for (const key in actualPatch) {
    if (!Object.hasOwn(actualPatch, key)) continue;
    try {
      state[key] = actualPatch[key] as T[Extract<keyof T, string>];
      appliedPatch[key] = actualPatch[key];
    } catch (e) {
      // Log a warning and continue applying other properties. Include the
      // property name and the error message to help debugging problematic
      // devices that report out-of-spec values.
      try {
        logger.warn(
          `Failed to set property ${String(key)} on state due to error: ${String(e)}`,
        );
      } catch {
        // Fallback to console if the logger itself fails for some reason.
        // eslint-disable-next-line no-console
        console.warn(
          `applyPatchState: failed to set property ${String(key)}:`,
          e,
        );
      }
      // continue with next property
    }
  }

  return appliedPatch;
}

function deepEqual<T>(a: T, b: T): boolean {
  if (a == null || b == null) {
    return a === b;
  }
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((vA, idx) => deepEqual(vA, b[idx]));
  }
  if (typeof a === "object" && typeof b === "object") {
    const keys = Object.keys({ ...a, ...b }) as (keyof T)[];
    return keys.every((key) => deepEqual(a[key], b[key]));
  }
  return a === b;
}
