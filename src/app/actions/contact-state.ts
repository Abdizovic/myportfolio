export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
  /** Echoed back so a failed submit doesn't wipe what the visitor typed. */
  values?: { name: string; email: string; message: string };
};

export const initialContactState: ContactState = { status: "idle" };
