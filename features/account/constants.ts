import { customers } from "@/data/customers";

/**
 * There's no real session yet (see Milestone 14 — Auth + RBAC). Until then,
 * the account section previews against a fixed mock customer so it behaves
 * like a real logged-in experience rather than an empty shell. Swapping in
 * real auth later means replacing this constant with the session's actual
 * customer id — every account page already reads through this one export.
 */
export const DEMO_CUSTOMER_ID = customers[0]!.id;
