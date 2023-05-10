let lastId = 0;

export default function NewId(prefix='id') {
    lastId++;
    return `${prefix}-${lastId}`;
}
