export const arrayToMap = <k, T>(prop: string, values: Array<T>): Map<k, T> => {
    let mapa = new Map();

    values.forEach((value: T) => mapa.set(value[prop as keyof typeof value], value));

    return mapa;
}