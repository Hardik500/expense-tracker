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

    // Check if the bank exists in the database
    const bank = await prisma.bank_fields_map.findUnique({
        where: {
            id: bank_id
        }
    });

    if (!bank) {
        return json({ error: "Bank not found" }, { status: 404 });
    }

    // Check if any entry in the statement already exists in the database and filter them out
    const existingTransactions = await prisma.transactions.findMany({
        where: {
            bank_id: bank_id,
            original_description: {
                in: statement.map(s => s.original_description)
            }
        }
    });

    const existingDescriptions = existingTransactions.map(t => t.original_description);
    const newTransactions = statement.filter(s => !existingDescriptions.includes(s.original_description));

    // If all the transactions already exist, return an empty array
    if (newTransactions.length === 0) {
        return json({ createdTransactions: [] });
    }

    // Create the new transactions
    const transactions = newTransactions.map(t => {
        return {
            original_description: t.original_description,
            debit: t.debit,
            credit: t.credit,
            balance: t.balance,
            date: new Date(t.date),
            bank_id: bank_id
        }
    });

    const createdTransactions = await prisma.transactions.createMany({
        data: transactions
    });

    return json({ createdTransactions });
}
