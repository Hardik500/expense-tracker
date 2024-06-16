import { json, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/db.server";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const bankId = url.searchParams.get("bank_id");

    // Get all the bank fields map if no bank name is provided
    if (!bankId) {
        const bankStatement = await prisma.bank_statement.findMany();
        return json({ bankStatement });
    }

    const bankStatement = await prisma.bank_statement.findMany({
        where: {
            bank: bankId
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

interface Statement {
    description: string;
    debit: number;
    credit: number;
    balance: number;
    category: string;
    sub_category: string;
    date: string;
}


const handlePost = async (request: Request) => {
    const data = await request.json();
    const statement: Statement[] = data.statement;
    const bank: string = data.bank;
    
    if (!statement || !bank) {
        return json({ error: "Statement and bank id are required" }, { status: 400 });
    }

    const bankStatement = await prisma.bank_statement.createMany({
        data: statement.map((s) => ({ ...s, bank }))
    });

    return json({ bankStatement });
}