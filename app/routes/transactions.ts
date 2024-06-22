import { json, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/db.server";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const bankId = url.searchParams.get("bank_id");

    // Get all the bank fields map if no bank name is provided
    if (!bankId) {
        const bankStatement = await prisma.transactions.findMany();
        return json({ bankStatement });
    }

    const bankStatement = await prisma.transactions.findMany({
        where: {
            bank_id: bankId
        }
    });

    return json({ bankStatement });
};

export const action: LoaderFunction = async ({ request }) => {
    switch (request.method) {
        case "POST": {
            return handlePost(request);
        }
        default: {
            return json({ error: "Invalid method" }, { status: 405 });
        }
    }
}

interface Raw_Transaction {
    original_description: string;
    debit: number;
    credit: number;
    balance: number;
    date: string;
}


const handlePost = async (request: Request) => {
    const data = await request.json();
    const statement: Raw_Transaction[] = data.statement;
    const bank_id: string = data.bankId;
    
    if (!statement || !bank_id) {
        return json({ error: "Statement and bank id are required" }, { status: 400 });
    }

    const bankStatement = await prisma.transactions.createMany({
        data: statement.map((s) => ({ ...s, bank_id }))
    });

    return json({ bankStatement });
}
