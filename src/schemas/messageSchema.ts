import { z } from "zod";

export const acceptMessages =z.object({
    content: z.string().min(10,"content must be at least of 10 Chars").max(300,"content must not be more than 300 chars")
})