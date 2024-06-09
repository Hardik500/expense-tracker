import { json, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/db.server";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const bankName = url.searchParams.get("bankName");

    if (!bankName) {
        return json({ error: "Bank name is required" }, { status: 400 });
    }

    const bank = await prisma.bank_fields_map.findFirst({
        where: {
            bank_name: bankName
        }
    });

    return json({ fieldMap: bank?.field_map || null });
};
