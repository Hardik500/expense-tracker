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

    return json(bank);
};

export const action: LoaderFunction = async ({ request }) => {
    switch (request.method) {
        case "POST": {
            return handlePost(request);
        }
        case "PUT": {
            return handlePut(request);
        }
        default: {
            return json({ error: "Invalid method" }, { status: 405 });
        }
    }
}

const handlePost = async (request: Request) => {
    // Create a new entry for the bank fields map
    const data = await request.json();
    const bankName = data.bankName;
    const fieldMap = data.fieldMap;

    if (!bankName || !fieldMap) {
        return json({ error: "Bank name and field map are required" }, { status: 400 });
    }

    // Check if the bank exists in the database
    const bankExists = await prisma.bank_fields_map.findFirst({
        where: {
            bank_name: bankName
        }
    });

    if (!bankExists) {
        const bank = await prisma.bank_fields_map.create({
            data: {
                bank_name: bankName,
                field_map: fieldMap
            }
        });

        return json({ bank });
    }

    // If the bank already exists, update the field map
    const bank = await prisma.bank_fields_map.update({
        where: {
            id: bankExists.id
        },
        data: {
            field_map: fieldMap
        }
    });

    return json({ bank });
}

const handlePut = async (request: Request) => {
    // Update the existing entry for the bank fields map
    const data = await request.json();
    const bankName = data.bankName;
    const fieldMap = data.fieldMap;

    if (!bankName || !fieldMap) {
        return json({ error: "Bank name and field map are required" }, { status: 400 });
    }

    // Check if the bank exists in the database
    const bankExists = await prisma.bank_fields_map.findFirst({
        where: {
            bank_name: bankName
        }
    });

    if (!bankExists) {
        return json({ error: "Bank not found" }, { status: 404 });
    }

    // If the bank already exists, update the field map
    const bank = await prisma.bank_fields_map.update({
        where: {
            id: bankExists.id
        },
        data: {
            field_map: fieldMap
        }
    });

    return json({ bank });
}
