# Finanz-Check

A browser-based mortgage comparison tool for visualizing and comparing different loan scenarios side by side. Built for the German mortgage market (Annuitätendarlehen).

**[Live Demo](https://benced94.github.io/finanz-check/)**

## Features

- **Multiple scenarios** — add and compare different mortgage configurations simultaneously
- **Interactive chart** — stacked area chart showing remaining Tilgung and Zinsen over time, decreasing to zero at payoff
- **Scenario comparison** — highlights the cheapest and fastest payoff option with detailed cost and time differences
- **CSV export** — monthly breakdown matching bank statement format (Datum, Saldo, Zahlung, Zinsen, Tilgung, Gebühren, Kontoführungsgebühr)
- **No backend** — everything runs locally in the browser, no data leaves your machine

## Inputs per scenario

| Field | Description |
|---|---|
| Loan amount (€) | Total mortgage principal |
| Interest rate (%) | Annual nominal interest rate |
| Tilgung (%) | Annual initial repayment rate |
| Extra payment (€/yr) | Annual Sondertilgung |

## How it calculates

Uses the standard German annuity mortgage formula:

- **Monthly payment** = (interest rate + tilgung rate) / 12 × loan amount (fixed over the term)
- **Monthly interest** = remaining balance × (interest rate / 12)
- **Monthly principal** = monthly payment − monthly interest
- **Extra payment** applied once per year as Sondertilgung
- Calculation stops when balance reaches zero or after 40 years

Interest is computed on the current remaining balance each month (compound interest), so the Zinsen portion shrinks and the Tilgung portion grows over time — the classic annuity pattern.

## Tech stack

- [React](https://react.dev/) + TypeScript
- [Vite](https://vite.dev/)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

Production output goes to `dist/`. Deployed automatically to GitHub Pages via the included [workflow](.github/workflows/deploy.yml).

## License

MIT
