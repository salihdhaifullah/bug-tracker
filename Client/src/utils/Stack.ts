interface IStack<T> {
    push(item: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    size(): number;
    isEmpty(): boolean;
}

export default class Stack<T> implements IStack<T> {
    private storage: T[] = [];

    push(item: T): void {
        this.storage.push(item);
    }

    pop(): T | undefined {
        return this.storage.pop();
    }

    peek(): T | undefined {
        return this.storage[this.size() - 1];
    }

    size(): number {
        return this.storage.length;
    }

    isEmpty(): boolean {
        return this.storage.length === 0;
    }
}
