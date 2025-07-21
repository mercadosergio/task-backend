import { hash } from 'bcryptjs';
import { prisma } from './../src/db/prisma.client';

async function main() {

    await prisma.user.create({
        data: {
            username: 'admin',
            password: await hash('1234567890', 10)
        }
    })


    await prisma.task.createMany({
        data: [
            { text: 'Comprar leche', status: 'PENDING' },
            { text: 'Terminar informe', status: 'COMPLETED' },
            { text: 'Llamar al médico', status: 'PENDING' },
            { text: 'Pagar servicios', status: 'IN-PROGRESS' },
            { text: 'Estudiar TypeScript', status: 'COMPLETED' },
            { text: 'Limpiar la casa', status: 'PENDING' },
        ],
    })
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
