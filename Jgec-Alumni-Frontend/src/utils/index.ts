export const debounce = (
    func: (argus: string) => Promise<void>,
    delay: number,
) => {
    let debounceTimer: NodeJS.Timeout;
    const context = this;
    return function () {
        const args: any = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
};