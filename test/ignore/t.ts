type User = {
    id: number;
    name: string;
    role: 'admin' | 'user';
};

const users: User[] = [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' },
    { id: 3, name: 'Charlie', role: 'admin' },
    { id: 4, name: 'David', role: 'user' },
];

function groupBy<T, K extends keyof T>(
    array: T[],
    key: K,
): Record<string, T[]> {
    return array.reduce(
        (result, item) => {
            const groupKey = String(item[key]);
            if (!result[groupKey]) {
                result[groupKey] = [];
            }
            result[groupKey].push(item);
            return result;
        },
        {} as Record<string, T[]>,
    );
}

const grouped = groupBy(users, 'role');
console.log(grouped);
