interface User {
    id: number;
    name: string;
    role: 'admin' | 'user';
    isActive: boolean;
}

const users: User[] = [
    { id: 1, name: 'Alice', role: 'admin', isActive: true },
    { id: 2, name: 'Bob', role: 'user', isActive: false },
    { id: 3, name: 'Charlie', role: 'user', isActive: true },
];

function filterObjects<T>(items: T[], conditions: Partial<T>): T[] {
    return items.filter((item) =>
        Object.entries(conditions).every(([key, value]) => {
            return item[key as keyof T] === value;
        }),
    );
}

// Хочется получить только активных пользователей
const activeUsers = filterObjects(users, { isActive: true });

console.log(activeUsers);
