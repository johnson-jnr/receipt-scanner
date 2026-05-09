const displayNames = new Intl.DisplayNames(['en'], { type: 'currency' });

export function getCurrencyOptions() {
    return (Intl.supportedValuesOf('currency') as string[]).map((code) => ({
        code,
        label: `${code} — ${displayNames.of(code)}`,
    }));
}

export function formatCurrency(amount: number, currencyCode: string) {
    if (!currencyCode) return;
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
    }).format(amount);
}
